## Overview

Next in line, we will see about the `find` method. This is an asynchronous method that returns an array of javascript objects, where each javascript object represents an entry of the database that meets with the parameters requested. This is one of the most flexible and powerful tool. With no more overdues, let's get to it.


### Parameters

  * Search: Javascript object with the definition of what should be searched.
  * Columns: An array with the columns that should be return. If it's null or 'all' will return all the columns.
  * Options: A javascript object for more configurations, such as sorting, grouping, etc.

### Return value

An array of javascript objects, where each javascript object represents an entry of the database that meets with the parameters requested. An example could be:

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



## Simple Queries

The first parameter of the `find` method is the `search`: a javascript object where you define what you want to search for. Let's see some examples:

```javascript
  Coffee.find({ price: 100 });
```

This will return all the coffees of price = 100.

```javascript
  Coffee.find({ price: 100, name: 'latte' });
```

This will return all the coffees of price = 100 and name = 'latte'.


```javascript
  Coffee.find();
```

If no search is defined, it will return all the entries. The same behaviour will occur if an empty search is provided: 

```javascript
  Coffee.find({});
```

## Queries for Masters

Simple queries are very powerful but not always meet what we are expecting. Let see more sophisticated examples:

```javascript
  Coffee.find({ price: ['>', 100] });
```

This will return all the coffees where the price is greater than 100.

```javascript
  Coffee.find({ price: ['<>', 100], name: 'latte' });
```

This will return all the coffees where the price is distinct to 100 and the name is 'latte'.

```javascript
  Coffee.find({ price: ['in', [100, 90]]});
```

 This is one of my favorites, in this case it will return all the entries where the price is either 90 or 100. 

### General Rule

 As a general rule, you can define the property of the `search` as an array with two values, key=["command",value]. The query will translate to SQL as follows `WHERE  key command value`.


 ## Queries for and/or

 If you need to do `and` `or` operations you can do as follows:

```javascript
  Coffee.find({ price: [100, 'or', 200] });
```

This will return all the coffees where the price is 100 or 200.

```javascript
  Coffee.find({ price: [['>', 100], 'and', ['<', 200]] });
```

This will return all the coffees where the price is between 100 and 200.

### General Rule

 As a general rule, you can define the property of the `search` as an array with three values, key=[firstSearch, command,secondSearch]. Where the firstSearch and the secondSearch follows the same logic as the previous examples and the command must be and/or.


## columns

Sometimes the entries have way too much information and you only desire to access some few attributes of each entry, or there is sensible information you do not want to expose. In this case the second parameter can be used: the `columns`. Let's look at some examples:

```javascript
  Coffee.find({ price: 100 });
```

By default it will return the complete object with all the columns.


```javascript
  Coffee.find({ price: 100 }, 'all');
```

It will return the complete object with all the columns, this is the default configuration.

```javascript
  Coffee.find({ price: 100 }, ['id', 'name']);
```

If it is defined as an array, will return only the columns defined in the array. In this case, only the id and name of every entry where it's price is 100.

```javascript
  Coffee.find({ price: 100 }, ['id as identifier']);
```

In this case it will return the ids of all the entries where the price is 100. However, instead of calling it id it will call it `identifier`.



## startDate and endDate

Let's assume you want to access all the coffees that were created before 2020? We could do it as follows:

```javascript
  Coffee.find({ created_at: ['<', '2020-01-01 00:00:00.000']);
```

And that's totally fine, however this can also be achieved using the third parameter: `options`. The `startDate` and `endDate` can be defined to return values created at a certain interval.

 ```javascript
   Coffee.find({}, 'all', { startDate:'2018-11-21T11:55:00.000Z' });
 ```
 
 In this case it will return all the entries where the created_at is after the given startDate, in this case, after 2018-11-21T11:55:00.000Z.

  ```javascript
   Coffee.find({}, 'all', { endDate:'2018-11-21T12:00:00.000Z' });
 ```
 
 In this case it will return all the entries where the created_at is after the given startDate, in this case, before 2018-11-21T12:00:00.000Z..

  ```javascript
   Coffee.find({}, 'all', { endDate:'2018-11-21T12:00:00.000Z', startDate: '2018-11-21T11:55:00.000Z&' });
 ```
 
 In this case it will return all the entries where the created_at is in between the given startDate and endDate, in this case, between 2018-11-21T11:55:00.000Z and 2018-11-21T12:00:00.000Z.
 


## distinct

The `distinct` option can be passed to select a distinct column, it will overwrite the columns attribute. For example:  


```javascript
  Coffee.find({ }, 'all', { distinct: 'price' });
```

It will return all the distinct prices.




## Order by, limit and offset

With the options, you can sort and limit your responses. Let see some examples: 

```javascript
   Coffee.find({}, 'all', { orderBy:'id', limit: '2' });
```
 
In this case it will return the first two entries ordered by id in ascending order.

```javascript
   Coffee.find({}, 'all', { orderBy:['id', 'desc'], limit: '2' });
```
 
 In this case it will return the first two entries ordered by id in descending order. 

```javascript
   Coffee.find({}, 'all', { orderBy:['id', 'asc'], limit: '2', offset: 1 });
```

 In this case it will return the second and third entries ordered by id in ascending order. It skips the first one because of the offset given. 


 ```javascript
   Coffee.find({}, 'all', { orderBy: [["price","desc"],["id", "asc"]] });
```
 
 In this case it will return the entries ordered by price in a descending order. In case that some entries have the same price, then they will be ordered by id in ascending order.

## rawSelect and RawWhere

  Now this is getting advanced, this is intended for people who know SQL. Sometimes we have craaazy ideas and we need even more sophisticated queries. In the options we can pass a `rawSelect` and a `rawWhere` property. 

  ### rawSelect

  RawSelect allows you to be even more specific on what you want to ask for. It can be given as a string or an array for sql injection. For instance:

  ```javascript
   Coffee.find({}, 'all', { rawSelect: 'EXTRACT(MONTH FROM created_at) as month'});
  ```
  Here we are using the rawSelect to use the psql function extract to return the month of creation. Note this will also return all the other attributes. To return only the months, run: 

  ```javascript
   Coffee.find({}, [], { rawSelect: 'EXTRACT(MONTH FROM created_at) as month'});
  ```

  Alternative this can also be achieved by passing a `clearSelect`. If the clearSelect is defined as `true` the columns parameter is ignored and only the `rawSelect` is taken into account: 

  ```javascript
   Coffee.find({}, 'all', { rawSelect: 'EXTRACT(MONTH FROM created_at) as month', clearSelect: true });
  ```

  #### SQL Injection

  :::danger
  Be very careful with this as it can be used as [sql injection](https://www.acunetix.com/websitesecurity/sql-injection/). As Uncle Ben once said, _with great power comes great responsability_. 
  :::

  [Sql injection](https://www.acunetix.com/websitesecurity/sql-injection/) is one of the most typical and dangerous attacks a website can receive, so it is important to be extremely careful about it. If you do not know what it is, this meme should explain it:

  ![SQL INJECTION](https://chinchay-docs.herokuapp.com/assets/sql-injections.png)


  To prevent sql injections you can define the rawSelect as an array. An example: 

  ```javascript
   Coffee.find({}, 'all', { clearSelect: true, rawSelect: ['EXTRACT(MONTH FROM ??) as month', ['created_at']] });

  ```
  In this case the `created_at` is indicated as `??` and passed in a second parameter.

  :::warning
  If by any chance a user input will be used to create the `rawSelect`, the `rawSelect` **MUST** be in array form and the user input passed as the second value of that array.
  :::

  ### rawWhere

  RawWhere allows you to be even more specific on how you want to filter your results, sometimes we just do weird queries. It can be given as a string or an array for sql injection. Let's look at some examples:

   ```javascript
   Coffee.find({}, 'all', { rawWhere: "name = 'expensive' or price = 100 "});
  ```

  If you want to fetch all the coffees where they are either named expensive or priced at 100, the previous rawWhere will allow you to do so.

  #### SQL Injection

  I know I said this like 2 paragraphs before, but yeah it is so important that I am going to say it again!

  :::danger
  Be very careful with this as it can be used as [sql injection](https://www.acunetix.com/websitesecurity/sql-injection/). As Uncle Ben once said, _with great power comes great responsability_. 
  :::

  [Sql injection](https://www.acunetix.com/websitesecurity/sql-injection/) is one of the most typical and dangerous attacks a website can receive, so it is important to be extremely careful about it. If you do not know what it is, this meme should explain it:

  ![SQL INJECTION](https://chinchay-docs.herokuapp.com/assets/sql-injections.png)


  To prevent sql injections you can define the rawSelect as an array. An example: 

  ```javascript
   Coffee.find({}, 'all', { rawWhere: ["name = ? or price = ? ", ["expensive", 100]] });

  ```
  In this case `expensive` and `100` are indicated as `?` and passed in a second parameter.

  :::warning
  If by any chance a user input will be used to create the `rawWhere`, the `rawWhere` **MUST** be in array form and the user input passed as the second value of that array.
  :::


  

## Group By

So with the `rawSelect` a whole world opens. Let assume we want to count how many coffees are of each price: 

```javascript
  Coffee.find({}, [], {groupBy: 'price', rawSelect: 'count(*) as amount' });
```

That query will return the amount of coffees at each price. For this previous example it might be easier to go with the [count method](./count), however it is a good example to show how powerful this can be.

## Return as Query

Last but definitely not least: `returnAsQuery`. If this parameter is defined as `true`, it will return a knex query object. With it you can use all of knex options to build even more sophisticated queries. Let's look at an example:

```javascript
  const query = Coffee.find({}, [], { returnAsQuery: true });
  query.join('tea', 'coffee.id', '=', 'tea.id');
```

This way we can cross the tea table with the coffee relation. This is very powerful and can allow you to do many things!

:::tip DEBUGGING TIP
  For debugging, set `{ returnAsQuery: true }` and then do `console.log(query.toString())` and you will be able to see the psql command. 
:::


## FindById

This a _shortcut method_. The following are equivalent:


```javascript
const result = await Coffee.findById(1);
```

```javascript
const [result] = await Coffee.find({id:1});
```

Note that the method find returns an array where the method findById returns a javascript object. The columns and options parameters can also be passed, all that applied for the `find` method also can be used in the `findById` method. 


## all

Will bring all the entries. The following are equivalent:

```javascript
const result = await Coffee.all();
```

```javascript
const  result = await Coffee.find({});
```

The columns and options parameters can also be passed, all that applied for the `find` method also can be used in the `all` method. 

## findIdIn

This will return all the entries which id is in the array given in the first parameter. As following are the same:

```javascript
const result = await Coffee.findIdIn([1,2,3]);
```

```javascript
const  result = await Coffee.find({id: ['in', [1,2,3]]});
```

After the array, it can receive a column, search and options parameters. (in that order!). all that applied for the `find` method also can be used in the `findIdIn` method. 

## findIn

The previous, can be extrapolated to not only id. Let's assume we want to find all those entries where the price is either 12 y 13.

```javascript
const result = await Coffee.findIn('price', [12, 13]);
```
 
 This is equivalent to:

```javascript
const  result = await Coffee.find({price: ['in', [12, 13]]});
```

After the array, it can receive a search, columns and options parameters. (in that order!). All that applied for the `find` method also can be used in the `findIn` method. 

## arrayOfIds

If you want to get all of the ids of the entries that match a particular search, the arrayOfIds method can be very handy. The following are equivalent:

```javascript
const result = await Coffee.arrayOfIds({'price': 12});
```
 

```javascript
const temp = await Coffee.find({'price': 12});
const result = Object.values(temp);
```

After the array, it can receive a search and options parameters. All that applied for the `find` method also can be used in the `findIn` method. 



