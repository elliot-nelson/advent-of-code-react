// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const { getInput, parseInt2, parseInt10, parseInt16, obj, scan, union, intersection, difference } = require('../../util');

function findChain(adapters) {
    return adapters.sort((a, b) => a - b);
}

function getDifferences(chain) {
    let diffs = [0, 0, 0, 0];

    // First adapter
    diffs[chain[0]]++;

    for (let i = 1; i < chain.length; i++) {
        diffs[chain[i] - chain[i - 1]]++;
    }

    // Final adapter
    diffs[3]++;

    return diffs;
}

function countGroupCombos(group) {
    let max = 2 ** group.length;
    let found = 0;

    if (group.length < 3) return 1;

    for (let i = 0; i < max; i++) {
        // We can ignore any list that doesn't start with first item and end with last item
        if ((i & 1) === 0) continue;
        if ((i & (max >> 1)) === 0) continue;

        let possible = group.filter((value, index) => i & (1 << index));
        if (!possible.find((value, index) => index > 0 && possible[index] - possible[index - 1] > 3)) found++;
    }

    return found;
}

function countCombinations(chain) {
    let groups = chain.reduce((groups, item, index) => {
        if (index > 0 && chain[index] - chain[index - 1] === 3) groups.push([]);
        groups[groups.length - 1].push(item);
        return groups;
    }, [[]]);

    groups[0].unshift(0);

    return groups.map(countGroupCombos).reduce((product, value) => product * value, 1);
}

async function puzzle(input) {
    let adapters = input.split('\n').map(parseInt10);
    let chain = findChain(adapters);
    let diffs = getDifferences(chain);

    console.log('Part 1 =>', diffs[1] * diffs[3]);

    let combinations = countCombinations(chain);
    console.log('Part 2 =>', combinations);
}

puzzle(getInput(process.argv[2]));
