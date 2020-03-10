
const fs = require('fs')
const parse = require('./language.js')

let code = fs.readFileSync('../data/example-one.oo') + ''
let ast = parse(code)
console.log(JSON.stringify(ast, null, 2))
