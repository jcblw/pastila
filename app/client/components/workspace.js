const
  React = require('react/addons'),
  NoteItem = require('./note-item'),
  Editor = require('./editor'),
  dispatcher = require('../dispatcher'),
  _ = require('lodash');

module.exports = class Notes extends React.Component {

  getContent() {
    if (this.props.note) {
      var
        fileNames = Object.keys(this.props.note.files),
        note = this.props.note.files[fileNames[0]];

      return note.content;
    }

    return 'Open a note by clicking a note in the sidebar';
  }

  onFileChange(content) {
    if (this.props.note) {
      var fileNames = Object.keys(this.props.note.files);
      if (this.props.note.files[fileNames[0]].content === content) {
        return;
      }
      this.props.note.files[fileNames[0]].content = content;
      dispatcher.emit('gist:update', this.props.note.id, this.props.note);
    }
  }

  render() {
    var
      content = this.getContent(),
      editor = (
        <Editor
          value={content}
          onChange={_.debounce(this.onFileChange.bind(this), 5000)}>
        </Editor>
      );

    return (
      <div className='workspace u-padding--default' style={this.props.style}>
        {editor}
      </div>
    );
  }
};
