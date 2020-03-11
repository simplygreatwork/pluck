
module.exports = function (parse, lexer, transform) {
	
	return {
		
		bp: 40,
		
		nud: function(token, bp) {
			return parse(bp)
		},
		
		led: function(left, token, bp) {
			return transform('less', left, parse(bp))
		}
	}
}
