'use strict'

const Store = require('./store')
const AppConstants = require('../constants/app')
const AppActions = require('../actions/app')
const {autobind} = require('core-decorators')

module.exports = class App extends Store {

  constructor (options) {
    super(options)
  }

  getState (action) {
    const {onState} = action
    this.db.get('state', onState || this.noop)
  }

  noop () {}

  @autobind
  saveState (action) {
    const {state} = action
    state.position = this.mainWindow.getPosition()
    state.size = this.mainWindow.getSize()
    this.db.put('state', state, this.noop)
  }

  @autobind
  getInitialState () {
    this.db.get('state', (err, state) => {
      // this is the first state
      if (err && err.message.match(/Key not found/)) {
        return AppActions.sendInitialState({})
      }
      if (err) {
        return AppActions.error(err)
      }
      if (state.position && this.mainWindow) {
        this.mainWindow.setPosition(...state.position)
      }
      if (state.size && this.mainWindow) {
        this.mainWindow.setSize(...state.size)
      }
      AppActions.sendInitialState(state)
    })
  }

  getEvents () {
    return {
      [AppConstants.APP_GET_INITIAL_STATE]: this.getInitialState,
      [AppConstants.APP_SET_STATE]: this.saveState
    }
  }

}
