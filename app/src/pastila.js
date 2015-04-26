const
  Gist = require('./stores/gist'),
  Auth = require('./stores/auth'),
  User = require('./stores/user'),
  dispatcher = require('./dispatcher');

module.exports = class Pastila {

  constructor(options) {
    this.db = options.db;
    this.log = options.log;
    this.auth = new Auth(options);
  }

  setupResources(auth, callback) {
    this.token = auth.token;
    this.user = new User(this);
    this.user.read((err, _user) => {
      if (err) {
        return callback(err);
      }
      this.username = _user.login;
      this.gists = new Gist(this);
      callback();
    });
  }

  isAuthed(callback) {
    this.auth.get((err, auth) => {
      var
        query = {};

      if (auth && typeof auth === 'object' && auth.token) {
        this.setupResources(auth, (err) => {
          if (err) {
            return callback(false);
          }
          query.isAuthed = true;
          callback(true);
        });
      }
      callback(false);
    });
  }

};
