// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const fs = require('fs');
const { int, hex, obj, scan } = require('../../util');

function getPuzzleInput(filename) {
    let lines = fs.readFileSync(filename, 'utf8').split('\n');
    if (lines[lines.length - 1] === '') lines.splice(-1);
    return lines;
}

function getSeat(spec) {
    let id = parseInt(spec.replace(/F|L/g, '0').replace(/B|R/g, '1'), 2),
        row = id & 0b111,
        col = id >> 3;

    return { row, col, id };
}

async function puzzle(input) {
    let seats = input.map(getSeat);

    console.log('Part 1 =>', Math.max(...seats.map(seat => seat.id)));

    seats.sort((a, b) => a.id - b.id);

    let seat = undefined;
    for (let i = 1; i < seats.length; i++) {
        if (seats[i + 1].id !== seats[i].id + 1) {
            seat = seats[i].id + 1;
            break;
        }
    }

    console.log('Part 2 =>', seat);
}

puzzle(getPuzzleInput(process.argv[2]));
