const
  React = require('react'),
  dispatcher = require('../dispatcher');

module.exports = class NoteItem extends React.Component {

  loadNote(e) {
    dispatcher.emit('gist:get', this.props.note.id);
  }

  render() {
    var
      note = this.props.note,
      files = Object.keys(note.files);
    return (
      <li className="listitem pure-menu-item">
        <a href="#" className="pure-menu-link"  onClick={this.loadNote.bind(this)} data-id={note.id}>{files[0]}</a>
      </li>
    );
  }
};
