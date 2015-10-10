'use strict'

const Menu = require('menu')
const app = require('app')
// const dispatcher = require('./dispatcher')
const shell = require('shell')
const BrowserWindow = require('browser-window')
const AppActions = require('../actions/app')
const template = [
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
        click: function () { app.quit() }
      }
    ]
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'New Note',
        accelerator: 'CmdOrCtrl+n',
        click: function () {
          AppActions.triggerEvent('ui:new')
        }
      },
      {
        label: 'Open Note',
        accelerator: 'CmdOrCtrl+o',
        click: function () {
          AppActions.triggerEvent('ui:open')
        }
      },
      {
        label: 'Save Note',
        accelerator: 'CmdOrCtrl+s',
        click: function () {
          AppActions.triggerEvent('ui:forcesave')
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        selector: 'redo:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: 'Alt+CmdOrCtrl+I',
        click: function () {
          BrowserWindow.getFocusedWindow().toggleDevTools()
        }
      }
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
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'What is Markdown?',
        click: function () {
          shell.openExternal('https://help.github.com/articles/markdown-basics/')
        }
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(template)

module.exports.setup = function () {
  Menu.setApplicationMenu(menu)
}
