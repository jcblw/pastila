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
    var fileNames = Object.keys(state.files);
    document.title = fileNames[0];
    this.app.setState({
      note: state
    });
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