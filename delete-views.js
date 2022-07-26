const fs = require('fs')
const os = require('os')
const path = require('path')
const rimraf = require('rimraf')
const yargs = require('yargs').argv

const file = path.join(yargs.dir, '/flume/log.offset')
const flumePath = path.join(yargs.dir, 'flume')

fs.readdir(flumePath, (err, files) => {
  if (err) throw err
  files.forEach(file => {
    if (!file.startsWith('log')) {
      const filePath = path.join(flumePath, file)
      console.log('deleting', filePath)
      rimraf.sync(filePath)
    }
  })
})
