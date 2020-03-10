
const p = require('uparse');
const whitespace = require('../parsers/whitespace')
const newline = require('../parsers/newline')
const symbol = require('../parsers/symbol')
const string = require('../parsers/string')
const number = require('../parsers/number')
const boolean = require('../parsers/boolean')
const split = require('../parsers/split')

function main() {
	
	return p.rep (
		split (
			atoms(),
			newline(),
			function(value) {
				return {
					type: 'statement',
					value: value.split
				}
			}
		),
		0,
		function(value) {
			return value.rep
		}
	)
}

function atoms() {
	
	return p.rep (
		atom(),
		0,
		function(value) {
			return value.rep.filter(function(each) {
				return each.type != 'whitespace'
			});
		}
	)
}

function atom() {
	
	return p.alt([
		whitespace(' \t\r'),
		number(),
		string(),
		boolean(),
		symbol(),
	], function(value) {
		return value.alt
	})
}

let array = []
for (i = 0; i < 1; i++) {
	array.push(
`1 2 3 4 5 6 7 8 9
1 2 3 4 5 6 7 8 9
a b c d e f g h i j k
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
