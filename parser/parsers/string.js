
var p = require('../parsers/core');

module.exports = function() {
	
	return p.seq ([
		p.str ('"'),
		p.rep (
			p.char ('-+\/\'\\\\=$:,<>!_.\(\)a-zA-Z0-9 \t'),
			0
		),
		p.str ('"'),
	], function(value) {
		return {
			type: 'string',
			value: value[1].join('')
		}
	})
}
