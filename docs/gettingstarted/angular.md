## Getting Started with Chinchay + Angular

### Overview

  For this tutorial we will have two servers running at the same time. One with the backend and another running the Angular app. 

## Backend Server

  For the backend server, follow [the getting started ](ejs.html). The only difference, is when running the chinchay new command, you can add the flag `--frontend disable` as follows:

```
$ chinchay new coffee --frontend disable
```

  This will not create the ejs files. We will not be needing them, we are going to do the frontend with Angular.

  For this tutorial we will need to add one more thing, we need to configure the backend so that it will not block the frontend due to CORS. If you do not know what this is you can read [this blog](https://www.codecademy.com/articles/what-is-cors), but in short, by default the server will block any request that comes from another app. Therefore, it will block the requests of the frontend. On the backend, we add the following to our app.js. It's important that this should be defined *BEFORE* we indicate the app to use the coffeeAPI routes.

  ```javascript
    app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  ``` 

  Let's go and run the backend, run the following command on the backend directory:

```
$ npm start
```


## Angular App

Next, we need to create an Angular app. We need to install the [Angular cli](https://angular.io/cli).
If you do not have it go and run: 

```
$ npm install -g @angular/cli
```

*NOTE*: You will need to have [npm](https://www.npmjs.com/get-npm) installed.

Then we simply create the angular app called testChinchayAngular

```
$ ng new testChinchayAngular
$ cd testChinchayAngular
```


A prompt asking if you like to add the angular routing will show, press `y` to confirm. Then select the stylesheet format of your preference. We will use CSS.

We are now ready to run our chinchay command.


## Chinchay

We install chinchay:
```
$ npm install chinchay -s
$ npm install chinchay -g
```

Then we simply run the command to create all the views and logic to work with the `coffee` relation of the backend:

```
$ chinchay new coffee --frontend angular --backend disable
```

Note we are indicating the frontend is angular and that no backend files should be created.

This will create a coffee directory within src/app. This will include:

* Index component: Where a list of all the coffees will display.
* New component: To create a new coffee.
* Edit component: To edit an existing coffee.
* Show component: To view a coffee and it's properties.
* Service: For connecting with the backend, to create, edit or retrieve data.
* Router: Configuration for the routes.
* Module: Module that will hold all the components and routing.

<br>

 
Next, we will add the generated module to the app. In the app.module.ts file, found within the src/app directory, we will add the `CoffeeModule` to the imports:

```javascript
import { CoffeeModule } from './coffee/coffee.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoffeeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```


## Connecting Backend and Frontend

To connect the backend to the frontend we need to configure one more thing. In the file src/environments/environment.ts we need to add the variable `backend = http://localhost:3000`. This will indicate that the backend is running in the port 3000 of our machine.

```javascript
export const environment = {
  production: false,
  backend: 'http://localhost:3000'
};
```


## Running the app

Now we are ready to run our app! We run:


```
$ ng serve
```

This will make our app run on [localhost:4200](localhost:4200).

Well, when you visit your app you get an Angular default webpage... To remove it, we go to `src/app/app.component.html` and leave only the router-outlet.

```html
<router-outlet></router-outlet>
```

Now we reload, and get an empty page. But let's navigate to [localhost:4200/coffee](localhost:4200) and we will see all our coffees! Go ahead and create more coffees!

Important: remember that the backend must be running!

Enjoy!

For more information to work around Chinchay CLI:

[See the Command Line Interface Documentation!](/docs/cli.html)
