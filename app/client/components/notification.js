'use strict'

const React = require('react')
const {PropTypes} = React
const AppActions = require('../../actions/app')
const propTypes = {
  message: PropTypes.string,
  timeout: PropTypes.number
}
const defaultProps = {
  timeout: 5000,
  message: ''
}

class Notification extends React.Component {

  constructor () {
    super()
    this.state = {isOpen: false}
  }

  componentWillReceiveProps ({message: nextMessage}) {
    const {message} = this.props
    if (message !== nextMessage && nextMessage) {
      this.setState({isOpen: true})
    } else if (message === nextMessage && nextMessage) {
    }
  }

  componentDidUpdate () {
    const {timeout} = this.props
    const {isOpen} = this.state
    if (isOpen) {
      clearTimeout(this.__timer)
      this.__timer = setTimeout(() => {
        this.setState({isOpen: false})
        setTimeout(AppActions.notification.bind(AppActions, ''), 300) // reset
      }, timeout)
    }
  }

  render () {
    const {isOpen} = this.state
    const className = `notification-wrapper ${isOpen ? 'is-open' : ''}`
    return (
      <div className={className}>
        <span className='notification-content'>{this.props.message}</span>
      </div>
    )
  }
}

Notification.propTypes = propTypes
Notification.defaultProps = defaultProps

module.exports = Notification
