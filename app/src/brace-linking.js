ace.define('ace/ext/linking', [
  'require',
  'exports',
  'module',
  'ace/editor',
  'ace/config'
], function (acequire, exports, module) {
  const Editor = acequire('ace/editor').Editor

  acequire('../config').defineOptions(Editor.prototype, 'editor', {
    enableLinking: {
      set: function (val) {
        if (val) {
          this.on('click', onClick)
          this.on('mousemove', onMouseMove)
        } else {
          this.off('click', onClick)
          this.off('mousemove', onMouseMove)
        }
      },
      value: false
    }
  })

  function onMouseMove (e) {
    const editor = e.editor
    const docPos = e.getDocumentPosition()
    const session = editor.session
    const token = session.getTokenAt(docPos.row, docPos.column)

    if (!token || (token && !token.value)) {
      return editor.renderer.setCursorStyle('')
    }
    if (token.value.match(/^https?\:\/\//)) {
      editor._emit('linkHover', {position: docPos, token})
      return editor.renderer.setCursorStyle('pointer')
    }
    if (token.value.match(/^\[(x|\s)+\]/)) {
      editor._emit('checkboxHover', {position: docPos, token})
      return editor.renderer.setCursorStyle('pointer')
    }
    editor.renderer.setCursorStyle('')
  }

  function onClick (e) {
    const button = e.getButton()

    if (button === 0) {
      const editor = e.editor
      const docPos = e.getDocumentPosition()
      const session = editor.session
      const token = session.getTokenAt(docPos.row, docPos.column)

      if (!token || (token && !token.value)) {
        return
      }
      if (token.value.match(/^https?\:\/\//)) {
        e.stop()
        editor._emit('linkClick', {position: docPos, token})
        editor.blur()
      }
      if (token.value.match(/^\[(x|\s)+\]/)) {
        e.stop()
        editor._emit('checkboxClick', {position: docPos, token})
        editor.blur()
      }
    }
  }
})

;(function () {
  ace.acequire(['ace/ext/linking'], function () {})
})()
