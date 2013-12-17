module.exports = assetString;

function assetString(nonce, ts) {
  return nonce + '\n' + ts + '\n';
}