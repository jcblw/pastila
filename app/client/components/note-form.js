'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const GistActions = require('../../actions/gist')
const _ = require('lodash')
const {autobind} = require('core-decorators')

module.exports = class EditNoteForm extends React.Component {

  constructor (options) {
    super(options)
    const note = this.props.note
    this.state = {
      fileName: this.getFileName(note),
      description: note ? note.description : ''
    }
  }

  componentWillReceiveProps (props) {
    const note = props.note
    if (note) {
      this.setState({
        fileName: this.getFileName(note),
        description: note ? note.description : ''
      })
    }
  }

  getFileName (note) {
    if (!note) {
      note = {}
    }

    const files = note.files || {}
    const fileNames = Object.keys(files)
    return fileNames[0]
  }

  @autobind
  onFieldChange (e) {
    const el = e.target
    const {name, value} = el
    const payload = {}

    payload[name] = value
    this.setState(payload)
  }

  focusForm (id) {
    if (this.props.id === id) {
      let input = ReactDOM.findDOMNode(this.refs.fileName)
      if (input && typeof input.focus === 'function') {
        input.focus()
      }
    }
  }

  @autobind
  onSubmitForm (e) {
    // think about moving this into the store.
    e.preventDefault()
    if (this.props.note) {
      let payload = _.clone(this.props.note)
      let files = _.clone(this.props.note.files)
      let fileNames = Object.keys(files)

      if (this.state.fileName !== fileNames[0]) {
        files[this.state.fileName] = {
          content: files[fileNames[0]].content
        } // transfer data to new file name
        files[fileNames[0]] = null // set old file to null eqv of deleting
      }

      payload.files = files
      payload.description = this.state.description
      return GistActions.update(this.props.note.id, payload)
    }

    const name = this.state.fileName.trim()
    const fileName = name.match(/.md$/) ? name : name + '.md'
    const payload = {
      description: this.state.description,
      files: {},
      public: false // this is just the default for now
    }

    payload.files[fileName] = {
      content: '# New Note'
    }

    GistActions.create(payload)

    this.setState({
      fileName: '',
      description: ''
    })
  }

  render () {
    const cta = this.props.cta || 'Submit'
    return (
      <form onSubmit={this.onSubmitForm} className='form-block form--createGist u-textAlign--left'>
        {this.props.children}
        <div className='input-group u-verticalSpacing--default'>
          <label className='input-group--label u-verticalSpacing--small'>File Name</label>
          <input name='fileName' className='input-group--input' type='text' value={this.state.fileName} onChange={this.onFieldChange} ref='fileName' />
          <small className='input-group--small'>File name will be suffixed with .md</small>
        </div>
        <div className='input-group u-verticalSpacing--default'>
          <label className='input-group--label u-verticalSpacing--small'>Description</label>
          <textarea name='description' className='input-group--input' type='text' value={this.state.description} onChange={this.onFieldChange}></textarea>
        </div>
        <div className='input-group u-textAlign--right'>
          <button className='btn btn-primary'>{cta}</button>
        </div>
      </form>
    )
  }
}
