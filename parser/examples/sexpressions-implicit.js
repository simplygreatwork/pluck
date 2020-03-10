
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
	
	return expression_contents(0)
}

function expression(level) {
	
	return between (
		p.char('('),
		p.ref_(refs, 'expression_contents', level),
		p.char(')'),
		function(value) {
			return {
				type: 'expression',		// whitespace is interfering with length determination
				value: massage(value)
			}
		}
	)
}

function massage(value) {
	
	let result = []
	value.forEach(function(each, index) {
		if (each.type == 'line') {
			if (each.value.length > 0 && each.value[0].type != 'symbol') {
				result.push(...each.value)
			} else {
				if (index === 0) {
					result.push(...each.value)
				} else {
					each.type = 'expression'
					result.push(each)
				}
			}
		} else {
			result.push(each)
		}
	})
	return result
}

function expression_contents(level) {
	
	return p.rep (
		p.alt ([
			line_blank(),
			expression(level),
			lines(level),
			comment(),
			whitespace(),
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
			return fold_whitespace(value)
		}
	)
}

function line_blank() {
	
	return p.seq ([
		p.rep (
			indent(), 0, function(value) { return value.rep }
		),
		newline()
	],
	function(value) {
		return {
			type: 'whitespace',
			value: '\n'
		}
	})
}

function lines(level) {													// fixme: include whitespace in result
	
	return p.seq ([
		line(level),
		p.opt(line_blank()),
		line_children(level)
	],
	function(value) {
		let line = value.seq[0]
		let lines = value.seq[2]
		line.value.push(...lines)
		line.value = massage(line.value)
		return line
	})
}

function line(level) {
	
	return between (
		indentation(level),
		p.ref_(refs, 'line_contents', level),
		newline(),
		function(value) {
			return {
				type: 'line',
				level: level,
				value: massage(value)
			}
		}
	)
}

function line_children(level) {

	return p.opt (
		p.rep (
			p.ref_(refs, 'lines', level + 1), 0, function(value) {
				return value.rep
			}
		),
		function(value) {
			return value.opt
		}
	)
}

function line_contents(level) {
	
	return p.rep (
		p.alt ([
			expression(level + 1),
			whitespace(),
			boolean(),
			number(),
			string(),
			symbol(),
			comment()
		], function(value) {
			return value.alt
		}),
		1,
		function(value) {
			return fold_whitespace(value)
			// return value.rep
		}
	)
}

function indentation(level) {
	
	let sequence = [];
	for (var i = 0; i < level; i++) {
		sequence.push(
			indent()
		)
	}
	return p.seq (sequence, function(value) {
		return value.seq.join('')
	})
}

function indent() {
	
	return p.alt([
		p.char ('\t'),
		p.str ('   ')
	])
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
			value: ''
		}
	})
}

function fold_whitespace(value) {
	
	let whitespace = []
	value.rep.map(function(each) {
		if (each.type == 'whitespace') {
			whitespace.push(each.value)
		} else if (each.type == 'newline') {
			whitespace.push(each.value)
		} else {
			each.whitespace = whitespace.join('')
			whitespace.splice(0, whitespace.length)
		}
	})
	return value.rep.filter(function(each) {
		if (each.type == 'whitespace') {
			return false
		} else if (each.type == 'newline') {
			return false
		} else {
			return true
		}
	})
}

refs.lines = lines
refs.line_contents = line_contents
refs.expression_contents = expression_contents

let result = p.parse (
	main(),
`
(module
	
	(call it)	;; comment
	import aaa

	import bbb

	import ccc
	func
		call one
		call two
	
)
`
);

console.log(JSON.stringify(result, null, 2))
