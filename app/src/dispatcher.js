var
  EventEmitter = require('eventemitter2').EventEmitter2,
  ipc = require('ipc'),
  dialog = require('dialog'),
  app = require('app'),
  through = require('through2');

class Dispatcher extends EventEmitter {
    constructor () {
      super();
    }

    // @todo refactor more events like this
    handleAuth(e) {
      this.pastila.auth.start();
      this.once('auth:success', (auth) => {
        this.pastila.setupResources(auth, () => {
          // error happens if gists are not fetched
          e.sender.send('auth:success', auth);
          this.removeAllListeners('auth:error');
        });
      });

      this.once('auth:error', (error) => {
        e.sender.send('auth:error', error.message);
        this.removeAllListeners('auth:success');
      });
    }

    startListening(options) {
      const {pastila, db, mainWindow} = options;
      this.pastila = options.pastila;
      this.mainWindow = mainWindow;
      // this need to be handled in a way that switching
      // out the main window does not effect the bindings
      ipc.on('auth:start', this.handleAuth.bind(this));
      ipc.on('gist:all', function (e, refresh) {
        pastila.gists.all(function(err, gists) {
          if (err) {
            return e.sender.send('store:error', 'gists:all');
          }
          e.sender.send('gist:all', gists);
        }, refresh);
      });

      ipc.on('auth:signout', function(e) {
        db.createKeyStream()
          .on('end', function() {
            e.sender.send('auth:signout');
          })
          .pipe(through(function(chunk, enc, callback) {
            this.push(chunk);
            db.del(chunk.toString(), callback);
          }));
      });

      ipc.on('gist:get', function(e, id) {
        pastila.gists.get(id, function(err, gist) {
            if (err) {
              return e.sender.send('store:error', 'gists:get');
            }
            // need to update list, need to abstract these events
            e.sender.send('gist:get', gist);
        });
      });

      ipc.on('gist:update', function(e, id, content) {
        pastila.gists.update(id, content, function(err) {
          if (err) {
            return e.sender.send('store:error', 'gists:update');
          }
          e.sender.send('gist:update'); // just to show some indication it updated
        });
      });

      ipc.on('gist:create', function(e, content) {
        pastila.gists.create(content, function(err, _gist) {
          if (err) {
            return e.sender.send('store:error', 'gists:create');
          }
          e.sender.send('gist:get', _gist);
          pastila.gists.updateCache(function(err, _gists) {
            if (err) {
              return;
            }
            e.sender.send('gist:all', _gists);
          });
        });
      });

      ipc.on('gist:del', function(e, gist) {
        var
          files = Object.keys(gist.files),
          warning = 'are you sure you want to remove ' +
            files[0] +
            '? This can not be undone.';

        dialog.showMessageBox({
          message: warning,
          buttons: ['Delete', 'Cancel']
        }, function(index) {
          if (index) {
            return;
          }
          pastila.gists.remove(gist.id, function() {
            pastila.gists.updateCache(function(err, _gists) {
              if (err) {
                return;
              }
              e.sender.send('gist:all', _gists);
            });
          });
        });
      });

      ipc.on('app:state', function(e, state) {
        pastila.saveState(state, app.quit.bind(app));
      });

      ipc.on('app:getInitialState', (e) => {
        db.get('state', (err, state) => {
            if (err) {
              return;
            }
            if (state.position && this.mainWindow) {
              this.mainWindow.setPosition(...state.position);
            }
            if (state.size && this.mainWindow) {
              this.mainWindow.setSize(...state.size);
            }
            e.sender.send('app:initialState', state);
        });
        if (!pastila.gists) {
          return;
        }
        pastila.gists.updateCache(function(err, _gists) {
          if (err) {
            return;
          }
          e.sender.send('gist:all', _gists);
        });
      });

      // this probably can be abstracted
      this.on('ui:open', () => {
        this.mainWindow.webContents.send('ui:open');
      });

      this.on('ui:forcesave', () => {
        this.mainWindow.webContents.send('ui:forcesave');
      });

      this.on('ui:new', () => {
        this.mainWindow.webContents.send('ui:new');
      });

    }

    setMainWindow(mainWindow) {
      this.mainWindow = mainWindow;
    }
}

module.exports = new Dispatcher();
module.exports.Dispatcher = Dispatcher;
