'use strict';

const
  http = require('http'),
  request = require('request'),
  qs = require('querystring'),
  Store = require('./store'),
  dispatcher = require('../dispatcher');

// @todo clear out auth if auth fails anywhere
module.exports = class Auth extends Store {

  constructor (options = {}) {
    this.port = options.port;
    this.clientId = options.clientId;
    this.serverLocation = options.serverLocation;
    super(options);
  }

  start() {
    this.server = http.createServer( (req, res) => {
        this.onRedirect(req);
        res.end();
        this.stop();
    });
    this.server.listen(this.port || 5678);
  }

  onRedirect(req) {
    const
      query = qs.parse(req.url.split('?').pop()),
      options = {
        json: true
      };

    if (query.code) {
      let url = `${this.serverLocation}/authenticate/${query.code}`;
      // pull handler out to own method
      return request(url, options,(err, resp, body) => {
        if (err) {
          return dispatcher.emit('auth:error', err);
        }
        if (!body.token) {
          return dispatcher.emit('auth:error', new Error('No token returned from server'));
        }
        this.setCache('auth', body, function(err) {
          if (err) {
            return dispatcher.emit('auth:error', err);
          }
          return dispatcher.emit('auth:success', body);
        });
      });

    }
    return dispatcher.emit('auth:error', new Error('No code given in redirect'));
  }

  get (callback) {
    this.getCache('auth', callback);
  }

  stop () {
    this.server.close();
  }

};
