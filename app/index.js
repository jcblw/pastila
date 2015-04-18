'use strict';

var
  app = require('app'),
  BrowserWindow = require('browser-window'),
  mainWindow;

require('crash-reporter').start(); // report crashes

app.on('window-all-closed', function() {
  app.quit(); // close app
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
