
# Overview How it works

Welcome to  **TheWall**

The whole idea is that each users has one-or-many roles. And each role has access to one-or-many endpoints. Each role can be parameterized with a filter. What does this mean? Lets explain with an example, lets assume we have a website to manage stores, you may want user A to be the editor of the store "BuyThis" and user B to be the editor of store "BuyHere", moreover to edit a store the endpoint is `"/store/:name/edit"`, where name changes accordingly. So what we do is assign a role of storeEditor to user A with filter "BuyThis" and a role storeEditor to user B with filter "BuyHere". Then we make that the role storeEditor can access the endpoint `"/store/:name/edit"` but parameterized by name, therefore the user A only can access `"/store/buyThis/edit"` and not `"/store/butHere/edit"`. This adds flexibility and scalability as you can reuse roles. 

**NOTE** Adding a filter to a role is optional.

Find a fully detailed documentation of how it works. How to navigate through it and every other aspect. Go ahead dig in:

[[toc]]
*  [TheWall Instance](./the-wall.html)
*  [The configuration File](./the-file.html)


