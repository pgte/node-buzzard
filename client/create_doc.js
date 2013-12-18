var crypto      = require('crypto');

module.exports = createDoc;

function createDoc() {
  var nonce = randomBytes(8);
  var ts    = Date.now();

  return {
    nonce: nonce,
    ts: ts
  };

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