
const fs = require('fs')
const parse = require('./sexpressions.js')

let code = fs.readFileSync('../fixtures/simple.wat') + ''
let ast = parse(code)
console.log(JSON.stringify(ast, null, 2))
