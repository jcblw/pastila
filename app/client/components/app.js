'use strict'

const React = require('react')
const createFragment = require('react-addons-create-fragment')
const Auth = require('./auth')
const Notes = require('./notes')
const Notification = require('./notification')
const SignIn = require('./signin')
const dispatcher = require('../../src/dispatcher')
const AppConstants = require('../../constants/app')
const UserConstants = require('../../constants/user')
const GistConstants = require('../../constants/gist')
const GistActions = require('../../actions/gist')
const AppActions = require('../../actions/app')
const {autobind} = require('core-decorators')
const propTypes = {
  isAuthed: React.PropTypes.bool,
  clientId: React.PropTypes.string,
  redirectURL: React.PropTypes.string
}
const defaultProps = {
  isAuthed: false
}

class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      isAuthed: this.props.isAuthed,
      isAuthenticating: false
    }
    dispatcher.register((action) => {
      switch (action.action) {
        case AppConstants.APP_INITIAL_STATE:
          delete action.state.notification;
          this.setState(action.state)
          break
        case AppConstants.APP_STATE_GET:
          this.getState()
          break
        case AppConstants.APP_CHANGED:
          this.render()
          break
        case AppConstants.APP_LOADING:
          this.setState({isLoading: true})
          break
        case AppConstants.APP_LOADING_DONE:
          this.setState({isLoading: false})
          break
        case AppConstants.APP_NOTIFICATION:
            this.setState({notification: action.message})
            break
        case UserConstants.AUTH_START:
          this.onAuthStart()
          break
        case UserConstants.AUTH_SUCCESS:
          this.onAuthSuccess()
          this.getAllGist()
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
        case GistConstants.GIST_DELETE:
          this.checkIfCurrentDeleted(action.id)
          break
      }
    })

    // startup app
    AppActions.getInitialState()
    if (this.state.isAuthed) {
      this.getAllGist() // attempt to update cache
    }
  }

  @autobind
  getAllGist () {
    clearTimeout(this._dispatcherTimer)
    if (!dispatcher.isDispatching()) {
      return GistActions.all()
    }
    this._dispatcherTimer = setTimeout(this.getAllGist, 500)
  }

  checkIfCurrentDeleted(id) {
    if (this.state.note.id === id) {
      this.setState({note: null})
      AppActions.clearView()
      AppActions.setTitle('Pastila')
    }
  }

  getState () {
    AppActions.state(this.state)
    AppActions.closeWindow()
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

  @autobind
  onClick () {
    AppActions.clearView()
    AppActions.focusEditor()
  }

  onGistGetReturn (gist) {
    this.setState({
      note: gist
    })
    AppActions.clearView()
    AppActions.focusEditor()
  }

  onGistAllReturn (gists) {
    this.setState({
      notes: gists
    })
  }

  render () {
    let content

    if (this.state.isAuthed) {
      content = createFragment({
        notes: (<Notes notes={this.state.notes} note={this.state.note} isLoading={this.state.isLoading} />),
        notifications: (<Notification message={this.state.notification} timeout={3000} />)
      })
    } else if (this.state.isAuthenticating) {
      content = (
        <Auth clientId={this.props.clientId} redirectURL={this.props.redirectURL} isLoading={this.state.isLoading} />
      )
    } else {
      content = (
        <SignIn errorMessage={this.state.errorMessage} isLoading={this.state.isLoading} />
      )
    }

    return (
      <div className='app-container' onClick={this.onClick}>
        {content}
      </div>
    )
  }
}

App.propTypes = propTypes
App.defaultProps = defaultProps

module.exports = App
