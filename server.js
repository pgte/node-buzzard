var crypto      = require('crypto');
var Boom        = require('boom');
var extend      = require('xtend');

var sign        = require('./sign');
var assetString = require('./asset_string');
var expired     = require('./expired');
var parseAuthorizationHeader = require('./parse_authorization_header');

var DEFAULT_MAX_LAG_MS = 1000 * 60 * 60 * 24; // 24 hours
var algorithms  = ['sha1', 'sha256'];

exports = module.exports  = createServer;
exports.middleware = middleware;

function createServer(credentialsFunc, options) {
  return new Server(credentialsFunc, options);
}

function Server(credentialsFunc, options) {
  if (! credentialsFunc || typeof credentialsFunc != 'function')
    throw new Error('need a credentials function');

  this._credentialsFunc = credentialsFunc;

  this.options = extend({
    maxLagMS: DEFAULT_MAX_LAG_MS
  }, options || {});
}

var S = Server.prototype;

S.authenticate = function authenticate(req, cb) {
  var self = this;

  var header = req.headers.authorization;

  if (! header) return cb(Boom.unauthorized('No authorization header'));

  var attributes;
  try {
    attributes = parseAuthorizationHeader(header);
  } catch(err) {
    return cb(err);
  }

  if (!attributes.id ||
      !attributes.ts ||
      !attributes.nonce ||
      !attributes.ac) {
    return cb(Boom.badRequest('Missing attributes'));
  }

  if (attributes.nonce.length < 5)
    return cb(Boom.badRequest('Invalid nonce shorter than 5 bytes'));

  this._credentialsFunc(attributes.id, gotCredentials);

  function gotCredentials(err, credentials) {
    if (err) return cb(err);

    if (!credentials.key || !credentials.algorithm)
      return callback(Boom.internal('Invalid credentials'));

    if (algorithms.indexOf(credentials.algorithm) === -1)
      return callback(Boom.internal('Unknown algorithm'), credentials, artifacts);

    var doc = assetString(attributes.nonce, attributes.ts);
    var ac = sign(credentials, doc);

    if (ac != attributes.ac)
      return cb(Boom.unauthorized('Invalid authentication code'));

    var ts = Number(attributes.ts);
    if (ts != attributes.ts)
      return cb(Boom.unauthorized('Invalid timestamp: must be a number'));

    if (expired(ts, self.options.maxLagMS))
      return cb(Boom.unauthorized('Invalid timestamp, must be within 24 hours'));

    cb(null, credentials, attributes);

  }
};

/// middleware

function middleware(credentialsFunc, options) {
  var server = createServer(credentialsFunc, options);

  return function(req, res, next) {
    server.authenticate(req, replied);

    function replied(err) {
      if (err) res.send(err);
      else next();
    }
  };
}