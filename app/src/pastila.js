'use strict'

const Gist = require('../stores/gist')
const App = require('../stores/app')
const User = require('../stores/user')
const dispatcher = require('./dispatcher')
const UserConstants = require('../constants/user')
const GistConstants = require('../constants/gist')
const AppConstants = require('../constants/app')
const BrowserWindow = require('browser-window')
const brucedown = require('brucedown')
const fs = require('fs')
const path = require('path')
const previewCSS = fs.readFileSync(
  path.resolve(__dirname, '../client/styles/markdown.css'),
  'utf8'
)

module.exports = class Pastila {

  constructor (options) {
    this.db = options.db
    this.log = options.log
    this.port = options.port
    this.clienID = options.clientID
    this.serverLocation = options.serverLocation
    this.user = new User(this)
    this._app = new App(this)
    dispatcher.register((action) => {
      if (action.action === UserConstants.AUTH_SUCCESS) {
        return this.isAuthed(() => {}) // cheap way to setup resources
      }
      if (action.action === GistConstants.PREVIEW_MARKDOWN) {
        return this.previewMarkdown(action.gist, null, true)
      }

      if (action.action === GistConstants.GIST_UPDATE) {
        return this.checkPreviewUpdate(action.gist)
      }
    })
  }

  setWindow (window) {
    this.mainWindow = window
    this._app.mainWindow = window
  }

  getFirstFile ({files}) {
    for (let key in files) {
      return files[key]
    }
  }

  checkPreviewUpdate (gist) {
    const windows = BrowserWindow.getAllWindows()
    const file = this.getFirstFile(gist) // first file name
    const filename = `${file.filename} preview`
    const currentWindow = windows.filter((window) => { return filename === window.getTitle() })[0]
    if (currentWindow) {
      this.previewMarkdown(gist, currentWindow)
    }
  }

  previewMarkdown (gist, _window, focus) {
    const windows = BrowserWindow.getAllWindows()
    const file = this.getFirstFile(gist) // first file name
    const filename = `${file.filename} preview`
    const currentWindow = _window || windows.filter((window) => { return filename === window.getTitle() })[0]
    // const styles = fs.readFileSync(path.resolve(__dirname, '../client/styles/markdown.css'), 'utf8')
    const window = currentWindow || new BrowserWindow({
      width: AppConstants.DEFAULT_WIDTH,
      height: AppConstants.DEFAULT_HEIGHT,
      show: true,
      title: filename
    })

    let isHandled = false
    brucedown(file.content, (err, results) => {
      if (isHandled) { return }
      isHandled = true
      if (err) {
        console.log(err.message)
        results = `<h1>${err.message}</h1>`
      }

      const html = `
        <!doctype html>
        <html>
          <head>
            <style type="text/css">${previewCSS}</style>
          </head>
          <body>
            ${results}
          </body>
        </html>
      `
      const url = `data:text/html,${encodeURI(html)}`
      window.loadUrl(url)
      if (focus) {
        window.focus()
      }
    })
  }

  setupResources (auth, callback) {
    this.token = auth.token
    this.user.token = auth.token
    this.user.read((err, _user) => {
      if (err) {
        return callback(err)
      }
      this.username = _user.login
      if (!this.gists) {
        this.gists = new Gist(this)
      }
      callback()
    })
  }

  saveState (state, callback) {
    state.position = this.mainWindow.getPosition()
    state.size = this.mainWindow.getSize()
    this.db.put('state', state, callback)
  }

  isAuthed (callback) {
    this.user.get((err, auth) => {
      if (err) {
        return callback(false)
      }
      const query = {}

      if (auth && typeof auth === 'object' && auth.token) {
        this.setupResources(auth, (err) => {
          if (err) {
            return callback(false)
          }
          query.isAuthed = true
          callback(true)
        })
      }
      callback(false)
    })
  }
}
