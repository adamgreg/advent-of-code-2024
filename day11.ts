import { memoize } from "jsr:@std/cache";
import { sumOf } from "jsr:@std/collections";

import { decInt, getInput } from "./util.ts";

const input = await getInput(11);

// Part one

/**
 * Transform a single stone recursively. Memoize for performance.
 * @param x The number on the strong
 * @param nBlinks The number of blinks remaining
 * @returns The number of stones this stone becomes after the last blink
 */
const blink = memoize((x: number, nBlinks: number): number => {
    if (nBlinks === 0) return 1;
    nBlinks -= 1;

    if (x === 0) return blink(1, nBlinks);
    const digits = Math.trunc(Math.log10(x)) + 1;
    if (digits % 2 === 0) {
        const div = 10 ** (digits / 2);
        return blink(Math.trunc(x / div), nBlinks) +
            blink(x % div, nBlinks);
    }
    return blink(x * 2024, nBlinks);
});

const line = input.split(" ").map(decInt);

const one = sumOf(line, (x) => blink(x, 25));
console.log("Part one:", one);

// Part two

const two = sumOf(line, (x) => blink(x, 75));
console.log("Part two:", two);
