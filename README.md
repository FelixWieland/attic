# attic

![](https://badge.fury.io/js/%40fwieland%2Fattic.svg)

Attic synchronizes persistent storage such as localStorage with an object in memory to reduce access time. In addition, it can track the lifetime of an element and discard it if it is too old. To minimize null values, you must specify a fallback (for example, an API query) each time you read from the cache. If an element does not exist or the lifetime of an element has expired, the fallback function is used and the result of this function is stored with the ID passed in the Get function. This means that the cache does not have to be filled explicitly via a set function (although the possibility exists in Attic).

# Installation
```sh
// with npm
npm install @fwieland/attic

// with yarn
yarn add @fwieland/attic
```

# Usage

Here is a quick example to get you started:

```js
import Attic from '@fwieland/attic';

const cache = new Attic("storageName", {
	lifetime: 10000, //10sec
})

cache.get("id1")
	.fallback(() => fetch('https://jsonplaceholder.typicode.com/todos/1').then(r => r.json())
	.then(content => console.log(content));

```

To reduce the boilerplate of extracting the json (in case of API-Requests) attic allows to specify a fallbackExtractor function.

```js
const cache = new Attic("storageName", {
	fallbackExtractor: (r) => r.json(),
})

cache.get("id1")
	.fallback(() => fetch('https://jsonplaceholder.typicode.com/todos/1'))
	.then(content => console.log(content));

```
