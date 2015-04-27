const
  React = require('react/addons'),
  NoteItem = require('./note-item'),
  Icon = require('./icon'),
  Avatar = require('./avatar'),
  dispatcher = require('../dispatcher');

module.exports = class Notes extends React.Component {

  getNodeList () {
    const
      notes = this.props.notes || [],
      nodes = {};

    notes.forEach((note) => {
      nodes[note.id] = (
        <NoteItem note={note} />
      );
    });

    if (!Object.keys(nodes).length) {
      nodes['not found'] = (
        <li className="listitem">No Notes Found</li>
      );
    }

    return React.addons.createFragment(nodes);
  }

  render () {
    var list = this.getNodeList();
    return (
      <div className="menu pure-menu u-padding--default" style={this.props.style}>
        <ul className="list">
          <li className="u-textAlign--center u-verticalSpacing--default">
            <Icon type="stacks" size="medium" color="dark"></Icon>
          </li>
          <li className="u-textAlign--center u-verticalSpacing--default">
            <Icon type="pen" size="medium" color="dark"></Icon>
          </li>
        </ul>
        <ul className="list list--bottom">
          <li className="u-textAlign--center u-verticalSpacing--default">
            <Icon type="plus" size="medium" color="dark"></Icon>
          </li>
          <li className="u-textAlign--center u-verticalSpacing--default">
            <Avatar src={this.props.user} size="medium"></Avatar>
          </li>
        </ul>
      </div>
    );
  }
};
