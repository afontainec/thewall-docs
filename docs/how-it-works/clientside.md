## Overview

In this section you are going to learn how to work with the API from a client side. How can you access data, order it and filter it. This Section assumes a running Chinchay API on `http://localhost:3000`. We will be using the one generated in the [Getting Started Tutorial](../gettingstarted/ejs).


:::tip NOTE
  For all the following examples, you must change the `http://localhost:3000` for the domain of your API. Also change the `coffee` to the name of your relation. 

:::



## Create

 ### Endpoint

 ```
 POST http://localhost:3000/coffee/new
 ```


### Description

 Receives a JSON object and, in the database, inserts an entry with values defined in the JSON. It will return whether it was successful or not, and the saved entry.

### Example

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"this is the name","price":100}' \
  http://localhost:3000/api/coffee/new
```

### Response

```javascript
{
  "message": "Elemento guardado exitosamente",
  "data": {
    "id": 1,
    "name": "this is the name",
    "price": 100,
    "created_at": "2018-11-21T11:54:42.840Z",
    "updated_at": "2018-11-21T11:54:42.840Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/1", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/1/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/1/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }
    ],
  }
}
```


## Update

 ### Endpoint

 ```
 PUT http://localhost:3000/coffee/:id/edit
 POST http://localhost:3000/coffee/:id/edit
 PATCH http://localhost:3000/coffee/:id/edit
 ```

 ### Description

This URL can be called either with PUT, PATCH or POST. It receives a JSON object and, in the database, updates the values defined in the JSON for the entry with id = :id. It will respond if it was successful and the updated entry. 

:::tip
The [RESTful API](https://restfulapi.net/http-methods/) recommends the PUT verb for edits/updates, so we recommend you to prefer that verb.
:::

 ### Example

 ```
  curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"name":"this is the updated name" }' \
    http://localhost:3000/api/coffee/1/edit
```

 ### Response

 ```javascript
{
  "message": "Elemento actualizado exitosamente",
  "data": {
    "id": 1,
    "name": "this is an updated name",
    "price": 100,
    "created_at": "2018-11-21T11:57:02.767Z",
    "updated_at": "2018-12-12T11:52:32.750Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/1", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/1/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/1/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
  }
}
```

Note that only the name was changed and the price was left intact, as the `data` did not provide a new price.


## Delete

 ### Endpoint

 ```
 DELETE http://localhost:3000/coffee/:id
 ```

 ### Description

This URL deletes the entry with id = :id. Be very careful with this endpoint as it is irreversible.


:::tip
  Rather than eliminating the entry you can add an "archived" column to the table. Where if an entry has `archived=true` it means it is "deleted". So if you screw up and delete something you can get it back (by setting `archived=false`).
:::

 ### Example

 ```
curl --request DELETE \
  http://localhost:3000/api/coffee/1
```

 ### Response

 ```javascript
{
  "message": "Elemento eliminado exitosamente",
  "data": {
    "id": 1,
    "name": "this is an updated name",
    "price": 100,
    "created_at": "2018-11-21T11:57:02.767Z",
    "updated_at": "2018-12-12T11:52:32.750Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/1", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/1/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/1/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
  }
}
```

## Find by ID 

 ### Endpoint

 ```
 GET http://localhost:3000/coffee/:id
 ```

 ### Description

Returns a JSON object representing the object with id = :id. If there is no such entry, it reports the error.

 ### Example

 ```
curl --request GET \
  http://localhost:3000/api/coffee/1
```

 ### Response

 ```javascript
{
  "message": "Elemento encontrada exitosamente",
  "data": {
    "id": 1,
    "name": "this is an updated name",
    "price": 100,
    "created_at": "2018-11-21T11:57:02.767Z",
    "updated_at": "2018-12-12T11:52:32.750Z",
    "links": [
      { "rel": "self", "href": "/api/coffee/1", "type": "GET" },
      { "rel": "edit", "href": "/api/coffee/1/edit", "type": "POST" },
      { "rel": "delete", "href": "/api/coffee/1/delete", "type": "DELETE" },
      { "rel": "new", "href": "/api/coffee/new", "type": "POST" },
      { "rel": "all", "href": "/api/coffee/find", "type": "GET" },
      { "rel": "count", "href": "/api/coffee/count", "type": "GET" }],
  }
}
```

## Find

 ### Endpoint

 ```
 GET http://localhost:3000/coffee/find
 ```

 ### Description

Returns an array with all the entries matching the given query. This is where the magic really happens. The user can customize the result by adding a query, in our first example we would look when no query is given (therefore returns all the entries), and then dig into all the options that can be added to filter and customize your search.


 ### Example

 ```
curl --request GET \
  http://localhost:3000/api/coffee/find
```

 ### Response

  Will return an array with all the entries:

  ```javascript
  {
    "message": "Busqueda encontrada exitosamente",
    "data": [{
        "id": 1,
        "name": "this is an updated name",
        "price": 100,
        "created_at": "2018-11-21T11:54:42.840Z",
        "updated_at": "2018-11-21T11:54:42.840Z",
        "links": [Object, Object, Object, Object, Object, Object],
      }, {
        "id": 2,
        "name": "this is the name",
        "price": null,
        "created_at": "2018-11-21T11:57:02.767Z",
        "updated_at": "2018-11-21T11:57:02.767Z",
        "links": [Object, Object, Object, Object, Object, Object],
      }, {
        "id": 3,
        "name": "other",
        "price": 100,
        "created_at": "2018-11-21T12:06:04.065Z",
        "updated_at": "2018-11-21T12:06:04.065Z",
        "links": [Object, Object, Object, Object, Object, Object],
      }, {
        "id": 4,
        "name": "expensive",
        "price": 110,
        "created_at": "2018-11-21T12:06:22.400Z",
        "updated_at": "2018-11-21T12:06:22.400Z",
        "links": [Object, Object, Object, Object, Object, Object],
      }],
  }
  ```

### Simple Queries

  This is the simplest but powerful way of querying, the query will filter with the given format _key=value_.


  #### Examples

  ```
  curl --request GET 'http://localhost:3000/api/coffee/find?price=100'
  ```
 In this case it will return all the entries where the price is 100. 


  ```
  curl --request GET 'http://localhost:3000/api/coffee/find?price=100&name=other'
  ```
  In this case it will return all the entries where the price is 100 and the name is other.

### Queries for Masters

Here are some examples of how to work with more complex queries. In the query you should pass an array with two values, as such: key=["command",value]. The query will translate to SQL as follows `WHERE  key command value`.


  * price=["<>", 90] will translate to `WHERE  price <> 90`

  * price=["in", [90, 100]] will translate to `WHERE  price in {90, 100}`

  * price=["not in", [90, 100]] will translate to `WHERE  price not in {90, 100}`

  It is very important for the brackets to be before and after every array, otherwise it will be parse as a string, for instance:

  price=">",90 will translate to `WHERE  price = '">", 90'`


#### Examples

 ```
 curl --request GET "http://localhost:3000/api/coffee/find?price=[\">\",105]" --globoff
 ```
 In this case it will return all the entries where the price is greater than 105. 

```
curl --request GET "http://localhost:3000/api/coffee/find?price=[\"<>\",90]" --globoff
```
 In this case it will return all the entries where the price is distinct to 90. 

 ```
curl --request GET "http://localhost:3000/api/coffee/find?price=[\"in\",[90,100]]" --globoff
```

 This is one of my favorites, in this case it will return all the entries where the price is either 90 or 100. 

```
  curl --request GET "http://localhost:3000/api/coffee/find?price=[\"not%20in\",[90,100]]" --globoff
```

 Note that whitespace when uri encoded transforms to `%20`, therefore  `[\"not%20in\",[90,100]]` translates to `["not in",[90,100]]`. In this case it will return all the entries except the ones where the price is either 90 or 100. 

 And much more! Any postgresql command is supported!


### Columns

Sometimes we don't want to get all the information, just the essential stuff. The columns options come handy. In an array you can specify all the columns you want to get.


#### Examples

 ```
 curl --request GET 'http://localhost:3000/api/coffee/find?price=100&columns=id'
 ```
 In this case it will only return the id column of the entries where the price is 100. The price, created_at, updated_at and name will be omitted. The response will be something as such:

   ```javascript
  {
    "message": "Busqueda encontrada exitosamente",
    "data": [{
        "id": 1,
        "links": [Object, Object, Object, Object, Object, Object],
      }, {
        "id": 3,
        "links": [Object, Object, Object, Object, Object, Object],
      }],
  }
  ```

 ```
 curl --request GET "http://localhost:3000/api/coffee/find?columns=[\"id\",\"price\"]" --globoff
 ```
 In this case it will only return the id and price columns of each entry.

  ```
 curl --request GET "http://localhost:3000/api/coffee/find?columns=[\"price%20as%20p\"]" --globoff
 ```
  Note that whitespace when uri encoded transforms to `%20`, therefore  `[\"price%20as%20p\"]` translates to `["price as p"]`. In this case it will only return the price columns of each entry, but rather than be called as price it will be called as p. As follows:

   ```javascript
  {
    "message": "Busqueda encontrada exitosamente",
    "data": [{
        "p": 100,
        "links": [Object, Object, Object, Object, Object, Object],
      }, {
        "p": null,
        "links": [Object, Object, Object, Object, Object, Object],
      }, {
        "p": 100,
        "links": [Object, Object, Object, Object, Object, Object],
      }, {
        "p": 110,
        "links": [Object, Object, Object, Object, Object, Object],
      }],
  }
  ```

#### Options 

It just does not end here! There are some more options to do your querying even more complete! If you already read the [Model Documentation](./model), this corresponds as the configurations passed in the `options` variable.

#### startDate and endDate

 ```
 curl --request GET 'http://localhost:3000/api/coffee/find?startDate=2018-11-21T11:55:00.000Z'
 ```
 
 In this case it will return all the entries where the created_at is after the given startDate, in this case, after 2018-11-21T11:55:00.000Z.

  ```
 curl --request GET 'http://localhost:3000/api/coffee/find?endDate=2018-11-21T12:00:00.000Z'
 ```
 
 In this case it will return all the entries where the created_at is before the given endDate, in this case, before 2018-11-21T12:00:00.000Z.

   ```
 curl --request GET "http://localhost:3000/api/coffee/find?startDate=2018-11-21T11:55:00.000Z&endDate=2018-11-21T12:00:00.000Z"
 ```
 
 In this case it will return all the entries where the created_at is in between the given startDate and endDate, in this case, between 2018-11-21T11:55:00.000Z and 2018-11-21T12:00:00.000Z.

 #### Order by, limit and offset

  ```
 curl --request GET "http://localhost:3000/api/coffee/find?orderBy=id&limit=2"
 ```
 
 In this case it will return the first two entries ordered by id in ascending order.

 ```
 curl --request GET "http://localhost:3000/api/coffee/find?orderBy=[\"id\",\"desc\"]&limit=2" --globoff
 ```
 
 In this case it will return the first two entries ordered by id in descending order. 

 ```
 curl --request GET "http://localhost:3000/api/coffee/find?orderBy=[\"id\",\"asc\"]&limit=2&offset=1" --globoff
 ```
 
 In this case it will return the second and third entries ordered by id in ascending order. It skips the first one because of the offset given. 

 ```
 curl --request GET "http://localhost:3000/api/coffee/find?orderBy=[[\"price\",\"desc\"],[\"id\",\"asc\"]]" --globoff
 ```
 
 In this case it will return the entries ordered by price in a descending order. In case that some entries have the same price, then they will be ordered by id in ascending order.


## Count

 ### Endpoint

 ```
 GET http://localhost:3000/coffee/count
 ```

 ### Description

Returns the amount with all the entries matching the given query. The user can customize the result by adding a query, all of the query examples given for the _find_ endpoint also work for the _count_ endpoint.

 In our first example we would look when no query is given (therefore counts all the entries), and then dig into all the options that can be added to filter and customize your search.


 ### Example

 ```
curl --request GET http://localhost:3000/api/coffee/count
```

 ### Response

  Will return an array than counts all the entries:

  ```javascript
  {
    "message": "Busqueda encontrada exitosamente",
    "data": 4
  }
  ```

### Other Examples

```
curl --request GET 'http://localhost:3000/api/coffee/count?price=100'
```
 In this case it will count all the entries where the price is 100. 


 ```
 curl --request GET "http://localhost:3000/api/coffee/count?price=[\">\",105]" --globoff
 ```
 In this case it will count all the entries where the price is greater than 105. 

### Group by

 If you want to know how many entries are of each price, you can group your answers by price. 

 ```
 curl --request GET "http://localhost:3000/api/coffee/count?groupBy=price" --globoff
 ```
 In this case it will count all the entries and group them by price, as follows:

 ```javascript
{
  "message": "Busqueda encontrada exitosamente",
  "data": [
      {
    "count": 1,
    "price": 110
    }, {
    "count": 2,
    "price": 100
    }, {
    "count": 1,
    "price": null
  }],
}
```

 Moreover, you can order the list from the price least repeated up to the most repeated:

 ```
 curl --request GET 'http://localhost:3000/api/coffee/count?groupBy=price&orderBy=count'
 ```

