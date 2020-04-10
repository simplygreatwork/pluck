
var p = require('../parsers/core');
const between = require('../parsers/between')
const whitespace = require('../parsers/whitespace')
const newline = require('../parsers/newline')
const number = require('../parsers/number')
const boolean = require('../parsers/boolean')
const string = require('../parsers/string')
const symbol = require('../parsers/symbol')
const comment = require('../parsers/comment')
const indent = require('../parsers/indent')
const indents = require('../parsers/indents')
const fold_whitespace = require('./fold-whitespace')
const fold_lines = require('./fold-lines')

let refs = {}

function expression(level) {
	
	return between (
		p.char ('('),
		p.ref(refs, 'expression_contents', level),
		p.char (')'),
		function(value) {
			return {
				type: 'expression',
				value: fold_lines(value)
			}
		}
	)
}

function expression_contents(level) {
	
	return p.rep (
		p.alt ([
			line_blank(),
			expression(level),
			lines(level),
			comment(';;'),
			whitespace('\t\r '),
			number(),
			string(),
			boolean(),
			symbol(),
			newline(),
		]),
		0,
		function(value) {
			return fold_whitespace(value)
		}
	)
}

function line_blank() {
	
	return p.seq ([
		p.rep (indent(), 0),
		newline()
	],
	function(value) {
		return {
			type: 'whitespace',
			value: '\n'
		}
	})
}

function lines(level) {
	
	return p.seq ([
		line(level),
		p.opt (line_blank()),
		line_children(level)
	],
	function(value) {
		let line = value[0]
		let line_blank = value[1]
		let lines = value[2]
		if (line_blank) line.value.push(line_blank)
		line.value.push(...lines)
		line.value = fold_lines(line.value)
		return line
	})
}

function line(level) {
	
	return p.seq ([
		indents(level),
		p.ref (refs, 'line_contents', level),
		newline(),
	], function(value) {
		return {
			type: 'line',
			value: value[1],
			whitespace_: value[2].value + value[0].value
		}
	})
}

function line_children(level) {
	
	return p.opt (
		p.rep (
			p.ref (refs, 'lines', level + 1), 0
		)
	)
}

function line_contents(level) {
	
	return p.rep (
		p.alt ([
			expression(level + 1),
			whitespace('\t\r '),
			number(),
			string(),
			boolean(),
			symbol(),
			comment(';;')
		]),
		1,
		function(value) {
			return fold_whitespace(value)
		}
	)
}

function sanitize(node) {													// related to: if (line_blank) line.value.push(line_blank)
	
	if (node.type == 'expression') {
		for (let i = node.value.length - 1; i >= 0; i--) {
			let child = node.value[i]
			if (child.type == 'whitespace') {
				node.value.splice(i, 1)
			}
			sanitize(child)
		}
	}
}

refs.lines = lines
refs.line_contents = line_contents
refs.expression_contents = expression_contents

module.exports = function(code) {
	
	let result = p.parse (
		expression_contents(0),
		code
	)
	result[0].type = 'expression'
	sanitize(result[0])
	return result
}
