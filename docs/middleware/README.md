
Welcome to the **Chinchay Middleware**



## Middleware

 With Chinchay you can easily create a RESTful API, not only that but Chinchay provides a complete flexible interface
 where the client can build specific queries to consult information. But... What about who can access the API? 
 
 With Chinchay Middleware you can easily transform your API into an [oAuth 2.0](https://oauth.net/2/) API, oAuth is an industry-standard protocol for authorization. In simple terms, you can protect so each user only access the endpoint you give him access to. Before consulting the API, The user authenticates with it's credentials and an access token is given. After that, the user must pass the access token for every request.
 
 The Chinchay Middleware will be in charge of inspecting that the token is present, valid and that the user of that token has access to the given endpoint. The token is expected to be given as a [Bearer Token](https://swagger.io/docs/specification/authentication/bearer-authentication/).
 
 The Access Module will be in charge of generating the access token, the token follows the json web token standard, by generating the token with the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) npm package.
 
 To actually define which user has access to which endpoints, chinchay uses the [TheWall](https://www.npmjs.com/package/thewall) npm package. 
 
 Moreover you might have one route that it's accessible by different users but the content must be different. For instance, with chinchay (running locally) the route: http://localhost/api/coffee/find will return all the coffees. If we have a customer1 user and a customer2 user, we might want to use that endpoint to return all the coffees that the user has access to. So how do we filter them? With TheWall we give access to both users to that route, but with the Access Module we can add the corresponding filter so that when the information is fetched to the database only the corresponding coffees are given.