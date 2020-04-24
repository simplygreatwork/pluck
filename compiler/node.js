
module.exports = {
	
	init: function() {
		
		this.index = 0
		this.length = this.value.length
	},
	
	inserted: function(index) {
		
		this.length = this.value.length
		if (index <= this.index) {
			this.index++
		}
	},
	
	removed: function(index) {
		
		this.length = this.value.length
		if (index <= this.index) {
			this.index--
		}
	},
	
	rewind: function() {
		
		this.index = -1
	}
}
