
module.exports = function (parse, lexer, transform) {
	
	return {
		
		bp: 30,
		
		nud: function(token, bp, parse) {
			return {type: 'negative', value: parse(bp)}
		},
		
		led: function(left, token, bp) {
			return transform('negative', left, parse(bp))
		}
	}
}
