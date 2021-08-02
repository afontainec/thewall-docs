## TheWall Configuration file

This file has two main purposes. The first is to indicate which endpoints are accesible by which roles. The second one is the indicate the path to the knex instance to connect to the Database. We will dig in to show how both works, but as a spoiler alert here is a config file:

```javascript
const path = require('path');

module.exports = {
  access: {
    admin: ['*'],
    storeOwner: [
      ['/store/:id/edit', 'id', 'post']
    ],
  },
  knex: path.join(__dirname, '.', 'knex.js'),
};
```

It creates two roles, admin and storeOwner. Admin has access to everything, while storeOwner only can POST to `store/:id/edit`, but changing the id value with the corresponding filter.

## Access

Well so the config file should export an object with the property `access`. This property will also be an object, where each property will be the name of a role. The value for each role will be an array indicating to which endpoints it has access to. 

### Creating Roles

To create a new role the only thing we need to do is to add a property to the `access` object.

### Entry as text

The following example indicates each endpoint as a text.

```javascript
const path = require('path');

module.exports = {
  access: {
    storeTwoOwner: [
      '/store/2/edit',
      '/store/2/view'
    ],
    storeOneOwner: [
      '/store/1/edit',
      '/store/1/view'
    ],
  },
  knex: path.join(__dirname, '.', 'knex.js'),
};
```

So what is doing is defining two roles: storeTwoOwner and storeOneOwner. Each role has access to two endpoints. As no http verb is indicated, a GET verb is assumed. 

### Adding the filter

What happen if we now have to add a third store, we could add the role storeThreeOwner, but it feels too repetitive right? We can do this by using the filter:

```javascript
const path = require('path');

module.exports = {
  access: {
    storeOwner: [
      ['/store/:id/edit', 'id'],
      ['/store/:id/view', 'id']
    ],
  },
  knex: path.join(__dirname, '.', 'knex.js'),
};
```

A lot have change from the previous example. First of all, we only have one role. Second, the access of this role is no longer a plain text, is an array. This allows to indicate that the url is dynamic and will change according to the filter. So instead of storeOneOwner, we will assign a storeOwner role with filter 1, analogous for storeTwoOwner.  


### Adding a verb

So far all our examples involve GET endpoints, however there are other verbs around. To indicate a verb, just add a third paremeter to the entry. For instance:

```javascript
const path = require('path');

module.exports = {
  access: {
    storeOwner: [
      ['/store/:id/edit', 'id', 'post'],
      ['/store/:id/view', 'id'],
      ['/store/registration', null, 'post']
    ],
  },
  knex: path.join(__dirname, '.', 'knex.js'),
};
```
Not we added a third endpoint, this illustrate how to indicate the verb if the endpoint is not dynamic.

### Wildcards

Also some wild cards can be added. Here some examples: 

```javascript
const path = require('path');

module.exports = {
  access: {
    admin: ['*'],
    storeOwner: [
      ['/store/:id/*', 'id'],
    ],
    everyStoreViewer: [
      '/store/*/view',
    ],
  },
  knex: path.join(__dirname, '.', 'knex.js'),
};
```

Here the admin role can access everything.
storeOwner, can access every GET that starts with `/store/:id`, obviously replacing the id with the corresponding filter.
everyStoreViewer can access every GET that starts with `/store/` and ends with `/view`, for example, `/store/1/view` and `/store/2/view`.


### non-registered Endpoints

If an endpoint is not registered, nor matches any entry of the config file, it will be assumed it is not restricted, therefore the hasAccess function will always return true.

## knex

The configuration also has a knex property. This is the path were a working knex instance is exported. Something of this sort is expected:

```javascript
const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];
module.exports = require('knex')(config);
```


## Does it have to be a separate file?

As a matter of fact no. The instance could be initialized as follow:

```javascript
const configuration = {
  access: {
    admin: ['*'],
    storeOwner: [
      ['/store/:id/edit', 'id', 'post']
    ],
  },
  knex: path.join(__dirname, '.', 'knex.js'),
};

module.exports = require('thewall')(configuration);
```

This is completely fine, however we recommend to have separate files, in our opinion it is cleaner that way.

