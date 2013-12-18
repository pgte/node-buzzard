module.exports = assetString;

function assetString(doc) {
  return doc.nonce + '\n' + doc.ts + '\n';
}