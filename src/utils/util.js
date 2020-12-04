// Speed running utilities
//
// These functions assist in quickly writing puzzle solving code. Not as important when
// writing the React versions of the puzzle solutions, but if I decie to attempt the
// leaderboard for a puzzle they come in handy. (Sometimes, I'll use these in the React
// solution as well just because I've already written it.)

export function int(value) {
  return parseInt(value, 10);
}

export function hex(value) {
  return parseInt(value, 16);
}

export function scan(string, regex, ...transformers) {
  let result = [];
  let match = string.match(regex);
  if (!match) return;
  for (let i = 1; i < regex.length; i++) {
    if (transform[i] === false) continue;
    result.push(transform[i] && transform[i] !== true ? transform[i](match[i]) : match[i]);
  }
}

export function obj(array, keys) {
  let result = {};
  for (let i = 0; i < array.length; i++) {
    if (keys[i]) result[keys[i]] = array[i];
  }
  return result;
}
