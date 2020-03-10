
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
			comment(';;'),
			whitespace('\t\r '),
			boolean(),
			number(),
			string(),
			symbol(),
			newline(),
		], function(value) {
			return value.alt
		}),
		0,
		function(value) {
			return fold_whitespace(value.rep)
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

function comment() {
	
	let result = [];
	return p.seq ([
		p.str (';', function(value) {
			return value.str
		}),
		p.str (';', function(value) {
			return value.str
		}),
		p.rep (
			p.char ('^\n', function(value) {
				return value.char;
			}),
			0,
			function(value) {
				return value.rep
			}
		),
	], function(value) {
		return {
			type: 'comment',
			value: value.seq[0] + value.seq[1] + value.seq[2].join('')
		}
	})
}

function fold_whitespace(value) {
	
	let whitespace = []
	value.map(function(each) {
		if (each.type == 'whitespace') {
			whitespace.push(each.value)
		} else if (each.type == 'newline') {
			whitespace.push(each.value)
		} else if (each.type == 'comment') {
			whitespace.push(each.value)
		} else {
			each.whitespace = whitespace.join('')
			whitespace.splice(0, whitespace.length)
		}
	})
	return value.filter(function(each) {
		if (each.type == 'whitespace') {
			return false
		} else if (each.type == 'newline') {
			return false
		} else if (each.type == 'comment') {
			return false
		} else {
			return true
		}
	})
}

refs.main = main

module.exports = function(code) {
	
	return p.parse(
		main(),
		code
	);
}