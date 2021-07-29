## Overview
 I assume we all have been annoyed when working with an API and it returns an error with the message "Something went wrong" and we are left there clueless. The ErrorHandler will map the Errors that are thrown in the server to corresponding HTTP codes and human-readable messages so the API client can understand what happened and act accordingly. 

 The ErrorHandler works hand by hand with the [ChinchayError](./chinchay-error). It will use the `chinchayCode` to translate/map it to a http status code and it's message.

  
## examples
  
  Before we dig into how it fully works we are going to look at some examples.

  ```javascript
  const error = new ChinchayError('user does not have access', 'no_access');
  const ERROR_TRANSLATE = {
    no_access: {
      code: 403, message: 'Forbidden. You can not access the requested data.'
    }
  }
  const errorHandler = new ErrorHandler(ERROR_TRANSLATE);
  const { code, message } = errorHandler.getHTTPCodeAndMessage(error);
  ```

  Will return: 

  ```javascript
  { 
    code: 403,
    message: 'Forbidden. You can not access the requested data.' 
  }
  ```

  On the `ERROR_TRANSLATE` we define to map the ChinchayError of code 'no_access' to a 403 HTTP status code. Note the `message` given is the one defined in the `errorHandler`, the `message` of the ChinchayError is intended for development purpose, and should not be exposed to clients.

  Let look at a different example: 

  ```javascript
  const error = new Error('unknown error');
  const ERROR_TRANSLATE = {
    no_access: {
      code: 403, message: 'Forbidden. You can not access the requested data.'
    }
  }
  const errorHandler = new ErrorHandler(ERROR_TRANSLATE);
  const { code, message } = errorHandler.getHTTPCodeAndMessage(error);
  ```

  Will return: 

  ```javascript
  { 
    code: 500,
    message: 'Internal Error' 
  }
  ```

  In this case the `ERROR_TRANSLATE` does not have an entry for the given error, in this case it will return with a 500 case. Anytime it encounters an error that he does not know how to translate, it will return a 500 code.

## errorTranslate

  Let's dig a bit deeper in the `errorTranslate` parameter. It is a javascript object, that indicates the message and code that should be returned for each chinchayError code. If there is no message nor code indicated it will assume it is a 500 error.

   
### default Error Translate and Replace

  There are some default Errors that have already been mapped. For instance: 


  ```javascript
  const errorHandler = new ErrorHandler();

  Coffee.update(1, { }).then().catch((err) => {
    const { code, message } = errorHandler.getHTTPCodeAndMessage(err);
  });
  ```

  Will output:

  ```javascript
  {
    code: 400,
    message: 'Error: Nothing to update or non existent column'
  }
  ```

  Here we didn't even pass an `errorTranslate`, so why is it not returning a 500 error? The error handler has some default translations. We can overwrite them: 

  ```javascript
  const ERROR_TRANSLATE  = {
    'empty_update': {
      code: 422,
      message: 'Could not be processed.'
    }
  };

  const errorHandler = new ErrorHandler(ERROR_TRANSLATE);

  Coffee.update(1, { }).then().catch((err) => {
    const { code, message } = errorHandler.getHTTPCodeAndMessage(err);
    console.log({code, message});
  });
  ```

  Will output:

  ```javascript
  { code: 422, message: 'Could not be processed.' }
  ```

  Moreover, we can all together remove the defaults. By passing the second parameter, `replace` as `true`. Let's look at an example:

  ```javascript
  const ERROR_TRANSLATE  = {
    no_access: {
      code: 403, message: 'Forbidden. You can not access the requested data.'
    }
  };

  const errorHandler = new ErrorHandler(ERROR_TRANSLATE, true);

  Coffee.update(1, { }).then().catch((err) => {
    const { code, message } = errorHandler.getHTTPCodeAndMessage(err);
    console.log({code, message});
  });
  ```

  Now that we have removed the default, the `empty_update` will not be found, therefore:
  ```javascript
  { 
    code: 500,
    message: 'Internal Error' 
  }
  ```

  :::warning Disclaimer
  For the chinchayCode `empty_update` I consider way more suitable the `400` code than the `422` or `500`. The previous examples were just to show how to work with the default configurations. 
  :::


## getHTTPCodeAndMessage

  If you have been reading through, well this part is going to seem a bit obvious. THe ErrorHandler has a `getHTTPCodeAndMessage` that receives an error and returns what `code` and `message` should be returned to the client.


  ### Parameters

  * error: A ChinchayError or Error instance. This is the error that should be mapped to a HTTP status code and a message.

  ### Return value

  * code&Message: A javascript object with two properties: `code`, and `message`. This is the http status code and a friendly human-readable message expected to be returned to the requesting client.


  This is basically the only function of the ErrorHandler worth talking about. On previous releases this function was absent and there were two separate functions, `getHTTPCode` and `getHTTPMessage`. While they still exist (actually `getHTTPCodeAndMessage` calls these functions) it's direct use is deprecated and the `getHTTPCodeAndMessage` function is preferred. 

