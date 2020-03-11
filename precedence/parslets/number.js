
module.exports = function (parse, lexer, transform) {
	
	return {
		
		bp: 0,
		
		nud: function(token) {
			return parseFloat(token.value)
		}
	}
}
