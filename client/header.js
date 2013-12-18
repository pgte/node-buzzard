var createDoc   = require('./create_doc');
var assetString = require('../asset_string');
var sign        = require('../sign');

module.exports = header;

function header(credentials) {
  if (!credentials ||
      !credentials.id ||
      !credentials.key ||
      !credentials.algorithm) {

    throw new Error('Invalid credentials, must have id, key and algorithm properties');
  }

  var doc = createDoc();
  var ac = sign(credentials, assetString(doc));

  return 'Buzzard id="' + encodeURIComponent(credentials.id) +
         '", ts="' + doc.ts +
         '", nonce="' + doc.nonce +
         '", ac="' + ac + '"';
}