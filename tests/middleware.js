var test = require('tap').test;
var Client = require('../').client;
var Middleware = require('../').server.middleware;

test('middleware', function(t) {

  var credentials = {
    id: 'iiiidddd',
    key: 'kkkeeeyyy',
    algorithm: 'sha1'
  };

  var mw = Middleware(getCredentials);

  var req = {
    headers: {
      authorization: Client.header(credentials)
    }
  };

  var res = {
    send: function(what) {
      throw what;
    }
  };

  var next = function(err) {
    if (err) throw err;
    t.end();
  }

  mw(req, res, next);

  function getCredentials(id, cb) {
    console.log('got credentials');
    t.equal(id, credentials.id);
    cb(null, credentials);
  }
});
