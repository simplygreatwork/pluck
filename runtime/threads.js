
var Worker = require('tiny-worker')

workers = {}
counter = 0

function spawn(name) {
	
	console.log('threads.spawm.name: ' + name)
	var worker = new Worker('./runtime/thread.js')
	workers[++counter] = worker
	worker.onmessage = function(event) {
		let action = event.data.action
		if (action == 'message') {
			console.log(event.data.message)
		} else if (action == 'terminate') {
			worker.terminate()
		}
	}
	worker.postMessage({ action: 'set', key: 'name', value: name })
	worker.postMessage({ action: 'start' })
}

module.exports = {
	spawn
}
