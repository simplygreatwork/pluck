
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

// goal: no keyword "then": all expressions inside of "if" but after (if (cond)) are shifted into (if (then))
// goal: keyword "else" is a sibling of "if" - else contents are moved into (if (else))

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {
			
			if (! query.is_type(node, 'expression')) return
			if (! query.is_type_value(node.value[0], 'symbol', 'else')) return
		}
	}
}
