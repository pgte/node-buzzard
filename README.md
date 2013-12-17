# Buzzard

Authentication protocol.

## Features

Uses an `Authorization` header containing, `nonce`, timestamp and authentication code, produced by the client.

The client holds a secret key that he uses to craft the authentication code from the nonce and the timestamp.


## Middleware

Connect and Restify-compatible middleware:

```javascript
var BuzzardMiddleware = require('buzzard').server.middleware;
var buzzardMiddleware = BuzzardMiddleware(credentialsFunc);

app.use(buzzardMiddleware);
```