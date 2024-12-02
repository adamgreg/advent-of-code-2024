import { sumOf } from "jsr:@std/collections";

import { decInt, getInput } from "./util.ts";

const input = await getInput(2);

// Part one

function isSafe(levels: number[]) {
    const diff = levels.slice(1).map((x, i) => x - levels[i]);
    if (diff.every((x) => (x > 0 && x < 4))) return 1;
    if (diff.every((x) => (x < 0 && x > -4))) return 1;
    return 0;
}

const records = input.split("\n").map((line) => line.split(" ").map(decInt));

const one = sumOf(records, isSafe);

console.log("Part one:", one);

// Part two

const two = sumOf(
    records,
    (x) => isSafe(x) || x.some((_, n) => isSafe(x.toSpliced(n, 1))) ? 1 : 0,
);

console.log("Part two:", two);
