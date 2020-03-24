
module.exports = {
	
	iterate: function(array, func) {
		
		for (let index = 0, length = array.length; index < length; index++) {
			let result = func(array[index], index)
			if (result === false) {
				break
			}
		}
	}
}
