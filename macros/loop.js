
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')
const backward = require('../compiler/utility').backward

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
			query.climb(parents, function(node, index, parents) {
				let parent = query.last(parents)
				let counter = parse (`		(set_local ${config.with} (i32.const ${config.from}))`)[0]
				query.insert(parent, counter, index)
				parent.emit('node.inserted', index)
				shared.declare(shared.dollarize(config.with), state)
			})
			parent.once('exit', function() {
				query.climb(parents, function(node, index, parents) {
					parent = query.last(parents)
					let repeat = node
					let block = create_block(repeat, state, config, system, document)
					query.replace(parent, repeat, block)
				})
			})
		}
	}
}

function create_block(repeat, state, config, system, document) {
	
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
	})
	document.walk(block.value[0], 0, [block], state)
	return block
}

function get_config(node) {
	
	let config = { with: '$i', from: 0, to: 10, every: 1, 'in': null }
	backward(node.value, function(each, index) {
		symbol_(each, index, node, config, 'with')
		symbol_(each, index, node, config, 'from')
		symbol_(each, index, node, config, 'to')
		symbol_(each, index, node, config, 'every')
		config.with = shared.dollarize(config.with)
	})
	return config
}

function symbol_(each, index, parent, config, symbol) {
	
	if (each.value == symbol) {
		config[symbol] = parent.value[index + 1].value
		parent.value.splice(index, 2)
		parent.emit('node.removed', index)
		parent.emit('node.removed', index)
	}
}

function print_config() {
	console.log('config: ' + JSON.stringify(config, null, 2))
}
