var Client = require('../client');

var test = require('tap').test;

test('requires credential', function(t) {
  t.throws(function() {
    Client.header();
  });
  t.end();
});

test('generates header', function(t) {
  var credentials = {
    id: 'iiiidddd',
    key: 'kkkeeeyyy',
    algorithm: 'sha1'
  };

  var header = Client.header(credentials);
  t.ok(header.match(/^Buzzard id=".+", ts="\d+", nonce=".+", ac=".+"$/), 'Invalid header: ' + header);
  t.end();
});