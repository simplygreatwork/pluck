
module.exports = function (parse, lexer, transform) {
	
	return {
		
		bp: 30,
		
		nud: function(token, bp) {
			return parse(bp)
		},
		
		led: function(left, token, bp) {
			return transform('i32.add', left, parse(bp))
		}
	}
}
