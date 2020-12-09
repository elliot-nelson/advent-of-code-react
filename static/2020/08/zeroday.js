// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const fs = require('fs');
const { getInput, parseInt2, parseInt10, parseInt16, obj, scan, union, intersection, difference } = require('../../util');

function runProgram(instructions) {
    let acc = 0, ptr = 0;
    let visited = [];

    while (ptr < instructions.length) {
        if (visited.includes(ptr)) {
            return { code: 7, acc };
        }

        visited.push(ptr);

        let instr = instructions[ptr];
        if (instr.op === 'nop') {
            ptr++;
        } else if (instr.op === 'jmp') {
            ptr += instr.arg;
        } else if (instr.op === 'acc') {
            acc += instr.arg;
            ptr++;
        }
    }

    return { code: 0, acc };
}

function findWorkingProgram(instructions) {
    for (let i = 0; i < instructions.length; i++) {
        let copy = [...instructions];
        if (copy[i].op === 'jmp') {
            copy[i] = { op: 'nop', arg: copy[i].arg };
        } else if (copy[i].op === 'nop') {
            copy[i] = { op: 'jmp', arg: copy[i].arg };
        } else {
            continue;
        }

        let result = runProgram(copy);
        if (result.code === 0) return result;
    }
}

async function puzzle(input) {
    const instructions = input.split('\n').map(line =>
        obj(scan(line, /(.+) (.+)/, true, parseInt10), ['op', 'arg'])
    );

    let result = runProgram(instructions);
    console.log('Part 1 =>', result);

    result = findWorkingProgram(instructions);
    console.log('Part 2 =>', result);
}

puzzle(getInput(process.argv[2]));
