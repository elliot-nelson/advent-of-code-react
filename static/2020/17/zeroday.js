// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const { getInput, parseInt2, parseInt10, parseInt16, obj, scan, union, intersection, difference } = require('../../util');

function neighbors(x, y, z, w) {
    let result = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
                for (let l = -1; l <= 1; l++) {
                    if (i !== 0 || j !== 0 || k !== 0 || l !== 0) result.push(`${x + i},${y + j},${z + k},${w + l}`);
                }
            }
        }
    }
    return result;
}

function makeState(grid) {
    let state = {};
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            state[`${x},${y},0,0`] = (grid[y][x] === '#');
        }
    }
    return state;
}

function cycle(state) {
    let next = { ... state };

    for (let w = -13; w <= 13; w++) {
        for (let z = -13; z <= 13; z++) {
            for (let y = -13; y <= 13; y++) {
                for (let x = -13; x <= 13; x++) {
                    let key = `${x},${y},${z},${w}`;
                    let active = state[key];
                    let activeNeighbors = neighbors(x, y, z, w).filter(xyzw => state[xyzw]).length;
                    if (active && (activeNeighbors < 2 || activeNeighbors > 3)) next[key] = false;
                    if (!active && activeNeighbors === 3) next[key] = true;
                }
            }
        }
    }

    return next;
}

async function puzzle(input) {
    let state = makeState(input.split('\n').map(line => line.split('')));

    for (let i = 0; i < 6; i++) {
        state = cycle(state);
    }

    console.log(Object.keys(state).length);
    console.log(Object.values(state).filter(x => x).length);

    console.log('Part 1 =>', Object.values(state).filter(x => x).length);

    console.log('Part 2 =>', 0);
}

puzzle(getInput(process.argv[2]));
