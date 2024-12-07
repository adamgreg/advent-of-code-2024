import { sumOf } from "jsr:@std/collections";

import { getInput } from "./util.ts";

const input = await getInput(6);

// Part one

// Map dimensions
const width = input.indexOf("\n") + 1;

// Determine initial position and direction of the guard
// Direction is the number of characters in the input she will move each step
const guardMatch = input.match(/[v^<>]/)!;
const initialPos = guardMatch.index!;
const initialDir = {
    "^": -width,
    "v": width,
    "<": -1,
    ">": 1,
}[guardMatch[0]]!;

// The next step (direction) to take if turning right
const turnRight = new Map([
    [-width, 1],
    [1, width],
    [width, -1],
    [-1, -width],
]);

/** Walk the guard around her route
 * @param pos - starting position, as index in input string
 * @param dir - starting direction, as step for input string index
 * @oaram obstaclePos - Optional position (index) for extra obstacle
 */
function walk(pos: number, dir: number, obstaclePos?: number) {
    // Set of directions taken when visiting each square
    const visited = new Map<number, Set<number>>();

    // Loop while in bounds
    while ((pos > 0) && (pos < input.length) && ((pos + 1) % width !== 0)) {
        // Record that this square has been visited in this direction
        if (visited.get(pos)?.add(dir) === undefined) {
            visited.set(pos, new Set([dir]));
        }

        // Turn right as necessary
        while (input[pos + dir] === "#" || pos + dir === obstaclePos) {
            dir = turnRight.get(dir)!;
        }

        // Advance
        pos += dir;

        if (visited.get(pos)?.has(dir)) return { visited, inLoop: true };
    }

    return { visited, inLoop: false };
}

const { visited } = walk(initialPos, initialDir);
const one = visited.size;

console.log("Part one:", one);

// Part two

// Check each square that the guard normally walks in.
const two = sumOf(
    visited.keys(),
    (obstaclePos) => walk(initialPos, initialDir, obstaclePos).inLoop ? 1 : 0,
);

console.log("Part two:", two);
