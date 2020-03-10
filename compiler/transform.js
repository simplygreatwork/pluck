
const print = require('./print.js')
const logger = require('./logger')()
const Walker = require('./walker.js')

let counter = 0

module.exports = function(document, system) {
	
	let tree = transform(document, system)
	code = print(tree)
	logger('transform').log('tree: ' + JSON.stringify(tree, null, 2))
	logger('transform').log('tree transformed: ' + code)
	return code
}

function transform(document, system) {
	
	let off = system.bus.on('insert', function() {
		counter++
	})
	let walker = new Walker()
	system.macros.expressions.forEach(function(each) {
		let macro = each(system, document)
		if (macro.enter) walker.on('enter.expression', macro.enter)
		if (macro.exit) walker.on('exit.expression', macro.exit)
	})
	system.macros.atoms.forEach(function(each) {
		let macro = each(system, document)
		if (macro.enter) walker.on('enter.atom', macro.enter)
		if (macro.exit) walker.on('exit.atom', macro.exit)
	})
	walker.walk(document.tree[0])
	off()
	if (counter > 0) console.log('invalidation count: ' + counter)
	return document.tree
}
