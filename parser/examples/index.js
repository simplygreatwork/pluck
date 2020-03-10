
// todo: do not use a results array
// instead dive into tree when finsihed -> alt:rep:seq etc
// use xeger or other

const p = require('uparse');

function main() {
	
	return p.rep(
		atom(),
		0,
		function(value) {
			return value.rep
		}
	)
}

function atom() {
	
	return p.alt([
		whitespace(),
		boolean(),
		number(),
		string(),
		symbol(),
	], function(value) {
		return value.alt		// todo: emit the atom here
	})
}

function whitespace() {
	
	return p.str(' ', function() {
		return {
			type: 'whitespace'
		}
	})
}

function boolean() {
	
	return p.alt([
		p.str('true'),
		p.str('false')
	], function(value) {
		return {
			type: 'boolean',
			value: value.alt.str
		}
	})
}

function number() {

	let result = [];
	return p.alt([
		p.str('0'),
		p.seq([
			p.char('1-9', function(value) {
				result.push(value.char);
				return value.char
			}),
			p.rep(p.char('0-9', function(value) {
				result.push(value.char);
				return value.char
			}), 0, function(value) {
				return value.rep
			})
		], function(value) {
			return value.seq
		})
	], function(value) {
		let string = result.join('');
		result = [];
		return {
			type: 'number',
			value: string
		};
	})
}

function string() {
	
	let result = [];
	return p.seq([
		p.str('"', function(value) {
			result.push(value.str)
		}),
		p.rep(
			p.char('a-z', function(value) {
				result.push(value.char)
				return value.char;
			}),
			0,
			function(value) {
				return value.rep
			}
		),
		p.str('"', function(value) {
			result.push(value.str)
		}),
	], function(value) {
		let string = result.join('');
		result = [];
		return {
			type: 'string',
			value: string
		}
	})
}

function symbol() {
	
	let result = [];
	return p.seq([
		p.alt([
			p.str('=', function(value) {
				result.push(value.str)
				return value.str;
			}),
			p.char('a-z', function(value) {
				result.push(value.char)
				return value.char;
			}),
		], function(value) {
			return value.alt
		}),
		p.rep(p.char('a-z', function(value) {
			result.push(value.char)
			return value.char;
		}), 0, function(value) {
			return value.rep;
		})
	], function(value) {
		let string = result.join('');
		result = [];
		return {
			type: 'symbol',
			value: string
		}
	})
}

let array = []
for (i = 0; i < 5000; i++) {
	array.push('1 2 3 true false "stringy" symbolic let x = 5')
}
console.log('begin');
let result = p.parse(
	main(),
	array.join('')
);
console.log('end');

if (false) {
	console.log(
		JSON.stringify(
			result, null, 2
		)
	)
}
