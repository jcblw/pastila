'use strict';

const
  Store = require('./store');

module.exports = class Gist extends Store {

  constructor(options) {
    this.username = options.username;
    super(options);
  }

  all(callback) {
    this.request('gists', `/users/${this.username}/gists`, callback);
  }

  parse(data) {
    if (Array.isArray(data)) {
      return data.filter(Gist.markdownOnly);
    }
    return data;
  }

  get(id, callback) {
    this.request(`gists:${id}`, `/gists/${id}`, callback);
  }

  static markdownOnly(gist) {
    const
      files = Object.keys(gist.files),
      file = files[0];
    return !!file.match(/\.md$/);
  }

};
