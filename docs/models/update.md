## Overview

 The `update` method. This is an asynchronous method that will update/edit entries of the database. It will return an array of javascript objects, where each javascript object represents an entry of the database that was edited. 
 

 ### Parameters

  * Search: Javascript object with the criteria to define what should be updated.
  * newValues: Javascript object indicating which columns must be updated.
  * Options: A javascript object for more configurations, such as sorting, grouping, etc.

  In this tutorial we are going to see several examples. However for a fully detailed description of how the search and option parameters work, check the [find documentation](./find).

### Return value

An array of javascript objects, where each javascript object represents an entry of the database that has been edited. An example could be:

  ```javascript
   [{
      "id": 1,
      "name": "this is an updated name",
      "price": 100,
      "created_at": "2018-11-21T11:54:42.840Z",
      "updated_at": "2018-11-21T11:54:42.840Z",
    }, {
      "id": 2,
      "name": "this is the name",
      "price": null,
      "created_at": "2018-11-21T11:57:02.767Z",
      "updated_at": "2018-11-21T11:57:02.767Z",
    }, {
      "id": 3,
      "name": "other",
      "price": 100,
      "created_at": "2018-11-21T12:06:04.065Z",
      "updated_at": "2018-11-21T12:06:04.065Z",
    }, {
      "id": 4,
      "name": "expensive",
      "price": 110,
      "created_at": "2018-11-21T12:06:22.400Z",
      "updated_at": "2018-11-21T12:06:22.400Z" }],
  ```


  There is one exception. If the search parameter is not given as a javascript object, it will assume you are [updating by id](#updateById). In this case the return value will be a javascript object representing the entry to the database with the given id. An example:

  ```javascript
  Coffee.update(1, { name: "this is an updated name" });
  ```

  Will return:

  ```javascript
    {
      "id": 1,
      "name": "this is an updated name",
      "price": 100,
      "created_at": "2018-11-21T11:54:42.840Z",
      "updated_at": "2018-11-21T11:54:42.840Z",
    }
  ```

## update

So let's get into it. The `newValues` parameter is a javascript option where every `key` will be defined with it's `value`. Let look at some examples:

```javascript
  Coffee.update({ id: 1 }, { price: 100 });
```

This will set the price to 100 of all the entries where id = 1. Will return an array with all the updated entries. In this case it will be an array of length 1.

```javascript
  Coffee.update({ id: ['in', [1, 2]] }, { price: 100 });
```

This will set the price to 100 of all the entries where id = 1 or id = 2. Will return an array with all the updated entries.

```javascript
  Coffee.update({}, { price: 100 });
```

This will set the price to 100 of all the entries. Will return an array with all the updated entries.


:::tip
  There is a lot you can do with the search, (first parameter). Look at the [find documentation](./find) to learn how to work with it. 
:::


### options

You can also use the options variable. Look at some examples:

```javascript
  Coffee.update({ }, { price: 100 }, { rawWhere: ['name = ? or price < 100', 'expensive'] });
```

This will set the price to 100 of all the entries where either the name is 'expensive' or the price is less than 100. Will return an array with all the updated entries.

```javascript
  Coffee.update({ name: 'latte' }, { price: 100 }, { startDate: '2020-01-01'}),
```

This will set the price to 100 of all the entries where the name is 'latte' and it was created after January First 2020. Will return an array with all the updated entries.


:::tip
  There is a lot you can do with the options (third parameter). Look at the [find documentation](./find) to learn how to work with it. 
:::


## updateById

What if we want to edit just one entry? the method `updateById` will only update the entry for the given id. Let's look at an example: 


```javascript
  Coffee.updateById(1, { price: 100 });
```

This will set the price to 100 of the entry with id = 1.

THis method will not return an array (as the previous examples) but will return a Javascript Object representing the entry with id = 1.

Note, that if the first parameter calling the `update` method is not an object, it will be equivalent to `updateById`. Therefore the latter example is equivalent to: 

```javascript
  Coffee.update(1, { price: 100 });
```

This will also return just a single entry and not an array of entries. 

## what cannot be set

There are some parameters that Chinchay will not let you change. These are the following:

  * created_at
  * updated_at
  * id


