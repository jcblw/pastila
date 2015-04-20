'use strict';

const
  Store = require('./store');

module.exports = class User extends Store {

  constructor(options) {
    options.type = 'user';
    options.endpoint = '/user';
    super(options);
  }

};
