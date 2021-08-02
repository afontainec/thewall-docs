# TheWall Instance

TheWall instance is in charge of adding, deleting and modifying the roles associated to each user. Plus is the one who indicates if a user can or cannot access a given endpoint.


## Initialization

When the wall is required to a project the first thing it will do is create a table in the psql database called `thewall_access`. If the table is already create then no worries, it will skip this step.

We defined which endpoints are accessible to each role in [TheWall configuration file](the-file.html). In this file all the roles are listed, indicating to which endpoint each role can access. Also it provides the path to where the )[knex](https://knexjs.org/) instance to access the database is located. If you wanna now the details, go ahead and [click here](the-file.html) to read more about TheWall configuration file.

 What we recommend is to create an instance for TheWall creating a file as follows:

```javascript
const config = require('../path/to/thewallfile');

module.exports = require('thewall')(config);
```

Very simple right?

Notice, that `'../path/to/thewallfile'` should be replaced with the path where [TheWall configuration file](the-file.html) is located at.

## addAccess

By adding an access we mean assigning a role to a user.

### Parameters

  * userId: The id of the user you want to give access to.
  * role: The role you want to give to the user
  * filter: The filter of that role. This is an optional 


### Example


```javascript
TheWall.addAccess(1, 'storeEditor', 3).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
```

Here we are adding the role storeEditor with filter 3 to the user with id 1.

## deleteAccess

This method is flexible and it allows to delete one-or-many entries.

### Parameters

It receives 1 parameter: params. This is an object that can have up to 3 properties, userId, role and filter, it indicates what entries to delete. 

### Example

```javascript
TheWall.deleteAccess({
  userId: 1
}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
```

Will delete all the entries associated to the user with id 1. In otherwords, it will eliminate all the roles of user 1.

```javascript
TheWall.deleteAccess({
  role: 'storeOwner'
}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
```

Will delete all the entries associated with the role storeOwner. In otherwords, there will be no user with the role storeOwner.

```javascript
TheWall.deleteAccess({
  userId: 1,
  role: 'storeOwner'
}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
```

Will delete all the entries associated to the user with id 1 and to the role storeOwner. In otherwords, it will eliminate all the roles storeOwner of user 1.


```javascript
TheWall.deleteAccess({
  userId: 1,
  role: 'storeOwner',
  filter: 3
}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
```

Will delete all the entries indicating that the user 1 has a role of storeOwner to store 3.

## updateAccess

This method is flexible and it allows to modify one-or-many entries.

### Parameters

It receives 2 parameter: 

  1. where: This is an object that can have up to 4 properties, id, userId, role and filter, it indicates what entries to modify.
  2. newValues: This is an object that can have up to 3 properties, userId, role and filter, it indicates what need to be updated. 

### Example

```javascript
TheWall.updateAccess({
  id: 103
}, {
  role: 'changeRole'
}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
```

Will modify the entry with id=103 role to `changeRole`.


```javascript
TheWall.updateAccess({
  role: 'changeRole',
  user_id: 2
}, {
  filter: 'new-filter'
}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
```

Will set the filter to `new-filter` for every entry where the role is `changeRole` and the user_id is `2`.

## findAccess

This method allows to search for one-or-many entries.

### Parameters

It receives 1 parameter: 

  1. params: This is an object that can have up to 3 properties, userId, role and filter, it indicates what need to be search for. 

### Example

```javascript
TheWall.findAccess({
  user_id: 2
}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
```

Will return all the accesses of user with id `2`.

```javascript
TheWall.findAccess({
  role: 'storeOwner'
}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
```

Will return all the accesses where the role is `storeOwner`.

```javascript
TheWall.findAccess({}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
```

Passing an empty object will return all the accesses.

## getRoles 

This function returns a list with all the possible roles.

## hasAccess

This function indicate if the given user has access or not a given endpoint.

### Parameters

  1. userId: The id of the user you are querying for.
  2. url: The url of the endpoint.
  3. verb: The http verb of the endpoint, for example GET, POST, PUT, etc.

### Example

```javascript
TheWall.hasAccess(1, '/store/10/edit', 'POST').then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
```

This function indicates if the user with id one has access to POST to `/store/10/edit`. The variable `result` will be `true` if it has access, elsewise it will be `false`.
