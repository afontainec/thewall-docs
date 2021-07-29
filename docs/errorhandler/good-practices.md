## Defining Chinchay Codes

One big question is how to build Chinchay Codes? Let's keep in mind that the `chinchayCode` is intended to be machine-readable, therefore it is not necessary for it to be self explanatory, so keep it short. One tempting option is to number them, error 1, error 2, and so forth. However I would advise against that option, even though it is not intended for it to be easily understood by humans, it does not mean it has to be crazy difficult. I would suggest something that would give a hint of what happened. Some examples:

#### don'ts

  ```javascript
  1 // avoid numbering
  '0x13' // I know hex can look pro, but again avoid numbering
  'error when the parameter given does not match with an existing one' // too long, too much bla bla 
  ```

#### do's

  ```javascript
  'unexistant_parameter'
  'id_not_found'
  'incorrect_format'
  'emptyData' // can be camelcase or your case of preference. For these errors I tend to go for snake cases though.
  ```


### Recycling chinchayCode

A common question is should I create a different `chinchayCode` for every possible Error or should I reuse them?

It truly depends on the case. Keep in mind that the mission here is to give to the client the correct and understandable messages. So do not try to over optimize the chinchayCodes. However if two errors are very similar, will have the same message and the same code, well yeah, then please do recycle! This will maintain a shorter `errorTranslate`, easier to read or debug.

## Global ErrorHandler

One interesting way of organizing the ErrorHandler is to have 1 errorHandler for the whole project. In one file, `errorhandlerfile.js` we will store the `errorTranslate` parameter:

```javascript
  module.exports = {
    empty_update: {
      code: 422,
      message: 'Could not be processed.'
    }, 
    no_access: {
      code: 403, message: 'Forbidden. You can not access the requested data.'
    },
    ...
    unexistant_option: {
      code: 400, message: 'Requested option is not valid.'
    },
  };
```

Then, in another file, let's call it `errorhandler.js`, we add the following:

```javascript
  const errorTranslate = require('path/to/errorhandlerfile');
  const { ErrorHandler } = require('chinchay');

  const errorHandler = new ErrorHandler(errorTranslate);

  module.exports = errorHandler;
```

Lastly, in each controller we replace:

```javascript
const { Table, ErrorHandler } = require('chinchay');

const errorHandler = new ErrorHandler();
```

with:

```javascript
  const errorHandler = require('path/to/errorhandler');
```

#### pros

The main reason to use it this way is because the `errorTranslate` parameter requires spaces. If you have a complete mapping of errors, your controllers will end up being more errorTranslate than controller. This looks ugly. 

Moreover, it is quite common for controllers to have very similar `errorTranslate`. This will lead to a lot of copy/pasting. In the long run this is hell, imagine you have 10 controllers and you found one new Error you haven't thought about before. Even worse, this error can happen in every controller, you will have to add it to the 10 controllers. With a centralized errorHandler it is just one change.  

#### cons

You lose flexibility. You might want to return different messages for the same error depending on the controller (you could be interested in returning different http status codes as well, but that is less common).

## HTTP Codes guide

Here is a quick guide of the codes I use and when I use them.

### 200

Success, when everything goes as expected.

### 400

This is basically a "it's not my fault" code. Whenever an error is thrown because the client made a weird request.

### 401 

401 the user is not authorized. The user must give a valid Authorization header field.

### 403

Forbidden. The user does not have access to the requested data.

### 404

Not Found. What you are looking for has not been found.

### 500

This is basically "not a clue what happened". It officially means "Internal Server Error", but it is usually used as something we did not expect to happens, did occur.

### And More

There are plenty of more errors, here is a [complete list](https://www.restapitutorial.com/httpstatuscodes.html).

## Developer Alert

If you are deploying to production it's a must to monitor the health of your server. This will let you know when something unexpected happen and act accordingly. There are plenty of tools to monitor the health of your code and let you know whenever a code 4XX or 5XX occurs, amount of requests, CPU usage, logs analyzers and much more.

In my experience, I usually do not do much error handling at the beginning, just the basic and obvious errors. All the rest I just return 500 and place an alert that would notify me everytime an error 500 occurs. When this alert triggers, I then analyze the request, see what happened and what would be the correct code and message, add it to the errorHandler and move on. This allows me to only populate the errorHandler with real cases, rather than overthinking everything that can go wrong.

