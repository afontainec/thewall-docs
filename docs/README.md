![Chinchay](https://chinchay-docs.herokuapp.com/assets/logo.png)

### Welcome to **TheWall**

Do you want user A to have access to certain endpoints and user B to have access to another set of endpoints? How do you control who can access what?

Well, the answers is... TheWall! This simple nodejs package allows you to indicate which user can access which endpoints. Each user can have any or many roles and each role has access to a given set of endpoints, and yes you can parameterize the endpoints. 

### Wait what? how does that happen?

* It will allow you to manage the roles each user has, allowing you to add, delete and modify roles.
* It will allow you to indicate which endpoints are accesible by which role
* It will indicate if a certain user can access a particular endpoint

### Technical requirements

It does required a [psql database](https://www.postgresql.org/) to connect to, as it will create a table to handle which users has which roles. For connecting to the database it uses [knex.js](https://knexjs.org/).


### Go for it

So what are you waiting for?? Go to [How it works](../how-it-works) to understand how it works or the [getting started section](./gettingstarted/) to begin your journey with TheWall!
