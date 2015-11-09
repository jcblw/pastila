const React = require('react')
const {Component} = React
const {autobind, debounce} = require('core-decorators')
const handlers = []

/*
  attach a single event listener to the window then defer it to avoid
  blocking any ui
*/

window.addEventListener('resize', () => {
  setTimeout(defferedHandlerCaller, 0)
})

/*
  defferedHandlerCaller - a function to handle that will loop through handlers
  and call which ones are functions
*/

function defferedHandlerCaller () {
  handlers.forEach((handle) => {
    if (typeof handle === 'function') {
      handle()
    }
  })
}

/*
  resizeThunk default export - a thunk function
  @params - config {Object} an object that can change the behavior of the component
    - config.onResize {Function} a function that will be called every time the browser
      is resized. Expects an object to be returned from function call.
    - config.debounceTime {Number} an amount of milliseconds to debounce resize function
      defaults to 500ms
*/

module.exports = function resizeThunk(config = {}) {
  const {onResize} = config
  const debounceTime = config.debounce || 500

/*
  decorateClass - the function that decorates the given component
  @param - DecoratedComponent {Class/React Component} - React component to decorate
*/

  return function decorateClass(DecoratedComponent) {
    return class Resize extends Component {

      /*
        constructor - calls ::getState to populate initial state
      */

      constructor (...args) {
        super(...args)
        this.state = this.getState()
      }

      /*
        getState - will call given onResize method and return the object returned
          from onResize or a blank object
        @returns - newState {Object} an object that will eventually ::setState on
          this component
      */

      getState () {
        if (typeof onResize === 'function') {
          const newState = onResize(window)
          if (newState && typeof newState === 'object') {
            return newState
          }
        }
        return {}
      }

      /*
        onWindowResize - a function that will set state to the component with the
          return of ::getState. Its docrated with autobind, and a debounce to the
          given debounce time.
      */

      @autobind
      @debounce(debounceTime)
      onWindowResize () {
        this.setState(this.getState())
      }

      /*
        componentDidMount - this will register the onWindowResize handler into
          the global window resize handler to allow for only on binding to the
          window event.
      */

      componentDidMount () {
        this._registeredIndex = handlers.length
        handlers.push(this.onWindowResize)
      }

      /*
        componentWillUnmount - this will unregister unused handlers
      */

      componentWillUnmount () {
        // just place null in place to not throw off index
        handlers.splice(this._registeredIndex, 1, null)
      }

      /*
        render - pretty much a proxy to send all state and props into child
          conponent
      */

      render () {
        return (
          <DecoratedComponent {...this.props} {...this.state} ref='child' />
        )
      }
    }
  }
}
