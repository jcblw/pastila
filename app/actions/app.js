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

  initialState (onState) {
    this.dispatcher.dispatch({
      action: constants.APP_INITIAL_STATE,
      onState: onState
    })
  }

}

module.exports = new AppActions()
