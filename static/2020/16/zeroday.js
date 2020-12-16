// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const { getInput, parseInt2, parseInt10, parseInt16, obj, scan, union, intersection, difference } = require('../../util');

function parseInput(input) {
    let groups = input.split('\n\n');

    return {
        rules: Object.fromEntries(
            groups[0].split('\n').map(line => line.split(': ')).map(entry => {
                entry[1] = entry[1].split(' or ').map(range => range.split('-').map(parseInt10));
                return entry;
            })
        ),
        yours: groups[1].split('\n')[1].split(',').map(parseInt10),
        nearby: groups[2].split('\n').slice(1).map(line => line.split(',').map(parseInt10))
    };
}

function fieldInRange(value, rule) {
    for (let range of rule) {
        if (value >= range[0] && value <= range[1]) {
            return true;
        }
    }
    return false;
}

function fieldIsValid(value, rules) {
    for (let rule of Object.values(rules)) {
        if (fieldInRange(value, rule)) return true;
    }
    return false;
}

function invalidFieldValues(ticket, rules) {
    return ticket.filter(value => !fieldIsValid(value, rules));
}

function mapFieldsToIndex(nearby, rules) {
    let mapping = [];

    // Find all possible matches
    for (let idx = 0; idx < nearby[0].length; idx++) {
        mapping[idx] = [];
        for (let entry of Object.entries(rules)) {
            if (nearby.map(ticket => ticket[idx]).filter(value => fieldInRange(value, entry[1])).length === nearby.length) {
                mapping[idx].push(entry[0]);
            }
        }
    }

    // Winnow
    while (mapping.find(p => p.length > 1)) {
        for (let idx = 0; idx < nearby[0].length; idx++) {
            if (mapping[idx].length === 1) {
                let choice = mapping[idx][0];
                for (let j = 0; j < nearby[0].length; j++) {
                    if (idx === j) continue;
                    mapping[j] = mapping[j].filter(entry => entry !== choice);
                }
            }
        }
    }

    return Object.fromEntries(mapping.map((entry, index) => [entry[0], index]));
}

async function puzzle(input) {
    let { rules, yours, nearby } = parseInput(input);

    let part1 = nearby.map(ticket => invalidFieldValues(ticket, rules)).flat().reduce((sum, x) => sum + x, 0);
    console.log('Part 1 =>', part1);

    let fieldMap = mapFieldsToIndex(nearby.filter(ticket => invalidFieldValues(ticket, rules).length === 0), rules, {});
    let fields = Object.keys(fieldMap).filter(name => name.startsWith('departure'));
    let part2 = fields.map(name => yours[fieldMap[name]]).reduce((product, x) => product * x, 1);
    console.log('Part 2 =>', part2);
}

puzzle(getInput(process.argv[2]));
