## Overview

The middleware has one function and one main function: does the user requesting a certain API endpoint have access to it?

So how do we set it up?

## hasAccess

Let's look to the API route created with the `chinchay new` command:

```javascript
  router.get('/api/coffee/find', (req, res, next) => {
    coffeeController.find(req, res, next);
  });
```

You just need to add the following:

```javascript
  router.get('/api/coffee/find', Middleware.hasAccess, (req, res, next) => {
    coffeeController.find(req, res, next);
  });
```

Note you must have imported the Middleware first:

```javascript
  const { Middleware } = require('chinchay');
```

So before actually running the controller function, the `Middleware.hasAccess` will run, checking that the Bearer token is present, valid and that the user can access it. Only then the controller function will run, otherwise it will reject the connection with a 401 code. 

## Configuring: prerouting and postrouting

Very important! For it to work, you must define that the app must use the middleware prerouting and the middleware postrouting, as such:


```javascript
  Middleware.prerouting(app);
  
  var coffee = require('./routes/coffee');
  var coffeeAPI = require('./routes/coffeeAPI');
  app.use('/', coffee);
  app.use('/', coffeeAPI);
  
  Middleware.postrouting(app);
```

:::danger
The prerouting must be before the `app.use(...)` and the postrouting must be after the `app.use(...)`. 
:::

## Automating with CLI: the middleware flag


When running the `chinchay new`, you can pass a `--middleware` to automatically add the `Middleware.hasAccess`. You can read more on how to work with it in the [documentation of the middleware flag](../docs/cli.html#the-middleware-flag).

## Token Encryption

:::danger
This is **VERY IMPORTANT**: The token is a jsonwebtoken encrypted by the [environment variable](https://en.wikipedia.org/wiki/Environment_variable) `JWT_SECRET`. You must define your own `JWT_SECRET` that must be kept confidential. If this variable is not defined, Chinchay will use a default secret, this will make your app prone to cyber-attacks. 
:::

## Token Expiration Date

By default the token will expire in 7 days since generated. However you can override this conduct by defining the  `TOKEN_EXPIRATION_WINDOW` on the `.chainfile`, click [here](../docs/chainfile.html#TOKEN_EXPIRATION_WINDOW) for more information.


