// Speed running utilities
//
// These functions assist in quickly writing puzzle solving code. Not as important when
// writing the React versions of the puzzle solutions, but if I decide to attempt the
// leaderboard for a puzzle they come in handy. (Sometimes, I'll use these in the React
// solution as well just because I've already written it.)

function int(value) {
  return parseInt(value, 10);
}

function hex(value) {
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

module.exports = { int, hex, scan, obj };
