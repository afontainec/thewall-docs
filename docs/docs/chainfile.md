## Overview

The chainfile is where all the configurations of Chinchay are defined. It is a file that must be named `.chainfile.js` and must be on the root of the repository.

Here we are going to indicate all the configurations:



## Knex: The minimal Configuration

The minimal chainfile needed by Chinchay is one that indicates where the [knex](http://knexjs.org/) instance is. So it should look something like this: 

```javascript
const path = require('path');

module.exports = {
  knex:  path.join(__dirname, 'knex.js')
};
```

Where the knex.js file exports the knex instance. Check the [Getting started tutorial](../gettingstarted/ejs.html#connecting-to-the-database), there you can see an example of a knex.js file. 

## Model + Controller + Routes

The model property expects a json as follows:

```javascript
const path = require('path');

module.exports = {
  models: {
    directory: 'path/to/directory/containing/models'
  },
  knex:  path.join(__dirname, 'knex.js')
};
```


where `models.directory` is the path of the directory where all the models should be located. 

For controllers and routes is analogous, so if we want to create a repository with the following structure:

    .
    ├── server
        ├── controllers       
        └── models
        └── routes

The chainfile should look like this

```javascript
const path = require('path');

module.exports = {
  models: {
    directory: path.join(__dirname, 'server', 'models'),
  },
  controllers: {
    directory: path.join(__dirname, 'server', 'controllers'),
  },
  routes: {
    directory: path.join(__dirname, 'server', 'routes'),
  },
  knex:  path.join(__dirname, 'knex.js')
};
```

If these configurations are not set, the model, controller and routes will be generated in a `models`, `controllers` and `routes` directory in the root of the repository. If the directory does not exist it will create it.

::: tip
  I always group all the backend-related (models, controllers, routes, etc) in a server folder.
:::


## views

For the views it's _almost_ the same. If you desire to use the ejs templating language it would be exactly the same: 

```javascript
const path = require('path');

module.exports = {
  models: {
    directory: path.join(__dirname, 'server', 'models'),
  },
  controllers: {
    directory: path.join(__dirname, 'server', 'controllers'),
  },
  routes: {
    directory: path.join(__dirname, 'server', 'routes'),
  },
  views: {
    directory: path.join(__dirname, 'frontend', 'views'),
  },
  knex:  path.join(__dirname, 'knex.js')
};
```

In this case the ejs files will be created within the `frontend/views` directory.

However, if the app is an angular app, the root of the Angular app must be provided as follows:

```javascript
module.exports = {
  models: {
    directory: path.join(__dirname, 'server', 'models'),
  },
  controllers: {
    directory: path.join(__dirname, 'server', 'controllers'),
  },
  routes: {
    directory: path.join(__dirname, 'server', 'routes'),
  },
  views: {
    directory: path.join(__dirname, 'frontend', 'views'),
    angular: path.join(__dirname, 'frontend'),
  },
  knex:  path.join(__dirname, 'knex.js')
};

```

If you are not sure what is the root of the Angular app, is the directory where you would normally run `ng generate component coffee`.

The most common use case is that the root of the Angular app is the same as the root of the repository. in such a case, angular should be defined as follows:

```javascript
  views: {
    angular: '.'
  }
```

::: warning
  For Angular this is not the path where the files will be created. It depends on how the angular is configured, but most certainly it will be created in the `src/app`.
:::


## frontend

A `frontend` property can be added to the chainfile. This is equivalent to adding the flag `--frontend` when running `chinchay new`. See the [cli documentation](./cli.html#frontend-flag) for more information.

This can be either:

  * ejs: The ejs templating language will be used to create the frontend app.
  * angular: Angular will be used to create the frontend app. Several components, a service and a router file will be generated.
  * disable: No frontend app will be generated.

  So for angular the chainfile should look something like this:

```javascript
  module.exports = {
  models: {
    directory: path.join(__dirname, 'server', 'models'),
  },
  controllers: {
    directory: path.join(__dirname, 'server', 'controllers'),
  },
  routes: {
    directory: path.join(__dirname, 'server', 'routes'),
  },
  views: {
    angular: path.join(__dirname, 'frontend'),
  },
  knex:  path.join(__dirname, 'knex.js'),
  frontend: 'angular'
};

```


## backend

A `backend` property can be added to the chainfile. This is equivalent to adding the flag `--backend` when running `chinchay new`. See the [cli documentation](./cli.html#backend-flag) for more information.

This can be either:

  * enable: Model, Controller and routes are generated.
  * disable: No models, controllers and routes will be generated.

  So if we want to disable the backend:

```javascript
  module.exports = {
  models: {
    directory: path.join(__dirname, 'server', 'models'),
  },
  controllers: {
    directory: path.join(__dirname, 'server', 'controllers'),
  },
  routes: {
    directory: path.join(__dirname, 'server', 'routes'),
  },
  views: {
    angular: path.join(__dirname, 'frontend'),
  },
  knex:  path.join(__dirname, 'knex.js'),
  frontend: 'angular',
  backend: 'disable'
};

```

## middleware + access + TheWall

Last, but definitely not least, how to restrict data access in your app. If you are designing an API that can be accessible by authenticated users only, and moreover, different users have access to different data, you will have to configure TheWall, access and middleware property.

### Middleware

  Let's start with the middleware. The value can be either `frontend`, `api`, `enable` or `disable`. This is equivalent to the flag `--middleware` and will determine which routes will require a _valid token_ to be granted access. So if you only what to protect the API routes, the chainfile will look as follows:

  ```javascript
  module.exports = {
  models: {
    directory: path.join(__dirname, 'server', 'models'),
  },
  controllers: {
    directory: path.join(__dirname, 'server', 'controllers'),
  },
  routes: {
    directory: path.join(__dirname, 'server', 'routes'),
  },
  views: {
    angular: path.join(__dirname, 'frontend'),
  },
  knex:  path.join(__dirname, 'knex.js'),
  middleware: 'api',
};
```

For more information check the full [Middleware Documentation](./middleware).

::: tip NOTE
  A valid token is an oAuth 2.0 token generated with a json web token and added as a Bearer Token. If you don't know what is all this, check the [Middleware Documentation](./middleware) and/or the [oAuth introduction](./overview.html#oAuth-2.0).
:::



### TheWall

For most cases, just providing a valid token is not enough. Usually we have different user roles. For instance maybe, a venue-owner will be able to access some data, a client some other data and an admin can access everything. To configure this, Chinchay uses [TheWall](https://www.npmjs.com/package/thewall). If you desire to use this functionality, a thewall property should be provided in the chainfile with the path to a file that exports a thewall instance. For example: 

  ```javascript
  module.exports = {
  models: {
    directory: path.join(__dirname, 'server', 'models'),
  },
  controllers: {
    directory: path.join(__dirname, 'server', 'controllers'),
  },
  routes: {
    directory: path.join(__dirname, 'server', 'routes'),
  },
  views: {
    angular: path.join(__dirname, 'frontend'),
  },
  knex:  path.join(__dirname, 'knex.js'),
  middleware: 'api',
  thewall: path.join(__dirname, 'thewall.js')
};
```

As you may have notice is very similar to the knex property. For more information on how to get this working and how thewal.js should be see the [middleware documentation](./middleware).


### access

Sometimes, just filtering who can access a route is not enough. Some routes must be accessible by different users but the content that route returns should differ. Here is where the access property comes to help. Where you can set which user roles have unrestricted access, for instance an admin may be able to access everything, and which roles are restricted. On the chainfile an `access` property should be defined to the path to the file that defines which roles are restricted and to which data are restricted. For example:

  ```javascript
  module.exports = {
  models: {
    directory: path.join(__dirname, 'server', 'models'),
  },
  controllers: {
    directory: path.join(__dirname, 'server', 'controllers'),
  },
  routes: {
    directory: path.join(__dirname, 'server', 'routes'),
  },
  views: {
    angular: path.join(__dirname, 'frontend'),
  },
  knex:  path.join(__dirname, 'knex.js'),
  middleware: 'api',
  access: path.join(__dirname, 'access.js')
};
```

For more information on how to configure the access.js file check the full [Middleware Documentation](./middleware).


### TOKEN_EXPIRATION_WINDOW


The access token generated for the Middleware will be valid for 7 days. THis behaviour can be changed by adding a `TOKEN_EXPIRATION_WINDOW` property:

  ```javascript
  module.exports = {
  models: {
    directory: path.join(__dirname, 'server', 'models'),
  },
  controllers: {
    directory: path.join(__dirname, 'server', 'controllers'),
  },
  routes: {
    directory: path.join(__dirname, 'server', 'routes'),
  },
  views: {
    angular: path.join(__dirname, 'frontend'),
  },
  knex:  path.join(__dirname, 'knex.js'),
  middleware: 'api',
  access: path.join(__dirname, 'access.js'),
  TOKEN_EXPIRATION_WINDOW: 3600
};
```

This must be given in **seconds**, therefore in the previous example each token will be valid for 3600 seconds, A.K.A. 1 hour.
