
const fs = require('fs');
const parse = require('./sexpressions.js');

let code = fs.readFileSync('../data/webassembly.wat') + '';
let ast = parse(code);
console.log(JSON.stringify(ast, null, 2))
