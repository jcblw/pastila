'use strict'

const React = require('react')
const Menu = require('./menu')
const Workspace = require('./workspace')

module.exports = (props) => {
  return (
    <div className='notes-container'>
      <Menu notes={props.notes} note={props.note} />
      <Workspace note={props.note} />
    </div>
  )
}
