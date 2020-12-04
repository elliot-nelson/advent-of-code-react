# Advent of Code: JavaScript Speedrun Tips

This is my personal list of tips for speedrunning Advent of Code solutions in JavaScript.

## Parse integers and hex values

The `parseInt` function is awkward because it isn't bindable (the base argument comes at the end).
Writing utility functions that are always ready to go will make parsing values much cleaner.

```js
function int(value) {
    return parseInt(value, 10);
}

function hex(value) {
    return parseInt(value, 16);
}

const line = `3 5 7 9`;

line.split(' ').map(int)
// => [3, 5, 7, 9]
```

## Scan a string with multiple types

Write a utility function and use it any time you need to scan a complex line. If you are familiar
with regular expressions, the parsing itself isn't hard, but you lose precious seconds converting
various pieces of data into the right type afterwards.

```js
// Save this function
// You can use your own API for the transformers, but I prefer:
//   `undefined` or `true` means pass as-is
//   `false` means DO NOT include in the result (ignore it)
//   any other value should be a function
function scan(string, regex, ...transformers) {
  let result = [];
  let match = string.match(regex);
  if (!match) return;
  for (let i = 1; i < match.length; i++) {
    if (transformers[i - 1] === false) continue;
    result.push(transformers[i - 1] && transformers[i - 1] !== true ? transformers[i - 1](match[i]) : match[i]);
  }
  return result;
}

const line = `INV 3-5: 0x00002938423`;

scan(line, /([A-Z]+) (\d+)-(\d+): (.+)/, [true, int, int, true])
// => ['INV', 3, 5, 4882526723]
```

## Turn an array into an object

Passing around arrays of complex values works in JavaScript, but it can get confusing quickly
in the complicated puzzles. Write a utility function to easily convert an array to an object
with named properties. Usually you'll use this in combination with one or more of the utilities
above...

```js
function obj(array, keys) {
    let result = {};
    for (let i = 0; i < array.length; i++) {
        if (keys[i]) result[keys[i]] = array[i];
    }
    return result;
}

const entry = ['TURN', 'R', 36, 5, true];

obj(entry, ['cmd', 'arg', 'line', 'count', 'repeat'])
// => { cmd: 'TURN', arg: 'R', line: 36, count: 5, repeat: true }
```

## Make an object out of key value pairs

Quickly object-ify key value pairs from strings using `Object.fromEntries`.

```js
const line = `x=3 y=4 z=5`;

Object.fromEntries(line.split(' ').map(kv => kv.split('=')))
// => { x: 3, y: 4, z: 5 }
```

```js
const line = `color:purple friendly:no`;

Object.fromEntries(line.split(' ').map(kv => kv.split(':')))
// => { color: 'purple', friendly: 'no' }
```
