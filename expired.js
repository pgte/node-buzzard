module.exports = expired;

function expired(ts, maxLagMS) {
  var now = Date.now();
  var max = now + maxLagMS;
  var min = now - maxLagMS;
  return (ts < min || ts > max);
}