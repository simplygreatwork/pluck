
module.exports = {
	
	iterate: function(array, func) {
		
		for (let index = 0, length = array.length; index < length; index++) {
			let result = func(array[index], index)
			if (result === false) {
				break
			}
		}
	},
	
	backward: function(array, func) {
		
		for (let index = array.length - 1; index >- 0; index--) {
			let result = func(array[index], index)
			if (result === false) {
				break
			}
		}
	},
	
	truncate_extensions: function(path_) {
		
		return path_.split('.')[0]
	}
}
