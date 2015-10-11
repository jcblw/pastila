'use strict'

const React = require('react')
const Icon = require('./icon')
const ClipBoard = require('clipboard')
const propTypes = {
  copyText: React.PropTypes.string,
  icon: React.PropTypes.string,
  onError: React.PropTypes.function,
  onSuccess: React.PropTypes.function,
  timeout: React.PropTypes.number,
  className: React.PropTypes.string,
  inputClassName: React.PropTypes.string,
  linkClassName: React.PropTypes.string
}
const defaultProps = {
  copyText: `data:text/html,${encodeURI('<h1>Share Link</h1>')}`,
  icon: 'link',
  timeout: 3000
}

class CopyLink extends React.Component {
    constructor () {
      super()
      this.state = {
        isCopied: false,
        hasError: false
      }
    }

    componentDidUpdate () {
      this.teardown()
      this.clipboard = new ClipBoard('.js-copyLink')
      this.clipboard.on('success', this.onCopySuccess.bind(this))
      this.clipboard.on('error', this.onCopyError.bind(this))
    }

    componentWillUnmount () {
      this.teardown()
    }

    revertState () {
      clearTimeout(this._timer)
      this.setState({
        isCopied: false
      })
    }

    onCopySuccess (...args) {
      clearTimeout(this._timer)
      this.setState({isCopied: true})
      this.setTimer()
      if (this.props.onSuccess) {
        this.props.onSuccess(...args)
      }
    }

    onCopyError (...args) {
      clearTimeout(this._timer)
      this.setState({hasError: true})
      this.setTimer()
      if (this.props.onError) {
        this.props.onError(...args)
      }
    }

    setTimer () {
      const fn = this.revertState.bind(this)
      this._timer = setTimeout(fn, this.props.timeout)
    }

    teardown () {
      if (this.clipboard) {
        this.clipboard.destroy()
        this.clipboard = null
      }
    }

    render () {
      return (
        <span className='js-copyLink {this.props.className ? this.props.className : ""}' data-clipboard-text={this.props.copyText}>
          <Icon className='menu-icon' type={this.props.icon} color='dark' size='medium' />
        </span>
      )
    }
}

CopyLink.propTypes = propTypes
CopyLink.defaultProps = defaultProps

module.exports = CopyLink
