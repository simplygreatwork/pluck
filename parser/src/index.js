
var p = require('./parsers/core');

const between = require('./parsers/between')
const split = require('./parsers/split')
const whitespace = require('./parsers/whitespace')
const newline = require('./parsers/newline')
const semicolon = require('./parsers/semicolon')
const number = require('./parsers/number')
const boolean = require('./parsers/boolean')
const string = require('./parsers/string')
const symbol = require('./parsers/symbol')

let refs = {}

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
	
	return p.rep(p.char('^\(\)\n;\t\r ', function(value) {
		return value.char;
	}), 1, function(value) {
		return {
			type: 'other',
			value: value.rep.join('')
		};
	})
}

refs.statements = statements()

module.exports = function(code) {
	
	return p.parse(
		statements(),
		code
	);
}