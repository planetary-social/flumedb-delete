var pull = require('pull-stream')
var drain = require('pull-stream/sinks/drain')
var codec = require('flumecodec')
var flume = require('flumedb')
var log = require('flumelog-offset')
const path = require('path')
const mv = require('mv')

const paths = {
  db: path.join(__dirname, 'db'),
  tmp: '/tmp/db' + Math.random()
}

const createDb = (file) => flume(log(file, { codec: codec.json }))
// a is the original log
// b is our secondary temporary log
var b = createDb(paths.tmp)
console.log('creating tmp db at:', paths.tmp)

// define function to exclude content (e.g. check `msg.value.author`)
const shouldDelete = msg => msg.author === 'bob'

// once all of the non-deleted messages are added to the second db, we replace a with b

module.exports = (obj, cb) => {
  const { dbPath, compare } = obj
  a = createDb(dbPath)

  let fn
  if (typeof compare === 'function') {
    fn = compare
  } else {
    fn = shouldDelete
  }

  // for each message, either ignore (delete) or add to new log
  const onEachMessage = msg => {
    if (fn(msg)) {
      console.log('deleted:', msg.key)
    } else {
      b.append(msg, function (err, seq) {
        if (err) throw err
      })
    }
  }

  const onDone = () => {
    // overwrite the real db with the temporary db
    mv(paths.tmp, dbPath, function (err) {
      if (err) return cb(err)
      console.log('done with delete')
      cb(null)
    })
  }

  pull(
    // we start a pull stream, ignoring the sequence numbers
    a.stream({ seqs: false }),
    // now we add the messages from the first db to the second db
    drain(onEachMessage, onDone)
  )
}
