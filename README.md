# Buzzard

[![Build Status](https://travis-ci.org/pgte/node-buzzard.png?branch=master)](https://travis-ci.org/pgte/node-buzzard)

Authentication protocol for HTTPS services.

## Features

Uses an `Authorization` header containing, `nonce`, timestamp and authentication code, produced by the client.

Also supports URL-based authentication.

The client holds a secret key that it uses to craft the authentication code from the nonce and the timestamp.

The server gets the nonce so that it can validate if the nonce is repeated.

Supports browserify.


## JS Client

### Client.header

Creates a header given a credential:

```javascript
var Client = require('buzzard').client;

var credentials = {
  id: 'iiiidddd',
  key: 'kkkeeeyyy',
  algorithm: 'sha1'
};

var header = Client.header(credentials);

// use request, jquery or whatvs, just be sure to send the HTTP header:

'Authorization': header
```

### Client.url

Creates a URL given a base URL and a credential:

```javascript
var Client = require('buzzard').client;

var credentials = {
  id: 'iiiidddd',
  key: 'kkkeeeyyy',
  algorithm: 'sha1'
};

var baseURL = 'http://cats.cat/purr?a=1'
var url = Client.url(baseURL, credentials);
```

## Server

### Construct the server validator

Construct a server validator by providing a function that fetches the credentials given a credential id;

```javascript
var Buzzard = require('buzzard').server;
var buzzard = Buzzard(getCredentials);

// stupid example

var credentials = {

  'user1': {
    id: 'user1',
    key: 'kkkeeeyyy1',
    algorithm: 'sha1'
  },

  'user2': {
    id: 'user2',
    key: 'kkkeeeyyy2',
    algorithm: 'sha1'
  }
}

/// cb is error-first
function getCredentials(id, cb) {
  cb(null, credentials[id]);
};

```

### Server.authenticate

Authenticates a request object, either using authorization header or URL.

```javascript
server.on('request', authenticate);

function authenticate(req) {
  buzzard.authenticate(req, authenticated);

  function authenticated(err, credentials, attributes) {
    if (err) {
      res.statusCode = err.response.code;
      res.end(err.message);
    } else {
      console.log('user id %s used nonce %s', credentials.id, attributes.nonce);

      // validate nonce...

      res.end('You have access!!!');
    }
  }
}
```

## Middleware

Connect and Restify-compatible middleware:

```javascript
var BuzzardMiddleware = require('buzzard').server.middleware;
var buzzardMiddleware = BuzzardMiddleware(credentialsFunc);

app.use(buzzardMiddleware);
```

## License

MIT
