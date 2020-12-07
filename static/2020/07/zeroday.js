// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const fs = require('fs');
const { getInput, parseInt2, parseInt10, parseInt16, obj, scan, union, intersection, difference } = require('../../util');

function parseRules(input) {
    let rules = {};

    for (let line of input) {
        let [color, contains] = line.replace(/\.$/, '').split(' bags contain ');
        contains = contains.split(', ');
        if (contains[0] === 'no other bags')
            rules[color] = {};
        else
            rules[color] = Object.fromEntries(contains.map(x => scan(x, /(\d+) (.+) bag/, parseInt10, true).reverse()));
    }

    return rules;
}

function canContain(rules, color) {
    let visited = {};
    let queue = [color];

    while (queue.length > 0) {
        let search = queue.shift();
        if (visited[search]) continue;
        visited[search] = true;

        queue = queue.concat(Object.keys(rules).filter(key => rules[key][search]));
    }

    return difference(Object.keys(visited), color);
}

function countBags(rules, color) {
    let count = 1;

    for (let key of Object.keys(rules[color])) {
        count += countBags(rules, key) * rules[color][key];
    }

    return count;
}

async function puzzle(input) {
    let rules = parseRules(input.split('\n'));

    console.log('Part 1 =>', canContain(rules, 'shiny gold').length);

    console.log('Part 2 =>', countBags(rules, 'shiny gold') - 1);
}

puzzle(getInput(process.argv[2]));
