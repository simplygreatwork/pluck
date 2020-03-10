
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

// goal: no keyword "then": all expressions inside of "if" but after (if (cond)) are shifted into (if (then))
// goal: keyword "else" is a sibling of "if" - else contents are moved into (if (else))
// note: "else if" could probably be part of else.js not a separate else-if.js

module.exports = function(system, document) {
	
	return {
		
		enter : function(node, index, parents, state) {		

			if (! query.is_type(node, 'expression')) return
			if (! query.is_type_value(node.value[0], 'symbol', 'else')) return
			if (! query.is_type_value(node.value[1], 'symbol', 'if')) return
		},

		exit: function(node, index, parents, state) {
			return
		}
	}
}
