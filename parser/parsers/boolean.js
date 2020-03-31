
var p = require('../parsers/core')

module.exports = function() {
	
	return p.alt([
		p.str('true'),
		p.str('false')
	], function(value) {
		return {
			type: 'boolean',
			value: value.alt.str
		}
	})
}
