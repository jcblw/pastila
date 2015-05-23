'use strict';

const
  ace = require('brace'),
  React = require('react'),
  _ = require('lodash');

require('brace/theme/github');
require('brace/theme/textmate');
require('brace/mode/markdown');


module.exports = React.createClass({
  propTypes: {
    mode  : React.PropTypes.string,
    theme : React.PropTypes.string,
    name : React.PropTypes.string,
    height : React.PropTypes.string,
    width : React.PropTypes.string,
    fontSize : React.PropTypes.number,
    showGutter : React.PropTypes.bool,
    onChange: React.PropTypes.func,
    value: React.PropTypes.string,
    onLoad: React.PropTypes.func,
    maxLines : React.PropTypes.number,
    readOnly : React.PropTypes.bool,
    highlightActiveLine : React.PropTypes.bool,
    showPrintMargin : React.PropTypes.bool
  },
  getInitialState() {
    return {
      value: this.props.value
    };
  },
  getDefaultProps() {
    return {
      name   : 'brace-editor',
      mode   : 'markdown',
      theme  : 'textmate',
      height : '100%',
      width  : '100%',
      value  : '',
      fontSize   : 19,
      showGutter : false,
      onChange   : null,
      onLoad     : null,
      maxLines   : null,
      readOnly   : false
    };
  },
  onChange() {
    const value = this.editor.getValue();
    if (this.state.value === value) {
      return;
    }

    if (this.props.onChange) {
      this.props.onChange(value, this.props.id);
      this.setState({value: value});
    }
  },
  componentDidMount() {
    const
      editor = this.editor = ace.edit(this.props.name),
      session = editor.getSession();
    editor.$blockScrolling = Infinity;
    editor.setOptions({
      fontFamily: 'osaka-mono'
    });
    session.setMode('ace/mode/'+this.props.mode);
    session.setUseWrapMode(true);
    editor.setTheme('ace/theme/'+this.props.theme);
    editor.setFontSize(this.props.fontSize);
    editor.on('change', this.onChange);
    editor.setValue(this.props.value, -1);
    editor.renderer.setShowGutter(this.props.showGutter);
    editor.setOption('maxLines', this.props.maxLines);
    editor.setOption('readOnly', this.props.readOnly);
    editor.setOption('highlightActiveLine', this.props.highlightActiveLine);
    editor.setShowPrintMargin(this.props.setShowPrintMargin);
    if (this.props.onLoad) {
      this.props.onLoad(this.editor);
    }
  },
  componentWillReceiveProps(nextProps) {
    const
      editor = this.editor = ace.edit(this.props.name),
      session = editor.getSession();
    session.setUseWrapMode(true);
    editor.$blockScrolling = Infinity;
    editor.getSession().setMode('ace/mode/'+nextProps.mode);
    editor.setTheme('ace/theme/'+nextProps.theme);
    editor.setFontSize(nextProps.fontSize);
    editor.setOption('maxLines', nextProps.maxLines);
    editor.setOption('readOnly', nextProps.readOnly);
    editor.setOption('highlightActiveLine', nextProps.highlightActiveLine);
    editor.setShowPrintMargin(nextProps.setShowPrintMargin);
    if (editor.getValue() !== nextProps.value) {
      editor.setValue(nextProps.value, -1);
      this.setState({value: nextProps.value});
      session.setUndoManager(new (ace.UndoManager)());
    }
    if (nextProps.onLoad) {
      nextProps.onLoad(this.editor);
    }
  },

  render() {
    const
      divStyle = {
        width: this.props.width,
        height: this.props.height
      };
    return (
      <div id={this.props.name} onChange={_.debounce(_.bind(this.onChange, this), 500)} style={divStyle}>
      </div>
    );
  }
});
