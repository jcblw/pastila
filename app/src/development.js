'use strict'

const gaze = require('gaze')
const fs = require('fs')
const BrowserWindow = require('browser-window')

module.exports = function (dir = '', mainWindow = {}, factory = function () {}) {
  console.log(`starting up development mode for ${dir}`)
  BrowserWindow
    .addDevToolsExtension('devtools/react-devtools/shells/chrome')
  gaze(dir, function (err) {
    if (err) {
      return console.warn('Error watcher not attached', err)
    }

    this.on('changed', function (filePath) {
      factory()
    })
  })
}
