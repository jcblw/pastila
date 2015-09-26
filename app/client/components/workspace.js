'use strict'

const React = require('react')
const Editor = require('./editor')
const GistActions = require('../../actions/gist')
const _ = require('lodash')

module.exports = class Notes extends React.Component {

  constructor (options) {
    super(options)
    this.onFileChange = _.debounce(this.onFileChange.bind(this), 2000)
  }

  getContent () {
    if (this.props.note) {
      const fileNames = Object.keys(this.props.note.files)
      const note = this.props.note.files[fileNames[0]]

      // dispatcher.emit('title:update', fileNames[0])
      return note.content
    }

    return 'Open a note by clicking a note in the sidebar'
  }

  onFileChange (content, id) {
    if (this.props.note) {
      const fileNames = Object.keys(this.props.note.files)
      if (this.props.note.id !== id || this.props.note.files[fileNames[0]].content === content) {
        return
      }
      this.props.note.files[fileNames[0]].content = content
      GistActions.update(this.props.note.id, this.props.note)
    }
  }

  render () {
    const content = this.getContent()
    const id = this.props.note ? this.props.note.id : 'startup'
    const editor = (
      <Editor
        id={id}
        value={content}
        onChange={this.onFileChange}
        onLoad={this.onFileChange.cancel} />
    )

    return (
      <div className='workspace' style={this.props.style}>
        {editor}
      </div>
    )
  }
}
