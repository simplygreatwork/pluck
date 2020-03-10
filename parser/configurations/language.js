
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
	
	return statements()
}

function statements() {
	
	return split (
		options(),
		p.alt([
			semicolon(),
			newline()
		]),
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
			whitespace('\t\r '),
			string(),
			symbol(),
			other()
		], function(value) {
			return value.alt
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
	
	return p.rep(p.char('^\(\)\n;\t\r ', function(value) {
		return value.char;
	}), 1, function(value) {
		return {
			type: 'other',
			value: value.rep.join('')
		};
	})
}

refs.statements = statements

module.exports = function(code) {
	
	return p.parse (
		main(),
		code
	)
}
