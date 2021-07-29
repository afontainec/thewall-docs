## Overview: What is Chinchay?

Ufff this is a tough question.... going technical, [Chinchay](https://www.npmjs.com/package/chinchay) is a npm package that works on top of [express.js](https://expressjs.com/) (and therefore [node.js](https://nodejs.org/es/)) and connects to a [postgreSQL](https://www.postgresql.org/) database through [knex.js](http://knexjs.org/), a SQL query builder.

When building a large application order is a key factor, very easily the repository becomes a big plate of spaghetti! Basically just chaos.

### What Chinchay Aims To Solve

Chinchay aims to speed up your development without compromising code quality. In my early programming years I had these problems:


*  Organizing the files
*  Following industry best practices
*  Managing the updates to the database
*  Making a _good_ api
*  Managing user access: who can access what
*  Managing HTTP status codes are responses correctly
*  Avoid copy-pasting programming, specially for [CRUD](https://www.codecademy.com/articles/what-is-crud) operations. I was doing over and over the same operations with minimal changes. 

It was then that I decided to build a package that would allow me to tackle each of these issues. This package includes both a Command Line Interface and many tools to solve each problem.


### So what does Chinchay actually do?

* Use [Chinchay’s CLI](./docs/cli) to automate [CRUD](https://www.codecademy.com/articles/what-is-crud) (Create, Read, Update, Delete) operations. It will follow a [MVC(Model View Controller)](https://techterms.com/definition/mvc) architecture pattern. With it, I can assure you coding will not be tedious nor time consuming. Chinchay tries not to be highly-opinionated and favours flexibility, therefore is fully customizable through the [.chainfile.js](./docs/chainfile).  
* [Chinchay’s CLI](./docs/cli) will create an API following the [REST](https://restfulapi.net/) application architecture.
* If you do not use the Chinchay CLI, Chinchay does offer a [HATEOAS generator](./docs/hateoas) that can be added to your API, one step forward towards a RESTful API. 
* Chinchay provides an [ErrorHandler](./errorhandler/) to manage HTTP status codes, returning meaningful messages and codes.
* Protect your app, so that only authorized users access the data. Use Chinchay [Access Module](./middleware/access), [Chinchay’s middleware](./middleware/middleware) and Chinchay’s sister package [TheWall](https://www.npmjs.com/package/thewall) to fully control who can access what. See the [API tutorial](./gettingstarted/apiMiddleware) for a complete guide!
* Chinchay’s CLI will also create Frontend views to work with the generated API. It can either be with [ejs](https://ejs.co/) or [Angular](https://angular.io/). [Currently working in more frontend options!]
*  Chinchay allows API clients to customize their queries. With just a couple of endpoints and a very simple syntax, API clients can query what they need. Obviously this can be limited and disabled as needed. See [API: Client Querying](./docs/clientside) for more!
* Last, But definitely not least, Chinchay offers a flexible and extendable [Table Gateway Model](./models/). To organize and manage your database queries without even knowing any SQL.



## File Structure: Model-View-Controller (MVC) Architecture

For starters, let's begin with a disclaimer: I did not reinvent the wheel. Chinchay uses the state-of-the-art, in this case it was MVC Architecture. If you do not know what that is, here are a list of useful links:

*  [Techterm article](https://techterms.com/definition/mvc)
*  [Tutorialspoint definition](https://www.tutorialspoint.com/mvc_framework/mvc_framework_introduction.htm)
*  [The stackexchange forum](https://softwareengineering.stackexchange.com/questions/127624/what-is-mvc-really)
*  [The always useful Wikipedia article](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)

But in a nutshell, the code is logically separated in three areas. The model, where the logical-business code is written. They are the gateway to the database and would do most of the "important" work. The view manages all the UI logic and the controller is the interface that connects the view with the model.

The [Command Line Interface](./cli) will allow you to generate files in this pattern to keep everything organized and clean.

## Updating the Database

Chinchay works with [PostgresQL](https://www.postgresql.org/about/). This is the [database system](https://en.wikipedia.org/wiki/Database) that stores the data. As you may know the data is saved in tables. So how do we actually create or modify these tables?

### Schema Migrations

  A schema migration is a piece of code that does one change to the database. Not only has the code to effectuate that change, but also has the code to revert that change. For instance if we add the column user_id to the table coffees but then regret that decision, we can rollback that migration, removing the column user_id. Here are some articles you might find interesting:

  * [science direct article](https://www.sciencedirect.com/topics/computer-science/schema-migration)
  * [perk article about migration and knex](http://perkframework.com/v1/guides/database-migrations-knex.html)
  *  [The always useful Wikipedia article](https://en.wikipedia.org/wiki/Schema_migration)

  I guess you are asking yourself how this actually works, the answer is: knex.

#### knex

  [knex](http://knexjs.org/) is the magical tool that will manage all the migrations. Every time you need to make a change to the database you make a knex migration as follows:

  ```
  $ knex migrate:make migration_name
  ```

  That will create a code that usually goes something like this: 

  ```javascript
    exports.up = function (knex) {
      // code to make the change in the database
    };

    exports.down = function (knex) {
      // code to revert the change in the database
    };
  ```

  In the **up** function you write the code for the change and in the **down** function the code to revert the change of the **up** function.

  Then just run the following to apply the change (it will execute the up function):
  ```
  $ knex migrate:make latest
  ```
  If you want to revert it, run the following (it will execute the down function):
  ```
  $ knex migrate:make rollback
  ```

  When you use the [Chinchay Command Line Interface](./cli) to create migrations it will use this. For more information on migrating with knex go to the [documentation](http://knexjs.org/). 

### Why postgresQL and not another database system?

To be honest, just because. PostgreSQL is one of the most popular databases and it seemed like a good starting point. At the moment we are working to make Chinchay compatible with mysql and other databases, actually if you are a database expert help us out making Chinchay compatible with more databases!


## REST API

The next big thing was: how to do a _good_ api?

And the answer is a flexible RESTful API. If you do not know what a RESTful API is, I recommend reading [this article](https://restfulapi.net/). In a nutshell a RESTful API is an architectural style presented by Roy Fielding that suggests a way to model the client-server interaction.

Not every API that says it's REST actually is REST. Most of the APIs out there who declare themselves as REST APIs actually are not. REST enforces some strict protocols which are hardly ever fulfilled. Aaaand enter Chinchay, Chinchay will separate the code in a **layered system**  which is **stateless** and **cacheable**. Moreover, to make a **uniform interface** it has a fully flexible **HATEOAS generator**.

### HATEOAS

HATEOAS is one of the most distinctive features of a REST API and is hardly ever present. HATEOAS tries to mimic our real-life browsing, when we visit a page all the possible links are presented (as buttons, images, etc). HATEOAS aims to do the same, in which every API request a list of followup links are given. However, doing so it's a pain in the *** for the developer, he is responsible to, for every API request, return all the followup links. So guess what does chinchay do? Yes it will make it veeery easy to do so with it's [HATEOAS generator](./hateoas).

You can read more about [HATEOAS here](https://restfulapi.net/hateoas/).


### Client Queries

Well so we now have a RESTful API with HATEOAS, is that a _good_ api? Well, not necessarily... A _GOOD_ API is an API that is both elegant and useful. 
  * Elegant: :white_check_mark: (it's REST, so yeah it is elegant) 
  * but how do we make it useful?

For it to be useful, the client must be able to extract the information it needs through it. Chinchay provides a complete flexible interface where the client can build specific queries to consult information. The backend developer does not need to do a different API endpoint for each client need, with a few endpoints and a flexible querying interface everything is possible. Read more on how to do so [here](./clientside).

### oAuth 2.0

If by this point you are thinking, wait, the client can ask whatever he wants, so is it unsafe or how do we control him to only access what he should access? Do not worry! Chinchay has you covered!

You can easily transform your API into an oAuth 2.0 API, oAuth is an industry-standard protocol for authorization. In simple terms, you can protect so each user only access the endpoint you give him access to. 

So the whole process go like this:

  1. The user authenticates with it's credentials (usually a username and password) 
  2. If the credentials are correct an access token is generated and given to the user. This token has an expiration date.
  3. Every request the user does to the API it must provide the access token, otherwise the connecting is denied.


### So how does Chinchay make the API an oAuth 2.0 API?

[The Chinchay Middleware](./middleware) will be in charge of inspecting that the token is present, valid and that the user of that token has access to the given endpoint. The token is expected to be given as a [Bearer Token](https://stackoverflow.com/questions/25838183/what-is-the-oauth-2-0-bearer-token-exactly/25843058).

The [Access Module](./middleware#access) will be in charge of generating the access token, the token follows the [json web token standard](https://jwt.io/), by generating the token with [the jsonwebtoken npm package](https://www.npmjs.com/package/jsonwebtoken). 

To actually define which user has access to which endpoints, chinchay uses the [TheWall npm package](https://www.npmjs.com/package/thewall). In the [Middleware documentation](./middleware) you will be guided on how to work with each of these tools.

Moreover you might have one route that it's accessible by different users but the content must be different. For instance, with chinchay (running locally) the route: _http://localhost/api/coffee/find_ will return all the coffees. If we have a customer1 user and a customer2 user, we might want to use that endpoint to return all the coffees that the user has access to. So how do we filter them? With TheWall we give access to both users to that route, but with the [Access Module](./middleware#access) we can add the corresponding filter so that when the information is fetched to the database only the corresponding coffees are given.

::: tip REMINDER
  Do remember that the using oAuth is optional, you might have an API that is accessible for everyone and if that's fine with you Chinchay will be fine as well.
:::


If you have more doubts of how oAuth works, check this links:

  * [OAuth 2.0](https://oauth.net/2/)
  *  [The always useful wiki article](https://en.wikipedia.org/wiki/OAuth#:~:text=OAuth%20is%20an%20open%20standard,without%20giving%20them%20the%20passwords.&text=OAuth%20is%20a%20service%20that%20is%20complementary%20to%20and%20distinct%20from%20OpenID.)
  * [Bearer Token](https://stackoverflow.com/questions/25838183/what-is-the-oauth-2-0-bearer-token-exactly/25843058)
  * [json web token standard](https://jwt.io/introduction/)