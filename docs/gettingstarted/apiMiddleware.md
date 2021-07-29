## Building our first RESTful API

This tutorial will walk you through building your first API with Chinchay! It will not only be a RESTful API but we will also configure our middleware and access to filter which user can access which resources. 


### Defining concepts


 * [oAuth 2.0](https://oauth.net/2/): oAuth is an industry-standard protocol for authorization. In simple terms, you can protect so each user only access the endpoint you give him access to. The user authenticates given it's credentials and is granted an access token. For every request he does after he must provide the token to prove his identity.

 * [The Chinchay Middleware](./middleware) will be in charge of inspecting that the token is present, valid and that the user of that token has access to the given endpoint. The token is expected to be given as a [Bearer Token](https://stackoverflow.com/questions/25838183/what-is-the-oauth-2-0-bearer-token-exactly/25843058).

* [TheWall npm package](https://www.npmjs.com/package/thewall). To actually define which user has access to which endpoints.

 * The [Access Module](./middleware#access) will be in charge of generating the access token, the token follows the [json web token standard](https://jwt.io/), by generating the token with [the jsonwebtoken npm package](https://www.npmjs.com/package/jsonwebtoken). Also will be in charge of filtering who has access to which data within a given endpoint.



### Quick Overview

So we are going to create an API with information about coffees and teas. Some users will only be allowed to read information about specific coffees, others only about specific teas, whereas others will be granted full access. So let's dive into how to configure this!



### Requirements
  * [npm](https://www.npmjs.com/get-npm)
  * [express](https://expressjs.com/)
  * [Postgres](https://www.postgresql.org/)

  If you do not have express installed you can easily install it with npm
```
$ npm install express -g
```

## Create nodejs app with express

Create a nodejs app called: tutorial-chinchay-api
```
$ express tutorial-chinchay-api 
$ cd tutorial-chinchay-api
```
<br/>
We will install drivers to use PostgresSQL database. we will use knex.js and pg

```
$ npm install pg -s
$ npm install knex -s
```
<br/>
Also we will use ejs instead of jade. So we need to run


Let's run the app to see what we have so far!

```
$ npm install
$ npm start
```
<br/>

You can visit [http://localhost:3000](http://localhost:3000) to see the default express web app... but we are here for the API so let's move on!

### Create Postgresql Database

In this tutorial we will not dig in how Postgres fully work. For more information on how to work around Postgres visit [https://www.postgresql.org/](https://www.postgresql.org/).

In order to connect to Postgres, we need to create a database. If you have postgresql installed you can run
```
$ psql
```
<br/>
This should open up the postgresql console. Run the following command:

```
postgres=# CREATE DATABASE tutorial_chinchay_api;
```
*NOTE:* Depending on your default user and psql version the syntax of the previous line may vary.

if it's successful close psql, run:
```
postgres=# \q
```


### Connecting to the Database

For connecting our app to the database chinchay uses [knex](https://knex.org/). In this tutorial we will not dig in how knex fully works. For more information on how to work around knex [click here](https://knex.org/).

First of all, we highly recommend to install knex globally:

```
$ npm install knex -g
```
<br/>
Until now we should have the following Directory Structure:

    .
    ├── bin                  
    ├── node_modules       
    ├── public   
    ├── routes
    ├── views              
    ├── app.js
    ├── package-lock.json
    └── package.json

We will add the following:

    .
    ├── bin
    ├── database
        ├── migrations       
        └── seeds
            ├── development
            ├── production   
            └──  test
    ├── node_modules       
    ├── public   
    ├── routes
    ├── views              
    ├── app.js
    ├── knexfile.js        
    ├── knex.js        
    ├── package-lock.json
    └── package.json

<br/>

* database/migrations/ directory will hold all the migrations (changes) to the database.
* database/seed/ directory will hold all the seed files. Every subdirectory will hold the seed corresponding to that environment.
* knex.js Will be the instance that connects to the database and the knexfile.js will hold the configurations.
<br/>
Go ahead and create those files

Before we continue we need to create a configuration file to let knex know how to interact with the database. We need to create a knexfile.js
```
$ touch knexfile.js
```
<br/>
Add the following code to knexfile.js

```javascript
const path = require('path');

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost:5432/test_chinchay',
    migrations: {
      directory: path.join(__dirname, '/database/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/database/seeds/test'),
    },
    acquireConnectionTimeout: 10000,
  },
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/tutorial_chinchay_api',
    migrations: {
      directory: path.join(__dirname, '/database/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/database/seeds/development'),
    },
    acquireConnectionTimeout: 10000,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost:5432/tutorial_chinchay_api',
    migrations: {
      directory: path.join(__dirname, '/database/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/database/seeds/production'),
    },
    acquireConnectionTimeout: 10000,
  },
  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost:5432/tutorial_chinchay_api',
    migrations: {
      directory: path.join(__dirname, '/database/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/database/seeds/production'),
    },
    acquireConnectionTimeout: 10000,
  },
};

```
:::warning
 If your Postgres user it is not postgres change it accordingly in the connection URL.
:::

We will not get in detail of how this file works, but basically we are telling knex where we want to save the migrations, the seeds and what is the url to connect to the database. Note that the knexfile defines this variables for every environment by separate.


Now we need to add the following code to the knex.js file:

```javascript
const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];
module.exports = require('knex')(config);
```

Now knex is configured to connect to the database.


## Creating the coffee + tea relations

Now let's get to the fun part: Chinchay. We will create the .chainfile.js, this file holds all of the configurations for chinchay.

Go ahead and create this file.


In the .chainfile.js add the following:


```javascript
const path = require('path');

module.exports = {
  models: {
    directory: path.join(__dirname, 'models'),
  },
  controllers: {
    directory: path.join(__dirname, 'controllers')
  },
  views: {
    directory: path.join(__dirname, 'views')
  },
  routes: {
    directory: path.join(__dirname, 'routes')
  },
  knex:  path.join(__dirname, 'knex.js')
};
```

Here we are defining which directories will hold the models, the controllers, the views and the routes.

Install chinchay:
```
$ npm install chinchay -s
$ npm install chinchay -g
```
<br/>
Installing chinchay globally will allow you to run chinchay CLI.


### Coffee And Tea

Now it's time to create the coffees and the teas!

```
$ chinchay new coffee --middleware api --frontend disable
```

```
$ chinchay new tea --middleware api --frontend disable
```

These will create models, controllers, views, routes and knex migrations in the directories defined in .chainfile.js. We shall use this to work with both coffees and teas.


The migrations will be saved in the directory `database/migrations/`. The name will vary, as it takes the current date and time to make the file, The file that has `coffee.js` appended add the following:

```javascript
exports.up = function (knex) {
  return knex.schema.createTable('coffee', (table) => {
    // Incremental id
    table.increments();
    table.string('name').notNullable();
    table.integer('price');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('coffee');
};
```

This piece of code will create a relation called coffee within our database with the variables name and price. Also will generate an id and a created_at and updated_at timestamps for every entry. To run this migration:


We will do the sale with the file that ends in `tea.js`:
```javascript
exports.up = function (knex) {
  return knex.schema.createTable('tea', (table) => {
    // Incremental id
    table.increments();
    table.string('name').notNullable();
    table.integer('price');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tea');
};
```


Now we can run these migrations:

```
$ knex migrate:latest
```
<br/>

Last but not least, in the app.js file, replace these lines:

```javascript
app.use('/', routes);
app.use('/users', users);
```

with these :

```javascript
Middleware.prerouting(app);
app.use('/', routes);

const teaAPI = require('./routes/teaAPI');
const coffeeAPI = require('./routes/coffeeAPI');
app.use('/', teaAPI);
app.use('/', coffeeAPI);

Middleware.postrouting(app);

```
These lines tell the app to use the generated API. Note that we must require the `Middleware` at the beginning of the `app.js` file:

```javascript
const { Middleware } = require('chinchay');
```

Now if we ran the app:

```
$ npm start
```

We will get an error! Why? We have not configured the middleware yet!

### Temporaring Middleware Configuration


On the [Configure the Middleware](#configuring-the-middleware) part we will dig on how to fully configure the middleware, for now let's add the following:

#### access.js

Create an `access.js` file 

```
$ touch access.js
```

and add the following:
```javascript
const UNRESTRICTED_ROLES = {};
const RESTRICTED_ROLES = {};

module.exports = {
  UNRESTRICTED_ROLES,
  RESTRICTED_ROLES,
};
```

#### thewall.js

We need to add TheWall to the project:

```
$ npm i thewall -s
```

Let's create a thewallfile that will hold all the configurations:

```
$ touch thewallfile.js
```

Fill the generate fill with:
```javascript
const path = require('path');

module.exports = {
  access: { },
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

#### chainfile.js

Last but not least add the following to the chainfile:

```javascript
  access: path.join(__dirname, 'access.js'),
  thewall: path.join(__dirname, 'thewall.js'),
```

Right after the line:

```javascript
  knex:  path.join(__dirname, 'knex.js')
```

Its time to rerun our app: 

```
$ npm start
```

Visit an API endpoint, for instance: [localhost:3000/api/coffee/find](http://localhost:3000/api/coffee/find)

We will receive a 403 Forbidden error. This is because we added the `--middleware` flag and did not provide a valid authentication. Let's create users and start requesting with a valid authentication!


## Creating the users

Let's create our users:

```
$ chinchay new users --middleware api --frontend disable
```

Replace the generated migration with the following:
```javascript
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    // Incremental id
    table.increments();
    table.string('username').notNullable();
    table.text('password');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
```
Run the migration:

```
$ knex migrate:latest
```

On the generated model, we will add the following:

```javascript
const { Table, ChinchayError } = require('chinchay');
const bcrypt = require('bcrypt-nodejs');


class Users extends Table {
  constructor() {
    const tableName = 'users';
    super(tableName);
  }

  save(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null); // encrypt password
    return super.save(user);
  }

  checkCredentials(user, password) {
    if (!user) return false;
    return bcrypt.compareSync(password, user.password);
  }

  async getUserByCredentials(username, password) {
    const result = await this.find({ username });
    const user = result[0];
    if (!this.checkCredentials(user, password)) throw new ChinchayError('username password do not match', 'wrong_credentials');
    return user;
  }
}


const instance = new Users();

module.exports = instance;

```

:::danger
  Passwords must **NEVER** be saved as plain text in the database and always should be encrypted.
:::

We added three methods. One that overwrites the `save` method by encrypting the password before saving the user. For it to work we must add the following package to encrypt:

```
  $ npm i bcrypt-nodejs -s
```

The second method is to check that some given credentials are correct. And the third, will return the user with the given username/password. If there is no user with that combination it will reject with an error. Why do we throw a ChinchayError and not a regular Error? This will allow the controller to send the correct code and message, we will talk more about this in the [Returning a 401 Code](#returning-a-401-code) section.

For adding the users routes, on the `app.js` add the following right after the `Middleware.prerouting(app)`:


```javascript
Middleware.prerouting(app);
app.use('/', routes);
const usersAPI = require('./routes/usersAPI');
app.use('/', usersAPI);
```

Let's populate our database with a user:

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username": "firstUser", "password": "firstUserpwd" }' \
  http://localhost:3000/api/users/new
```
:::tip remember
  Remember to restart the server: `npm start`
:::

BUT we see a 403 error! We need a user to create a user but to have that user we must create a user first! We are in a loophole!

To fix this, on the `usersAPI.js` file we will remove the middleware for creating users, replace:

```javascript
router.post('/api/users/new', Middleware.hasAccess, (req, res, next) => {
```

with: 

```javascript
router.post('/api/users/new', (req, res, next) => {
```

Now run again, and the user will be created! We have defeated the loophole.

:::warning
  Depending on your use case, you may want to add the Middleware back again.
:::



## Getting the token

So we have our first user created! But how do we give him an access token so that he can use the database? 

We will create a login endpoint in `usersAPI.js`:

```javascript
// DELETE

router.delete('/api/users/:id', Middleware.hasAccess, (req, res, next) => {
  usersController.delete(req, res, next);
});

// LOGIN

router.post('/api/login', (req, res, next) => {
  usersController.login(req, res, next);
});


module.exports = router;
```

On the `usersController` create the login function:


```javascript
const login = (req, res) => {
  const { username, password } = req.body;
  Users.getUserByCredentials(username, password).then((user) => {
    const accessToken = Access.generateToken(user);
    const json = httpResponse.success('Ok', 'accessToken', accessToken);
    return res.status(200).send(json);
  }).catch((error) => {
    const code = errorHandler.getHTTPCode(error);
    const message = errorHandler.getHTTPMessage(error);
    const json = httpResponse.error(message, error, code);
    return res.status(code).send(json);
  });
};

module.exports = {
  new: newElement,
  template,
  show,
  index,
  edit,
  create,
  find,
  findById,
  count,
  update,
  delete: del,
  login,
};
```

Note that we are using the `Access` to generate the token, for it to work must be required at the beginning of the file:

```javascript
const { Table, ErrorHandler, Access } = require('chinchay');
```


So if we restart the server, run again `npm start` and run the following:

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username": "firstUser", "password": "firstUserpwd" }' \
  http://localhost:3000/api/login
```

We receive our token!


### Token Encryption

:::danger
This is **VERY IMPORTANT**: The token is a jsonwebtoken encrypted by the [environment variable](https://en.wikipedia.org/wiki/Environment_variable) `JWT_SECRET`. You must define your own `JWT_SECRET` that must be kept confidential. If this variable is not defined, Chinchay will use a default secret, this will make your app prone to cyber-attacks. 
:::

### #Returning a 401 Code

So as you may have noticed, if we request the login endpoint with wrong credentials we get a 500 http code. Try it out:

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username": "firstUser", "password": "wrong password" }' \
  http://localhost:3000/api/login
```

In case you don't know, the error 500 is a "server-side" error. Meaning something has gone wrong in the server. It is usually the http way of saying "we do not know what the heck happened". Not truly the case though right? The problem is that the client (us) provided the wrong username/password combination. So how can we configure it so that this request responds with a more suitable code, such as 401 Unauthorized?

#### ErrorHandler

  Enter the.... ErrorHandler! The ErrorHandler is the one responsible for deciding the code to respond and an auxiliary message. It works hand by hand with the ChinchayError to map each error to a given code and message.

  So if we look at the users model we can see the following: 


```javascript
  async getUserByCredentials(username, password) {
    const result = await this.find({ username });
    const user = result[0];
    if (!this.checkCredentials(user, password)) throw new ChinchayError('username password do not match', 'wrong_credentials');
    return user;
  }
```

We see that we threw here a Chinchay Error. The second parameter is the identifier we want to provide to this error. In this case 'wrong_credentials'. So we need to tell the Error Handler that when it receives an Error with this identifier it should return a 401 code. 

So we will add the following to the controller: 

```javascript

const Users = require('../models/users');

const ERROR_TRANSLATE = {
  wrong_credentials: { code: 401, message: 'The combination username/password provided do not exist' },
};

const errorHandler = new ErrorHandler(ERROR_TRANSLATE);

const viewPath = '../views/users';
```

Here we are indicating that the error 'wrong_credentials' should be mapped to the code 401. Go ahead and try it out!


## Configuring TheWall

  So now we have our token! So far so good. Next step is to configure TheWall. Defining which user can access which data.

### roles

  With TheWall you will assign roles to each user. One user can have many roles. Each role will give him access to certain data. On this tutorial we will have the following roles:

  * admin: This will have access to everything. is kind of a superuser.
  * coffeeAdmin: Access to everything coffee related, can create, read, edit and delete coffees.
  * teaAdmin: Access to everything tea related, can create, read, edit and delete teas.
  * teaDrinker: Access to a specific tea (the one it's drinking). It can only read it. It cannot add, edit or delete teas.
  * coffeeDrinker: Access to a specific coffee (the one it's drinking). It can only read it. It cannot add, edit nor coffee teas.

:::tip
  I always recommend creating an admin role that has access to everything. 
:::

### thewallfile

  Let's replace the configuration of the `thewallfile`:

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

For more information on how to configure TheWall check [TheWall documentation](https://www.npmjs.com/package/thewall).



### add admin role

We will add an endpoint to add roles to users. On the `usersAPI.js` we add the endpoint:

```javascript
// LOGIN

router.post('/api/login', (req, res, next) => {
  usersController.login(req, res, next);
});

// ACCESS

router.post('/api/users/:id/add/access', (req, res, next) => {
  usersController.addAccess(req, res, next);
});


module.exports = router;
```

Next in the `usersController` we add:

```javascript
const addAccess = (req, res) => {
  const { id } = req.params;
  const { role, filter } = req.body;
  TheWall.addAccess(id, role, filter).then((access) => {
    const json = httpResponse.success('Ok');
    return res.status(200).send(json);
  }).catch((error) => {
    const code = errorHandler.getHTTPCode(error);
    const message = errorHandler.getHTTPMessage(error);
    const json = httpResponse.error(message, error, code);
    return res.status(code).send(json);
  });
};


module.exports = {
  new: newElement,
  template,
  show,
  index,
  edit,
  create,
  find,
  findById,
  count,
  update,
  delete: del,
  login,
  addAccess,
};
```

Note we need to import TheWall. This is the file we created [in this step](#thewall-js). Add the following line at the beginning of the `usersController`:

```javascript
const TheWall = require('../thewall');
```

Now we run the following: 

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"role": "admin" }' \
  http://localhost:3000/api/users/1/add/access
```

Now our user with id 1 is an admin! Lastly let's add the Middleware to the route we created:

```javascript
router.post('/api/users/:id/add/access', Middleware.hasAccess, (req, res, next) => {
  usersController.addAccess(req, res, next);
});
```

ITS TIME! Let's test our API(and not get a forbidden error)!

```
curl --header "Content-Type: application/json" \
  --header "Authorization: Bearer ACCESS_TOKEN" \
  --request POST \
  --data '{"name": "latte", "price": "100" }' \
  http://localhost:3000/api/coffee/new
```

Note we added an Authorization Header, Replace `ACCESS_TOKEN` with the token received [earlier](#getting-the-token).

### populate ddbb

So we are going to use our user to create 1 more coffee and 2 teas:

```
curl --header "Content-Type: application/json" \
  --header "Authorization: Bearer ACCESS_TOKEN" \
  --request POST \
  --data '{"name": "cappuccino", "price": "100" }' \
  http://localhost:3000/api/coffee/new
```

```
curl --header "Content-Type: application/json" \
  --header "Authorization: Bearer ACCESS_TOKEN" \
  --request POST \
  --data '{"name": "black tea", "price": "10" }' \
  http://localhost:3000/api/tea/new
```

```
curl --header "Content-Type: application/json" \
  --header "Authorization: Bearer ACCESS_TOKEN" \
  --request POST \
  --data '{"name": "green tea", "price": "20" }' \
  http://localhost:3000/api/tea/new
```

### create more users

Here we are going to create users. Note that only the admin can add access to each user, so for the add/access use the access token of the admin! 

#### coffeeAdmin

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username": "User2", "password": "second" }' \
  http://localhost:3000/api/users/new
```

```
curl --header "Content-Type: application/json" \
  --header "Authorization: Bearer ACCESS_TOKEN" \
  --request POST \
  --data '{"role": "coffeeAdmin" }' \
  http://localhost:3000/api/users/2/add/access
```

#### teaAdmin

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username": "User3", "password": "password" }' \
  http://localhost:3000/api/users/new
```

```
curl --header "Content-Type: application/json" \
  --header "Authorization: Bearer ACCESS_TOKEN" \
  --request POST \
  --data '{"role": "teaAdmin" }' \
  http://localhost:3000/api/users/3/add/access
```

#### coffeeDrinker

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username": "User4", "password": "password" }' \
  http://localhost:3000/api/users/new
```
This user will be drinking a latte, this is the coffee with id 1, so we define the filter as 1:
```
curl --header "Content-Type: application/json" \
  --header "Authorization: Bearer ACCESS_TOKEN" \
  --request POST \
  --data '{"role": "coffeeDrinker", "filter": 1 }' \
  http://localhost:3000/api/users/4/add/access
```

#### teaDrinker

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username": "User5", "password": "password" }' \
  http://localhost:3000/api/users/new
```
This user will be drinking a green tea, this is the tea with id 2, so we define the filter as 2:
```
curl --header "Content-Type: application/json" \
  --header "Authorization: Bearer ACCESS_TOKEN" \
  --request POST \
  --data '{"role": "teaDrinker", "filter": 2 }' \
  http://localhost:3000/api/users/5/add/access
```

### play time

So... it's play time! You can now see what user can do what. Remember to first ask the access token for each user.

  * What users can create a new coffee? 
  * What users can create a new tea? 
  * What users can access the data of the coffee latte? What about cappuccino?
  * What users can access the data of black tea? What about green tea?
  * What users can access the data of a certain user?



## Configuring Access

In your play time, did you try out: `http://localhost:300/api/coffee/find`. Does it work correctly?

If you try to access that endpoint with a coffeeDrinker, all the coffees will be returned, where it should only return the coffees that he has access ro. TheWall filter on a per-endpoint basis, however in this case is the same endpoint, so TheWall is insufficient: Enter Chinchay's Access Module.

### roles

This module also works with roles. It has to type of roles:

  * RESTRICTED ROLES: roles that have access to a particular entry. Its accessibility is limited. For instance a coffeeDrinker only has access to certain coffees.
  * UNRESTRICTED_ROLES: roles that have complete access on a particular module or subdivision of the app. Usually used for a certain database relation. For instance a coffeeAdmin has unrestricted access to the coffees.

  ### Configuring access.js

  Let's replace the configuration of the `access.js` created [in this step](#access-js):

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

Now, we will replace the find function of the `coffeeController` for this one:


```javascript
const find = (req, res) => {
  const userAccess = req.user.access || [];
  const options = Table.extractOptions(req.query);
  const columns = Table.extractColumns(req.query);
  let search = Table.extractSearch(req.query);
  search = Access.addAccessibleToSearch(search, userAccess, 'coffee', 'id');
  Coffee.find(search, columns, options).then((results) => {
    const json = httpResponse.success('Busqueda encontrada exitosamente', 'data', results);
    for (let i = 0; i < json.data.length; i++) {
      json.data[i].links = HATEOAS.get(json.data[i]);
    }
    return res.status(200).send(json);
  }).catch((error) => {
    const code = errorHandler.getHTTPCode(error);
    const message = errorHandler.getHTTPMessage(error);
    const json = httpResponse.error(message, error, code);
    return res.status(code).send(json);
  });
};
```

Note that here we are adding to the search this access so it will filter which data should be returned. For it to work Access must be required at the beginning of the file:

```javascript
const { Table, ErrorHandler, Access } = require('chinchay');
```


## Conclusion

So that's it! We have a functional API with different roles. We learned how to work with oAuth in Chinchay, how to configure TheWall and the Chinchay Access Module. A repository with the complete code of this tutorial can be found [here](https://github.com/afontainec/tutorial-chinchay-api).

For further reading go to the [Chinchay Documentation](../docs)




  
