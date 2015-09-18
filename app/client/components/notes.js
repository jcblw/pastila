'use strict';

const
  React = require('react'),
  Menu = require('./menu'),
  Workspace = require('./workspace');

module.exports = (props) => {
  return (
    <div className="notes-container">
      <Menu notes={props.notes} note={props.note}></Menu>
      <Workspace note={props.note}></Workspace>
    </div>
  );
};
