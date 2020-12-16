// The "zero day" version is a fast node script to try and validate a
// solution. It might not exist if I didn't race that day.

const { getInput, parseInt2, parseInt10, parseInt16, obj, scan, union, intersection, difference } = require('../../util');

function winner(busIds) {
    let equations = busIds.map((value, index) => [value, index]).filter(x => x[0]).map(eq => {
        return { m: BigInt(eq[0]), a: BigInt(-(eq[1] % eq[0])) };
    });

    // m = m1 * m2 * m3 * m4 ... mN
    let m = equations.reduce((product, eq) => product * eq.m, 1n);

    // zI = m / mI
    let z = equations.map(eq => m / eq.m);

    // yI = zI inverse mod mI, or in other words, yI = the number that when
    // multiplied by zI mod mI is 1. There are algorithms for this, but because
    // each individual bus id is small, we can easily brute force this small section.
    let y = equations.map((eq, index) => {
        for (let i = 0n; i < eq.m; i++) {
            if (((z[index] % eq.m) * i) % eq.m === 1n) return i;
        }
    });

    // wI = yI * zI mod m
    let w = equations.map((eq, index) => {
        return (y[index] * z[index]) % m;
    });

    // x = a1 * w1 + a2 * w2 + ... + aN * wN mod m
    let x = equations.reduce((sum, eq, index) => {
        let result = (sum + eq.a * w[index]) % m;
        while (result < 0) result += m;
        return result;
    }, 0n) % m;

    return x;
}

async function puzzle(input) {
    let lines = input.split('\n');
    let startTime = parseInt10(lines[0]);
    let busIds = lines[1].split(',').map(parseInt10);

    console.log(busIds);

    let t = startTime, id;
    for (;;) {
        id = busIds.find(x => x && t % x === 0);
        if (id) break;
        t++;
    }

    console.log('Part 1 =>', t, id, (t - startTime) * id);

    console.log('Part 2 =>', winner(busIds));
}

puzzle(getInput(process.argv[2]));
