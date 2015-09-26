'use strict'
const {Dispatcher} = require('flux')
const dispatcher = new Dispatcher()
const ipc = require('ipc')
const isRenderer = require('is-electron-renderer')
let processAction = 'main:action'
let externalAction = 'renderer:action'

// this allows our dispatcher to talk through differnt processes\
if (isRenderer) {
  processAction = 'renderer:action'
  externalAction = 'main:action'
}

dispatcher.register((action) => {
  if (!action._transfered_) {
    action._transfered_ = true
    ipc.send(externalAction, action) // dispatch to main process
  }
})

ipc.on(processAction, (action) => { // catch a dispatch from the main process
  dispatcher.dispatch(action)
})

module.exports = dispatcher
module.exports.Dispatcher = Dispatcher
