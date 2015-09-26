'use strict'

const Store = require('./store')
const AppConstants = require('../constants/app')
const AppActions = require('../actions/app')

module.exports = class App extends Store {

  constructor (options) {
    super(options)
  }

  getState (action) {
    const {onState} = action
    this.db.get('state', onState || this.noop)
  }

  noop () {}

  saveState (action) {
    const {state} = action
    state.position = this.mainWindow.getPosition()
    state.size = this.mainWindow.getSize()
    this.db.put('state', state, this.noop)
  }

  getEvents () {
    return {
      [constants.APP_INITIAL_STATE]: this.getState.bind(this),
      [AppConstants.APP_SET_STATE]: this.saveState.bind(this)
    }
  }

}
