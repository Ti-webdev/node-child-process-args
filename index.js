var assert = require('assert');
var spawn = require('child_process').spawn;

var re = /^[-_\d\w/@:.]+$/;

module.exports = function (args) {
  return new Promise(function(resolve, reject) {
    if (0 === args.length) {
      return resolve('');
    }

    var quotedArgs = args.map(quoteArgument);
    var checkPromise = checkQuotedArguments(quotedArgs);
    var result = quotedArgs.join(' ');
    checkPromise.then(resolve.bind(null, result), reject);
  });
}

function quoteArgument(arg) {
  if (re.test(arg)) {
    return arg;
  }
  return "'"+arg.replace(/'/g, '\\\'')+"'";
}

function checkQuotedArguments(quotedArgs) {
  var echoArgs = quotedArgs.filter(function(arg) {
    return -1 === ['-n', '-e', '-E', '--help', '--verson'].indexOf(arg)
  });
  var child = spawn('echo', ['-n'].concat(echoArgs));

  var checkPromise = new Promise(function(resolve, reject) {
    var actual = '';
    child.stdout.on('data', function(chunk) {
      actual += chunk.toString();
    });
    child.stdout.on('end', function() {
      assert.strictEqual(actual, echoArgs.join(' '), 'Failed check quoted arguments');
      resolve();
    });
  });

  var exitPromise = new Promise(function(resolve, reject) {
    child.on('exit', function(code, sginal) {
      assert.strictEqual(0, code, 'Failed check args over echo');
      assert.strictEqual(null, sginal, 'Failed check args over echo');
      resolve();
    });
  });

  return Promise.all([checkPromise, exitPromise]);
}
