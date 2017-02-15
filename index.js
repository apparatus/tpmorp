/*
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict'

require('events').EventEmitter.defaultMaxListeners = Infinity


/**
 * simple CLI prompt module - with the emphasis on simple and non-invasive
 * with command history and command completion
 */
module.exports = function (readline) {
  var rl
  var commands

  function completer (line) {
    var ml1 = []
    var ml2 = []
    var s = line.split(' ')
    var keys = Object.keys(commands)
    var command = null
    var result

    // if more than one token
    if (s.length > 0) {

      // check for exact match
      keys.forEach(function (key) {
        if (key === s[0]) {
          command = key
        }
      })

      // if exact match check sub command entries
      if (command) {
        if (commands[command].sub) {
          commands[command].sub.forEach(function (sub) {
            if (sub.indexOf(s[1]) === 0) {
              ml2.push(command + ' ' + sub)
            }
          })

          // no sub match so return all possibilities
          if (ml2.length === 0) {
            commands[command].sub.forEach(function (sub) {
              ml2.push(command + ' ' + sub)
            })
          }

          result = [ml2, line]
        } else {
          result = [[], line]
        }
      }
    }

    // command not matched
    if (!command) {
      keys.forEach(function (key) {
        if (key.indexOf(s[0]) === 0) {
          ml1.push(key)
        }
      })
      result = [ml1.length ? ml1 : keys, line]
    }
    return result
  }


  function match (line) {
    var keys = Object.keys(commands)
    var command = null
    var args = null
    var s

    line.trim()
    line.replace(/\s+/g, ' ')
    s = line.split(' ')

    keys.forEach(function (key) {
      if (key === s[0]) {
        command = commands[key]
        s.shift()
        args = s
      }
    })
    return {command: command, args: args}
  }


  function start (prmpt, cmds, cb) {
    commands = cmds

    rl = readline.createInterface({input: process.stdin,
      output: process.stdout,
      historySize: 50,
      completer: completer,
      prompt: prmpt})

    rl.on('line', function (line) {
      var result = match(line)
      cb(result.command ? null : 'invalid command', result.command, result.args)
    })
  }


  function displayPrompt () {
    rl.prompt()
  }


  function stop () {
    rl.close()
  }


  return {
    start: start,
    displayPrompt: displayPrompt,
    stop: stop
  }
}

