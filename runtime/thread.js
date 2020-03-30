
let properties = {}

onmessage = function (event) {
	
	if (event.data.action == 'set') {
		properties[event.data.key] = event.data.value
		postMessage({ action: 'message', message: `Worker key "${event.data.key}" has been set to "${event.data.value}".` })
	} else if (event.data.action == 'start') {
		let id = setInterval(loop, 1)
		setTimeout(function() {
			clearInterval(id)
			postMessage({ action: 'message', message: 'Worker has been terminated.' })
			postMessage({ action: 'terminate' })
		}, 1000)
		postMessage({ action: 'message', message: 'Worker has been started.' })
	}
}

function loop() {
	console.log('thread: ' + properties.name)
}
