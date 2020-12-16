// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const { getInput, parseInt2, parseInt10, parseInt16, obj, scan, union, intersection, difference } = require('../../util');

function follow(steps) {
    let x = 0, y = 0, facing = 0;

    for (let step of steps) {
        switch (step[0]) {
            case 'N':
                y -= step[1];
                break;
            case 'S':
                y += step[1];
                break;
            case 'E':
                x += step[1];
                break;
            case 'W':
                x -= step[1];
                break;
            case 'L':
                facing += step[1];
                break;
            case 'R':
                facing -= step[1];
                break;
            case 'F':
                x += Math.round(Math.cos(facing * Math.PI / 180) * step[1]);
                y -= Math.round(Math.sin(facing * Math.PI / 180) * step[1]);
                break;
        }
        console.log(x,y);
    }

    return [x,y];
}

function followWaypoint(steps) {
    let x = 0, y = 0, waypoint = [10, -1];

    let angle, dist;

    for (let step of steps) {
        switch (step[0]) {
            case 'N':
                waypoint[1] -= step[1];
                break;
            case 'S':
                waypoint[1] += step[1];
                break;
            case 'E':
                waypoint[0] += step[1];
                break;
            case 'W':
                waypoint[0] -= step[1];
                break;
            case 'L':
                angle = Math.atan2(waypoint[1], waypoint[0]) - (step[1] * Math.PI / 180);
                dist = Math.sqrt(waypoint[0] ** 2 + waypoint[1] ** 2);
                waypoint[0] = Math.cos(angle) * dist;
                waypoint[1] = Math.sin(angle) * dist;
                break;
            case 'R':
                angle = Math.atan2(waypoint[1], waypoint[0]) + (step[1] * Math.PI / 180);
                dist = Math.sqrt(waypoint[0] ** 2 + waypoint[1] ** 2);
                waypoint[0] = Math.cos(angle) * dist;
                waypoint[1] = Math.sin(angle) * dist;
                break;
            case 'F':
                x += waypoint[0] * step[1];
                y += waypoint[1] * step[1];
                break;
        }
        console.log(x, y, waypoint);
    }

    return [x,y];
}

async function puzzle(input) {
    let steps = input.split('\n').map(line => scan(line, /(.)(\d+)/, true, parseInt10));

    let result = follow(steps);
    console.log('Part 1 =>', Math.abs(result[0]) + Math.abs(result[1]));

    result = followWaypoint(steps);
    console.log('Part 2 =>', Math.abs(result[0]) + Math.abs(result[1]));
}

puzzle(getInput(process.argv[2]));
