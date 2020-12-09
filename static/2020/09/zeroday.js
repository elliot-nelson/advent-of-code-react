// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const { getInput, parseInt2, parseInt10, parseInt16, obj, scan, union, intersection, difference } = require('../../util');

function valid(list, number) {
    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            if (number === list[i] + list[j]) return true;
        }
    }
    return false;
}

function findInvalid(numbers) {
    let list = [];
    numbers = [...numbers];
    for (let i = 0; i < 25; i++) list.push(numbers.shift());

    while (numbers.length > 0) {
        let number = numbers.shift();
        if (!valid(list, number)) return number;
        list.push(number);
        if (list.length > 25) list.shift();
    }

    return false;
}

function findWeakness(numbers, number) {
    for (let i = 0; i < numbers.length; i++) {
        let sum = 0;
        for (let j = i; j < numbers.length; j++) {
            sum += numbers[j];
            if (sum === number) {
                return [Math.min(...numbers.slice(i, j + 1)), Math.max(...numbers.slice(i, j + 1))];
            } else if (sum > number) break;
        }
    }
    return false;
}


async function puzzle(input) {
    const numbers = input.split('\n').map(parseInt10);

    let part1 = findInvalid(numbers);
    console.log('Part 1 =>', part1);

    let part2 = findWeakness(numbers, part1);
    console.log('Part 2 =>', part2[0] + part2[1]);
}

puzzle(getInput(process.argv[2]));
