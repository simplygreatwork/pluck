
var p = require('../parsers/core')

module.exports = function(content, delimiter, transform) {
	
	transform = transform || function(value) {
		return value
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
				], function(value) { return value[0] }),
				content
			]),
			0
		)
	], function(value) {
		return transform( { split: value[1] } )
	})
}
