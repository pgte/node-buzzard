var Boom = require('boom');

var keys = ['id', 'ts', 'nonce', 'ac'];

module.exports = parseAuthorizationHeader;

function parseAuthorizationHeader(header) {
  var headerParts = header.match(/^(\w+)(?:\s+(.*))?$/);
  if (!headerParts) {
    throw Boom.badRequest('Invalid header syntax');
  }

  var scheme = headerParts[1];
  if (scheme.toLowerCase() !== 'buzzard')
    throw Boom.unauthorized('Not buzzard protocol');

  var attributesString = headerParts[2];
  if (!attributesString)
    throw Boom.badRequest('Invalid header syntax');

  var err;
  var attributes = {};

  var verify = attributesString.replace(/(\w+)="([^"\\]*)"\s*(?:,\s*|$)/g, function ($0, $1, $2) {

    // Check valid attribute names

    if (keys.indexOf($1) === -1) {
      err = 'Unknown attribute: ' + $1;
      return;
    }

    // Allowed attribute value characters: !#$%&'()*+,-./:;<=>?@[]^_`{|}~ and space, a-z, A-Z, 0-9

    if ($2.match(/^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~]+$/) === null) {
      err = 'Bad attribute value: ' + $1;
      return;
    }

    // Check for duplicates

    if (attributes.hasOwnProperty($1)) {
      err = 'Duplicate attribute: ' + $1;
      return;
    }

    attributes[$1] = $2;
    return '';
  });

  if (verify)
    throw Boom.badRequest(err || 'Bad header format');

  return attributes;
};