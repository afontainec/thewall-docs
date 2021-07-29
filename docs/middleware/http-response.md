## Overview

 `httpResponse` will be responsible to generate the response for every http Request. It has two methods, `success` for when everything went right and `error` for when an error occurred.


## Success


  ### Parameters

   * text: friendly message indicating the response.
   * keys: Array of keys that the response is expected to have. Optionally, if it is only one key it can be passed as string.
   * values: Array of values that the response is expected to have. Value n will be assigned to key n.

  ### Examples


  ```javascript
  > httpResponse.success('ok', 'user', { id: 1, username: 'example' });
  <- { message: 'ok', user: { id: 1, username: 'example' } }
  ```

  ```javascript
  > httpResponse.success('ok', ['id', 'user'], [1, { id: 1, username: 'example' }]);
  <- { message: 'ok', id: 1, user: { id: 1, username: 'example' } }
  ```

## Error


  ### Parameters

   * error: friendly message indicating the error.
   * fullMessage: Complete message indicating the error. It is intended only for development purpose, in production will be ignored.
   * code: The http status code that will be returned, in case of 500 the first parameter will be forced to 'Internal Server Error'

  ### Examples


  ```javascript
  const error = new Error('username not found');
  > httpResponse.error('There is no user for the given username', error);
  <- { error: 'There is no user for the given username',
  fullError:
   Error: username not found
       at Module._compile (internal/modules/cjs/loader.js:701:30)
       at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
       at Module.load (internal/modules/cjs/loader.js:600:32)
       at tryModuleLoad (internal/modules/cjs/loader.js:539:12)
       at Function.Module._load (internal/modules/cjs/loader.js:531:3)
       at Function.Module.runMain (internal/modules/cjs/loader.js:754:12)
       at startup (internal/bootstrap/node.js:283:19)
       at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3) }
  ```

  ```javascript
  const error = new Error('username not found');
  > httpResponse.error('There is no user for the given username', error, 500);
  <- { error: 'Internal Server Error',
  fullError:
   Error: username not found
       at Module._compile (internal/modules/cjs/loader.js:701:30)
       at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
       at Module.load (internal/modules/cjs/loader.js:600:32)
       at tryModuleLoad (internal/modules/cjs/loader.js:539:12)
       at Function.Module._load (internal/modules/cjs/loader.js:531:3)
       at Function.Module.runMain (internal/modules/cjs/loader.js:754:12)
       at startup (internal/bootstrap/node.js:283:19)
       at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3) }
  ```

  As the code is set to 500, `error` is overwritten, this is to protect unwanted message leaking to clients.

  ```javascript
  process.env.NODE_ENV = 'production';
  const error = new Error('username not found');
  > httpResponse.error('There is no user for the given username', error);
  <- { error: 'There is no user for the given username' }
  ```

  As the environment is set to production, no `fullError` is given.
