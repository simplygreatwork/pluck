
var p = require('../src/parsers/core');
const between = require('../src/parsers/between')
const newline = require('../src/parsers/newline')

let refs = {}

function main() {
	
	return p.rep (
		p.alt ([
			expression(),
			atom(),
			newline(),
		], function(value) {
			return value.alt
		}),
		0,
		function(value) {
			return value.rep
		}
	)
}

function expression() {
	
	return between (
		p.char('('),
		p.ref(refs, 'main'),
		p.char(')'),
		function(value) {
			return {
				type: 'list',
				value: value
			}
		}
	)
}

refs.main = main()

let array = []
for (i = 0; i < 1; i++) {
	array.push(
		`(
			one
			two
			three (
				four
				five
			)
		)`
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
