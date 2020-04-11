
# pluck

- **pluck** is a modular and composable programming language construction kit.
- Get started with WebAssembly text format syntax and macros.
- Create and use macros to construct your own programming language features.
- Additional [project documentation](https://www.notion.so/pluck-ad6047f9dd6e4c2dbadd89c69c6914fd) is hosted at Notion.

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
  if (! query.is_length_exceeding(parent, 2)) return
  if (! query.is_type_value(parent.value[0], 'symbol', 'func')) return
  if (! query.is_type_value(parent.value[2], 'symbol', 'accepts')) return
  iterate(state.func.value, function(each, index) {
    if (index <= 2) return true
    if (query.is_type(each, 'expression')) return false
    if (query.is_type(each, 'whitespace')) return true			// whitespace should be folded already but encountered an issue anyway
    let value = shared.dollarize(each.value)
    parent.value[index] = parse(` (param ${value} i32)`)[0]
    return true
  })
  parent.value.splice(2, 1)
  parent.emit('removed', 2)
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
module
  
  import "../library/utility.watm"
  import "../library/memory.watm"
  import "../library/string.watm"
  import "../library/number.watm"
  import "../library/boolean.watm"
  import "../library/types.watm"
  import "../library/console.watm"
  import "host" "table" (table 1 anyfunc)
  memory (import "host" "memory") 1
  
  func main
    
    memory_bootstrap
    callable 42
    
  func callable accepts value
    set input to value
```

### Overview

- A work in process to get up and running quickly with WebAssembly text format.
- Parses WebAssembly .wat files, transforms using macros, and launches the project's main function.
- s-expressions in WebAssembly text format are parsed using a fork of the simple, tiny parser combinator library: uparse
  - https://github.com/jimf/uparse
- The parser infers s-expression statements from indentations in the source code.
- Transformations for string building and automatic module importing and exporting are included.
- Each module's functions are exported automatically using macros.
- Each module's functions are imported automatically using macros.
- Several macros have been partially implemented such as: repeat, if, break, function references, and some logic and arithmetic operators.
- Contains the beginning of a basic standard library in WebAssembly text format.
  - strings, numbers, booleans, lists, maps, binary trees, assertions
- The parser supports documentation first.
  - Runnable wat source code can be compiled while embedded inside markdown documentation.

### Structure

- /examples
- /macros
- /library
- /compiler
- /runtime
- /parser
- /browser
- /fixtures

### Requirements

- Requires Node.js
- Tested with Node.js 13.10.1
- Node.js 10.16.3 seems to be missing WebAssembly.Global

### Run with GitPod

Open [pluck](https://gitpod.io/#https://github.com/simplygreatwork/pluck) in GitPod.

```
git fetch && git fetch --tags
git checkout 2020-04-10-2
nvm install 13.10.1
nvm use 13.10.1
npm install
npm start index
npm start macros
npm start stress
npm start tiny
npm start compaction
```

### Run locally
```
git clone https://github.com/simplygreatwork/pluck.git
cd pluck
git checkout 2020-04-10-2
nvm install 13.10.1
nvm use 13.10.1
npm install
npm start index
npm start macros
```

You can run any of the files in the examples folder. Here are some highlights:
```
npm start objects
npm start lists
npm start maps
npm start if
npm start if-else
npm start repeat
npm start repeat-if
npm start repeat-nested
npm start operators
npm start negation
```

You can also optionally clean, compile, and run. e.g.
```
npm start index --clean
npm start index --no-run
npm start index --no-compile
npm start index --clean --no-run
```

If you encounter any troubles compiling or running, use the option `--clean` or delete the `build` folder.
