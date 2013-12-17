var test = require('tap').test;
var Client = require('../').client;
var Server = require('../').server;

test('diff protocol in header is not cool', function(t) {

  var header = 'Hawk a=1, b=2, c=3'
  var server = Server(noop);

  var req = {
    headers: {
      authorization: 'Whatevs' + header
    }
  };
  server.authenticate(req, authenticated);

  function authenticated(err) {
    t.type(err, Error);
    t.equal(err && err.message, 'Not buzzard protocol');
    t.end();
  }
});

test('outdated timestamp is not cool', function(t) {

  var credentials = {
    id: 'iiiidddd',
    key: 'kkkeeeyyy',
    algorithm: 'sha1'
  }

  var header = 'Buzzard id="iiiidddd", ts="1377297968619", nonce="hG08SWfj", ac="F0vrC/ofDIuZD40+3aaHhahpYsg="';
  var server = Server(getCredentials);

  var req = {
    headers: {
      authorization: header
    }
  };
  server.authenticate(req, authenticated);

  function authenticated(err) {
    t.type(err, Error);
    t.equal(err && err.message, 'Invalid timestamp, must be within 24 hours');
    t.end();
  }

  function getCredentials(id, cb) {
    console.log('got credentials');
    t.equal(id, credentials.id);
    cb(null, credentials);
  }
});

test('invalid ac is not cool', function(t) {

  var credentials = {
    id: 'iiiidddd',
    key: 'kkkeeeyyy',
    algorithm: 'sha1'
  }

  var header = Client.header(credentials);
  header = header.replace(/ac\=\".+\"/, 'ac="fooledya"');
  var server = Server(getCredentials);

  var req = {
    headers: {
      authorization: header
    }
  };
  server.authenticate(req, authenticated);

  function authenticated(err) {
    t.type(err, Error);
    t.equal(err && err.message, 'Invalid authentication code');
    t.equal(err && err.response && err.response.code, 401);
    t.end();
  }

  function getCredentials(id, cb) {
    console.log('got credentials');
    t.equal(id, credentials.id);
    cb(null, credentials);
  }
});

test('short nonce is not cool', function(t) {

  var credentials = {
    id: 'iiiidddd',
    key: 'kkkeeeyyy',
    algorithm: 'sha1'
  }

  var header = Client.header(credentials);
  header = header.replace(/nonce\=\".+\",/, 'nonce="123",');
  var server = Server(getCredentials);

  var req = {
    headers: {
      authorization: header
    }
  };
  server.authenticate(req, authenticated);

  function authenticated(err) {
    t.type(err, Error);
    t.equal(err && err.message, 'Invalid nonce shorter than 5 bytes');
    t.equal(err && err.response && err.response.code, 400);
    t.end();
  }

  function getCredentials(id, cb) {
    console.log('got credentials');
    t.equal(id, credentials.id);
    cb(null, credentials);
  }
});

test('valid header is cool', function(t) {
  var credentials = {
    id: 'iiiidddd',
    key: 'kkkeeeyyy',
    algorithm: 'sha1'
  }

  var header = Client.header(credentials);
  var server = Server(getCredentials);

  var req = {
    headers: {
      authorization: header
    }
  };
  server.authenticate(req, authenticated);

  function authenticated(err, _credentials, properties) {
    if (err) throw err;
    t.deepEqual(_credentials, credentials);
    t.type(properties, 'object');
    t.end();
  }

  function getCredentials(id, cb) {
    t.equal(id, credentials.id);
    cb(null, credentials);
  }
});

function noop() {}

function xtest() {}