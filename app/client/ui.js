'use strict';

const
  React = require('react'),
  App = require('./components/app'),
  dispatcher = require('./dispatcher');

module.exports = class UI {
  constructor (props) {
    this.app = new React.render(<App isAuthed={props.isAuthed} />, document.body);
    if (props.isAuthed) {
      dispatcher.emit('gist:all');
    }
  }
  update (type, state) {
    if (type === 'auth:success') {
      return this.app.setState({
        isAuthenticating: false,
        isAuthed: true
      });
    }

    if (type === 'auth:error') {
      return this.app.setState({
        isAuthenticating: false,
        isAuthed: false,
        errorMessage: state
      });
    }

    if (type === 'auth:start') {
      return this.app.setState({
        isAuthenticating: true,
        isAuthed: false
      });
    }

    if (type === 'gist:all') {
      return this.app.setState({
        notes: state
      });
    }

    if (type === 'gist:get') {
      console.log(state);
      return this.app.setState({
        note: state
      });
    }
  }
};
