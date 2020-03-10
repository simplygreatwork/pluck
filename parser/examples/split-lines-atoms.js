
const p = require('uparse');
const split = require('../parsers/split')
const atoms = require('../parsers/atoms')
const newline = require('../parsers/newline')

function main() {
	
	return split (
		atoms(),
		newline(),
		function(value) {
			return {
				statements: value.split
			}
		}
	)
}

let array = []
for (i = 0; i < 1; i++) {
	array.push(
`one one
two
three
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
