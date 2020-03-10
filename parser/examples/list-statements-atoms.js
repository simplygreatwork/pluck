
const p = require('uparse');
const between = require('../parsers/between')
const split = require('../parsers/split')
const whitespace = require('../parsers/whitespace')
const newline = require('../parsers/newline')
const number = require('../parsers/number')
const boolean = require('../parsers/boolean')
const string = require('../parsers/string')
const symbol = require('../parsers/symbol')

let refs = {}

function main() {
	
	return statements()
}

function statements() {
	
	return split (
		options(),
		newline(),
		function(value) {
			return {
				statements: value.split
			}
		}
	)
}

function options() {
	
	return p.rep (
		p.alt([
			list(),
			boolean(),
			number(),
			whitespace(),
			string(),
			symbol(),
			other()
		], function(value) {
			return value.alt		// todo: emit the atom here
		}),
		1,
		function(value) {
			return value.rep.filter(function(each) {
				return each.type != 'whitespace'
			});
		}
	)
}

function list() {
	
	return between (
		p.char('('),
		p.ref(refs, 'statements'),
		p.char(')'),
		function(value) {
			return {
				type: 'list',
				statements: value.statements
			}
		}
	)
}

function other() {

	return p.rep(p.char('^\(\)\n\t\r ', function(value) {
		return value.char;
	}), 1, function(value) {
		return {
			type: 'other',
			value: value.rep.join('')
		};
	})
}

refs.statements = statements()

let array = []
for (i = 0; i < 1; i++) {
	array.push(
`

	list = Object clone
	list push true
	1 2 3 true false "stringy" symbolic let x = 5


	list push false
	method = method (
		list = Object clone
		list push 1
		list push 2
		print
		method = method (


			list = Object clone
			list push 1
			list push 2
			print
		)


	)
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
