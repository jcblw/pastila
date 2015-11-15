'use strict'

const ace = require('brace')
const React = require('react')
const {PropTypes, Component} = React;
const _ = require('lodash')
const {autobind} = require('core-decorators')
const dispatcher = require('../../src/dispatcher')
const AppConstants = require('../../constants/app')
const shortcuts = require('../../src/brace-shortcuts')
const propTypes = {
  id: PropTypes.string,
  mode: PropTypes.string,
  theme: PropTypes.string,
  name: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  fontSize: PropTypes.number,
  showGutter: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
  onLoad: PropTypes.func,
  maxLines: PropTypes.number,
  readOnly: PropTypes.bool,
  highlightActiveLine: PropTypes.bool,
  showPrintMargin: PropTypes.bool,
  enableLinking: PropTypes.bool,
  onLinkClick: PropTypes.func
}
const defaultProps = {
  name: 'brace-editor',
  mode: 'markdown',
  theme: 'kuroir',
  height: '100%',
  width: '100%',
  value: '',
  fontSize: 19,
  showGutter: false,
  onChange: null,
  onLoad: null,
  maxLines: null,
  readOnly: false,
  enableLinking: true
}

require('brace/theme/kuroir')
require('brace/mode/markdown')
require('../../src/brace-linking')

class Editor extends Component {

  constructor (props) {
    super()
    this.state = {value: props.value}
  }

  @autobind
  onChange () {
    const value = this.editor.getValue()
    if (this.state.value === value) {
      return
    }

    if (this.props.onChange) {
      this.props.onChange(value, this.props.id)
      this.setState({value: value})
    }
  }

  componentDidMount () {
    const editor = this.editor = ace.edit(this.props.name)
    const session = editor.getSession()
    const {props} = this;
    editor.$blockScrolling = Infinity
    editor.setOptions({
      fontFamily: 'osaka-mono'
    })
    session.setMode(`ace/mode/${props.mode}`)
    session.setUseWrapMode(true)
    session.setTabSize(2)
    session.setUseSoftTabs(true)
    editor.setTheme(`ace/theme/${props.theme}`)
    editor.setFontSize(props.fontSize)
    editor.on('change', this.onChange)
    editor.setValue(props.value, -1)
    editor.renderer.setShowGutter(props.showGutter)
    editor.setOption('scrollPastEnd', 0.7)
    editor.setOption('maxLines', props.maxLines)
    editor.setOption('readOnly', props.readOnly)
    editor.setOption('enableLinking', props.enableLinking)
    editor.setOption('highlightActiveLine', props.highlightActiveLine)
    editor.setShowPrintMargin(false)
    if (props.onLoad) {
      props.onLoad(this.editor)
    }
    if (props.onLinkClick) {
      editor.on('linkClick', props.onLinkClick);
    }
    editor.on('checkboxClick', this.onCheckboxClick);
    shortcuts.forEach((shortcut) => {
      editor.commands.addCommand(shortcut)
    })
  }

  componentWillReceiveProps (nextProps) {
    const editor = this.editor = ace.edit(this.props.name)
    const session = editor.getSession()
    session.setUseWrapMode(true)
    editor.$blockScrolling = Infinity
    editor.getSession().setMode(`ace/mode/${nextProps.mode}`)
    editor.setTheme(`ace/theme/${nextProps.theme}`)
    editor.setFontSize(nextProps.fontSize)
    editor.setOption('maxLines', nextProps.maxLines)
    editor.setOption('readOnly', nextProps.readOnly)
    editor.setOption('enableLinking', nextProps.enableLinking)
    editor.setOption('highlightActiveLine', nextProps.highlightActiveLine)
    editor.setShowPrintMargin(nextProps.setShowPrintMargin)
    if (editor.getValue() !== nextProps.value) {
      editor.setValue(nextProps.value, -1)
      this.setState({value: nextProps.value})
      session.setUndoManager(new (ace.UndoManager)())
    }
    if (nextProps.onLoad) {
      nextProps.onLoad(this.editor)
    }
    if (nextProps.onLinkClick) {
      editor.on('linkClick', nextProps.onLinkClick);
    }
  }

  focusEditor () {
    if (this.editor && typeof this.editor.focus === 'function') {
      this.editor.focus()
    }
  }

  @autobind
  onCheckboxClick ({position, token, ...args}) {
    const {value} = token
    const range = {
      start: {
        row: position.row,
        column: token.start
      },
      end: {
        row: position.row,
        column: token.start + value.length
      }
    }
    const replace = value === '[ ]' ? '[x]' : '[ ]'
    this.editor.session.replace(range, replace);
  }

  componentWillMount () {
    this._dispatherToken = dispatcher.register((action) => {
      if (action.action === AppConstants.APP_EDITOR_FOCUS) {
        this.focusEditor()
      }
    })
  }

  componentWillUnmount () {
    dispatcher.unregister(this._dispatherToken)
  }

  render () {
    const divStyle = {
      width: this.props.width,
      height: this.props.height
    }
    return (
      <div id={this.props.name} onChange={this.onChange} style={divStyle}></div>
    )
  }

}

Editor.propTypes = propTypes
Editor.defaultProps = defaultProps

module.exports = Editor
