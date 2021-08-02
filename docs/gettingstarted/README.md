
Welcome to the **TheWall Getting Started**


To install TheWall simply run:


`npm i thewall`

After that, we recommend creating a [TheWall configuration file](../how-it-works/the-file.html). We leave an example here:

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
This file define two roles, an admin to access to everything and a storeOwner with access to 1 endpoint. You can edit this as desired.

Note it also define a path for the [knex](https://knexjs.org/) instance.

Then we create our [TheWall instance](../how-it-works/the-wall.html). Here we leave an example:

```javascript
const config = require('../path/to/thewallfile');

module.exports = require('thewall')(config);
```


And we are ready to go.


## Better with an example...

It is always better to work out with an example. So here is a [link](http://chinchay.accionet.net/gettingstarted/apiMiddleware.html) to a tutorial on how [Chinchay](http://chinchay.accionet.net) is used with TheWall to create an API.

