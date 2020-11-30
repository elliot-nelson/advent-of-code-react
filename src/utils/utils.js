/* Utilities */

// Retrieve a puzzle input as an array of lines.
export async function getPuzzleInput(filename) {
  const data = await fetch(filename).then(result => result.text());
  let lines = data.split('\n');
  if (lines[lines.length - 1] === '') lines.splice(-1);
  return lines;
}
