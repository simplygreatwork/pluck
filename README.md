
# pluck

- **pluck** is a programming language construction kit.
- Get started with WebAssembly text format syntax and macros.
- Create and use macros to construct your own programming language features.

### Create a macro to recognize and transpile [integer values](/macros/number.js) to WebAssembly
```javascript

enter : function(node, index, parents, state) {		
	
  if (! shared.is_inside_function(state)) return
  if (! query.is_type(node, 'number')) return
  let parent = query.last(parents)
  if (query.is_type_value(parent.value[0], 'symbol', 'i32.const')) return
  if (query.is_type_value(parent.value[0], 'symbol', 'br')) return
  if (query.is_type_value(parent.value[0], 'symbol', 'br_if')) return
  parent.value[index] = parse(` (i32.const ${node.value})`)[0]
}
```

### Create a macro to configure function [parameters](/macros/accepts.js)
```javascript

enter : function(node, index, parents, state) {
	
  let parent = query.last(parents)
  if (! query.is_type(parent, 'expression')) return
  if (! query.is_expression_longer(parent, 2)) return
  if (! query.is_type_value(parent.value[0], 'symbol', 'func')) return
  if (! query.is_type_value(parent.value[2], 'symbol', 'accepts')) return
  parent.value.every(function(each, index) {
    if (index <= 2) return true
    if (query.is_type(each, 'expression')) return false
    if (query.is_type(each, 'whitespace')) return true			// whitespace ought to be folded already but encountered an issue anyway
    let value = shared.dollarize(each.value)
    parent.value[index] = parse(` (param ${value} i32)`)[0]
    return true
  })
  parent.value.splice(2, 1)
  system.bus.emit('node.removed', parent, 2)
  state.locals = shared.find_locals(state)
}
```

### [Install](/compiler/config.js) your macros

```javascript
macros: [
  ...
  require('./macros/accepts.js')
  require('./macros/number.js')
  ...
]
```

### Write [example](/examples/demo.wat.watm) code to use your new macros

```wat
(module
  import "host" "table" (table 1 anyfunc)
  memory (import "host" "memory") 1
  type $void_to_void (func)
  
  func main
    test 42
	
  func test accepts value
    set input to value
)
```

### Overview

- A work in process to get up and running quickly with WebAssembly text format syntax.
- Parses WebAssembly .wat files, transforms using macros, and launches the project's main function.
- s-expressions in WebAssembly text syntax are parsed using a fork of the simple, tiny parser combinator library: uparse
  - https://github.com/jimf/uparse
- The parser infers s-expressions statements from indentations in the source code.
- Transformations for string building and automatic module importing and exporting are included.
- Each module's functions are exported automatically using macros.
- Each module's functions are imported automatically using macros.
- Several macros have been partially implemented such as: repeat, if, break, function references, and some logic and arithmetic operators.
- Contains the beginning of a basic standard library in WebAssembly text syntax.
  - strings, lists, booleans, numbers, assertions
- The parser supports documentation first.
  - Runnable wat source code can be compiled while embedded inside markdown documentation.
- Currently compiles and runs in Node.js only. Small tweaks are needed to allow running in the browser.

### Structure

1. lexer
2. parser (for s-expressions)
2. abstract syntax tree transformer (s-expressions)
3. linker
4. library (wat/wasm)

### Folders

- parser/
- compiler/
- library/
- macros/
- examples/
- fixtures/
- precedence/

### Requirements

- Requires Node.js
- Tested with Node.js 13.10.1
- Node.js 10.16.3 seems to be missing WebAssembly.Global

### Run with GitPod

- Open [pluck](https://gitpod.io/#https://github.com/simplygreatwork/pluck) in GitPod.

```
nvm install 13.10.1
nvm use 13.10.1
npm install
npm start
npm start memory
npm start macros
npm start stress
npm start tiny
```

### Run locally
```
git clone https://github.com/simplygreatwork/pluck.git
cd pluck
nvm install 13.10.1
nvm use 13.10.1
npm install
npm start
npm start memory
npm start macros
npm start stress
npm start tiny
```

### Roadmap

- perhaps implement a TDOP/Pratt parser for enchanced operator precedence handling
- allow relative paths for modules
- create macro for function pointers (tables)
- create binary search tree instead of hashtable
- create the distinct data structures: array, linked list, and hybrid (vector)
- fill in blank function stubs: e.g. $boolean_xor