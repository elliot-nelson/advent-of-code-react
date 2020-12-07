// Speed running utilities
//
// These functions assist in quickly writing puzzle solving code. Not as important when
// writing the React versions of the puzzle solutions, but if I decide to attempt the
// leaderboard for a puzzle they come in handy. (Sometimes, I'll use these in the React
// solution as well just because I've already written it.)

const fs = require('fs');

function getInput(filename) {
  let lines = fs.readFileSync(filename, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') lines.splice(-1);
  return lines.join('\n');
}

function parseInt2(value) {
  return parseInt(value, 2);
}

function int(value) {
  return parseInt(value, 10);
}
function parseInt10(value) {
  return parseInt(value, 10);
}

function hex(value) {
  return parseInt(value, 16);
}
function parseInt16(value) {
  return parseInt(value, 16);
}

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

function obj(array, keys) {
  let result = {};
  for (let i = 0; i < array.length; i++) {
    if (keys[i]) result[keys[i]] = array[i];
  }
  return result;
}

function union(...arrays) {
  let a = (arrays.shift() || []).concat(...arrays);
  return [...new Set(a)];
}

function intersection(...arrays) {
  let a = arrays.shift() || [], b;
  while (b = arrays.shift()) {
    a = a.filter(x => b.includes(x));
  }
  return a;
}

function difference(...arrays) {
  let a = arrays.shift() || [], b;
  while (b = arrays.shift()) {
    a = a.filter(x => !b.includes(x));
  }
  return a;
}

module.exports = {
  getInput,
  parseInt2,
  parseInt10,
  parseInt16,
  int, hex, scan, obj,
  union,
  intersection,
  difference
};
