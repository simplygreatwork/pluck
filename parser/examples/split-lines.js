
const p = require('uparse');
const number = require('../parsers/number')
const symbol = require('../parsers/symbol')
const newline = require('../parsers/newline')
const split = require('../parsers/split')

function main() {
	
	return split (
		symbol(),
		newline()
	)
}

function other() {
	
	return p.rep(p.char('^\n', function(value) {
		return value.char;
	}), 1, function(value) {
		return value.rep.join('');
	})
}

let array = []
for (i = 0; i < 1; i++) {
	array.push(
`one
two
three
four
five
six
seven
`
	)
}

console.log('begin');
let result = p.parse(
	main(),
	array.join('')
);
console.log('end');

if (array.length < 5) {
	console.log(
		JSON.stringify(
			result, null, 2
		)
	)
}
