const fs = require('fs');

function getPuzzleInput(filename) {
    let lines = fs.readFileSync(filename, 'utf8').split('\n');
    if (lines[lines.length - 1] === '') lines.splice(-1);
    return lines;
}

async function puzzle(input) {
    input = input.map(x => parseInt(x, 10));
    for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {
            if (input[i] + input[j] === 2020) {
                console.log('Part 1 =>', input[i] * input[j]);
            }
            for (let k = j + 1; k < input.length; k++) {
                if (input[i] + input[j] + input[k] === 2020) {
                    console.log('Part 2 =>', input[i] * input[j] * input[k]) ;
                }
            }
        }
    }
}

puzzle(getPuzzleInput(process.argv[2]));
