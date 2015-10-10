'use strict'

const React = require('react')
const Icon = require('./icon')
const Avatar = require('./avatar')
const dispatcher = require('../../src/dispatcher')
const AppConstants = require('../../constants/app')
const AppActions = require('../../actions/app')
const {autobind} = require('core-decorators')

module.exports = class ContextLink extends React.Component {

  constructor (options) {
    super(options)
    this.state = {
      isOpen: false,
      id: this.props.icon || this.props.user,
      eventTrigger: options.eventTrigger
    }
  }

  onContextOpening (id) {
    if (this.state.id !== id) {
      this.setState({
        isOpen: false
      })
    }
    this.setState({
      opening: false
    })
  }

  @autobind
  onContextClick (e) {
    e.stopPropagation()
  }

  open () {
    AppActions.clearView(this.state.id)
    this.setState({
      isOpen: !this.state.isOpen,
      opening: true
    })
  }

  componentDidUpdate () {
    if (this.state.isOpen === true) {
      // dispatcher.emit('focus', this.props.focusId)
    }
  }

  componentWillMount () {
    this.dispatcherToken = dispatcher.register((action) => {
      if (action.action === AppConstants.APP_CLEAR_VIEW) {
        this.onContextOpening(action.id)
      }

      if (action.action === AppConstants.APP_EVENT_TRIGGER) {
        if (action.eventTrigger === this.state.eventTrigger) {
          this.open()
        }
      }
    })
  }

  componentWillUnmount () {
    dispatcher.unregister(this.dispatcherToken)
  }

  @autobind
  onClickOpen (e) {
    e.stopPropagation()
    this.open()
  }

  getLink () {
    if (this.props.icon) {
      return (
        <Icon className='menu-icon' type={this.props.icon} color='dark' size='medium' />
      )
    } else {
      return (
        <Avatar className='menu-avatar' src={this.props.user} size='medium' />
      )
    }
  }

  render () {
    const className = (this.state.isOpen ? 'is-open ' : ' ') +
        (this.props.bottom ? 'contextLink--bottom ' : ' ') +
        'contextLink--container'
    const link = this.getLink()

    return (
      <li className={`${this.props.className} ${this.state.isOpen ? 'is-active ' : ' '}`}>
        <span onClick={this.onClickOpen}>{link}</span>
        <div className={className} onClick={this.onContextClick}>
          {this.props.children}
        </div>
      </li>
    )
  }

}
