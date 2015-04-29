'use strict';

const
  React = require('react'),
  Auth = require('./auth'),
  Notes = require('./notes'),
  SignIn = require('./signin'),
  dispatcher = require('../dispatcher');

module.exports = class App extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      isAuthed: this.props.isAuthed,
      isAuthenticating: false
    };
    dispatcher.on('app:getState', this.getState.bind(this));
  }

  getState() {
    dispatcher.emit('app:state', this.state);
  }

  onClick() {
    dispatcher.emit('contextlink:close');
  }

  render () {
    let content;

    if (this.state.isAuthed) {
      content = (
        <Notes notes={this.state.notes} note={this.state.note} />
      );
    } else if (this.state.isAuthenticating) {
      content = (
        <Auth clientId={this.props.clientId} redirectURL={this.props.redirectURL} />
      );
    } else {
      content = (
        <SignIn errorMessage={this.state.errorMessage} />
      );
    }

    return (
      <div className='app-container' onClick={this.onClick.bind(this)}>
        {content}
      </div>
    );
  }
};
