const
  Gist = require('./stores/gist'),
  Auth = require('./stores/auth'),
  User = require('./stores/user');

module.exports = class Pastila {

  constructor(options) {
    this.db = options.db;
    this.log = options.log;
    this.auth = new Auth(options);
  }

  setWindow(window) {
    this.mainWindow = window;
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

  saveState(state, callback) {
    state.position = this.mainWindow.getPosition();
    state.size = this.mainWindow.getSize();
    this.db.put('state', state, callback);
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
