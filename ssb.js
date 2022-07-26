const codec = require('flumecodec')
const flume = require('flumedb')
const log = require('flumelog-offset')
const del = require('./delete')
const deleteViews = require('./delete-views')
const os = require('os')
const path = require('path')

const ref = require('ssb-ref')
const yargs = require('yargs').argv

const dbPath = path.join(yargs.dir, '/flume/log.offset')

const compare = msg => {
  // ONLY RETURN TRUE WHEN MESSAGE SHOULD BE DELETED
  if (ref.isFeed(yargs.id)) {
    return msg.value.author === yargs.id
  } else {
    console.log('missing --id parameter')
    exit(1)
  }
}

del({ dbPath, compare }, (err) => {
  if (err) throw err
  console.log('done deleting from flume')
})

deleteViews(dbPath)
console.log('complete')
