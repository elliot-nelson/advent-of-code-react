// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

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

function occupied(grid, x, y) {
    let count = 0;

    [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, -1],
        [0, 1]
    ].forEach(k => {
        let xp = x + k[0], yp = y + k[1];
        if (xp >= 0 && xp < grid[0].length && yp >= 0 && yp < grid.length && grid[yp][xp] === '#') count++;
    });

    return count;
}

function occupied2(grid, x, y) {
    let count = 0;

    [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, -1],
        [0, 1]
    ].forEach(k => {
        let xp = x + k[0], yp = y + k[1];
        for (;;) {
            if (xp < 0 || xp >= grid[0].length || yp < 0 || yp >= grid.length) return;
            if (grid[yp][xp] === '#') {
                count++; return;
            }
            if (grid[yp][xp] === 'L') {
                return;
            }
            xp += k[0];
            yp += k[1];
        }
    });

    return count;
}

function step(grid, mode) {
    let next = [];

    for (let y = 0; y < grid.length; y++) {
        next.push([]);
        for (let x = 0; x < grid[0].length; x++) {
            next[y][x] = grid[y][x];
            if (mode) {
                if (grid[y][x] === 'L' && occupied2(grid, x, y) === 0) next[y][x] = '#';
                if (grid[y][x] === '#' && occupied2(grid, x, y) >= 5) next[y][x] = 'L';
            } else {
                if (grid[y][x] === 'L' && occupied(grid, x, y) === 0) next[y][x] = '#';
                if (grid[y][x] === '#' && occupied(grid, x, y) >= 4) next[y][x] = 'L';
            }
        }
    }
    return next;
}

async function puzzle(input) {
    let grid = input.split('\n').map(line => line.split(''));

    let seen = [];

    while (true) {
        let string = grid.map(line => line.join('')).join('\n');
        console.log(string);
        console.log('---');
        seen.push(string);
        grid = step(grid);
        if (seen[seen.length - 1] === seen[seen.length - 2]) break;
    }

    let result = seen[seen.length - 1].split('').filter(c => c === '#').length;
    console.log('Part 1 =>', result);

    console.log('xxxx');
    seen = [];
    grid = input.split('\n').map(line => line.split(''));
    while (true) {
        let string = grid.map(line => line.join('')).join('\n');
        console.log(string);
        console.log('---');
        seen.push(string);
        grid = step(grid, true);
        if (seen[seen.length - 1] === seen[seen.length - 2]) break;
        console.log('f');
    }

    result = seen[seen.length - 1].split('').filter(c => c === '#').length;
    console.log('Part 2 =>', result);
}

puzzle(getInput(process.argv[2]));
