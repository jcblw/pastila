'use strict'

const React = require('react')
const Icon = require('./icon')
const UserActions = require('../../actions/user')
const {autobind} = require('core-decorators')

module.exports = class SignIn extends React.Component {

  @autobind
  onAuthGithub () {
    UserActions.login()
  }

  render () {
    return (
      <div className='signin u-textAlign--center u-layout--centered'>
        <div>
          <div className='u-verticalSpacing--default'>
            <Icon pathto='client/assets/logos.svg' type='pastila' />
          </div>
          <button className='btn btn-primary' onClick={this.onAuthGithub}>
            <Icon pathto='client/assets/logos.svg' type='github' size='medium' className='u-marginRight--smaller' />
            Sign in with Github
          </button>
        </div>
      </div>
    )
  }
}
