'use strict';

// ES6!
require('babel/register');

var
  app = require('app'),
  BrowserWindow = require('browser-window'),
  qs = require('querystring'),
  fs = require('fs'),
  Pastila = require('./src/pastila'),
  dispatcher = require('./src/dispatcher'),
  levelup = require('levelup'),
  ttl = require('level-ttl'),
  path = require('path'),
  menu = require('./src/menu'),
  logPath = path.resolve(__dirname, 'pastila-session.log'),
  log = fs.createWriteStream(logPath),
  dbPath = path.resolve(__dirname, '.pastila'),
  db = levelup(dbPath, {valueEncoding: 'json'}),
  mainWindow,
  pastila;

db = ttl(db);

require('crash-reporter').start(); // report crashes

pastila = new Pastila({
  db: db,
  clientId: '4e73f807eaa53c1b7661',
  serverLocation: 'https://gatekeeper-gistnotes.herokuapp.com',
  log: log
});

// app.on('window-all-closed', function() {
//   app.quit();
// });

function createMainWindow() {
  const _window = new BrowserWindow({
    width: 600,
    height: 600,
    show: false
  });

  pastila.setWindow(_window);
  dispatcher.setMainWindow(_window);

  _window.webContents.on('did-finish-load', function() {
    if (mainWindow) {
      _window.showInactive();
      mainWindow.destroy();
    } else {
      _window.show();
    }
    mainWindow = _window;
  });

  // check auth on startup
  pastila.isAuthed(function(isAuthed) {
    var query = {};
    if (isAuthed) {
      query.isAuthed = isAuthed;
    }
    _window.loadUrl('file://' + __dirname + '/index.html?' + qs.stringify(query));
  });
}

dispatcher.startListening({
  pastila: pastila,
  db: db
});

app.on('ready', function() {
  menu.setup();
  createMainWindow();
  require('./src/development')(path.resolve(__dirname, 'client/**/*'), mainWindow, createMainWindow);
});
