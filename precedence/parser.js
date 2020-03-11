
let lexer = null
let transform = null
let parslets = null

function bp (token) {
	
	if (! token.type) {
		return 0
	} else {
		return parslets[token.type].bp
	}
}

function nud (token) {
	return parslets[token.type].nud(token, bp(token))
}

function led (left, token) {
	return parslets[token.type].led(left, token, bp(token))
}

function parse (rbp) {
	
	rbp = rbp || 0
	let token = lexer.next()
	let left = nud(token)
	while (true) {
		let next = lexer.peek()
		if (bp(next) > rbp) {
			token = lexer.next()
			left = led(left, token)
		} else {
			break
		}
	}
	return left
}

function tokens(string) {
	
	if (true) {
		return string.split(' ').map(function(each) {
			let type = each
			if (! isNaN(parseInt(each))) type = 'number'
			return {
				type: type,
				value: each
			}
		})
	} else {
		return []
	}
}

module.exports = {
	
	parse: function(string) {
		
		lexer = require('./lexer')(tokens(string))
		transform = require('./transform')
		parslets = {
			'expression': require('./parslets/expression')(parse, lexer, transform),
			'number': require('./parslets/number')(parse, lexer, transform),
			'equals': require('./parslets/equals')(parse, lexer, transform),
			'and': require('./parslets/and')(parse, lexer, transform),
			'or': require('./parslets/or')(parse, lexer, transform),
			'not': require('./parslets/not')(parse, lexer, transform),
			'plus': require('./parslets/plus')(parse, lexer, transform),
			'minus': require('./parslets/minus')(parse, lexer, transform),
			'greater': require('./parslets/greater')(parse, lexer, transform),
			'less': require('./parslets/less')(parse, lexer, transform),
			'(': require('./parslets/open')(parse, lexer, transform),
			')': require('./parslets/close')(parse, lexer, transform)
		}
		return parse()
	}
}