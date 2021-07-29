## Overview

  The ChinchayError is a class that extends the Error class. In simple terms it's the same as the error class, but it has a user-defined identifier called `the chinchayCode`. This is used by the ErrorHandler to identify each error.

### parameters

  * error: A given Error. If you want to maintain an Error but add the `chinchayCode`, pass it as the first argument. See more in the [Map to Another Error Section](#map-to-another-error).
  * chinchayCode: A code to define what type of error it is. It will be later on used by the ErrorHandler to identify the error. Read more about it in the [next section](#chinchaycode).
  * message: A friendly message to elaborate more on what happened. The chinchayCode is intended to be machine-readable, this is intended to be human-readable, or well at least developer-readable. 



## chinchayCode

 A code to define what type of error it is. It will be later on used by the ErrorHandler to identify the error. It can be a string or a number. Later on, the ErrorHandler will map each `chinchayCode` to a HTTP status code. It is intended to be short, it is not necessary for it to be self explanatory, that is what the `message` property is for.

 :::tip protip
  Even though it is the `message`'s job to explain the error, do think of a `chinchayCode` that would give a hint of what happened. Avoid meaningless codes such as an incremental hexadecimal number.
 :::




## Message

A friendly message to elaborate more on what happened. The `chinchayCode` is intended to be machine-readable, this is intended to be human-readable, or well at least developer-readable. This `message` can be passed as the first parameter. The following codes are equivalent:


```javascript
  const error = new Error('example message');
  const chinchayError = new ChinchayError(error, 'test_error', 'example message');
```

```javascript
  const chinchayError = new ChinchayError('example message', 'test_error');
```


## Map to Another Error

Sometimes you do not want to create a new Error, rather you desire to transform a given error into a `ChinchayError`. For example, you are working with an external API and the it's the API the one that throws the Error:



```javascript
  requestify.get('https://example.com/api/coffee/find/').then((result) => {
    resolve(result);
  }).catch((err) => {
    const error = new ChinchayError(err, 'api_error');
    reject(error);
  });
```

In the previous example we do not desire to lose the information of the `err` variable, therefore we pass it on so that chinchay will build over it.