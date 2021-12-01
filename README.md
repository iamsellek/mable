# mable-hash

A helper for storing and iterating over data in hash tables in TS/JS.

# TOC

1. [Installation](#installation)
1. [Examples and API](#examples-and-api)
   1. [Instantiation](#instantiation)
   1. [API - Loop Functions](#api---loop-functions)
      1. [every](#everycallback-boolean)
      1. [filter](#filtercallback-mableobjectt)
      1. [find](#findcallback-theobject--undefined)
      1. [findAll](#findallcallback-mableobjectt--undefined)
      1. [forEach](#foreachcallback-void)
      1. [includes](#includescallback-boolean)
      1. [map](#mapcallback-mableobjectt)
      1. [some](#somecallback-boolean)
   1. [Async](#async)
   1. [API - Hash Table Management](#api---hash-table-management)
      1. [delete](#deletekey-void)
      1. [deleteAll](#deleteall-void)
      1. [get](#getkey-t--undefined)
      1. [getTheObject](#gettheobject-genericobjectt)
      1. [getAsArray](#getasarray-t)
      1. [getLength](#getlength-number)
      1. [has](#haskey-boolean)
      1. [set](#setkey-value-void)
      1. [update](#updatekey-value-void)
   1. [Examples](#examples)
   1. [Adding Custom Helper Functions](#adding-custom-helper-functions)
1. [The Why](#the-why)
1. [Why Did You Name This "mable"?](#why-did-you-name-this-mable)

# Installation

```
npm install mable-hash
```

# Examples and API

## Instantiation

MableObject is a class with generic type T that applies to the hash table that you'll be using. It takes an optional initial value if you already have one. Mable refers to the hash table it's storing as `The Object`.

```
// The variable peopleHash is a hash table with ids of type string or number and values of type Person.

// As a TypeScript type, it would be: Record<number | string, Person>.

const peopleEmpty = new MableObject<Person>(); // no initial value for theObject.

const peopleInitial = new MableObject(peopleHash); // initial value of peopleHash (type is inferred) for theObject.
```

## API - Loop Functions

### every(callback): boolean

Ensures that every value on The Object matches some conditional provided in the callback.

Returns true if if every value matches the conditional and false otherwise.

### filter(callback): MableObject\<T>

Returns a new MableObject containing only the items that pass the conditional provided by the callback.

### find(callback): TheObject | undefined

Returns the FIRST value in The Object that matches the conditional provided by the callback or undefined if no matches are found.

Also, "first" might be a misnomer here. I'm not sure how JS sorts Objects' key-value pairs, so I can't tell you for sure WHICH of your values will be found with this function, but if you're using logic that says "just give me the first one you find," you likely don't care which that is as long as one is returned or one isn't. If this ends up not being the case, I can try to rework this function.

### findAll(callback): MableObject\<T> | undefined

Returns ALL values in The Object as a new MableObject that match the conditional provided by the callback or undefined if no matches are found.

### forEach(callback): void

Loops through each value on The Object and performs the logic in the callback function on each one.

Syntactical sugar for:

```
for (let item of Object.values(theObject)) {
  callback()
}
```

### includes(callback): boolean

Returns true if The Object contains a value that matches the conditional provided by the callback. Returns false otherwise.

### map(callback): MableObject\<T>

Loops through each value on The Object. Makes a change to each value based on the logic in the callback. Returns a new MableObject with the results.

### some(callback): boolean

Returns true if at least ONE value in The Object returns true for the callback, returns false otherwise.

## Async

There are async options for every one of the above functions. There are two async options for each function and they follow this naming scheme:

### {functionName}AsyncEach(asyncCallback)

The functions that end in AsyncEach support async callbacks and fire/await each iteration one at a time. So it waits for iteration one to finish, then moves on to iteration 2. You should use the AsyncEach functions when you need to wait for each promise before moving onto the next one.

### {functionName}AsyncAll(asyncCallback)

The functions that end in AsyncAll support async callbacks and fire off every promise to run in parallel. The promises are then all awaited with a `Promise.all`. You should use the AsyncAll functions when you don't necessarily need each promise to wait for the ones before it.

## API - Hash Table Management

### delete(key): void

Deletes the value at the key provided.

### deleteAll(): void

Resets The Object to an empty hash table.

### get(key): T | undefined

Gets the item at key "key" in The Object.

### getTheObject(): GenericObject\<T>

Returns a copy of the object. This is NOT a deep copy.

### getAsArray(): T[]

Returns the values stored in The Object as an array.

### getLength(): number

Get the number of items stored in The Object.

### has(key): boolean

Returns true if the key provided exists in The Object. Returns false otherwise.

### set(key, value): void

Sets the item at key "key" in The Object. Overwrites any previously-existing item at that key.

### update(key, value): void

Updates the item at "key" in The Object with only the changes passsed in as "updates." Leaves other values in the item alone. Does NOTHING if item at "key" does not already exist.

## Examples

### Instantiation

To make use of a mable object, create a new instance of the MableObject class and then call the helper functions on your instantiation.

```
// The variable peopleHash is a hash table with ids of type string or number and values of type Person.

// As a TypeScript type, it would be: Record<number | string, Person>.

const people = new MableObject(peopleHash);

// ensure that every single person has a valid age.
const result = people.every(person => typeof people.age === 'number');

if (!result) {
  throw new Error();
}

// ensure that at least one person has a valid age.
const result = people.some(person => typeof people.person === 'number');

// create a new MableObject where each person's age is one digit higher.
const olderPeople = people.map(person => {...person, age: person.age + 1});

// run the every logic, but with an async callback. Use AsyncEach to make each call one at a time so we don't overload the API.
const result = await people.everyAsyncEach(async person => {
  const targetAge = await getTargetAgeFromAPI();

  return person.age === targetAge;
});

// run the every logic, but with an async callback. Use AsyncAll to run all the calls in parallel because there's no risk of being rate-limited with this API.
const result = await people.everyAsyncAll(async person => {
  const targetAge = await getTargetAgeFromAPI();

  return person.age === targetAge;
});
```

## Adding Custom Helper Functions

MableObject is a class, so to add your own functionality that might be specific to one object type or another, you just need to extend it.

```

class MablePeople extends MableObject<Person> {
  getCombinedAge(): number {
    let combinedAge = 0;

    this.forEach(person => {
      combinedAge += person.age;
    });

    return combinedAge;
  }
}

let peopleHash = {...};
const people = new MablePeople(peopleHash);

// you can now call getCombinedAge on people.
console.log(people.getCombinedAge());
// as well as all of the normal MableObject functions.
console.log(people.getLength());
```

# The Why

Dealing with large amounts of data in TS/JS can get clunky. You have two options: store the data in an array or store the data in a POJO (Plain Ol' Javascript Object -- or a Record in TS-speak). The problem is that both of these options come with drawbacks. (If you don't care to read the list of drawbacks for each data structure in JS, feel free to jump down to the "Enter mable" section.)

## Array Drawbacks

Arrays make it super simple to add things. Just call array.push(). And with all of the Array prototype helper functions built into JS, looping over them and doing pretty much anything is super simple. But what about other data-management necessities?

To find an item, you're having to do a .find() and potentially loop over the entire array before finding the one item you want.

To edit an item, you need to find the index of the item and then splice together everything before the item, the new item, then everything after the item.

To delete a specific item, you need to splice together everything before the item in question and then everything after into a new array. And you can only do that AFTER calling findIndex() to find the index of the item.

These are just a few examples and I'm already tired just typing the descriptions, much less running through the very mundane task of actually doing it all.

## Object/POJO/Hash Table/Map Class/Record Drawbacks

Objects make adding, deleting, and finding items very easy. To add a new item, just type `object[key] = value.` Deleting an item is a quick, one-line task: `delete object[key]`. Finding an item requires no logic at all: `object[key]`. But when it comes time to loop through your data, your code gets clunky real quick.

To loop through your keys or values, you're having to have calls to `Object.values()` or `Object.keys()` all over the place and you're having to figure out the proper way to loop through these each time. This can get hard to read and it's definitely a chore to type them over and over just to properly loop through your data.

JS' Map class isn't much different. It does provide a built-in way to loop through items, but only with a forEach. You're responsible for coding your own .map() functionality, your own .some(), your own .every(), etc. Also, Map.map() just sounds confusing.

## Enter mable

This is where mable comes in. mable smashes together the best of both worlds. Your data is stored in an object, which means you can manage the data by id/key quickly and easily. And an instance of the MableObject class comes with built in loop helpers, just like JS's native Array object. And your code stays clean and readable without the need for the drawbacks that either/or brings.

Think of mable as a kind of new data structure. It comes with the benefits of both arrays AND POJOs.

# Why Did You Name This "mable"?

Computer science calls the concept of key-value lookups "hash tables," but every language/framework seems to have their own name for their implementation of the hash table data structure and some languages even have multiple names. Swift calls them "dictionaries." Java calls them HashTables. JS calls them "objects" or "maps" or one of 30 different other names.

When trying to come up with a name, a coworker jokingly said I should just smash "map" and "hash table" together to come up with "maple." "mable," which sounds like a lovely grandmother's name, just sounded funnier to me, so I picked that. (Also, this means that my package has awesome SEO value built-in from the start.)

I know what you're wondering to yourself, by the way, and yes, this is how I make life decisions.
