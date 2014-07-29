var assert = require('assert');
var childProcessArgs = require('..');

it('Should return empty string if array length is zero', function() {
  return childProcessArgs([]).then(assert.strictEqual.bind(assert, ''));
});

it('Do not quote numbers', function(){
  return childProcessArgs([0,1,2,3]).then(assert.strictEqual.bind(assert, '0 1 2 3'));
});

it('Do not quote single words', function(){
  return childProcessArgs(['a', 'b', 'foo', 'bar']).then(assert.strictEqual.bind(assert, 'a b foo bar'));
});

it("Hello's world", function() {
  return childProcessArgs(["Hello's world"]).then(assert.strictEqual.bind(assert, "'Hello\\'s world'"));
});

it('Any space chars', function() {
  return childProcessArgs([' ', '|', '  ', '\r\n']).then(assert.strictEqual.bind(assert, "' ' '|' '  ' '\r\n'"));
});

it('--help', function() {
  return childProcessArgs(['--help']).then(assert.strictEqual.bind(assert, '--help'));
});

it('-e', function() {
  return childProcessArgs(['-e', '\\\\']).then(assert.strictEqual.bind(assert, "-e '\\\\'"));
});

xit('\\x00 chr', function() {
  return childProcessArgs(['\x00 text']).then(assert.strictEqual.bind(assert, "'"+String.fromCharCode(0)+"'"));
});

it('Very long arguments', function() {
  var args = [];
  for(var i = 0; i < 1024*96; i++) {
    args.push(Math.random());
  }
  return childProcessArgs(args).then(assert.strictEqual.bind(assert, args.join(' ')), function(err) {
    console.log(err);
  });
});

describe('github.com/bahamas10/node-shell-escape', function() {
  it('simple', function() {
    var args = ['curl', '-v', '-H', 'Location;', '-H', 'User-Agent: dave#10', 'http://www.daveeddy.com/?name=dave&age=24'];
    return childProcessArgs(args)
      .then(assert.strictEqual.bind(assert, "curl -v -H 'Location;' -H 'User-Agent: dave#10' 'http://www.daveeddy.com/?name=dave&age=24'"));
  });

  it('advanced', function() {
    return childProcessArgs(['echo', 'hello!', 'how are you doing $USER', '"double"', "'single'"])
      .then(assert.strictEqual.bind(assert, "echo 'hello!' 'how are you doing $USER' '\"double\"' '\\'single\\''"));
  });
  describe('more', function(){
    var d = {
      "echo 'hello\nworld'": ['echo', 'hello\nworld'],
      "echo 'hello\tworld'": ['echo', 'hello\tworld'],
      "echo 'hello  world'": ['echo', 'hello  world'],
      "echo hello world": ['echo', 'hello', 'world'],
    };

    Object.keys(d).forEach(function(s) {
      it(s, function() {
        return childProcessArgs(d[s])
          .then(assert.strictEqual.bind(assert, s));
      });
    });
  });
});
