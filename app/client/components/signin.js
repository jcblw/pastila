const
  React = require('react'),
  dispatcher = require('../dispatcher');

module.exports = class SignIn extends React.Component {

  onAuthGithub () {
    dispatcher.emit('auth:start');
  }

  render () {
    return (
      <div className="signin u-textAlign--center">
        <h1>Sign into Github</h1>
        <button className="pure-button" onClick={this.onAuthGithub.bind(this)}>Auth Github</button>
      </div>
    );
  }
};
