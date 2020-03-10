
var p = require('../src/parsers/core');
const between = require('../src/parsers/between')
const split = require('../src/parsers/split')
const whitespace = require('../src/parsers/whitespace')
const newline = require('../src/parsers/newline')
const semicolon = require('../src/parsers/semicolon')
const number = require('../src/parsers/number')
const boolean = require('../src/parsers/boolean')
const string = require('../src/parsers/string')
const symbol = require('../src/parsers/symbol')

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
			return value.rep.filter(function(each) {
				if (each.type == 'whitespace') {
					return false
				} else if (each.type == 'newline') {
					return false
				} else {
					return true
				}
			});
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
				type: 'expression',
				value: value
			}
		}
	)
}

function atom() {
	
	return p.alt([
		whitespace(),
		newline(),
		boolean(),
		number(),
		string(),
		symbol(),
	], function(value) {
		return value.alt		// todo: emit the atom here
	})
}

refs.main = main()

let array = []
for (i = 0; i < 1000; i++) {
	array.push(`
(module
	(memory
		(import "js" "mem")
		1
	)
	(func
		(export "accumulate") (param $ptr i32) (param $len i32) (result i32)
		(local $end i32)
		(local $sum i32)
		(set_local $end 
			(i32.add
				(get_local $ptr) (i32.mul
					(get_local $len) (i32.const 4)
				)
			)
		)
		(block $break
			(loop $top
				(br_if $break
					(i32.eq
						(get_local $ptr) (get_local $end)
					)
				)
				(set_local $sum
					(i32.add (get_local $sum) (i32.load (get_local $ptr)))
				)
				(set_local $ptr (i32.add (get_local $ptr) (i32.const 4)))
				(br $top)
			)
		)
		(get_local $sum)
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
