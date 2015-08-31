'use strict';

require('babel/register');

const
  qs = require('querystring'),
  query = qs.parse(window.location.search.split('?').pop()),
  dispatcher = require('./dispatcher');

dispatcher.start(query);

// save the state of the app before closing
window.onbeforeunload = function() {
  dispatcher.emit('app:getState');
  return false;
};
