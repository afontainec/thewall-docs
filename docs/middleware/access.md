## Overview

 The Access Module has two Functions. The first one is to be in charge of generating an access token. This token follows the json web token standard, by generating the token with the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) npm package. The routes protected by the Middleware will expect requests to hold this token as a Bearer token.

  Second, it restricts which users can access different content, functionalities, functions, etc. It works with roles, where each user can have many roles. Each role will give him access to certain data and/or functionalities. There are two types of roles:

  * RESTRICTED ROLES: roles that have access to a particular entry. Its accessibility is limited to that entry. For example, let's assume you have an app with information about coffees, if a user can only access 1 particular coffee, he should be granted a restricted role.
  * UNRESTRICTED_ROLES: roles that have complete access on a particular module or subdivision of the app. Usually used for a certain database relation. Let's assume you have an app with information about coffees and teas, if a user can access all the coffees but not the teas, he should be granted an unrestricted role in coffees.

  This module works side by side with [TheWall](https://www.npmjs.com/package/thewall). and will require a working instance of TheWall to work properly.


## Configure


  ### Restricted and Unrestricted Roles

  To configure it, we need to pass it a configuration file indicating which roles are unrestricted and which are restricted. For example let's create an `access.js` file with the following:

  ```javascript
  const UNRESTRICTED_ROLES = {
    coffee: ['admin', 'coffeeAdmin'],
    tea: ['admin', 'teaAdmin'],
  };

  const RESTRICTED_ROLES = {
    coffee: ['coffeeDrinker'],
    tea: ['teaDrinker'],
  };

  module.exports = {
    UNRESTRICTED_ROLES,
    RESTRICTED_ROLES,
  };
  ```

  In this example, coffeeAdmin has unrestricted access to the coffees, but no access to the teas, whereas the coffeeDrinker has restricted access to coffee.

  For Chinchay to use this, the path of the configuration file must be provided in the `.chainfile.js`:

  ```javascript
  const path = require('path');

  module.exports = {
      access: path.join(__dirname, 'access.js'),
      knex:  path.join(__dirname, 'knex.js')
  };
  ```

  ### TheWall

  Lastly, a [TheWall](https://www.npmjs.com/package/thewall) instance must be provided in the `chainfile`. 
  
  We create the a `thewallfile.js` to hold the configuration of the wall:

  ```javascript
  const path = require('path');

  module.exports = {
    access: {
      admin: ['*'], // access everything
      coffeeAdmin: ['/api/coffee/*'], // access to all routes starting with /api/coffee/
      coffeeDrinker: [
        '/api/coffee/find', /* index with all the coffee it has access to */
        ['/api/coffee/:id', 'id', 'get'], /* view the coffee with id=:id, only if it has the role coffeeDrinker to that :id. */
      ], 
      teaAdmin: ['/api/tea/*'], /* access to all routes starting with /api/tea/ */
      teaDrinker: [
        '/api/tea/find', /* index with all the tea it has access to */
        ['/api/tea/:id', 'id', 'get'], /* view the tea with id=:id, only if it has the role teaDrinker to that :id. */
      ],
    },
    knex: path.join(__dirname, 'knex.js'),
  };
  ```

Now create a `thewall` instance:

  ```
  $ touch thewall.js
  ```

  Fill the generate fill with:
  ```javascript
  const config = require('./thewallfile');

  module.exports = require('thewall')(config);
  ```

  Add it to the `chainfile.js`: 
    
  ```javascript
  const path = require('path');

  module.exports = {
      access: path.join(__dirname, 'access.js'),
      thewall: path.join(__dirname, 'thewall.js'),
      knex:  path.join(__dirname, 'knex.js')
  };
  ```
  
  
  For more information as to how to add TheWall instance look at the [API tutorial](../gettingstarted/apiMiddleware) and/or the [Chainfile Docs](../chainfile.html#middleware-access-thewall).
  

### bootstrap

  The bootstrap function will be the one that actually loads the configuration files. It will also Bootstrap the [accessToken](./accessToken). This function will be automatically called when requiring Chinchay, developers will hardly ever need to use it. Manually calling this function is a code smell of Chinchay not being properly configured.



## isAdmin

  ### Overview
  There is a special role in Access: the `admin` role, by default, this role will have unrestricted access to everything.

  There are two ways you can make a user an `admin`:

  #### The Correct Way: Add a TheWall role called `admin`

  The correct way to indicate that a user is an admin is by adding a TheWall role to that user:
  ```javascript
    const access = await TheWall.addAccess(1, 'admin');
  ```
  With the following, we have indicated that the user with id=1 is an admin.


  #### The Incorrect Way: add a is_admin

  Well maybe a went a bit too far, it is not "incorrect", it's more the old fashioned way. Just add a `is_admin` boolean to the user relation, for example: 

  ```javascript
  exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
      // Incremental id
      table.increments();
      table.string('username').notNullable();
      table.text('password');
      table.boolean('is_admin');
      // created_at and updated_at
      table.timestamps();
    });
  };
  ```

  ### Parameter

  * user: javascript object representing the requesting user. It should hold the TheWall roles in an `access` property.

  :::tip Common Use
  The most common way of using this method is by passing the `req.user` property as the `user` parameter. Note that this property is added by the middleware and if this latter is not configured correctly, particularly the `Middleware.prerouting(app)` is missing, the `req.user` property will be absent.
  :::

  ### Return Value

  * isAdmin: Boolean indicating if the given user is or not an admin.


  ### Example

  
  ```javascript
  req.user = {
    id: 1,
    access: [{role: 'admin' }]
  };
  Access.isAdmin(req.user); // returns true
  ```

  ```javascript
  req.user = {
    id: 1,
    access: [{role: 'coffeeAdmin' }]
  };
  Access.isAdmin(req.user); // returns false 
  ```

## hasAccessToAll

  ### Overview

  Check if the given user has complete access to a particular module or subdivision of the app, in other words if it holds an unrestricted role for the asked module/subdivision. If the user is admin it will assume it has access to it.

  ### Parameter

  * user: javascript object representing the requesting user. It should hold the TheWall roles in an `access` property.

  :::tip Common Use
  The most common way of using this method is by passing the `req.user` property as the `user` parameter. Note that this property is added by the middleware and if this latter is not configured correctly, particularly the `Middleware.prerouting(app)` is missing, the `req.user` property will be absent.
  :::

  * to: module or subdivision at issue. 

  ### Return Value

  * hasAccess: Boolean indicating if the given user has unrestricted access to the module or subdivision at issue.
  
  
  ### Examples

  This example assumes [this configuration](#configure).

  ```javascript
  req.user = {
    id: 1,
    access: [{role: 'admin' }]
  };
  Access.hasAccessToAll(req.user, 'coffee'); // returns true
  ```

  ```javascript
  req.user = {
    id: 2,
    access: [{role: 'coffeeAdmin' }]
  };
  Access.hasAccessToAll(req.user, 'coffee'); // returns true 
  ```

  ```javascript
  req.user = {
    id: 3,
    access: [{role: 'teaAdmin' }]
  };
  Access.hasAccessToAll(req.user, 'coffee'); // returns false 
  ```

  ```javascript
  req.user = {
    id: 4,
    access: [{role: 'coffeeDrinker', filter: 1 }]
  };
  Access.hasAccessToAll(req.user, 'coffee'); // returns false 
  ```

## accessiblesIds

  ### Overview

  Returns all the ids/filters to which a given user has access on a particular module or subdivision of the app. In other words it will return an Array with all the `filter` property of every access it has to a given module/subdivision.

  This method is intended to be used only for users that do not have unrestricted access.

  ### Parameter

  * user: javascript object representing the requesting user. It should hold the TheWall roles in an `access` property.

  :::tip Common Use
  The most common way of using this method is by passing the `req.user` property as the `user` parameter. Note that this property is added by the middleware and if this latter is not configured correctly, particularly the `Middleware.prerouting(app)` is missing, the `req.user` property will be absent.
  :::

  * to: module or subdivision at issue. 

  ### Return Value

  * ids: Array of all the filters of that user's accesses.
  
  
  ### Examples

  This example assumes [this configuration](#configure).

  ```javascript
  req.user = {
    id: 1,
    access: [{role: 'coffeeDrinker', filter: '1' }, {role: 'coffeeDrinker', filter: '2' }]
  };
  Access.accessiblesIds(req.user, 'coffee'); // returns ['1', '2']
  ```

  ```javascript
  req.user = {
    id: 2,
    access: [{role: 'coffeeDrinker', filter: '1' }, {role: 'teaDrinker', filter: '2' }]
  };
  Access.accessiblesIds(req.user, 'coffee'); // returns ['1']
  ```

  ```javascript
  req.user = {
    id: 3,
    access: [{role: 'teaDrinker', filter: '1' }, {role: 'teaDrinker', filter: '2' }]
  };
  Access.accessiblesIds(req.user, 'coffee'); // returns []
  ```

## addAccessibleToSearch

  ### Overview

  This is one of the most useful methods. It's intended to filter the `search` parameter of [The Model](../models/find.html#parameters) so it does not access data it should not. It will either edit, remove or add properties to the search in order to return only what it is accessible by the user.

  It is usually used in a controller right before the [find](../models/find) or [count](../models/count) method of the model is called.

  ### Parameter

  * search: The search parameter to filter
  * access: The users access. An array with all it's roles/accesses.
  * tableName: module or subdivision of the app at issue.
  * key: The key/property corresponding to the `filter` property of the access.


  :::tip Common Use: access
  The most common way of using this method is by passing the `req.user.access` property as the `access` parameter. Note that this property is added by the middleware and if this latter is not configured correctly, particularly the `Middleware.prerouting(app)` is missing, the `req.user` property will be absent.
  :::

  ### Return value

  * search: The filtered search parameter.

  ### Examples

  1. If the user is an admin the search will not be changed:
  ```javascript
  req.user = {id: 1, access: [{ role: 'admin' }] };
  const userAccess = req.user.access || [];
  let search = { id: 1 };
  search = Access.addAccessibleToSearch(search, userAccess, 'coffee', 'id');
  ```

  Filtered search:
  ```javascript
  { id: 1 }
  ```

  2. Access to several entries
  ```javascript
  req.user = {id: 1, access: [{ role: 'coffeeDrinker', filter: '2' }, { role: 'coffeeDrinker', filter: '3' }] };
  const userAccess = req.user.access || [];
  let search = { price: 100 };
  search = Access.addAccessibleToSearch(search, userAccess, 'coffee', 'id');
  ```

  Filtered search:
  ```javascript
  { price: 100, id: [ 'in', [ 2, 3 ] ] }
  ```

  3. Searching for a given entry
  ```javascript
  req.user = {id: 1, access: [{ role: 'coffeeDrinker', filter: '2' }, { role: 'coffeeDrinker', filter: '3' }] };
  const userAccess = req.user.access || [];
  let search = { id: 2 };
  search = Access.addAccessibleToSearch(search, userAccess, 'coffee', 'id');
  ```

  Filtered search:
  ```javascript
  { id: 2 }
  ```

  4. Searching for a given entry, without access
  ```javascript
  req.user = {id: 1, access: [{ role: 'coffeeDrinker', filter: '2' }, { role: 'coffeeDrinker', filter: '3' }] };
  const userAccess = req.user.access || [];
  let search = { id: 4 };
  search = Access.addAccessibleToSearch(search, userAccess, 'coffee', 'id');
  ```

  Filtered search:
  ```javascript
  { id: [ 'in', [] ] }
  ```

  5. Searching for an array of options
  ```javascript
  req.user = {id: 1, access: [{ role: 'coffeeDrinker', filter: '2' }, { role: 'coffeeDrinker', filter: '3' }] };
  const userAccess = req.user.access || [];
  let search = { id: ['in', ['2', '4']] };
  search = Access.addAccessibleToSearch(search, userAccess, 'coffee', 'id');
  ```

  Filtered search:
  ```javascript
  { id: [ 'in', ['2'] ] }
  ```

## find

  ### Overview

    This is intended for searching access. it translations directly to [TheWall](https://www.npmjs.com/package/thewall) `findAccess` function.

  ### Parameter

  * access: javascript object indicating what should be searched. Similar to the `search` parameter of [The Model](../models/find.html#parameters).

  ### Return value

  * accesses: Array of javascript object. Where each javascript object represents a role. 

  ### Examples

  If you want to search for all the accesses/roles of the user with id=1: 
  ```javascript
  Access.find({ user_id: 1 });
  ```

  To find all the users who have coffeeDrinker role on coffee 4.
  ```javascript
  Access.find({ role: 'coffeeDrinker', filter: '4' });
  ```

## hasAccessTo

  ### Overview

   It will indicate if the given user has or not access to the requested id. This is equivalent to asking, does the user have a role with access to the requested filter?

  ### Parameter

  * user: javascript object representing the requesting user. It should hold the TheWall roles in an `access` property.
  * to: The subdivision/module at issue.
  * filterId: the given specific filter being asked.

  :::tip Common Use
  The most common way of using this method is by passing the `req.user` property as the `user` parameter. Note that this property is added by the middleware and if this latter is not configured correctly, particularly the `Middleware.prerouting(app)` is missing, the `req.user` property will be absent.
  ::: 

  ### Return value

  * hasAccess: Boolean indicating if the user has access to the filterId of that subdivision/module. 

  ### Examples

  ```javascript
  req.user = {id: 1, access: [{ role: 'coffeeAdmin' }]};
  Access.hasAccessTo(req.user, 'coffee', 2); // returns true
  ```

  ```javascript
  req.user = {id: 1, access: [{ role: 'coffeeDrinker', filter: '2' }]};
  Access.hasAccessTo(req.user, 'coffee', 2); // returns true
  ```

  ```javascript
  req.user = {id: 1, access: [{ role: 'coffeeDrinker', filter: '2' }]};
  Access.hasAccessTo(req.user, 'coffee', 3); // returns false
  ```

  ```javascript
  req.user = {id: 1, access: [{ role: 'coffeeDrinker', filter: '2' }]};
  Access.hasAccessTo(req.user, 'tea', 2); // returns false
  ```


## generateToken

  ### Overview

   It will generate an access token for the given user. It will expire in 7 days. 

  ### Parameter

  * user: javascript object representing the user.

  ### Return value

  * accessToken: Javascript object with two properties. The token, as an encrypted string, and the expiration. 

  ### Example

  ```javascript
  req.user = {id: 1 };
  Access.generatToken(req.user); // returns true
  ```

  ```javascript
  { token:
   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJpYXQiOjE1OTYzODY0MDQsImV4cCI6MTU5Njk5MTIwNH0.UssIWi2QgutT3IKR4WImW7WTHpOi518hEgMW7mIHyi4',
  expiration: '2020-08-09T16:40:04.789Z' 
  }
  ```

## Token Encryption

:::danger
This is **VERY IMPORTANT**: The token is a jsonwebtoken encrypted by the [environment variable](https://en.wikipedia.org/wiki/Environment_variable) `JWT_SECRET`. You must define your own `JWT_SECRET` that must be kept confidential. If this variable is not defined, Chinchay will use a default secret, this will make your app prone to cyber-attacks. 
:::