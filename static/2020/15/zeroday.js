// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const { getInput, parseInt2, parseInt10, parseInt16, obj, scan, union, intersection, difference } = require('../../util');

function playPart1(numbers, turns) {
    let spoken = {};
    let last, number;
    numbers = [...numbers];

    for (let turn = 0; turn < turns; turn++) {
        if (numbers.length) {
            number = numbers.shift();
            last = number;
            (spoken[number] = spoken[number] || []).push(turn);
        } else {
            if (spoken[last].length > 1) {
                number = spoken[last][spoken[last].length - 1] - spoken[last][spoken[last].length - 2];
            } else {
                number = 0;
            }
            (spoken[number] = spoken[number] || []).push(turn);
            last = number;
        }
    }

    return last;
}

async function puzzle(input) {
    let numbers = input.split('\n')[0].split(',').map(parseInt10);

    console.log('Part 1 =>', playPart1(numbers, 2020));

    console.log('Part 2 =>', playPart1(numbers, 30000000));
}

puzzle(getInput(process.argv[2]));
