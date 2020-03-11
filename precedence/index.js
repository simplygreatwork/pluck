
let parser = require('./parser')

print(parser.parse('1 plus 2'))
print(parser.parse('1 plus 2 and 3 plus 4'))
print(parser.parse('1 less 2 and 2 less 3'))
print(parser.parse('3 greater 2 and 2 greater 1'))
print(parser.parse('1 less 2 and 2 less 3 and 3 less 4'))
print(parser.parse('1 greater 1 and 1 less ( 1 plus 1 )'))

function print(result) {
	console.log('result: ' + JSON.stringify(result, null, 2))
}
