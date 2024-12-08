import { sumOf } from "jsr:@std/collections";

import { decInt, getInput } from "./util.ts";

const input = await getInput(7);

// Part one

// Extract equations
const eqs = input.split("\n").map((line) => {
    const [lhs, rhs] = line.split(": ", 2);
    return [decInt(lhs), rhs.split(" ").map(decInt)] as const;
});

function* genOne(operands: number[]): Generator<number> {
    if (operands.length > 1) {
        const [x, ...rest] = operands;
        for (const y of genOne(rest)) {
            yield x + y;
            yield x * y;
        }
    } else yield operands[0];
}

const one = sumOf(
    eqs,
    ([lhs, rhs]) => genOne(rhs.toReversed()).some((x) => x === lhs) ? lhs : 0,
);

console.log("Part one:", one);

// Part two

function* genTwo(operands: number[]): Generator<number> {
    if (operands.length > 1) {
        const [x, ...rest] = operands;
        for (const y of genTwo(rest)) {
            yield x + y;
            yield x * y;
            yield parseInt(`${y}${x}`);
        }
    } else yield operands[0];
}

const two = sumOf(
    eqs,
    ([lhs, rhs]) => genTwo(rhs.toReversed()).some((x) => x === lhs) ? lhs : 0,
);

console.log("Part two:", two);
