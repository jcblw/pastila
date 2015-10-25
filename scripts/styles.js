'use strict'

const cssnext = require('cssnext')
const fs = require('fs')
const path = require('path')
const gaze = require('gaze')
const filename = process.argv[2]
const output = process.argv[3]
const watchables = process.argv[4]
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
  ws.on('finish', function () { done() })
  ws.write(output)
  ws.end()
}

processCSS(filepath, outputpath, function () {
  if (!watchables) {
    process.exit(0)
  } else {
    console.log('styles compiled')
  }
})

if (watchables) {
  const watchGlob = path.join(process.cwd(), watchables)
  console.log('watching ' + watchGlob)
  const fn = processCSS.bind(null, filepath, outputpath, function () {
    console.log('styles recompiled')
  })
  gaze(watchGlob, function (err) {
    if (err) {
      throw err
    }
    this.on('all', fn)
  })
}
