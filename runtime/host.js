
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
		legend: new WebAssembly.Global({
			value: 'i32',
			mutable: true
		}, 0),
		type_strings: new WebAssembly.Global({
			value: 'i32',
			mutable: true
		}, 0),
		global: new WebAssembly.Global({
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
		print_string: function(string) {
			console.log(string_unwrap(string, this))
		}.bind(this),
		print_integer: function(value) {
			console.log(value)
		},
		thread_create: function(string, funcref) {
			threads.create(string_unwrap(string, this), funcref)
			this.imports['library/thread'].thread_start(funcref, string)
		}.bind(this),
		thread_start: function(string, funcref) {
			this.imports['library/thread'].thread_start(funcref, string)
		}.bind(this)
	})
}

function string_unwrap(handle, host) {
	
	let pointer = host.imports['library/core'].memory_dereference_handle_(handle)
	var array = new Uint8Array(host.memory.buffer)
	let type = array[pointer]
	pointer = pointer + 8
	let length = array[pointer]
	pointer = pointer + 4
	let string = ''
	for (var i = 0; i < length; i++) {
		string += String.fromCharCode(array[pointer + i])
	}
	return string
}

module.exports = Host
