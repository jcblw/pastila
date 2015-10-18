'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const qs = require('querystring')
const query = qs.parse(window.location.search.split('?').pop())
const App = require('./components/app')
const AppActions = require('../actions/app')
const AppConstants = require('../constants/app')
const dispatcher = require('../src/dispatcher')
const isAuthed = query.isAuthed === 'true'

ReactDOM.render(<App isAuthed={isAuthed} />, document.getElementById('pastila'))
// save the state of the app before closing
window.onbeforeunload = function () {
  AppActions.getState()
  window.onbeforeunload = null
  return false
}

dispatcher.register((action) => {
  if (action.action === AppConstants.APP_UPDATE_TITLE) {
    document.title = action.title
  }
  if (action.action === AppConstants.APP_CLOSE_WINDOW) {
    window.close()
  }
})
