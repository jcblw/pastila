'use strict'

const ace = require('brace')
const React = require('react')
const _ = require('lodash')
const {autobind} = require('core-decorators')
const dispatcher = require('../../src/dispatcher')
const AppConstants = require('../../constants/app')

require('brace/theme/github')
// require('brace/theme/textmate');
require('brace/theme/kuroir')
require('brace/mode/markdown')

class Editor extends React.Component {

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
    editor.$blockScrolling = Infinity
    editor.setOptions({
      fontFamily: 'osaka-mono'
    })
    session.setMode(`ace/mode/${this.props.mode}`)
    session.setUseWrapMode(true)
    session.setTabSize(2)
    session.setUseSoftTabs(true)
    editor.setTheme(`ace/theme/${this.props.theme}`)
    editor.setFontSize(this.props.fontSize)
    editor.on('change', this.onChange)
    editor.setValue(this.props.value, -1)
    editor.renderer.setShowGutter(this.props.showGutter)
    editor.setOption('scrollPastEnd', 0.7)
    editor.setOption('maxLines', this.props.maxLines)
    editor.setOption('readOnly', this.props.readOnly)
    editor.setOption('highlightActiveLine', this.props.highlightActiveLine)
    editor.setShowPrintMargin(false)
    if (this.props.onLoad) {
      this.props.onLoad(this.editor)
    }
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
  }

  focusEditor () {
    if (this.editor && typeof this.editor.focus === 'function') {
      this.editor.focus()
    }
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

Editor.propTypes = {
  id: React.PropTypes.string,
  mode: React.PropTypes.string,
  theme: React.PropTypes.string,
  name: React.PropTypes.string,
  height: React.PropTypes.string,
  width: React.PropTypes.string,
  fontSize: React.PropTypes.number,
  showGutter: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
  onLoad: React.PropTypes.func,
  maxLines: React.PropTypes.number,
  readOnly: React.PropTypes.bool,
  highlightActiveLine: React.PropTypes.bool,
  showPrintMargin: React.PropTypes.bool
}

Editor.defaultProps = {
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
  readOnly: false
}

module.exports = Editor
