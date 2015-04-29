const
  React = require('react/addons'),
  Menu = require('./menu'),
  Workspace = require('./workspace'),
  dispatcher = require('../dispatcher');

module.exports = class Notes extends React.Component {

  render() {

    return (
      <div className="notes-container">
        <Menu notes={this.props.notes} note={this.props.note}></Menu>
        <Workspace note={this.props.note}></Workspace>
      </div>
    );
  }
};
