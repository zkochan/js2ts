'use strict'
const lebab = require('lebab')
const glob = require('glob')
const fs = require('fs')
const path = require('path')
const cwd = process.cwd();
const eof = require('os').EOL

glob(path.join(cwd, 'src', '**', '*.js'), {ignore: ['**/node_modules/**']}, (err, files) => {
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

fs.writeFileSync('tsconfig.json', `{
  "compilerOptions": {
    "removeComments": false,
    "preserveConstEnums": true,
    "sourceMap": true,
    "declaration": true,
    "noImplicitAny": false,
    "noImplicitReturns": true,
    "suppressImplicitAnyIndexErrors": true,
    "allowSyntheticDefaultImports": true,
    "strictNullChecks": true,
    "target": "es6",
    "outDir": "dist",
    "module": "commonjs",
    "moduleResolution": "node"
  },
  "filesGlob": [
    "src/"
  ]
}`, 'utf8')

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
pkg.scripts = Object.assign({}, pkg.scripts, {
  prepublish: 'tsc'
})

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + eof, 'UTF8')
