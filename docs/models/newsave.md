## New

The new method will return a javascript object representing a _new_ and empty entry.

::: warning
  **Important:** this entry is not saved on the database until the save method is called.
:::

Using the example of the [Getting Started tutorial](../gettingstarted/ejs) the following:

```javascript
  coffee.new();
```

will return:

```javascript
{ id: null,
  name: null,
  price: null,
  created_at: null,
  updated_at: null }
```

## Save

Method to save data to the database. It expects a javascript object representing the data to be saved.

```javascript
  coffee.save({name: 'cappuccino', price: 5 });
```

The previous code will save an entry where the name is 'cappuccino' and the price is `5`.


### On conflict

You can pass an `onConflict` object to handle insert conflicts. For example:

```javascript
  coffee.save({ name: 'cappuccino', price: 5 }, { onConflict: { columns: ['name'], merge: { price: knex.raw('EXCLUDED.price') }}});
```

Lets assume there is a unique constraint on `name`, so this code will create a new entry on the database if there is no `"cappuccino"` on the database, however if there is an entry with `name = "cappuccino"` it will update it with the given price, in this case 5. The following code will just ignore the conflict error: 

```javascript
  coffee.save({ name: 'cappuccino', price: 5 }, { onConflict: { columns: ['name'], ignore: true }});
```

## Save several at once

The same method can be used to save several instances at once. To do this an array of javascript objects must be passed. Each object will represent one database entry.

```javascript
  coffee.save([{ name: 'cappuccino', price: 5 }, { name: 'latte' }]);
```

This will save two entries, the first named cappuccino at a price of 5, and the second named latte and without a given price. The previous is equivalent to:

```javascript
  Promise.all([coffee.save({ name: 'cappuccino', price: 5 }), coffee.save({ name: 'latte' })]);
```

### Batch Size

  When the input is an array, they will be saved by batches, the default batch size is of 1000. Therefore if the array is of length 3010, the entries will be saved in 4 batches, 3 of 1000 entries and a fourth with 10 entries. You can modify the batch size as follows:


  ```javascript
    coffee.save(longArrayOfEntries, { batchSize: 100 });
  ```

  Here the batches will be of size 100.