const
  React = require('react/addons'),
  NoteItem = require('./note-item'),
  ContextLink = require('./context-link'),
  NoteForm = require('./note-form'),
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

  noop() {}

  signout() {
    dispatcher.emit('auth:signout');
  }

  render () {
    const
      list = this.getNodeList(),
      penClassName = (this.props.note ? '' : 'is-hidden ') +
        'u-textAlign--center u-verticalSpacing--default';

    return (
      <div className="menu pure-menu u-padding--default" style={this.props.style}>
        <ul className="list">
          <ContextLink icon="stacks" size="medium" color="dark" className='u-textAlign--center u-verticalSpacing--default'>
            <ul className="u-textAlign--left">
              {list}
            </ul>
          </ContextLink>
          <ContextLink icon="pen" size="medium" color="dark" className={penClassName}>
            <NoteForm note={this.props.note} onChange={this.noop}></NoteForm>
          </ContextLink>
        </ul>
        <ul className="list list--bottom">
          <ContextLink icon="plus" size="medium" color="dark" bottom={true} className="u-textAlign--center u-verticalSpacing--default">
            <NoteForm onChange={this.noop}>
              <label className="u-fontSize--larger u-verticalSpacing--default">Create New Note</label>
            </NoteForm>
          </ContextLink>
          <ContextLink icon="settings" size="medium" bottom={true} className="u-textAlign--center u-verticalSpacing--default">
            <ul className="u-textAlign--left">
              <li className="listitem">
                <a href="#" onClick={this.signout.bind(this)}>
                  Sign Out
                </a>
              </li>
            </ul>
          </ContextLink>
        </ul>
      </div>
    );
  }
};
