'use strict';

const
  Store = require('./store');

module.exports = class Gist extends Store {

  constructor(options) {
    super(options);
    this.username = options.username;
  }

  all(callback) {
    this.log(`gist::all - getting gist for user ${this.username}`);
    this.request('gists', `/users/${this.username}/gists`, callback);
  }

  parse(data) {
    if (Array.isArray(data)) {
      return data.filter(Gist.markdownOnly);
    }
    return data;
  }

  get(id, callback) {
    this.log(`gist::get - getting gist ${id}`);
    this.request(`gists:${id}`, `/gists/${id}`, callback);
  }

  update(id, gist, callback) {
    this.log(`gist::update - updating gist ${id}`);
    this.patch(`/gists/${id}`, {files: gist.files}, (err, _gist) => {
      callback(err, _gist);
      if (!err && _gist && _gist.id) {
        this.setCache(`gists:${id}`, gist);
      }
    });
  }

  static markdownOnly(gist) {
    const
      files = Object.keys(gist.files),
      file = files[0];
    return !!file.match(/\.md$/);
  }

};
