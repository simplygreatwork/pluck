
var p = require('../parsers/core');

module.exports = function(content, delimiter, transform) {
	
	transform = transform || function(value) {
		return value;
	}
	
	return p.seq ([
		p.opt (
			p.rep (delimiter, 1)
		),
		p.rep (
			p.alt ([
				p.seq ([
					content,
					p.rep (delimiter, 1)
				], function(value) { return value.seq[0] }),
				content
			], function(value) { return value.alt }),
			0,
			function(value) { return value.rep },
		)
	], function(value) {
		return transform( { split: value.seq[1] } )
	})
}
