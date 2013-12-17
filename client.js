var crypto      = require('crypto');
var assetString = require('./asset_string');
var sign        = require('./sign');

exports.header = header;

function header(credentials) {
  if (!credentials ||
      !credentials.id ||
      !credentials.key ||
      !credentials.algorithm) {

    throw new Error('Invalid credentials, must have id, key and algorithm properties');
  }

  var nonce = randomBytes(8);
  var ts    = Date.now();

  var doc = assetString(nonce, ts);
  var ac = sign(credentials, doc);

  var header = 'Buzzard id="' + encodeURIComponent(credentials.id) +
               '", ts="' + ts +
               '", nonce="' + nonce +
               '", ac="' + ac + '"';

  return header;
}

function randomBytes(size) {
  var buffer = randomBits((size + 1) * 6);
  var string = buffer.toString('base64');
  return string.slice(0, size);
}

function randomBits(bits) {
  var bytes = Math.ceil(bits / 8);
  return crypto.randomBytes(bytes);
}