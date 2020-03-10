
var p = require('uparse');
const number = require('../parsers/number')

console.log(
	p.parse(number(), 'Hello!')
)

console.log(
	p.parse(number(), '123Hello!')
)

console.log(
	p.parse(number(), '000')
)

console.log(
	p.parse(number(), '123')
)
