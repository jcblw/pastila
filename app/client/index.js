'use strict';

require('node-jsx').install({
  harmony: true
});

const
  qs = require('querystring'),
  query = qs.parse(window.location.search.split('?').pop()),
  UI = require('./ui'),
  dispatcher = require('./dispatcher'),
  ipc = require('ipc');

let
  ui;

dispatcher.on('auth:start', function() {
  ui.update('auth:start');
  ipc.send('auth:start');
});

dispatcher.on('gist:all', function() {
  ipc.send('gist:all');
});

ipc.on('gist:all', function(gists) {
  ui.update('gist:all', gists);
});

dispatcher.on('gist:get', function(id) {
  ipc.send('gist:get', id);
});

ipc.on('gist:get', function(gist) {
  ui.update('gist:get', gist);
});

ipc.on('auth:success', function(auth) {
  ui.update('auth:success', auth);
  dispatcher.emit('gist:all');
});

ipc.on('auth:error', function(err) {
  console.log(err);
});

// set this up after handlers are attached
ui = new UI(query);


// need to setup communication layer
// new data from main process -> ui.update({data...})
