
const iterator = require('../iterator')

module.exports = function (parse, lexer, transform, config) {
	
	return {
		
		bp: 0,
		
		nud: function(token, bp) {
			return parser().parse(iterator(token.value))
		},
		
		led: function(left, token, bp) {
			return
		}
	}
	
	function parser() {
		
		return require('../parser')(config)
	}
}
