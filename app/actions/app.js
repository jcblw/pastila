'use strict'

const constants = require('../constants/app')
const Base = require('./base')

class AppActions extends Base {

  constructor () {
    super()
  }

  state (state) {
    this.dispatcher.dispatch({
      action: constants.APP_SET_STATE,
      state: state
    })
  }

  getState () {
    this.dispatcher.dispatch({action: constants.APP_STATE_GET})
  }

  getInitialState (onState) {
    this.dispatcher.dispatch({action: constants.APP_GET_INITIAL_STATE})
  }

  sendInitialState (state) {
    this.dispatcher.dispatch({
      action: constants.APP_INITIAL_STATE,
      state: state
    })
  }

  clearView (id) {
    this.dispatcher.dispatch({
      action: constants.APP_CLEAR_VIEW,
      id: id
    })
  }

  focusEditor () {
    this.dispatcher.dispatch({action: constants.APP_EDITOR_FOCUS})
  }

  triggerEvent (eventTrigger) {
    this.dispatcher.dispatch({
      action: constants.APP_EVENT_TRIGGER,
      eventTrigger: eventTrigger
    })
  }

  setTitle (title) {
    this.dispatcher.dispatch({
      action: constants.APP_UPDATE_TITLE,
      title: title
    })
  }

  closeWindow () {
    this.dispatcher.dispatch({action: constants.APP_CLOSE_WINDOW})
  }

}

module.exports = new AppActions()
