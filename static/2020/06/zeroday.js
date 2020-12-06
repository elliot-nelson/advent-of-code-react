const { createHash } = require('crypto');
// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const { getInput, int, hex, obj, scan, union, difference, intersection } = require('../../util');

function answers(group) {
    return union(group.split('\n').map(line => line.split('')).flat());
}

function answers2(group) {
    return intersection(...group.split('\n').map(answers));
}

async function puzzle(input) {
    let groups = input.split('\n\n');

    console.log('Part 1 =>', groups.map(answers).reduce((a, b) => a + b.length, 0));

    console.log('Part 2 =>', groups.map(answers2).reduce((a, b) => a + b.length, 0));
}

puzzle(getInput(process.argv[2]));
