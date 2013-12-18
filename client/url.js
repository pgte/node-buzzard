var url    = require('url');
var extend = require('xtend');

var assetString = require('../asset_string');
var createDoc   = require('./create_doc');
var sign        = require('../sign');

module.exports = createURL;

function createURL(baseURL, credentials) {
  if (!credentials ||
      !credentials.id ||
      !credentials.key ||
      !credentials.algorithm) {

    throw new Error('Invalid credentials, must have id, key and algorithm properties');
  }

  var doc = createDoc();
  var ac = sign(credentials, assetString(doc));

  var parts = {
    id:    credentials.id,
    ts:    doc.ts,
    nonce: doc.nonce,
    buzzard:    ac
  };

  return enrichURL(baseURL, parts);
}

function enrichURL(baseURL, parts) {
  var parsedURL = url.parse(baseURL, true, true);
  if (! parsedURL.query) parsedURL.query = {};
  var qs = parsedURL.query;
  parsedURL.query = extend(qs, parts);
  delete parsedURL.search;
  return url.format(parsedURL);
}
