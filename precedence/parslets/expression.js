
const iterator = require('../iterator')

module.exports = function (parse, lexer, transform) {
	
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
		
		return require('../parser')({
			transform: require('../transforms/expression'),
			parslets: {
				'expression:': require('../parslets/expression'),
				'number:': require('../parslets/number'),
				'symbol:equals': require('../parslets/equals'),
				'symbol:and': require('../parslets/and'),
				'symbol:or': require('../parslets/or'),
				'symbol:not': require('../parslets/not'),
				'symbol:plus': require('../parslets/plus'),
				'symbol:minus': require('../parslets/minus'),
				'symbol:greater': require('../parslets/greater'),
				'symbol:less': require('../parslets/less'),
				'symbol:(': require('../parslets/open'),
				'symbol:)': require('../parslets/close')
			}
		})
	}
}
