
var p = require('../parsers/core')

module.exports = function() {
	
	return p.seq ([
		p.alt ([
			p.char ('-=:$_.a-zA-Z0-9'),
		]),
		p.rep (
			p.alt ([
				p.char ('-=:$_.a-zA-Z0-9'),
			]),
			0
		)
	], function(value) {
		return {
			type: 'symbol',
			value: value[0] + value[1].join('')
		}
	})
}
