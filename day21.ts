import { memoize } from "jsr:@std/cache";
import { minOf, sumOf } from "jsr:@std/collections";

import { getInput } from "./util.ts";

const input = await getInput(21);

const codes = input.trim().split("\n");

/** Co-ordinates of keys on numeric keypad */
const numCoords = {
    "7": [2, 3] as const,
    "8": [1, 3] as const,
    "9": [0, 3] as const,
    "4": [2, 2] as const,
    "5": [1, 2] as const,
    "6": [0, 2] as const,
    "1": [2, 1] as const,
    "2": [1, 1] as const,
    "3": [0, 1] as const,
    "0": [1, 0] as const,
    A: [0, 0] as const,
};

/** Co-ordinates of keys on directional keypad */
const dirCoords = {
    "^": [1, 0] as const,
    "<": [2, -1] as const,
    ">": [0, -1] as const,
    v: [1, -1] as const,
    A: [0, 0] as const,
};

/** Co-ordinates of keys on both keypads */
const coords = Object.assign(numCoords, dirCoords);

type Key = keyof typeof coords;
type DirKey = keyof typeof dirCoords;

/**
 * Returns the directional keypresses to move a robot from one key to another
 * and press it
 */
const getPresses = memoize((fromKey: Key, toKey: Key): DirKey[][] => {
    const [fromX, fromY] = coords[fromKey];
    const [toX, toY] = coords[toKey];

    // Calculate movement from current position, and convert to keypresses
    const dx = toX - fromX;
    const dy = toY - fromY;
    const horz = dx >= 0 ? Array(dx).fill("<") : Array(-dx).fill(">");
    const vert = dy >= 0 ? Array(dy).fill("^") : Array(-dy).fill("v");

    // Return choices of horizontal or vertical first, avoiding the gap
    if (toX === 2 && fromY === 0) return [vert.concat(horz, ["A"])];
    if (fromX === 2 && toY === 0) return [horz.concat(vert, ["A"])];
    return [horz.concat(vert, ["A"]), vert.concat(horz, ["A"])];
});

/** Cost of typing a particular key via a certain number of robots */
const cost = memoize((key: Key, prevKey: Key, numBots: number): number => {
    if (numBots === 0) return 1; // Cost at outermost level
    if (key === prevKey) return 1; // Repeat key
    return minOf(getPresses(prevKey, key), (presses) =>
        presses.reduce(
            (acc, x, idx, arr) =>
                acc + cost(x, arr[idx - 1] ?? "A", numBots - 1),
            0,
        ))!;
});

/** Calculate the complexity for a single code, via a number of robots */
function complexity(code: string, numBots: number) {
    const numKeys = code.split("") as Key[];
    const presses = numKeys.reduce(
        (acc, x, i, arr) => acc + cost(x, arr[i - 1] ?? "A", numBots),
        0,
    );
    const num = parseInt(code.slice(0, -1));
    return presses * num;
}

// Part one

const one = sumOf(codes, (code) => complexity(code, 3));

console.log("Part one:", one);

// Part two

const two = sumOf(codes, (code) => complexity(code, 26));

console.log("Part two:", two);
