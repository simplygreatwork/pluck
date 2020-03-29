

project = 'index'		// such as: index, memory, macros, stress, repeat, etc.
imports_ = {
	host: host()
}
memory_ = imports_.host.memory

function main() {
	
	load()
}

function load() {
	
	let path = '../build/' + project + '/build.json'
	fetch(path)
	.then((response) => {
		return response.json()
	})
	.then((data) => {
		load_wasm(data.modules)
	})
}

function load_wasm(paths) {
	
	let path = paths.shift()
	WebAssembly.instantiateStreaming(fetch('../build/' + project + '/' + path), imports_)
	.then(function(object) {
		let key = path.split('.')[0]
		imports_[key] = object.instance.exports
		if (paths.length > 0) {
			load_wasm(paths)
		} else {
			object.instance.exports.main()
		}
	})
}

function host() {
	
	return {
		memory: memory_ = new WebAssembly.Memory({
			initial: 100,
			maximum: 65536
		}),
		table: new WebAssembly.Table({
			initial: 65336,
			element: 'anyfunc'
		}),
		global: new WebAssembly.Global({
			value: 'i32',
			mutable: true
		}, 0),
		legend: new WebAssembly.Global({
			value: 'i32',
			mutable: true
		}, 0),
		type_strings: new WebAssembly.Global({
			value: 'i32',
			mutable: true
		}, 0),
		on_memory_allocate_block: new WebAssembly.Global({
			value: 'i32',
			mutable: true
		}, 0),
		on_memory_allocate_handle: new WebAssembly.Global({
			value: 'i32',
			mutable: true
		}, 0),
		print_string: function(offset) {
			var array = new Uint8Array(memory_.buffer)
			let type = array[offset]
			offset = offset + 4
			let length = array[offset]
			offset = offset + 4
			var string = ''
			for (var i = 0; i < length; i++) {
				string += String.fromCharCode(array[offset + i])
			}
			console.log(string)
		}.bind(this),
		print_integer: function(value) {
			console.log(value)
		}
	}
}