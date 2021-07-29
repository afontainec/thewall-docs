## Overview

HATEOAS is one of the most distinctive features of a REST API and is hardly ever present. HATEOAS tries to mimic our real-life browsing, when we visit a page all the possible links are presented (as buttons, images, etc). HATEOAS aims to do the same, in which every API request a list of followup links are given. However, doing so it's a pain in the *** for the developer, he is responsible to, for every API request, return all the followup links. So guess what does chinchay do? Yes it will make it veeery easy to do so with it's HATEOAS generator.

You can read more about [HATEOAS here](https://restfulapi.net/hateoas/).


## HATEOAS Generator

So, let's get started. Will exemplify with the controller of [Getting Started Tutorial](../gettingstarted/ejs).

So the controller goes like this:

```javascript
const HateoasGenerator = require('chinchay').Hateoas;

...

const HATEOAS = new HateoasGenerator();
```

So here we are creating one instance of the HATEOAS generator for this specific controller.


## addLink

So we have our instance, how do we inform which urls should he add to every request?
Well it's very simple, if we look at the controller we would see this auto-generated lines:

```javascript
  HATEOAS.addLink('self', '/api/coffee/:id');
  HATEOAS.addLink('edit', '/api/coffee/:id/edit', 'POST');
  HATEOAS.addLink('delete', '/api/coffee/:id/delete', 'DELETE');
  HATEOAS.addLink('new', '/api/coffee/new', 'POST');
  HATEOAS.addLink('all', '/api/coffee/find');
  HATEOAS.addLink('count', '/api/coffee/count');
```

So, 6 links are added. This generate a HATEOAS as such:

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


 Let's explain a bit the method `addLink(name, url, type)`

* **name**: the name defines a human-readable name for that link. It will be assigned to property `rel`.
* **url**: Is the url of the given link. It is assigned to the property `href`. Note that variables can be passed for the url. For instance the self url is given an `:id` which is then replaced by the corresponding id.
* **type**: The http verb. It will be assigned to the property `type`.

## get

Let's look now when and how are these links added to each response. If we look the create function we see the the `links` property is added to the `json.data` which is the send as the response:

```javascript
const create = (req, res) => {
  Coffee.save(req.body).then((results) => {
    const json = httpResponse.success('Elemento guardado exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    return res.status(200).send(json);
  }).catch((error) => {
    const code = errorHandler.getHTTPCode(error);
    const message = errorHandler.getHTTPMessage(error);
    const json = httpResponse.error(message, error, code);
    return res.status(code).send(json);
  });
};
```

Let's look at the `get(values)` method. This method receives some _values_, in the previous example the `results`. It will create an array of all the defined links. It will use the _values_ property to compile each link. 

  * values: A javascript object. The keys/properties it will use to compile every uri. For instance, if the uri is `'/api/coffee/:id'` and the _values_ is `{id: 1}`, the compiled uri will be `'api/coffee/1'`.
  * return: An array of javascript objects, where each object has a `rel`, `href` and `type` property. The rel provides a human-readable value for understanding what is, `href` the link to the resource and the `type` is the http verb for the link.

Take a look at the find function to check out how the HATEOAS is added when the results is an array:


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

## removeLink

This method is not used in the controller but is quite self explanatory. If at any time you desire to dynamically delete links you can call `removeLink(name)` and the link with the given name will no longer be added when the `get` method is called.

