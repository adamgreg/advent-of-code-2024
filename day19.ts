import { memoize } from "jsr:@std/cache";
import { sumOf } from "jsr:@std/collections";

import { getInput } from "./util.ts";

const input = await getInput(19);

const [towelStr, patternStr] = input.split("\n\n", 2);

const patterns = patternStr.trimEnd().split("\n");
const towels = towelStr.split(", ").map((x) => new RegExp("^" + x));

// Part one

/** Recurse through towel options to test is pattern is possible */
const isPossible = memoize((pattern: string): boolean => {
    if (pattern.length === 0) return true;
    const options = towels.filter((x) => x.test(pattern));
    return options.some((x) => isPossible(pattern.slice(x.source.length - 1)));
});

const one = sumOf(patterns, (x) => isPossible(x) ? 1 : 0);

console.log("Part one:", one);

// Part two

/** Recurse through towel options counting ways to make pattern */
const countWays = memoize((pattern: string): number => {
    if (pattern.length === 0) return 1;
    const options = towels.filter((x) => x.test(pattern));
    return sumOf(options, (x) => countWays(pattern.slice(x.source.length - 1)));
});

const two = sumOf(patterns, countWays);

console.log("Part two:", two);
