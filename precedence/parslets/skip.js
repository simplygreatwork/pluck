
module.exports = function (parse, lexer, transform, iterator) {
	
	return {
		
		bp: 0,
		
		nud: function(token, bp) {
			console.log('skip nud')
			return parse(bp)
		},
		
		led: function(left, token, bp) {
			console.log('skip led')
			return transform('skip', left, parse(bp))
		}
	}
}
