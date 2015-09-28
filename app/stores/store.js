'use strict'

const request = require('request')
const dispatcher = require('../src/dispatcher')

module.exports = class Store {

  constructor (options) {
    this.db = options.db
    this.type = options.type
    this.endpoint = options.endpoint
    this.token = options.token
    this._log = options.log
    this.baseUrl = options.baseUrl || 'https://api.github.com'
    this.listen()
  }

  log (msg) {
    this._log.write(`main process [${Date.now()}] ${msg} \n\r`)
  }

  request (type, endpoint, callback, refresh) {
    this.getCache(type, (err, resource) => {
      if (err || !resource || refresh) {
        return this.requestHTTP({uri: endpoint}, (err, _resource) => {
          if (err) {
            return callback(err)
          }

          if (typeof this.parse === 'function') {
            _resource = this.parse(_resource)
          }

          this.setCache(type, _resource, () => {
            callback(err, _resource)
          })
        })
      }
      callback(null, resource)
    })
  }

  patch (endpoint, payload, callback) {
    this.requestHTTP({
      method: 'PATCH',
      body: payload,
      uri: endpoint
    }, callback)
  }

  post (endpoint, payload, callback) {
    this.requestHTTP({
      method: 'POST',
      body: payload,
      uri: endpoint
    }, callback)
  }

  del (endpoint, callback) {
    this.requestHTTP({
      method: 'DELETE',
      uri: endpoint
    }, callback)
  }

  getCache (type, callback) {
    this.db.get(type, callback)
  }

  setCache (type, resource, callback) {
    if (type.match(/^gist/)) {
      // only cache for 15 min
      return this.db.put(type, resource, { ttl: 15 * 60 * 1000 }, callback)
    }
    this.db.put(type, resource, callback)
  }

  removeCache (type, callback) {
    this.db.del(type, callback)
  }

  read (callback) {
    this.request(this.type, this.endpoint, callback)
  }

  requestHTTP (options, callback) {
    options.headers = {}
    options.headers['User-Agent'] = 'pastila'
    options.headers.Authorization = `token ${this.token}`
    options.json = true
    options.baseUrl = options.baseUrl || this.baseUrl
    request(options, function (err, results, body) {
      if (!err && results.statusCode > 300) {
        err = new Error('Bad response from api')
      }
      callback(err, body)
    })
  }

  getEvents () { return {} }

  listen () {
    const _events = this.getEvents()
    dispatcher.register((action) => {
      for (let key in _events) {
        console.info(`\n\r Checking ${action.action} against ${key}`)
        if (action.action === key && typeof _events[key] === 'function') {
          _events[key](action)
        }
      }
    })
  }
}
