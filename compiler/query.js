
function is_type(node, type) {
	return (node.type == type)
}

function is_value(node, value) {
	return (node.value == value)
}

function is_type_value(node, type, value) {
	return (node.type == type) && (node.value == value)
}

function is_length(node, length) {	
	return (node.type == 'expression') && (node.value.length === length)
}

function is_length_exceeding(node, length) {
	return (node.type == 'expression') && (node.value.length > length)
}

function is_depth(parents, depth) {
	return (parents.length == depth)
}

function get_value(node, index) {
	return (index === undefined) ? node.value : node.value[index]
}

function last(array) {
	return array[array.length - 1]
}

function tail(array, offset) {
	return array[array.length - (offset + 1)]
}

function replace(parent, node, node_b) {
	
	let index_ = index(parent, node)
	remove(parent, node)
	insert(parent, node_b, index_)
	return index_
}

function index(parent, node) {
	
	for (let index = 0, length = parent.value.length; index < length; index++) {
		if (parent.value[index] == node) {
			return index
		}
	}
	return -1
}

function remove(parent, node) {
	
	let index_ = index(parent, node)
	remove_at(parent, index_)
	return index_
}

function remove_at(parent, index) {
	if (index > -1) parent.value.splice(index, 1)
}

function append(parent, node) {
	parent.value.push(node)
}

function prepend(parent, node) {
	parent.value.unshift(node)
}

function insert(parent, node, index) {
	parent.value.splice(index, 0, node)
}

function closest() {
	return
}

function climb(parents, func) {
	
	parents = [...parents]
	let node = parents.pop()
	let parent = last(parents)
	func(node, index(parent, node), parents)
}

module.exports = {
	is_type: is_type,
	is_type_value: is_type_value,
	is_length,
	is_length_exceeding,
	is_depth,
	get_value,
	last,
	tail,
	replace,
	index,
	remove,
	remove_at,
	insert,
	append,
	prepend,
	closest,
	climb,
}