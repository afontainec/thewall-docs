## Overview

Chinchay offers a command line to help you get started. It will auto-generate the files you need to develop. So go ahead at take a look:

## The magical new command

Most of Chinchay's magic happens with a simple: 

```
$ chinchay new relation
```

This simple, but yet powerful, command will create all that is needed to create, read, update and delete entries to the _relation_. The keyword _relation_ corresponds to what are you building, for instance in the [getting started tutorial](../gettingstarted) they are creating coffees therefore the command was:

```
$ chinchay new coffee
```

## Chinchay Configurations: Chainfile

All of the configurations needed will be in a file called .chainfile.js on the base of the repository. So before we go on we will explain the minimum chainfile needed for the new command to operate. For more information on the chainfile, visit the [chainfile documentation](./chainfile)

### The minimal chainfile

The minimal chainfile needed by Chinchay is one that indicates where the [knex](http://knexjs.org/) instance is. So it should look something like this: 

```javascript
const path = require('path');

module.exports = {
  knex:  path.join(__dirname, 'knex.js')
};
```

Where the knex.js file exports the knex instance. Check the [Getting started tutorial](../gettingstarted/ejs.html#connecting-to-the-database), there you can see an example of a knex.js file. 


## What is created?

So now that we have our minimal chainfile, what is actually being created? It will create a knex migration, a model, a controller, views, and some routes. 

::: tip DISCLAIMER
  Depending on how the chainfile is defined, the files created might vary.
:::

### Knex migration

Well everything starts with the database. So a migration to add the new table is created. If by this point you're a thinking database, table, knex, migration? WTF are those? don't worry check the explanation [here](./overview.html#updating-the-database). 

The migration should look like something like this:

```javascript
exports.up = function (knex) {
  return knex.schema.createTable('coffee', (table) => {
    // Incremental id
    table.increments();
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('coffee');
};
```

Let's explain every bit, we are creating a table called coffee, in this case the relation was named coffee, if we would have run `chinchay new tea` the table would have been called tea. the `table.increments()` add an id column that will auto-increment and `table.timestamps()` adds a created_at and updated_at columns. So far the table is something like this:

| Column  | Type  |  Collation | Nullable  | Default  |
|---|---|---|---|---|
| id  | integer  |   | not null  | nextval('coffee_id_seq'::regclass)  |
| created_at  | timestamp with time zone  |   |   |   |
| updated_at  | timestamp with time zone  |   |   |   |

So you must edit this file to add the columns you desire:

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

For a complete guide on how to add columns visit the [knex documentation](http://knexjs.org/#Schema-createTable). Don't forget to run:

```
$ knex migrate:latest
```

For the migration to be taken into account!

#### Where it's created and why there?

On the chainfile we defined where the knex instance is. The knex will have its own configuration on where it should create the migration. So it's up to knex to decide where the file is created!

::: tip
  1. For the knex configuration we recommend having a [knexfile](http://knexjs.org/#knexfile), it's cleaner and more elegant!
  2. I usually have a db directory in the root, where all the database thingies are.
:::

### The Model

The model is the one responsible for interacting with the table created by the knex migration. It is very simple and it should look like this:

```javascript
const { Table } = require('chinchay');


class Coffee extends Table {
  constructor() {
    const tableName = 'coffee';
    super(tableName);
  }
}


const instance = new Coffee();


module.exports = instance;

```

As you may notice this is a [singleton](https://www.dofactory.com/javascript/design-patterns/singleton?s=40) (there will only be one instance of the Coffee class). This class extends the Table class from Chinchay, which has all the basic methods you need to get started. But if you need more, feel free to add more methods to the Coffee class. For more information on this, [click here](./model).

::: warning
  The tableName must match with the table created in the migration!
:::

#### Where it's created and why there?

By default the file will be created in a model directory in the root of the repository. This is customizable by adding a model configuration to the chainfile as follows: 

```javascript
const path = require('path');

module.exports = {
  models: {
    directory: path.join(__dirname, 'server', 'models'),
  },
  knex:  path.join(__dirname, 'knex.js')
};
```

### The Controller

  The next file created is the controller. This will control both the API and the view routes. For the view routes it's quite simple, it will fetch, through the model, the needed data and render the ejs file. Things get more interesting with the API routes. 

  A good function to analyze how the Chinchay controller adds value is the find function, so let's look at it first:
  ```javascript
    const find = (req, res) => {
      const options = Table.extractOptions(req.query);
      const columns = Table.extractColumns(req.query);
      const query = Table.extractQuery(req.query);
      Coffee.find(query, columns, options).then((results) => {
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

  #### Client Queries

  So it starts by extracting the options, columns and query from the query, what is that? Chinchay offers a flexible API where the client can query and decide what it really wants. You can do stuff like this:

  * `localhost:3000/api/coffee?`  Will return all the coffees
  * `localhost:3000/api/coffee?price=100` Will return all the coffees where the price = 100
  * `localhost:3000/api/coffee?price=100&columns=name` Will return only the names of all the coffees where the price = 100
  * `localhost:3000/api/coffee?price=100&columns=["id","name"]&orderBy=id` Will return the names and ids of all the coffees where the price = 100, ordered by id.

  There are tons of more things that can be done! Check the  [client side documentation](./clientside). Also if you are interested in knowing what is the difference between query, columns and options check the [model documentation](./model).

  #### HATEOAS


  Then the model goes and finds all the data, filtering and sorting according to what was determined in the options, columns and query. If it's successful we can see how HATEOAS is added to the property links of every element. If we look at the beginning of the API functions we will see that a HateoasGenerator is initialized. Here all the links that the HATEOAS should have are added. It comes with some default values, if you need to add more, edit or delete just go ahead. The default configuration will add a link as follows:

  ```javascript
  {
    "message": "Busqueda encontrada exitosamente",
    "data": [{
        "id": 2,
        "created_at": "2018-11-21T11:57:02.767Z",
        "links": [{ "rel": "self", "href": "/api/coffee/2", "type": "GET"},
          { "rel": "edit", "href": "/api/coffee/2/edit", "type": "POST"},
          { "rel": "delete", "href": "/api/coffee/2/delete", "type": "DELETE"},
          { "rel": "new", "href": "/api/coffee/new", "type": "POST"},
          { "rel": "all", "href": "/api/coffee/find", "type": "GET"},
          { "rel": "count", "href": "/api/coffee/count", "type": "GET"}],
      }],
  }
  ```

  For more information on this, see the [HateoasGenerator documentation](./hateoas).

  #### Error handler

  But what happens when the the model throws an error and goes to the catch block? For instance, maybe we are trying to filter by a non existing column? Enters the [ErrorHandler](./errorhandler). For many years this troubled me greatly. Should I return a 500 error or a 400? what should be the message to show in the frontend? To tackle this, the ErrorHandlers maps backend errors to a human-readable message and a http code. The ErrorHandler comes with some translations predefined but you can override them, add more, etc. For more information, check the [ErrorHandler Documentation](./errorhandler).


#### Where it's created and why there?

By default the file will be created in a controller directory in the root of the repository. This is customizable by adding a controller configuration to the chainfile as follows: 

```javascript
const path = require('path');

module.exports = {
  controllers: {
    directory: path.join(__dirname, 'server', 'controllers'),
  },
  knex:  path.join(__dirname, 'knex.js')
};
```


### The Router

Two routing files will be created. The first one for rendering ejs files and the other for the API endpoints. If the app is configured for angular, a file will be generated to work with the angular router. They will be generated in the routes folder, however you can customize this by adding the following to the chainfile:

```javascript
const path = require('path');

module.exports = {
  routes: {
    directory: path.join(__dirname, 'server', 'routes'),
  },
  knex:  path.join(__dirname, 'knex.js')
};
```

::: tip IMPORTANT!!!
  This must be added manually to the express router. Check the [Getting Started tutorial](../gettingstarted/ejs.html#using-chinchay) and/or the [Chinchay + Angular tutorial](../gettingstarted/angular) to see how they can be added.
:::


### The views

Last but not least, a bunch of view files are created. This varies deeply if Chinchay is configured for ejs or angular. However, in any case the following will be generated:

  * An index which lists all the entries. This will have buttons to edit, delete and view each entry. Also a button to create a new entry.
  * A view of the entry where you can see the properties of a given entry. Buttons to edit, delete and go to the index will be provided.
  * An editing page, where the properties of a given entry can be edited.
  * An create page, where a new entry can be created.
  * A way to connect to the backend API (for instance an Angular service)

 This might vary depending on the frontend configuration. We strongly recommend you check the [Getting Started tutorial](../gettingstarted/ejs.html#using-chinchay) and/or the [Chinchay + Angular tutorial](../gettingstarted/angular) to get a grasp on how to work with these files.

## frontend and backend

Are you developing an API without frontend? Or is the API already created and you are just building an angular app? Well here we will explain to you two flags that can be used when running the new command.

### frontend flag

This can be either `ejs`, `angular` or `disable`. So if you ran:

```
$ chinchay new coffee --frontend angular
```

The views generated will correspond to angular components, services and routes for the Angular router. If the flag is defined with `ejs` equivalent files will be created.

If you are building an API with no frontend, you may disable it creating zero view files:

```
$ chinchay new coffee --frontend disable
```

By default it's set to `ejs`.


### backend flag

This can be either `enable` or `disable`. So if you ran:

```
$ chinchay new coffee --backend disable
```

The model, controller and corresponding routes will be omitted.

By default it's enabled.

### Adding it to the chainfile

Having to pass the flag everytime can be exhausting... that's why you might add it to the chainfile to make life easier:

```javascript
const path = require('path');

module.exports = {
  frontend: 'angular',
  backend: 'disable',
  knex:  path.join(__dirname, 'knex.js')
};
```

::: warning
  If it is both defined in the chainfile and passed as a flag, Chinchay will use the flag configuration over the chainfile configuration.
:::


## the middleware flag

If you are developing a top secret app, and you need to protect your routes so they are publicly accessible you can add the middleware flag to protect your routes. The possible values are `api`, `frontend`, `enable` and `disable`. So if I ran the following command: 

```
$ chinchay new coffee --middleware api
```

Users accessing the api routes will have to show a valid token to pass. Whereas the ejs files are publicly accessible. If the command is ran with `--middleware frontend` it's the other way around. As I guess you already figure it out, if the flag is defined and disable, all routes are public (this is the default configuration) and if it's enable all the routes are protected.  Check the [Middleware documentation](./middleware) to see how to work around with it.

::: danger
  VERY IMPORTANT: if you are protecting your routes you **must** provide a secret for the middleware by defining the JWT_SECRET environment variable.
:::

This configuration can also be added to the chainfile:

```javascript
const path = require('path');

module.exports = {
  middleware: 'api',
  knex:  path.join(__dirname, 'knex.js')
};
```
::: warning
  If it is both defined in the chainfile and passed as a flag, Chinchay will use the flag configuration over the chainfile configuration.
:::



## Do I prefer :camel:camels or :snake:snakes?  

Always a moot point... I usually go for camelCase except for databases and json properties. And well kebabs for files. However, Chinchay doesn't care. It will be able to process all of this:

```
$ chinchay new tea_cup
$ chinchay new teaCup
$ chinchay new TeaCup
$ chinchay new tea-cup
$ chinchay new TEA-CUP
$ chinchay new TEA_CUP
```