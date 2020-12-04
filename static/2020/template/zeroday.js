// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const fs = require('fs');
const { int, hex, obj, scan } = require('../../util');

function getPuzzleInput(filename) {
    let lines = fs.readFileSync(filename, 'utf8').split('\n');
    if (lines[lines.length - 1] === '') lines.splice(-1);
    return lines;
}

async function puzzle(input) {

    console.log('Part 1 =>', 0);

    console.log('Part 2 =>', 0);
}

puzzle(getPuzzleInput(process.argv[2]));
