## Overview

 The `delete` method. This is an asynchronous method that will delete entries of the database. It will return an array of javascript objects, where each javascript object represents an entry of the database that was removed. 
 

 ### Parameters

  * Search: Javascript object with the criteria to define what should be deleted.
  * Options: A javascript object for more configurations, such as sorting, grouping, etc.

  In this tutorial we are going to see several examples. However for a fully detailed description of how the search and option parameters work, check the [find documentation](./find).

### Return value

An array of javascript objects, where each javascript object represents an entry of the database that has been removed. An example could be:

  ```javascript
   [{
      "id": 1,
      "name": "latte",
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


  There is one exception. If the search parameter is not given as a javascript object, it will assume you are [deleting by id](#deleteById). In this case the return value will be a javascript object representing the entry to the database with the given id. An example:

  ```javascript
  Coffee.delete(1);
  ```
  Will return

  ```javascript
    {
      "id": 1,
      "name": "latte",
      "price": 100,
      "created_at": "2018-11-21T11:54:42.840Z",
      "updated_at": "2018-11-21T11:54:42.840Z",
    }
  ```

## delete

So let's get into it, here are some examples on how to define what should be deleted:

:::warning
  This is an irreversible action. Once deleted it can not be undone.
:::

```javascript
  Coffee.delete({ id: 1 });
```

This will delete all the entries where id = 1. Will return an array with all the removed entries. In this case it will be an array of length 1.

```javascript
  Coffee.delete({ id: ['in', [1, 2]] });
```

This will delete all the entries where id = 1 or id = 2. Will return an array with all the removed entries. In this case it will be an array of length 2.

```javascript
  Coffee.delete({});
```

This will delete all the entries. Will return an array with all the removed entries.


:::tip
  There is a lot you can do with the search, (first parameter). Look at the [find documentation](./find) to learn how to work with it. 
:::


### options

You can also use the options variable. Look at some examples:

```javascript
  Coffee.delete({ }, { rawWhere: ['name = ? or price < 100', 'expensive'] });
```

This will delete all the entries where either the name is 'expensive' or the price is less than 100. Will return an array with all the deleted entries.

```javascript
  Coffee.delete({ name: 'latte' }, { startDate: '2020-01-01'}),
```

This will delete all the entries where the name is 'latte' and it was created after January First 2020. Will return an array with all the removed entries.


:::tip
  There is a lot you can do with the options (third parameter). Look at the [find documentation](./find) to learn how to work with it. 
:::


## deleteById

What if we want to remove just one entry? the method `deleteById` will only delete the entry for the given id. Let's look at an example: 


```javascript
  Coffee.deleteById(1);
```

This will only delete the entry with id = 1.

THis method will not return an array (as the previous examples) but will return a Javascript Object representing the entry with id = 1.

Note, that if the first parameter calling the `delete` method is not an object, it will be equivalent to `deleteById`. Therefore the latter example is equivalent to: 

```javascript
  Coffee.delete(1);
```

This will also return just a single entry and not an array of entries. 

