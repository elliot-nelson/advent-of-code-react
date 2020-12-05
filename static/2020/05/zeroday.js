// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const fs = require('fs');
const { int, hex, obj, scan } = require('../../util');

function getPuzzleInput(filename) {
    let lines = fs.readFileSync(filename, 'utf8').split('\n');
    if (lines[lines.length - 1] === '') lines.splice(-1);
    return lines;
}

function getRow(spec) {
    let range = [0, 128];

    for (let i = 0; i < 7; i++) {
        if (spec[i] === 'F') {
            range[1] -= (range[1] - range[0]) / 2;
        } else {
            range[0] += (range[1] - range[0]) / 2;
        }
    }

    return range[0];
}

function getCol(spec) {
    let range = [0, 8];

    for (let i = 7; i < 10; i++) {
        if (spec[i] === 'L') {
            range[1] -= (range[1] - range[0]) / 2;
        } else {
            range[0] += (range[1] - range[0]) / 2;
        }
    }

    return range[0];
}

function getSeat(spec) {
    let row = getRow(spec), col = getCol(spec), id = (row * 8) + col;

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
