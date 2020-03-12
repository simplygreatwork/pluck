
const elements = require('../elements')

module.exports = {
	
	lex: function(string) {
		
		let array = string.split(' ').map(function(each) {
			let type = 'symbol'
			if (! isNaN(parseInt(each))) type = 'number'
			return {
				type: type,
				value: each
			}
		})
		return elements(array)
	}
}
