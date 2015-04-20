'use strict';

require('node-jsx').install({harmony: true});

var
  app = require('app'),
  BrowserWindow = require('browser-window'),
  ipc = require('ipc'),
  util = require('util'),
  qs = require('querystring'),
  Pastila = require('./src/pastila'),
  dispatcher = require('./src/dispatcher'),
  levelup = require('levelup'),
  db = levelup('./.pastila', {valueEncoding: 'json'}),
  mainWindow,
  pastila;

require('crash-reporter').start(); // report crashes

pastila = new Pastila({
  db: db,
  clientId: '4e73f807eaa53c1b7661',
  serverLocation: 'https://gatekeeper-gistnotes.herokuapp.com'
});

ipc.on('auth:start', function(e) {
  pastila.auth.start();

  dispatcher.once('auth:success', function(auth) {
    pastila.setupResources(auth, function(err) {
      // error happens if gists are not fetched
      e.sender.send('auth:success', auth);
      dispatcher.removeAllListeners('auth:error');
    });
  });

  dispatcher.once('auth:error', function(error) {
    e.sender.send('auth:error', error.message);
    dispatcher.removeAllListeners('auth:success');
  });
});

ipc.on('gist:all', function(e) {
  pastila.gists.all(function(err, gists) {
    if (err) {
      return e.sender.send('store:error', 'gists:all');
    }
    e.sender.send('gist:all', gists);
  } );
});

ipc.on('gist:get', function(e, id) {
  pastila.gists.get(id, function(err, gist) {
      if (err) {
        return e.sender.send('store:error', 'gists:get');
      }
      e.sender.send('gist:get', gist);
  });
});

app.on('window-all-closed', function() {
  // write state to db for when reopening
  // pastila.saveState();
  app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500
  });
  mainWindow.on('closed', function() {
    mainWindow = null;
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
