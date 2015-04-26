const
  React = require('react/addons'),
  NoteItem = require('./note-item'),
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
      <div className="menu u-padding--default" style={this.props.style}>
        <ul className="list">
          <li className="listitem">
            Notes
          </li>
          {list}
        </ul>
      </div>
    );
  }
};
