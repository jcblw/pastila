const
  React = require('react/addons'),
  Menu = require('./menu'),
  Workspace = require('./workspace'),
  dispatcher = require('../dispatcher');

module.exports = class Notes extends React.Component {

  render() {

    const
      menuStyle = {
        flex: 1
      },
      workspaceStyle = {
        flex: 5
      };

    return (
      <div className="notes-container">
        <Menu notes={this.props.notes}></Menu>
        <Workspace note={this.props.note}></Workspace>
      </div>
    );
  }
};
