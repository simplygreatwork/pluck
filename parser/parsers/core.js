
// from https://github.com/jimf/uparse/blob/master/index.js
// with some tweaks for error position reporting and p.ref with arguments

function none(value) {
	return value
}

function ParseState(string, offset) {
	this.string = string
	this.offset = offset
}

ParseState.prototype.peek = function(n) {
	return this.string.slice(this.offset, this.offset + n)
}

ParseState.prototype.read = function(n) {
	return new ParseState(this.string, this.offset + n)
}

ParseState.prototype.isComplete = function() {
	return this.offset === this.string.length
}

let max = 0

function parse(parser, string) {
	
	max = 0
	let parseState = new ParseState(string, 0, 0)
	var result = parser(parseState)
	if (result && result[1].isComplete()) {
		return result[0]
	} else {
		return {
			error: true,
			position: max
		}
	}
}

function str(string, transform) {

	transform = transform || none
	return function (parseState) {
		var chunk = parseState.peek(string.length)
		return (
			chunk === string ?
			[transform({ str: chunk }), parseState.read(string.length)] : null
		)
	}
}

function char(chars, transform) {
	
	transform = transform || none
	return function (parseState) {
		var chunk = parseState.peek(1)
		var regex = new RegExp('[' + chars + ']')
		return (
			regex.test(chunk) ?
			[transform({ char: chunk }), parseState.read(1)] : invalid(parseState)
		)
	}
}

function seq(parsers, transform) {
	
	transform = transform || none
	return function (parseState) {
		var result = parsers.reduce(function(accumulator, parser) {
			if (! accumulator.success) {
				return accumulator
			}
			var parsed = parser(accumulator.state)
			if (parsed) {
				accumulator.matches.push(parsed[0])
				accumulator.state = parsed[1]
			} else {
				accumulator.success = false
			}
			return accumulator
		}, {
			success: true,
			state: parseState,
			matches: []
		})
		return (
			result.success ?
			[transform({ seq: result.matches }), result.state] : invalid(parseState)
		)
	}
}

function rep(parser, reps, transform) {
	
	transform = transform || none
	return function (parseState) {
		var matches = []
		var lastState = null
		var parsed
		while (parseState) {
			lastState = parseState
			parsed = parser(parseState)
			if (parsed) {
				matches.push(parsed[0])
				parseState = parsed[1]
			} else {
				parseState = null
			}
		}
		return (
			matches.length >= reps ?
			[transform({ rep: matches }), lastState] : invalid(lastState)
		)
	}
}

function opt(parser, transform) {
	
	transform = transform || none
	return function (parseState) {
		var lastState = parseState
		var parsed = parser(parseState)
		return (
			parsed ?
			[transform({ opt: parsed[0] }), parsed[1]] : [transform({ opt: invalid(lastState) }), parseState]
		)
	}
}

function alt(parsers, transform) {
	
	transform = transform || none
	return function (parseState) {
		var result
		for (var i = 0, length = parsers.length; i < length; i += 1) {
			result = parsers[i](parseState)
			if (result) {
				return [transform({ alt: result[0] }), result[1]]
			}
		}
		return invalid(parseState)
	}
}

function ref(context, name) {
	
	let values = Array.from(arguments).slice(2)
	return function (parseState) {
		return context[name](...values)(parseState)
	}
}

function defer(handler) {
	
	return function (parseState) {
		return handler(parseState)
	}
}

function invalid(parseState) {
	
	max = Math.max(max, parseState.offset)
	return null
}

module.exports = {
	parse, str, char, seq, rep, opt, alt, ref
}
