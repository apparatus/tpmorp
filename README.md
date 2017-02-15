
#tpmorp
A simple immersive CLI interface helper

##Why?
Because other modules are way too over complicated. `tpmorp` has no exernal dependencies and uses just the functionality available in Nodes core `readline` module.

##How

```sh
$ npm install --save tpmorp
```

```javascript
var readline = require('readline')
var morp = require('tpmorp')(readline)
```

##Example
The example code shows how to use tpmorp in a imple hello/goodbye CLI interface. See `example.js`

```javascript
'use strict'

var readline = require('readline')
var morp = require('tpmorp')(readline)

function hello (args, cb) {
  console.log('hello ' + args)
  cb(false)
}

function goodbye (args, cb) {
  console.log('goodbye ' + args)
  cb(true)
}

var commands = {
  hello: {sub: ['all', 'peter', 'matteo'],
    action: hello,
    description: 'say hello'},

  goodbye: {sub: ['all', 'peter', 'dave'],
    action: goodbye,
    description: 'say goodbye'}
}

morp.start('test>', commands, function (err, command, args) {
  if (err) {
    console.log(err)
    morp.displayPrompt()
  } else {
    command.action(args, function (quit) {
      if (quit) {
        morp.stop()
      } else {
        morp.displayPrompt()
      }
    })
  }
})

morp.displayPrompt()
```

#License
MIT, knock yourself out...
