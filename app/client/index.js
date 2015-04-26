'use strict';

// ES6!
require('babel/register');

const
  qs = require('querystring'),
  query = qs.parse(window.location.search.split('?').pop()),
  UI = require('./ui'),
  dispatcher = require('./dispatcher'),
  ipc = require('ipc');

let
  ui;


// need to put this area into a sep module
// auth
dispatcher.on('auth:start', function() {
  ui.update('auth:start');
  ipc.send('auth:start');
});

ipc.on('auth:success', function(auth) {
  ui.update('auth:success', auth);
  dispatcher.emit('gist:all');
});

ipc.on('auth:error', function(err) {
  console.log(err);
});

// basic updates from main process.
dispatcher.on('gist:all', ipc.send.bind(ipc, 'gist:all'));
ipc.on('gist:all', function(gists){
  ui.update('gist:all', gists);
});
dispatcher.on('gist:get', ipc.send.bind(ipc, 'gist:get'));
ipc.on('gist:get', function(gist){
  ui.update('gist:get', gist);
});
dispatcher.on('gist:update', ipc.send.bind(ipc, 'gist:update'));


// set this up after handlers are attached
ui = new UI(query);
