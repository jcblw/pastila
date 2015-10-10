'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const createFragment = require('react-addons-create-fragment')
const NoteItem = require('./note-item')
const Icon = require('./icon')
const ContextLink = require('./context-link')
const NoteForm = require('./note-form')
const UserActions = require('../../actions/user')
const GistActions = require('../../actions/gist')
const {autobind} = require('core-decorators')

module.exports = class Notes extends React.Component {

  constructor () {
    super()
  }

  noop () {}

  getNodeList () {
    const notes = this.props.notes || []
    const nodes = {}

    notes.forEach((note, index) => {
      nodes[note.id] = (
        <NoteItem note={note} ref={`note${index}`} />
      )
    })

    if (!Object.keys(nodes).length) {
      nodes['not found'] = (
        <li className='listitem'>No Notes Found</li>
      )
    }

    return createFragment(nodes)
  }

  focusItem (id) {
    if (id === 'noteList') {
      let item = ReactDOM.findDOMNode(this.refs.note0)
      if (item && typeof item.focus === 'function') {
        item.children[0].focus()
      }
    }
  }

  @autobind
  onPreviewClick () {
    GistActions.preview(this.props.note);
  }

  @autobind
  signout () {
    UserActions.logout()
  }

  render () {
    const list = this.getNodeList()
    const penClassName = (this.props.note ? '' : 'is-hidden ') +
        'u-textAlign--center u-verticalSpacing--default'

    return (
      <div className='menu pure-menu u-padding--default' style={this.props.style}>
        <ul className='list'>
          <ContextLink icon='stacks' size='medium' color='dark' className='u-textAlign--center u-verticalSpacing--default' eventTrigger='ui:open' focusId='noteList'>
            <ul className='u-textAlign--left'>
              {list}
            </ul>
          </ContextLink>
          <ContextLink icon='pen' size='medium' color='dark' className={penClassName} onChange={this.noop} focusId='editForm'>
            <NoteForm note={this.props.note} onChange={this.noop} id='editForm' />
          </ContextLink>
          <li className={penClassName}>
            <span onClick={this.onPreviewClick}>
              <Icon className='menu-icon' type='preview' color='dark' size='medium' />
            </span>
          </li>
        </ul>
        <ul className='list list--bottom'>
          <ContextLink icon='plus' size='medium' color='dark' bottom={true} className='u-textAlign--center u-verticalSpacing--default' eventTrigger='ui:new' focusId='newForm'>
            <NoteForm onChange={this.noop} id='newForm'>
              <label className='u-fontSize--larger u-verticalSpacing--default'>Create New Note</label>
            </NoteForm>
          </ContextLink>
          <ContextLink icon='settings' size='medium' bottom={true} className='u-textAlign--center u-verticalSpacing--default'>
            <ul className='u-textAlign--left'>
              <li className='listitem'>
                <a href='#' onClick={this.signout}>
                  Sign Out
                </a>
              </li>
            </ul>
          </ContextLink>
        </ul>
      </div>
    )
  }
}
