const
  React = require('react/addons'),
  NoteItem = require('./note-item'),
  ContextLink = require('./context-link'),
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
          <ContextLink icon="stacks" size="medium" color="dark" className="u-textAlign--center u-verticalSpacing--default">
            <ul className="u-textAlign--left">
              <li className="list-header">
                Notes
              </li>
              {list}
            </ul>
          </ContextLink>
          <ContextLink icon="pen" size="medium" color="dark" className="u-textAlign--center u-verticalSpacing--default">
            Bar
          </ContextLink>
        </ul>
        <ul className="list list--bottom">
          <ContextLink icon="plus" size="medium" color="dark" bottom={true} className="u-textAlign--center u-verticalSpacing--default">
            Baz
          </ContextLink>
          <ContextLink user={this.props.user} size="medium" bottom={true} className="u-textAlign--center u-verticalSpacing--default">
            Qux
          </ContextLink>
        </ul>
      </div>
    );
  }
};
