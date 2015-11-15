module.exports = [
  {
    name: 'bold',
    bindKey: {mac: 'Command-B'},
    exec: function (editor) {
      tokenWrap('**', editor)
    }
  },
  {
    name: 'italic',
    bindKey: {mac: 'Command-I'},
    exec: function (editor) {
      tokenWrap('*', editor)
    }
  }
]

function tokenWrap (char, editor) {
  const selectedText = editor.getSelectedText()
  const charPat = char.split('').join('\\')
  const charAmount = char.length * 2
  const fullPattern = new RegExp(`^\\${charPat}(.)+\\${charPat}$`)
  const startPattern = new RegExp(`^\\${charPat}`)
  const endPattern = new RegExp(`\\${charPat}$`)
  if (selectedText) {
    const selectRange = editor.getSelectionRange()
    let diff
    let newValue
    if (selectedText.match(fullPattern)) {
      newValue = selectedText.split(startPattern).join('').split(endPattern).join('')
      diff = -charAmount
    } else {
      newValue = `${char}${selectedText}${char}`
      diff = charAmount
    }
    editor.session.replace(selectRange, newValue)
    selectRange.end.column = selectRange.end.column + diff
    editor.session.selection.setRange(selectRange)
  }
}
