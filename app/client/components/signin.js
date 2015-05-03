const
  React = require('react'),
  Icon = require('./icon'),
  dispatcher = require('../dispatcher');

module.exports = class SignIn extends React.Component {

  onAuthGithub () {
    dispatcher.emit('auth:start');
  }

  render () {
    return (
      <div className="signin u-textAlign--center u-layout--centered">
        <div>
          <div className="u-verticalSpacing--default">
            <Icon pathto="client/assets/logos.svg" type="pastila"></Icon>
          </div>
          <button className="btn btn-primary" onClick={this.onAuthGithub.bind(this)}>
            <Icon pathto="client/assets/logos.svg" type="github" size="medium" className="u-marginRight--smaller"></Icon>
            Sign in with Github
          </button>
        </div>
      </div>
    );
  }
};
