'use strict';

const
  request = require('request'),
  qs = require('querystring'),
  levelup = require('levelup');

module.exports = class Store {

  constructor(options) {
    this.db = options.db;
    this.type = options.type;
    this.endpoint = options.endpoint;
    this.token = options.token;
    this.baseUrl = options.baseUrl || 'https://api.github.com';
  }

  request(type, endpoint, callback) {
    this.getCache(type, (err, resource) => {
      if (err || !resource) {
        return this.requestHTTP({uri: endpoint}, (err, _resource) => {
          if (err) {
            return callback(err);
          }

          if (typeof this.parse === 'function') {
            _resource = this.parse(_resource);
          }

          this.setCache(type, _resource, () => {
            callback(err, _resource);
          });
        });
      }
      callback(null, resource);
    });
  }

  patch(endpoint, payload, callback) {
    this.requestHTTP({
      method: 'PATCH',
      body: payload,
      uri: endpoint
    }, callback);
  }

  getCache(type, callback) {
    this.db.get(type, callback);
  }

  setCache(type, resource, callback) {
    this.db.put(type, resource, callback);
  }

  removeCache(type, callback) {
    this.db.del(type, callback);
  }

  read(callback) {
    this.request(this.type, this.endpoint, callback);
  }

  requestHTTP(options, callback) {
    options.headers = {};
    options.headers['User-Agent'] = 'pastila';
    options.headers.Authorization = `token ${this.token}`;
    options.json = true;
    options.baseUrl = options.baseUrl || this.baseUrl;
    request(options, function(err, results, body) {
      callback(err, body);
    });
  }

};
