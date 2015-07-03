'use strict';

const
  React = require('react'),
  App = require('./components/app'),
  dispatcher = require('./dispatcher');

module.exports = class UI {
  constructor(props) {
    this.app = new React.render(<App isAuthed={props.isAuthed} />, document.body);
    if (props.isAuthed) {
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
