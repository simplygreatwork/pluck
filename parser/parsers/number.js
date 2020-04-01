
var p = require('../parsers/core')

module.exports = function() {
	
	return p.seq ([
		p.opt (
			p.str ('-')
		),
		p.rep (
			p.char ('0-9.'), 1, function(value) {
				return value.join('')
			}
		)
	], function(value) {
		return {
			type: 'number',
			value: value[0] ? value[0] + value[1] : value[1]
		}
	})
}
