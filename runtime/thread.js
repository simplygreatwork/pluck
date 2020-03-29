
let properties = {}

onmessage = function (event) {
	
	if (event.data.action == 'set') {
		properties[event.data.key] = event.data.value
		postMessage({ action: 'message', message: `Worker key "${event.data.key}" has been set to "${event.data.value}".` })
	} else if (event.data.action == 'start') {
		postMessage({ action: 'message', message: 'Worker has been started.' })
		postMessage({ action: 'message', message: 'Worker has been terminated.' })
		postMessage({ action: 'terminate' })
	}
}
