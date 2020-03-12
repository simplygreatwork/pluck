
module.exports = function (type, left, right) {
	
	return {
		type: 'expression',
		value: [{
			type: 'symbol',
			value: type
		}, left, right]
	}
}
