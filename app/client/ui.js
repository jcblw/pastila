'use strict';

const
  React = require('react'),
  ReactDOM = require('react-dom'),
  App = require('./components/app'),
  dispatcher = require('./dispatcher');

module.exports = class UI {

  constructor(props) {
    this.isAuthed = props.isAuthed;
    this.app = new ReactDOM.render(<App isAuthed={this.isAuthed} />, document.getElementById('pastila'));
  }

  start() {
    if (this.isAuthed) {
      dispatcher.emit('gist:all');
    }
  }

  onAuthSuccess() {
    this.app.setState({
      isAuthenticating: false,
      isAuthed: true
    });
  }

  onAuthSignout() {
    this.app.setState({
      isAuthenticating: false,
      isAuthed: false
    });
  }

  onAuthError(state) {
    this.app.setState({
      isAuthenticating: false,
      isAuthed: false,
      errorMessage: state
    });
  }

  onAuthStart() {
    this.app.setState({
      isAuthenticating: true,
      isAuthed: false
    });
  }

  onGistAll(state) {
    this.app.setState({
      notes: state
    });
  }

  onGistGet(state) {
    this.app.setState({
      note: state
    });
    dispatcher.emit('contextlink:close');
  }

  onState(state) {
    this.app.setState(state);
  }

  update(type, ...args) {
    var handler = 'on' + ((type || '').split(':').map(UI.toUpperCase).join(''));
    if (typeof this[handler] !== 'function') {
      return;
    }
    this[handler](...args);
  }

  static toUpperCase(str = '') {
    return str[0].toUpperCase() + str.substr(1);
  }
};
