
module.exports = function (parse, lexer, transform) {
	
	return {
		
		bp: 20,
		
		nud: function(token, bp) {
			return parse(bp)
		},
		
		led: function(left, token, bp) {
			return transform('or', left, parse(bp))
		}
	}
}