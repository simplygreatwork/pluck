
var p = require('../parsers/core')

module.exports = function() {
	
	return p.seq ([
		p.alt ([
			p.char ('=$_.a-zA-Z0-9', function(value) {
				return value.char
			}),
		], function(value) {
			return value.alt
		}),
		p.rep (
			p.alt ([
				p.char ('=$_.a-zA-Z0-9', function(value) {
					return value.char
				}),
			], function(value) {
				return value.alt
			}),
			0,
			function(value) {
				return value.rep
			}
		)
	], function(value) {
		return {
			type: 'symbol',
			value: value.seq[0] + value.seq[1].join('')
		}
	})
}
