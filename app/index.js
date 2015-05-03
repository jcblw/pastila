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

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {


  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    show: false
  });

  dispatcher.startListening({
    pastila: pastila,
    db: db,
    mainWindow: mainWindow
  });
  pastila.setWindow(mainWindow);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.show();
  });
  // check auth on startup
  pastila.isAuthed(function(isAuthed) {
    var query = {};
    if (isAuthed) {
      query.isAuthed = isAuthed;
    }
    mainWindow.loadUrl('file://' + __dirname + '/index.html?' + qs.stringify(query));
  });
});
