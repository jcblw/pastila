'use strict'

const app = require('app')
const BrowserWindow = require('browser-window')
const qs = require('querystring')
const fs = require('fs')
const Pastila = require('./pastila')
const levelup = require('levelup')
const path = require('path')
const menu = require('./menu')
const logPath = path.resolve(__dirname, 'pastila-session.log')
const log = fs.createWriteStream(logPath)
const dbPath = path.resolve(__dirname, '.pastila')
const development = !!process.env.DEBUG_PASTILA
const AppConstants = require('../constants/app')
let db = levelup(dbPath, {valueEncoding: 'json'})
let mainWindow
let pastila

require('crash-reporter').start() // report crashes
pastila = new Pastila({
  db: db,
  clientId: '4e73f807eaa53c1b7661',
  serverLocation: 'https://gatekeeper-gistnotes.herokuapp.com',
  log: log
})

function createMainWindow () {
  const _window = new BrowserWindow({
    width: AppConstants.DEFAULT_WIDTH,
    height: AppConstants.DEFAULT_HEIGHT,
    show: false
  })

  pastila.setWindow(_window)

  _window.webContents.on('did-finish-load', function () {
    if (mainWindow) {
      _window.showInactive()
      mainWindow.destroy()
    } else {
      _window.show()
    }
    mainWindow = _window
  })

  // check auth on startup
  pastila.isAuthed(function (isAuthed) {
    const query = {}

    if (development) {
      query.debug = true
    }

    if (isAuthed) {
      query.isAuthed = isAuthed
    }
    _window.loadUrl(`file://${path.resolve(__dirname, '../')}/index.html?${qs.stringify(query)}`)
  })
}

app.on('ready', function () {
  menu.setup()
  createMainWindow()
  if (development) {
    require('./development')(
      path.resolve(__dirname, '../client/**/*'),
      mainWindow,
      createMainWindow
    )
  }
})
