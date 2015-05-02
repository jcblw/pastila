'use strict';

// ES6!
require('babel/register');

var
  app = require('app'),
  BrowserWindow = require('browser-window'),
  ipc = require('ipc'),
  util = require('util'),
  qs = require('querystring'),
  fs = require('fs'),
  dialog = require('dialog'),
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

ipc.on('gist:all', function (e, refresh) {
  pastila.gists.all(function(err, gists) {
    if (err) {
      return e.sender.send('store:error', 'gists:all');
    }
    e.sender.send('gist:all', gists);
  }, refresh);
});

ipc.on('gist:get', function(e, id) {
  pastila.gists.get(id, function(err, gist) {
      if (err) {
        return e.sender.send('store:error', 'gists:get');
      }
      // need to update list, need to abstract these events
      e.sender.send('gist:get', gist);
  });
});

ipc.on('gist:update', function(e, id, content) {
  pastila.gists.update(id, content, function(err) {
    if (err) {
      return e.sender.send('store:error', 'gists:update');
    }
    e.sender.send('gist:update'); // just to show some indication it updated
  });
});

ipc.on('gist:create', function(e, content) {
  pastila.gists.create(content, function(err, _gist) {
    if (err) {
      return e.sender.send('store:error', 'gists:create');
    }
    e.sender.send('gist:get', _gist);
    pastila.gists.updateCache(function(err, _gists) {
      if (err) {
        return;
      }
      e.sender.send('gist:all', _gists);
    });
  });
});

ipc.on('gist:del', function(e, gist) {
  var
    files = Object.keys(gist.files),
    warning = 'are you sure you want to remove ' +
      files[0] +
      '? This can not be undone.';

  dialog.showMessageBox({
    message: warning,
    buttons: ['Delete', 'Cancel']
  }, function(index) {
    if (index) {
      return;
    }
    pastila.gists.remove(gist.id, function(err, gist) {
      pastila.gists.updateCache(function(err, _gists) {
        if (err) {
          return;
        }
        e.sender.send('gist:all', _gists);
      });
    });
  });
});

app.on('window-all-closed', function() {
  // write state to db for when reopening
  app.quit();
});

ipc.on('app:state', function(e, state) {
  // pastila.saveState();
  db.put('state', state, app.quit.bind(app));
});

ipc.on('app:getInitialState', function(e) {
  db.get('state', function(err, state) {
      if (err) {
        return;
      }
      e.sender.send('app:initialState', state);
  });
  pastila.gists.updateCache(function(err, _gists) {
    if (err) {
      return;
    }
    e.sender.send('gist:all', _gists);
  });
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    show: false
  });
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
