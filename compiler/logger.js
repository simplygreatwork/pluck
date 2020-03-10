
let scopes = null

module.exports = function(scopes_) {
	
	scopes = scopes || new Set(scopes_)
	return function(scope) {
		return {
			log: function(message) {
				if (scopes.has(scope)) {
					console.log(message)
				}
			}
		}
	}
}
