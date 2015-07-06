
const
  React = require('react'),
  Icon = require('./icon'),
  dispatcher = require('../dispatcher');

module.exports = class NoteItem extends React.Component {

  loadNote() {
    dispatcher.emit('contextlink:close');
    dispatcher.emit('gist:get', this.props.note.id);
  }

  onDelClick(e) {
    e.stopPropagation();
    dispatcher.emit('gist:del', this.props.note);
  }

  onKeypress(e) {
    debugger;
    if (e.keycode === 38) { // up
      debugger;
    }
  }

  render() {
    const
      note = this.props.note,
      files = Object.keys(note.files);
    return (
      <li className="listitem">
        <a href="#" onClick={this.loadNote.bind(this)} data-id={note.id} onKeyPress={this.onKeypress.bind(this)}>
          {files[0]}
          <Icon type="x" size="small" color="dark" className="u-marginRight--default u-position--absolute u-position--right" onClick={this.onDelClick.bind(this)}></Icon>
        </a>
      </li>
    );
  }
};
