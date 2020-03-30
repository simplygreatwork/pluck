
const fs = require('fs')
const parse = require('./sexpressions-implicit.js')

let code = fs.readFileSync('../fixtures/complex-implicit.wat') + ''
let ast = parse(code)
console.log(JSON.stringify(ast, null, 2))
