
module.exports = function (parse, lexer, transform) {
	
	return {
		
		bp: 100,
		
		nud: function(token, bp) {
			
			const inner = parse()
			lexer.expect(')')
			return inner
		},
		
		led: function(left, token, bp) {
			
			if (left.type != 'id') throw new Error(`Cannot invoke expression as if it was a function)`)
			if (typeof left.ref != 'function') throw new Error(`Cannot invoke non-function`)
			const args = parse()
			lexer.expect(')')
			return {type: '()', target: left, args}
		}
	}
}
