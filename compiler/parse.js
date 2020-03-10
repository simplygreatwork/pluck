
const implicit = require('../parser/configurations/sexpressions-implicit.js')
const explicit = require('../parser/configurations/sexpressions.js')

module.exports = function(code, hint) {
	
	if (hint == 'explicit') {
		return explicit(code)
	} else if (hint == 'implicit') {
		return implicit(code)
	} else {
		return (code.split('/n').length === 1) ? explicit(code) : implicit(code)
	}
}
