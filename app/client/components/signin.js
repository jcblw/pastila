const
  React = require('react'),
  dispatcher = require('../dispatcher');

module.exports = class SignIn extends React.Component {

  onAuthGithub () {
    dispatcher.emit('auth:start');
  }

  render () {
    return (
      <button onClick={this.onAuthGithub.bind(this)}>Auth Github</button>
    );
  }
};
