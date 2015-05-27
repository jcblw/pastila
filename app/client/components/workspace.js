const
  React = require('react/addons'),
  NoteItem = require('./note-item'),
  Editor = require('./editor'),
  dispatcher = require('../dispatcher'),
  _ = require('lodash');

module.exports = class Notes extends React.Component {

  constructor(options) {
    super(options);
    this.onFileChange = _.debounce(this.onFileChange.bind(this), 2000);
  }

  getContent() {
    if (this.props.note) {
      var
        fileNames = Object.keys(this.props.note.files),
        note = this.props.note.files[fileNames[0]];

      return note.content;
    }

    return 'Open a note by clicking a note in the sidebar';
  }

  onFileChange(content, id) {
    if (this.props.note) {
      var fileNames = Object.keys(this.props.note.files);
      if (this.props.note.id !== id || this.props.note.files[fileNames[0]].content === content) {
        return;
      }
      this.props.note.files[fileNames[0]].content = content;
      dispatcher.emit('gist:update', this.props.note.id, this.props.note);
    }
  }

  render() {
    var
      content = this.getContent(),
      id = this.props.note ? this.props.note.id : 'startup',
      editor = (
        <Editor
          id={id}
          value={content}
          onChange={this.onFileChange}
          onLoad={this.onFileChange.cancel}>
        </Editor>
      );

    return (
      <div className='workspace' style={this.props.style}>
        {editor}
      </div>
    );
  }
};
