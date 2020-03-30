
var p = require('../parsers/core');
const between = require('../parsers/between')
const split = require('../parsers/split')
const whitespace = require('../parsers/whitespace')
const newline = require('../parsers/newline')
const semicolon = require('../parsers/semicolon')
const number = require('../parsers/number')
const boolean = require('../parsers/boolean')
const string = require('../parsers/string')
const symbol = require('../parsers/symbol')
const comment = require('../parsers/comment')
const fold_whitespace = require('./fold-whitespace')

let refs = {}

function expression_contents() {
	
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
		p.ref(refs, 'expression_contents'),
		p.char(')'),
		function(value) {
			return {
				type: 'expression',
				value: value
			}
		}
	)
}

refs.expression_contents = expression_contents

module.exports = function(code) {
	
	let result = p.parse (
		expression_contents(0),
		code
	)
	result[0].type = 'expression'
	return result
}