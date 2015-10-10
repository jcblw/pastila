'use strict'

const http = require('http')
const request = require('request')
const qs = require('querystring')
const Store = require('./store')
const through = require('through2')
const UserActions = require('../actions/user')
const UserConstants = require('../constants/user')

module.exports = class User extends Store {
  constructor (options) {
    options.type = 'user'
    options.endpoint = '/user'
    super(options)
    this.port = options.port
    this.clientId = options.clientId
    this.serverLocation = options.serverLocation
  }

  start () {
    this.server = http.createServer((req, res) => {
      this.onRedirect(req)
      res.end()
      this.stop()
    })
    this.server.listen(this.port || 5678)
  }

  onRedirect (req) {
    const query = qs.parse(req.url.split('?').pop())
    const options = {json: true}

    if (query.code) {
      let url = `${this.serverLocation}/authenticate/${query.code}`
      // pull handler out to own method
      return request(url, options, (err, resp, body) => {
        if (err) {
          return UserActions.authFailed(err)
        }
        if (!body.token) {
          return UserActions.authFailed(new Error('No token returned from server'))
        }
        this.setCache('auth', body, function (err) {
          if (err) {
            return UserActions.authFailed(err)
          }
          return UserActions.authSuccess(body)
        })
      })
    }
    return UserActions.authFailed(new Error('No code given in redirect'))
  }

  logout () {
    const {db} = this
    this.db.createKeyStream()
      .on('end', function () {
        UserActions.loggedout()
      })
      .pipe(through(function (chunk, enc, callback) {
        this.push(chunk)
        db.del(chunk.toString(), callback)
      }))
  }

  get (callback) {
    this.getCache('auth', callback)
  }

  failed () {
    this.stop()
    this.logout()
  }

  stop () {
    this.server.close()
  }

  getEvents () {
    return {
      [UserConstants.AUTH_START]: this.start.bind(this),
      [UserConstants.AUTH_FAILED]: this.failed.bind(this),
      [UserConstants.AUTH_SUCCESS]: this.stop.bind(this),
      [UserConstants.USER_LOGGEDOUT]: this.logout.bind(this)
    }
  }

}
