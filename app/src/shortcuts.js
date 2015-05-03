'use strict';

const
  dispatcher = require('./dispatcher'),
  globalShortcuts = require('global-shortcut'),
  shortcuts = { // this should be moved eventually
    // right now this does nothing
  };

function attach(shortcut, eventName) {
  globalShortcuts.register(shortcut, function() {
    dispatcher.emit(eventName);
  });
}

function attachAll() {
  for (let shortcut in shortcuts) {
    attach(shortcut, shortcuts[shortcut]);
  }
}

function detach() {
  globalShortcuts.unregisterAll();
}

module.exports.attach = function(mainWindow) {
  mainWindow.on('blur', detach);
  mainWindow.on('focus', attachAll);
};

module.exports.detach = detach;
