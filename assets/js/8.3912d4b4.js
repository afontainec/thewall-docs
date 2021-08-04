(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{349:function(e,t,o){"use strict";o.r(t);var a=o(26),r=Object(a.a)({},(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[o("h1",{attrs:{id:"overview-how-it-works"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#overview-how-it-works"}},[e._v("#")]),e._v(" Overview How it works")]),e._v(" "),o("p",[e._v("Welcome to  "),o("strong",[e._v("TheWall")])]),e._v(" "),o("p",[e._v('The whole idea is that each users has one-or-many roles. And each role has access to one-or-many endpoints. Each role can be parameterized with a filter. What does this mean? Lets explain with an example, lets assume we have a website to manage stores, you may want user A to be the editor of the store "BuyThis" and user B to be the editor of store "BuyHere", moreover to edit a store the endpoint is '),o("code",[e._v('"/store/:name/edit"')]),e._v(', where name changes accordingly. So what we do is assign a role of storeEditor to user A with filter "BuyThis" and a role storeEditor to user B with filter "BuyHere". Then we make that the role storeEditor can access the endpoint '),o("code",[e._v('"/store/:name/edit"')]),e._v(" but parameterized by name, therefore the user A only can access "),o("code",[e._v('"/store/buyThis/edit"')]),e._v(" and not "),o("code",[e._v('"/store/butHere/edit"')]),e._v(". This adds flexibility and scalability as you can reuse roles.")]),e._v(" "),o("p",[o("strong",[e._v("NOTE")]),e._v(" Adding a filter to a role is optional.")]),e._v(" "),o("p",[e._v("Find a fully detailed documentation of how it works. How to navigate through it and every other aspect. Go ahead dig in:")]),e._v(" "),o("p"),o("div",{staticClass:"table-of-contents"},[o("ul")]),o("p"),e._v(" "),o("ul",[o("li",[o("RouterLink",{attrs:{to:"/how-it-works/the-wall.html"}},[e._v("TheWall Instance")])],1),e._v(" "),o("li",[o("RouterLink",{attrs:{to:"/how-it-works/the-file.html"}},[e._v("The configuration File")])],1)])])}),[],!1,null,null,null);t.default=r.exports}}]);