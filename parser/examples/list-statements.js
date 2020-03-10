
const p = require('uparse');
const atom = require('../parsers/atom')
const between = require('../parsers/between')
const split = require('../parsers/split')

let refs = {}

function main() {
	
	return p.rep (
		p.alt ([
			list(),
			atom()
		], function(value) {
			return value.alt
		}),
		0,
		function(value) {
			return value.rep
		}
	)
}

function list() {
	
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
			list = Object clone
			list push true
			list push false
			method = method (
				list = Object clone
				list push 1
				list push 2
				print
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
