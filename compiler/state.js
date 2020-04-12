
const path = require('path')
const jetpack = require('fs-jetpack')

class State {
	
	constructor() {
		
		this.path_ = path.join(process.cwd(), 'build', 'state.json')
		Object.assign(this, {
			id_static: 0,
			id_string: 0,
			id_function: 0,
			id_signature: 0,
			id_type: 0,
			index_type: {},
			id_table: 4096,
			index_table: {}
		})
	}
	
	deserialize() {
		
		if (jetpack.exists(this.path_)) {
			Object.assign(this, jetpack.read(this.path_, 'json'))
		}
	}
	
	serialize() {
		jetpack.write(this.path_, {
			id_static: this.id_static,
			id_string: this.id_string,
			id_function: this.id_function,
			id_signature: this.id_signature,
			id_type: this.id_type,
			index_type: this.index_type,
			id_table: this.id_table,
			index_table: this.index_table
		})
	}
}

module.exports = State
