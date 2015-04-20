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

  getCache(type, callback) {
    this.db.get(type, callback);
  }

  setCache(type, resource, callback) {
    this.db.put(type, resource, callback);
  }

  read(callback) {
    this.request(this.type, this.endpoint, callback);
  }

  requestHTTP(options, callback) {
    options.qs = options.qs || {};
    options.headers = {};
    options.headers['User-Agent'] = 'pastila';
    options.qs.access_token = this.token;
    options.json = true;
    options.baseUrl = options.baseUrl || this.baseUrl;
    console.log(options);
    request(options, function(err, results, body) {
      callback(err, body);
    });
  }

};
