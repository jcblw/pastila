'use strict';

const
  React = require('react'),
  App = require('./components/app');

module.exports = class UI {
  constructor () {
    this.app = new React.render(<App />, document.body);
  }
  update (state) {
    this.app.setState(state);
  }
};
