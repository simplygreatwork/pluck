
const path = require('path')
const jetpack = require('fs-jetpack')

class State {
	
	constructor() {
		
		this.path_ = path.join(process.cwd(), 'build', 'state.json')
		Object.assign(this, {
			id_static: 0,
			id_string: 0,
			id_table: 4096,
			id_type: 0,
			index_table: {},
			index_type: {}
		})
	}
	
	deserialize() {
		
		if (jetpack.exists(this.path_)) {
			Object.assign(this, jetpack.read(this.path_, 'json'))
		}
	}
	
	serialize() {
		jetpack.write(this.path_, JSON.stringify(this, ['id_static', 'id_string', 'id_table', 'index_table']))
	}
}

module.exports = State
