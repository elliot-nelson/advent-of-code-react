// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const fs = require('fs');
const { getInput, parseInt2, parseInt10, parseInt16, obj, scan, union, intersection, difference } = require('../../util');

function parseRules(lines) {
    return Object.fromEntries(
        lines.map(line => scan(line, /(.+) bags contain (.+)\.$/, true, list => {
            list = list.split(', ').filter(x => x !== 'no other bags').map(rule =>
                scan(rule, /(\d+) (.+) bag/, parseInt10, true).reverse()
            );
            return list.length ? Object.fromEntries(list) : {};
        }))
    );
}

function canContain(rules, color) {
    return union(
        ...Object.keys(rules).filter(key => rules[key][color]).map(search => canContain(rules, search).concat(search))
    );
}

function countBagsInside(rules, color) {
    return Object.keys(rules[color]).reduce((sum, key) =>
        sum + (1 + countBagsInside(rules, key)) * rules[color][key], 0
    );
}

async function puzzle(input) {
    let rules = parseRules(input.split('\n'));

    console.log('Part 1 =>', canContain(rules, 'shiny gold').length);

    console.log('Part 2 =>', countBagsInside(rules, 'shiny gold'));
}

puzzle(getInput(process.argv[2]));
