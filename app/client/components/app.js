'use strict';

const
  React = require('react'),
  Auth = require('./auth'),
  Notes = require('./notes'),
  SignIn = require('./signin');

module.exports = class App extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      isAuthed: this.props.isAuthed,
      isAuthenticating: false
    };
  }

  render () {
    let content;

    if (this.state.isAuthed) {
      content = (
        <Notes notes={this.state.notes} />
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
      <div className='app-container'>
        {content}
      </div>
    );
  }
};
