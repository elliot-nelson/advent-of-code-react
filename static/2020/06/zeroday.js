const { createHash } = require('crypto');
// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const fs = require('fs');
const { int, hex, obj, scan } = require('../../util');

function getPuzzleInput(filename) {
    let lines = fs.readFileSync(filename, 'utf8').split('\n');
    if (lines[lines.length - 1] === '') lines.splice(-1);
    return lines;
}

function answers(group) {
    let hash = {};
    for (let i = 0; i < group.length; i++) {
        if (group[i] >= 'a' && group[i] <= 'z') {
            hash[group[i]] = true;
        }
    }
    return hash;
}

function answers2(group) {
    let hashes = group.split('\n').map(answers);
    let combined = hashes.reduce((a, b) => ({ ...a, ...b }));

    Object.keys(combined).forEach(key => {
        hashes.forEach(hash => {
            if (!hash[key]) combined[key] = false;
        });
    });

    return combined;
}

async function puzzle(input) {
    let groups = input.join('\n').split('\n\n');

    console.log('Part 1 =>', groups.map(answers).reduce((a, b) => a + Object.keys(b).length, 0));

    console.log('Part 2 =>', groups.map(answers2).reduce((a, b) => a + Object.keys(b).filter(x => b[x]).length, 0));
}

puzzle(getPuzzleInput(process.argv[2]));
