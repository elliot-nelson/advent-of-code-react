// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const { getInput, parseInt2, parseInt10, parseInt16, obj, scan, union, intersection, difference } = require('../../util');

function applyMask(value, mask) {
    let bin = (value >>> 0).toString(2).padStart(mask.length, '0');
    return parseInt2(mask.split('').map((c, index) => {
        return c === 'X' ? bin[index] : c;
    }).join(''));
}

function applyMask2(value, mask) {
    let bin = (value >>> 0).toString(2).padStart(mask.length, '0');
    return mask.split('').map((c, index) => {
        return c;
    }).join('');
}

function part1(steps) {
    let mem = [];
    let mask = '';

    for (let step of steps) {
        switch (step.op) {
            case 'mask':
                mask = step.value;
                break;
            case 'set':
                mem[step.pos] = applyMask(step.value, mask);
                break;
        }
        console.log(mem);
    }

    return mem.reduce((sum, value) => sum + (value || 0), 0);
}

async function puzzle(input) {
    let steps = input.split('\n').map(line => {
        let match = line.match(/^mask = (.+)/);
        if (match) {
            return { op: 'mask', value: match[1] };
        } else {
            match = line.match(/^mem\[(\d+)\] = (\d+)/);
            return { op: 'set', pos: parseInt10(match[1]), value: parseInt10(match[2]) };
        }
    });

    console.log(steps);

    console.log('Part 1 =>', part1(steps));

    console.log('Part 2 =>', 0);
}

puzzle(getInput(process.argv[2]));
