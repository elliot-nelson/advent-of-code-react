// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

import * as fs from 'fs';
import { int, hex, obj, scan } from '../../../src/utils/util.js';

function getPuzzleInput(filename) {
    let lines = fs.readFileSync(filename, 'utf8').split('\n');
    if (lines[lines.length - 1] === '') lines.splice(-1);
    return lines;
}

function valid1(passport) {
    let fields = [
        'byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'
    ];

    for (let field of fields) {
        if (!passport[field]) return false;
    }

    return true;
}

function valid2(passport) {
    if (!valid1(passport)) return false;

    if (int(passport.byr) < 1920 || int(passport.byr) > 2002) return false;
    if (int(passport.iyr) < 2010 || int(passport.iyr) > 2020) return false;
    if (int(passport.eyr) < 2020 || int(passport.eyr) > 2030) return false;
    let hgt = passport.hgt.match(/^(\d+)(cm|in)$/);
    if (!hgt) return false;
    if (hgt[2] === 'cm' && (int(hgt[1]) < 150 || int(hgt[1]) > 193)) return false;
    if (hgt[2] === 'in' && (int(hgt[1]) < 59 || int(hgt[1]) > 76)) return false;
    if (!passport.hcl.match(/^#[0-9a-f]{6}$/)) return false;
    if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(passport.ecl)) return false;
    if (!passport.pid.match(/^\d{9}$/)) return false;

    return true;
}

async function puzzle(input) {
    let passports = input.join('\n').split('\n\n').map(entry => entry.replace(/\n/g, ' '));
    passports = passports.map(data =>
        Object.fromEntries(data.trim().split(/ +/).map(entry => entry.split(':')))
    );

    console.log('Part 1 =>', passports.filter(valid1).length);
    console.log('Part 2 =>', passports.filter(valid2).length);
}

puzzle(getPuzzleInput(process.argv[2]));
