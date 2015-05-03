'use strict';

var
  Menu = require('menu'),
  app = require('app'),
  dispatcher = require('./dispatcher'),
  BrowserWindow = require('browser-window'),
  menu,
  template = [
    {
      label: 'Pastila',
      submenu: [
        {
          label: 'About Pastila',
          selector: 'orderFrontStandardAboutPanel:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide Pastila',
          accelerator: 'CmdOrCtrl+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'CmdOrCtrl+Shift+H',
          selector: 'hideOtherApplications:'
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: function() { app.quit(); }
        },
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New Note',
          accelerator: 'CmdOrCtrl+n',
          click: function() {
            dispatcher.emit('ui:new');
          }
        },
        {
          label: 'Open Note',
          accelerator: 'CmdOrCtrl+o',
          click: function() {
            dispatcher.emit('ui:open');
          }
        },
        {
          label: 'Save Note',
          accelerator: 'CmdOrCtrl+s',
          click: function() {
            dispatcher.emit('ui:forcesave');
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+CmdOrCtrl+I',
          click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
        },
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          selector: 'performClose:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        },
      ]
    },
    {
      label: 'Help',
      submenu: []
    },
  ];
  menu = Menu.buildFromTemplate(template);

module.exports.setup = function() {
  Menu.setApplicationMenu(menu);
};
