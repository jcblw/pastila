const
  React = require('react/addons'),
  NoteItem = require('./note-item'),
  ContextLink = require('./context-link'),
  NoteForm = require('./note-form'),
  dispatcher = require('../dispatcher');

module.exports = class Notes extends React.Component {

  constructor() {
    super();
    dispatcher.on('focus', this.focusItem.bind(this));
  }

  noop() {}

  getNodeList() {
    const
      notes = this.props.notes || [],
      nodes = {};

    notes.forEach((note, index) => {
      nodes[note.id] = (
        <NoteItem note={note} ref={"note" + index }/>
      );
    });

    if (!Object.keys(nodes).length) {
      nodes['not found'] = (
        <li className="listitem">No Notes Found</li>
      );
    }

    return React.addons.createFragment(nodes);
  }

  focusItem(id) {
    if (id === 'noteList') {
      let item = React.findDOMNode(this.refs.note0);
      if (item && typeof item.focus === 'function') {
        item.children[0].focus();
      }
    }
  }

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
          <ContextLink icon="stacks" size="medium" color="dark" className='u-textAlign--center u-verticalSpacing--default' eventTrigger="ui:open" focusId="noteList">
            <ul className="u-textAlign--left">
              {list}
            </ul>
          </ContextLink>
          <ContextLink icon="pen" size="medium" color="dark" className={penClassName} onChange={this.noop} focusId="editForm">
            <NoteForm note={this.props.note} onChange={this.noop} id="editForm"></NoteForm>
          </ContextLink>
        </ul>
        <ul className="list list--bottom">
          <ContextLink icon="plus" size="medium" color="dark" bottom={true} className="u-textAlign--center u-verticalSpacing--default" eventTrigger="ui:new" focusId="newForm">
            <NoteForm onChange={this.noop} id="newForm">
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
