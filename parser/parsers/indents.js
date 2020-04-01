
var p = require('../parsers/core')
var indent = require('./indent')

module.exports = function(level) {
	
	let sequence = []
	for (var i = 0; i < level; i++) {
		sequence.push (
			indent()
		)
	}
	return p.seq (sequence, function(value) {
		return {
			type: 'whitespace',
			value: value.join('')
		}
	})
}
