
const query = require('../compiler/query')
const parse = require('../compiler/parse')
const shared = require('./shared')

let system = null
let document = null
let configs = []

function enter(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	if (! query.is_type_value(node.value[0], 'symbol', 'repeat')) return
	let config = get_config(node)
	if (false) print_config()
	configs.push(config)
}

function exit(node, index, parents, state) {
	
	if (! query.is_type(node, 'expression')) return
	if (! query.is_type_value(node.value[0], 'symbol', 'repeat')) return
	let config = query.last(configs)
	let tree = parse (`
	(block (loop
		(if (i32.gt_u (get_local ${config.with}) (i32.const ${config.to})) (then (br 2)))
		(set_local ${config.with} (i32.add (get_local ${config.with}) (i32.const ${config.every})))
		(br 0)
	))
	`)[0]
	node.value.filter(function(each) {
		return (each.type == 'expression')
	})
	.forEach(function(each, index) {
		query.insert(tree.value[1], each, 2 + index)
	})
	query.replace(query.last(parents), node, tree)
	tree = parse (`		(set_local ${config.with} (i32.const ${config.from}))`)[0]
	query.insert(query.last(parents), tree, index)
	configs.pop()
	return false
}

function get_config(node) {
	
	let config = {with: '$i', from: 0, to: 10, every: 1, 'in': null}
	node.value.forEach(function(each, index) {
		if (each.value == 'with') config.with = node.value[index + 1].value
		if (each.value == 'from') config.from = node.value[index + 1].value
		if (each.value == 'to') config.to = node.value[index + 1].value
		if (each.value == 'every') config.every = node.value[index + 1].value
		config.with = shared.dollarify(config.with)
	})
	return config
}

function print_config() {
	console.log('config: ' + JSON.stringify(config, null, 2))
}

module.exports = function(system_, document_) {
	
	system = system_
	document = document_
	return {
		enter,
		exit
	}
}
