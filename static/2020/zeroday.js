// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const fs = require('fs');

function getPuzzleInput(filename) {
    let lines = fs.readFileSync(filename, 'utf8').split('\n');
    if (lines[lines.length - 1] === '') lines.splice(-1);
    return lines;
}

function isValid(password) {
    let sum = password[3].split('').filter(c => c === password[2]).length;
    return sum >= password[0] && sum <= password[1];
}

function isValid2(password) {
    let matches = [
        password[3][password[0] - 1] === password[2],
        password[3][password[1] - 1] === password[2]
    ];

    return matches[0] !== matches[1];
}

async function puzzle(input) {
    let passwords = input.map(s => s.match(/(\d+)-(\d+) (.): (.+)/)).map(a => [
        parseInt(a[1], 10), parseInt(a[2], 10), a[3], a[4]
    ]);

    let valid = passwords.filter(isValid);
    console.log('Part 1 =>', valid.length);

    let valid2 = passwords.filter(isValid2);
    console.log('Part 2 =>', valid2.length);
}

puzzle(getPuzzleInput(process.argv[2]));
