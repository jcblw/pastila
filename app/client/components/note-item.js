const
  React = require('react'),
  Icon = require('./icon'),
  dispatcher = require('../dispatcher');

module.exports = class NoteItem extends React.Component {

  loadNote(e) {
    dispatcher.emit('contextlink:close');
    dispatcher.emit('gist:get', this.props.note.id);
  }

  render() {
    var
      note = this.props.note,
      files = Object.keys(note.files);
    return (
      <li className="listitem">
        <a href="#" onClick={this.loadNote.bind(this)} data-id={note.id}>
          <Icon type="doc" size="small" color="dark" className="u-marginRight--default"></Icon>{files[0]}
        </a>
      </li>
    );
  }
};
