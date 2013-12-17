var Server = require('./server');

module.exports = middleware;

function middleware(credentialsFunc, options) {
  var server = Server(credentialsFunc, options);

  return function(req, res, next) {
    server.authenticate(req, replied);

    function replied(err) {
      if (err) res.send(err);
      else next();
    }
  };
}