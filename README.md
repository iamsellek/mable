# mable-hash

A helper for storing and iterating over data in hash tables in TS/JS.

# The Why

Dealing with large amounts of data in TS/JS can get clunky. You have two options: store the data in an array or store the data in a POJO (Plain Ol' Javascript Object -- or a Record in TS-speak). The problem is that both of these options come with drawbacks. (If you don't care to read the list of drawbacks for each data structure in JS, feel free to jump down to the "Enter mable" section.)

## Array Drawbacks

Arrays make it super simple to add things. Just call array.push(). And with all of the Array prototype helper functions built into JS, looping over them and doing pretty much anything is super simple. But what about other data-management necessities?

To find an item, you're having to do a .find() and potentially loop over the entire array before finding the one item you want.

To edit an item, you need to find the index of the item and then splice together everything before the item, the new item, then everything after the item.

To delete a specific item, you need to splice together everything before the item in question and then everything after into a new array. And you can only do that AFTER calling findIndex() to find the index of the item.

These are just a few examples and I'm already tired just typing the descriptions, much less running through the very mundane task of actually doing it all.

## Object/POJO/Hash table/Record Drawbacks

Objects make adding, deleting, and finding items very easy. To add a new item, just type `object[key] = value.` Deleting an item is a quick, one-line task: `delete object[key]`. Finding an item requires no logic at all: `object[key]`. But when it comes time to loop through your data, your code gets clunky real quick.

To loop through your keys or values, you're having to have calls to `Object.values()` or `Object.keys()` all over the place and you're having to figure out the proper way to loop through these each time. This can get hard to read and it's definitely a chore to type them over and over just to properly loop through your data.

# Enter mable

This is where mable comes in. mable smashes together the best of both worlds. Your data is stored in an object, which means you can manage the data by id/key quickly and easily. And an instance of the MableObject class comes with built in loop helpers, just like JS's native Array object. And your code stays clean and readable without the need for the drawbacks that either/or brings.

Think of mable as a kind of new data structure. It comes with the benefits of both arrays AND POJOs.

# Why Did You Name This "mable"?

Computer science calls the concept of key-value lookups "hash tables," but every language/framework seems to have their own name for their implementation of the hash table data structure and some languages even have multiple names. Swift calls them "dictionaries." Java calls them HashTables. JS calls them "objects" or "maps" or one of 30 different other names.

When trying to come up with a name, a coworker jokingly said I should just smash "map" and "hash table" together to come up with "maple." "mable," which sounds like a lovely grandmother's name, just sounded funnier to me, so I picked that. (Also, this means that my package has awesome SEO value built-in from the start.)

I know what you're wondering to yourself, by the way, and yes, this is how I make life decisions.
