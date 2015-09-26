'use strict'

const React = require('react')
const Auth = require('./auth')
const Notes = require('./notes')
const SignIn = require('./signin')
const dispatcher = require('../../src/dispatcher')
const AppConstants = require('../../constants/app')
const UserConstants = require('../../constants/user')
const GistConstants = require('../../constants/gist')
const GistActions = require('../../actions/gist')

module.exports = class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      isAuthed: this.props.isAuthed,
      isAuthenticating: false
    }
    dispatcher.register((action) => {
      switch (action.actionType) {
        case AppConstants.APP_STATE_GET:
          this.getState()
          break
        case AppConstants.APP_CHANGED:
          this.render()
          break
        case UserConstants.AUTH_SUCCESS:
          this.onAuthSuccess()
          break
        case UserConstants.USER_LOGOUT:
          this.onAuthSignout()
          break
        case UserConstants.AUTH_FAILED:
          this.onAuthError(action.message)
          break
        case UserConstants.USER_LOGIN:
          this.onAuthStart()
          break
        case GistConstants.GIST_RETURNED:
          this.onGistGetReturn(action.gist)
          break
        case GistConstants.GIST_ALL_RETURNED:
          this.onGistAllReturn(action.gists)
          break
      }
    })

    // startup app
    if (this.state.isAuthed) {
      GistActions.all()
    }
  }

  getState () {
    dispatcher.dispatch({
      action: AppConstants.APP_STATE,
      state: this.state
    })
  }

  onAuthSuccess () {
    this.setState({
      isAuthenticating: false,
      isAuthed: true
    })
  }

  onAuthSignout () {
    this.setState({
      isAuthenticating: false,
      isAuthed: false
    })
  }

  onAuthError (message) {
    this.setState({
      isAuthenticating: false,
      isAuthed: false,
      errorMessage: message
    })
  }

  onAuthStart () {
    this.setState({
      isAuthenticating: true,
      isAuthed: false
    })
  }

  onClick () {
    // need to figure out good way to do this
    // dispatcher.emit('contextlink:close');
    // dispatcher.emit('editor:focus');
  }

  onGistGetReturn (gist) {
    this.setState({
      note: gist
    })
  }

  onGistAllReturn (gists) {
    this.app.setState({
      notes: gists
    })
  }

  render () {
    let content

    if (this.state.isAuthed) {
      content = (
        <Notes notes={this.state.notes} note={this.state.note} />
      )
    } else if (this.state.isAuthenticating) {
      content = (
        <Auth clientId={this.props.clientId} redirectURL={this.props.redirectURL} />
      )
    } else {
      content = (
        <SignIn errorMessage={this.state.errorMessage} />
      )
    }

    return (
      <div className='app-container' onClick={this.onClick.bind(this)}>
        {content}
      </div>
    )
  }
}
