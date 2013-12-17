var crypto = require('crypto');

module.exports = sign;

function sign(credentials, doc) {
  var hmac = crypto.createHmac(credentials.algorithm, credentials.key).update(doc);
  return hmac.digest('base64');
}