'use strict'

const React = require('react')
const Icon = require('./icon')
const UserActions = require('../../actions/user')

function authGithub () {
  UserActions.login()
}

module.exports = (props) => {
  return (
    <div className='signin u-textAlign--center u-layout--centered'>
      <div>
        <div className='u-verticalSpacing--default'>
          <Icon pathto='client/assets/logos.svg' type='pastila' />
        </div>
        <button className='btn btn-primary' onClick={authGithub}>
          <Icon pathto='client/assets/logos.svg' type='github' size='medium' className='u-marginRight--smaller' />
          Sign in with Github
        </button>
      </div>
    </div>
  )
}
