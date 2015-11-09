const React = require('react')
const ReactDOM = require('react-dom')
const {Component} = React
const _ = require('lodash')
const {autobind} = require('core-decorators')

module.exports = function scrollThunk(config = {}) {
  const {onScrollTop, onScrollBottom} = config
  const debounceTime = config.debounce || 200
  const stepAmount = config.steps || 20
  const padding = config.padding || 20

  return function decorateClass(DecoratedComponent) {
    return class Scrolly extends Component {

      constructor (...args) {
        super(...args)
        this.state = {steps: 0}
        this._pxTravel = 0
        // this.onScroll = _.throttle(this.onScroll, stepAmount / 2)
      }

      @autobind
      // @debounce(debounceTime)
      onScroll (e) {
        const el = ReactDOM.findDOMNode(this.refs.scrolly)
        if (!el) {
          return;
        }
        const {steps} = this.state
        this._pxTravel = el.scrollTop - this._lastScrollTop;
        this._lastScrollTop = el.scrollTop
        const {child} = this.refs
        if (el.scrollTop < padding && !steps) {
          // console.log('scrolled to top', this._pxTravel)
          const travel = this.getTravel(stepAmount / 2, false, true, this._pxTravel)
          if (isNaN(travel) || travel < padding) return
          if (typeof child.onScrollToTop === 'function') {
            child.onScrollToTop(travel)
          }
          return this.setState({scrolledToTop: true, pxTravel: this._pxTravel, steps: stepAmount})
        }
        if ((el.scrollTop + el.clientHeight + padding) > el.scrollHeight && !steps) {
          // console.log('scrolled to the bottom', this._pxTravel)
          const travel = this.getTravel(stepAmount / 2, true, false, this._pxTravel)
          if (isNaN(travel) || travel > -(padding)) return
          if (typeof child.onScrollToBottom === 'function') {
            child.onScrollToBottom(travel)
          }
          return this.setState({scrolledToBottom: true, pxTravel: this._pxTravel, steps: stepAmount})
        }
      }

      componentDidUpdate () {
        const {steps, scrolledToBottom, scrolledToTop} = this.state
        const el = ReactDOM.findDOMNode(this.refs.scrolly)
        if (steps) {
          setTimeout(() => {
            this.setState({steps: steps - 1})
          }, stepAmount / 2)
        }
      }

      getTravel(steps, scrolledToBottom, scrolledToTop, pxTravel) {
        if (!steps) {
          return 0
        }
        const halfSteps = stepAmount / 2
        const isBack = steps < halfSteps
        const step = isBack ? steps : -(steps - stepAmount)
        const travel = -((pxTravel / stepAmount) * step)
        return travel
      }

      render () {
        const {steps, scrolledToBottom, scrolledToTop, pxTravel} = this.state;
        const travel = this.getTravel(steps, scrolledToBottom, scrolledToTop, pxTravel)
        const style = {
          overflow: 'scroll',
          transform: `translate3d(0, ${travel}px, 0)`,
          padding: `${padding}px 0`
        };
        return (
          <div className="Scrolly-el" onScroll={this.onScroll} style={style} ref='scrolly'>
            <DecoratedComponent {...this.props} {...this.state} ref='child' />
          </div>
        )
      }
    }
  }
}
