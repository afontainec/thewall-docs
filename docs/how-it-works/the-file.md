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

### Creating Roles

### Entry as text

### Adding the filter

### Entry as array

### Wildcards


## knex

