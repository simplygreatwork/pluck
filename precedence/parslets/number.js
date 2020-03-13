
module.exports = function (parse, lexer, transform) {
	
	return {
		
		bp: 0,
		
		nud: function(token) {
			return {
				type : 'expression',
				value: [{
					type: 'symbol',
					value: 'i32.const'
				}, {
					type: 'number',
					value: parseFloat(token.value)
				}]
			}
		}
	}
}
