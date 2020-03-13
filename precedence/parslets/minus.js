
module.exports = function (parse, lexer, transform) {
	
	return {
		
		bp: 30,
		
		nud: function(token, bp, parse) {
			return parse(bp)
		},
		
		led: function(left, token, bp) {
			return transform('i32.sub', left, parse(bp))
		}
	}
}
