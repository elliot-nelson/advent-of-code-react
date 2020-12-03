// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const fs = require('fs');

function getPuzzleInput(filename) {
    let lines = fs.readFileSync(filename, 'utf8').split('\n');
    if (lines[lines.length - 1] === '') lines.splice(-1);
    return lines;
}

function solve(map, slope) {
    let x = 0, y = 0, trees = 0;
    while (y < map.length) {
        if (map[y][x % map[0].length] === '#') trees++;
        x += slope.x;
        y += slope.y;
    }
    return trees;
}

async function puzzle(input) {
    let map = input.map(line => line.split(''));

    let s1 = solve(map, { x: 3, y: 1 });
    console.log('Part 1 =>', s1);

    let s2 = solve(map, { x: 1, y: 1 }) *
        solve(map, { x: 3, y: 1 }) *
        solve(map, { x: 5, y: 1 }) *
        solve(map, { x: 7, y: 1 }) *
        solve(map, { x: 1, y: 2 });
    console.log('Part 2 =>', s2);
}

puzzle(getPuzzleInput(process.argv[2]));
