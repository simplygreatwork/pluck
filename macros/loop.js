
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

let configs = []

module.exports = function(system, document) {
	
	return {
		
		type: 'symbol',
		value: 'repeat',
		
		enter : function(node, index, parents, state) {
			
			let parent = query.last(parents)
			if (! query.is_type(parent, 'expression')) return
			if (! query.is_type_value(node, 'symbol', 'repeat')) return
			if (! (index === 0)) return
			let config = get_config(parent)
			parent.once('exit', function() {
				let func = state.func
				let repeat = parent
				let block = create_block(config, repeat, system)
				index = query.replace(func, repeat, block)
				counter = parse (`		(set ${config.with} (i32.const ${config.from}))`)[0]
				query.insert(func, counter, index)
				system.bus.emit('node.inserted', func, index)
				query.climb(parents, function(node, index, parents) {
					query.climb(parents, function(node, index, parents) {
						document.walk(node, index, parents, {})
					})
				})
			})
		}
	}
}

function create_block(config, repeat, system) {
	
	let block = parse (`
	(block (loop
		(if (i32.gt_u (get_local ${config.with}) (i32.const ${config.to})) (then (br 2)))
		(set_local ${config.with} (i32.add (get_local ${config.with}) (i32.const ${config.every})))
		(br 0)
	))
	`)[0]
	let loop = block.value[1]
	repeat.value.filter(function(each) {
		return (each.type == 'expression')
	})
	.forEach(function(each, index) {
		index = 2 + index
		query.insert(loop, each, index)
		system.bus.emit('node.inserted', loop, index)
	})
	return block
}

function get_config(node) {
	
	let config = { with: '$i', from: 0, to: 10, every: 1, 'in': null }
	node.value.forEach(function(each, index) {
		if (each.value == 'with') config.with = node.value[index + 1].value
		if (each.value == 'from') config.from = node.value[index + 1].value
		if (each.value == 'to') config.to = node.value[index + 1].value
		if (each.value == 'every') config.every = node.value[index + 1].value
		config.with = shared.dollarize(config.with)
	})
	return config
}

function print_config() {
	console.log('config: ' + JSON.stringify(config, null, 2))
}
