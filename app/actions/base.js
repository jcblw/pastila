'use strict'

class Actions {
  constructor () {
    this.dispatcher = require('../src/dispatcher')
  }

  setDispatcher (dispatcher) {
    this.dispatcher = dispatcher
  }
}

module.exports = Actions
