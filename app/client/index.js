'use strict';

require('babel/register');

const
  qs = require('querystring'),
  query = qs.parse(window.location.search.split('?').pop()),
  dispatcher = require('./dispatcher');

dispatcher.start(query);
