var Client = require('../client');
var Server = require('../server');

var test = require('tap').test;

test('URL is formed', function(t) {

  var credentials = {
    id: 'iiiidddd',
    key: 'kkkeeeyyy',
    algorithm: 'sha1'
  };

  var baseURL = 'http://cats.cat';
  var url = Client.url(baseURL, credentials);

  t.ok(url.match(/^http:\/\/cats\.cat\/\?id=iiiidddd\&ts=.+\&nonce=.+\&buzzard=.+$/), url);
  t.end()
});

test('URL with original qs is well formed', function(t) {
  var credentials = {
    id: 'iiiidddd',
    key: 'kkkeeeyyy',
    algorithm: 'sha1'
  };

  var baseURL = 'http://cats.cat/abc?a=1&b=2';
  var url = Client.url(baseURL, credentials);

  t.ok(url.match(/^http:\/\/cats\.cat\/abc\?a=1\&b=2\&id=iiiidddd\&ts=.+\&nonce=.+\&buzzard=.+$/), url);
  t.end()
});

test('URL is accepted by the server', function(t) {
  var credentials = {
    id: 'iiiidddd',
    key: 'kkkeeeyyy',
    algorithm: 'sha1'
  };

  var baseURL = 'http://cats.cat/abc?a=1&b=2';
  var url = Client.url(baseURL, credentials);

  var req = {
    url: url
  };

  var server = Server(getCredentials);

  server.authenticate(req, authenticated);

  function authenticated(err, _credentials, attributes) {
    if (err) throw err;
    t.deepEqual(_credentials, credentials);
    t.type(attributes.nonce, 'string');
    t.end()
  }

  function getCredentials(id, cb) {
    t.equal(id, credentials.id);
    cb(null, credentials);
  }
});