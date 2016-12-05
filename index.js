'use strict'
const lebab = require('lebab')
const glob = require('glob')
const fs = require('fs')
const path = require('path')
const cwd = process.cwd();

glob(path.join(cwd, '**', '*.js'), {ignore: ['**/node_modules/**']}, (err, files) => {
  if (err) throw err

  files.forEach(filePath => {
    try {
      const js = fs.readFileSync(filePath, 'utf8')
      const ts = lebab.transform(js, ['commonjs'])
      fs.writeFileSync(filePath.replace(/\.js$/, '.ts'), ts.code, 'utf8')
      fs.unlinkSync(filePath)
      console.error(`Converted ${filePath}`)
    } catch (err) {
      console.error(`Failed to convert ${filePath}. ${err.message}`)
    }
  })
})
