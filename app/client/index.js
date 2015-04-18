require('node-jsx').install({
  harmony: true,
  extension: '.jsx'
});

var
  React = require('react'),
  UI = require('./ui.jsx'),
  ui = new UI();

// need to setup communication layer
// new data from main process -> ui.update({data...})
