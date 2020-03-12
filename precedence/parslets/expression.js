
module.exports = function (parse, lexer, transform) {
	
	return {
		
		bp: 0,
		
		nud: function(token, bp) {
			return token
		},
		
		led: function(left, token, bp) {
			return token
		}
	}
}
