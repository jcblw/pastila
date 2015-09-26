'use strict'

const constants = require('../constants/user')
const Base = require('./base')

class UserActions extends Base {

  constructor () {
    super()
  }

  login () {
    this.dispatcher.dispatch({action: constants.AUTH_START})
  }

  authFailed () {
    this.dispatcher.dispatch({action: constants.AUTH_FAILED})
  }

  authSuccess () {
    this.dispatcher.dispatch({action: constants.AUTH_SUCCESS})
  }

  logout () {
    this.dispatcher.dispatch({action: constants.USER_LOGOUT})
  }

  loggedout () {
    this.dispatcher.dispatch({action: constants.USER_LOGGEDOUT})
  }
}

module.exports = new UserActions()
