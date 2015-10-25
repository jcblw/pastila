'use strict'

const cssnext = require('cssnext')
const fs = require('fs')
const path = require('path')
const filename = process.argv[2]
const output = process.argv[3]
const filepath = path.resolve(process.cwd(), filename)
const outputpath = path.resolve(process.cwd(), output)

function processCSS (src, out, done) {
  const css = fs.readFileSync(src, 'utf8')
  if (!css) {
    throw new Error('Could not find file ' + src)
  }
  const ws = fs.createWriteStream(out)
  const output = cssnext(css, {
    from: src,
    plugins: [
      // require('postcss-import')
    ]
  })
  ws.on('end', function () { done() })
  ws.write(output)
  ws.end()
}

processCSS(filepath, outputpath, function () { process.exit(0) })
