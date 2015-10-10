'use strict'

const React = require('react')
const Icon = require('./icon')
const GistActions = require('../../actions/gist')
const AppActions = require('../../actions/app')
const {autobind} = require('core-decorators')

module.exports = class NoteItem extends React.Component {

  @autobind
  loadNote () {
    AppActions.clearView()
    GistActions.get(this.props.note.id)
  }

  @autobind
  onDelClick (e) {
    e.stopPropagation()
    GistActions.del(this.props.note.id)
  }

  render () {
    const note = this.props.note
    const files = Object.keys(note.files)
    return (
      <li className='listitem'>
        <a href='#' onClick={this.loadNote} data-id={note.id}>
          {files[0]}
          <Icon type='x' size='small' color='dark' className='u-marginRight--default u-position--absolute u-position--right' onClick={this.onDelClick} />
        </a>
      </li>
    )
  }
}
