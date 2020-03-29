
const threads = require('./threads')

function Host() {
	
	Object.assign(this, {
		memory: new WebAssembly.Memory({
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
		print_string: function(pointer) {
			console.log(string_unwrap(pointer, this.memory.buffer))
		}.bind(this),
		print_integer: function(value) {
			console.log(value)
		},
		thread_spawn: function(pointer) {
			threads.spawn(string_unwrap(pointer, this.memory.buffer))
		}.bind(this)
	})
}

function string_unwrap(pointer, buffer) {
	
	var array = new Uint8Array(buffer)
	let type = array[pointer]
	pointer = pointer + 4
	let length = array[pointer]
	pointer = pointer + 4
	let string = ''
	for (var i = 0; i < length; i++) {
		string += String.fromCharCode(array[pointer + i])
	}
	return string
}

module.exports = Host