'use strict';

var gaze = require('gaze');

module.exports = function(dir = '', mainWindow = {}, factory = function(){}) {
  console.log('starting up development mode for', dir);
  gaze(dir, function(err) {
    if (err) {
      return console.warn('Error watcher not attached', err);
    }

    this.on('changed', function(filePath) {
      console.log('File changed', filePath);
      // window factory
      factory();
    });

  });
};
