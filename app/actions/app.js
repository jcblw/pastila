'use strict'

const constants = require('../constants/app')
const Base = require('./base')

class AppActions extends Base {

  constructor () {
    super()
  }

  state (state) {
    this.dispatcher.dispatch({
      action: constants.APP_STATE,
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

}

module.exports = new AppActions()
