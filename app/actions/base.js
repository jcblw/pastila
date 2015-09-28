'use strict'

class Actions {
  constructor () {
    this.dispatcher = require('../src/dispatcher')
  }

  setDispatcher (dispatcher) {
    this.dispatcher = dispatcher
  }

  error (err) {
    console.error(err)
  }
}

module.exports = Actions
