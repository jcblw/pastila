'use strict'
const {Dispatcher} = require('flux')
const dispatcher = new Dispatcher()
const ipc = require('ipc')
const isRenderer = require('is-electron-renderer')
let processAction = 'main:action'
let externalAction = 'renderer:action'
let sender = ipc
// let lb = '\n\r'

// this allows our dispatcher to talk through differnt processes\
if (isRenderer) {
  processAction = 'renderer:action'
  externalAction = 'main:action'
}

dispatcher.register((action) => {
  // console.info(`${lb}sending${processAction} to ${externalAction}${lb} ${action.action}${lb} renderer: ${isRenderer}${lb} isTranfered: ${action._transfered_}`)
  if (!action._transfered_) {
    action._transfered_ = true
    sender.send(externalAction, action) // dispatch to main process
  }
})

ipc.on(processAction, (event, action) => { // catch a dispatch from the main process
  if (!isRenderer) {
    sender = event.sender
  } else {
    action = event
  }
  // console.info(`${lb}broadcasting ${processAction}${lb} ${action.action}${lb} renderer: ${isRenderer}`)
  dispatcher.dispatch(action)
})

module.exports = dispatcher
module.exports.Dispatcher = Dispatcher
