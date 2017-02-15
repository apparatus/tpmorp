'use strict'

var readline = require('readline')
var morp = require('./index')(readline)


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

