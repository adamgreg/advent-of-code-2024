import { sortBy, sumOf } from "jsr:@std/collections";

import { getInput } from "./util.ts";

const input = await getInput(15);

const [mapStart, moveChars] = input.split("\n\n", 2).map((x) =>
    x.replaceAll("\n", "").split("")
);
const width = input.indexOf("\n");

const strides = { ">": 1, "<": -1, "v": width, "^": -width };
const moves = (moveChars as (keyof typeof strides)[]).map((x) => strides[x]);

// Find the starting position of the bot, and replace with empty space
const botStartIdx = mapStart.indexOf("@");
mapStart[botStartIdx] = ".";

// Part one

// Take a copy of the map, to mutate
const map = Array.from(mapStart);

/** Find index of the next empty space. Null if a wall is encountered first */
function findSpace(startIdx: number, stride: number) {
    let i = startIdx;
    while (true) {
        switch (map[i]) {
            case ".":
                return i;
            case "#":
                return null;
        }
        i += stride;
    }
}

/** Perform a single move, updating botIdx and the map */
function doMove(botIdx: number, dir: number) {
    const nextIdx = botIdx + dir;
    const spaceIdx = findSpace(nextIdx, dir);
    if (spaceIdx === null) return botIdx; // Blocked
    if (spaceIdx !== nextIdx) {
        // Push boxes
        map[spaceIdx] = "O";
        map[nextIdx] = ".";
    }
    return nextIdx; // Move bot
}

// Perform the bot's moves
moves.reduce(doMove, botStartIdx);

/** Convert a map index to the GPS co-ordinate */
function idxToGps(idx: number) {
    return Math.trunc(idx / width) * 100 + idx % width;
}

// Sum the GPS co-ordinates of each box
const one = sumOf(map.map((x, n) => x === "O" ? n : 0), idxToGps);

console.log("Part one:", one);

// Part two

const widthTwo = width * 2;

// Set of all indices containing walls
const walls = new Set(
    mapStart.flatMap((x, n) => x === "#" ? [n * 2, n * 2 + 1] : []),
);

// Map of all indices containing boxes to the left index of their box
const boxes = new Map(
    mapStart.flatMap((x, n) => {
        if (x !== "O") return [];
        const boxPos = n * 2;
        return [[boxPos, boxPos], [boxPos + 1, boxPos]];
    }),
);

/** Push this box. Return the array of boxes pushed, or null if blocked. */
function push(box: number, dir: number): number[] | null {
    // The unoccupied indices into which this box must move
    const dests = dir === 1
        ? [box + 2]
        : dir === -1
        ? [box - 1]
        : [box + dir, box + 1 + dir];
    if (dests.some((x) => walls.has(x))) return null; // Blocked

    // Get other boxes pushed due to this movement
    const pushed: (number | null)[] = dests.map((x) => boxes.get(x))
        .filter((x) => x !== undefined)
        .flatMap((x) => push(x, dir));

    // Blocked if not every affected box can be moved
    if (!pushed.every((x) => x !== null)) return null;

    // No obstacle to box movement. Return pushed boxes.
    return [...pushed, box];
}

/** Perform a single move, updating botIdx and the map */
function doMoveTwo(botIdx: number, dir: number) {
    const nextIdx = botIdx + dir;
    if (walls.has(nextIdx)) return botIdx; // Blocked by wall
    const box = boxes.get(nextIdx);
    if (box !== undefined) {
        const pushed = push(box, dir);
        if (pushed === null) return botIdx; // Boxes blocked

        // Push the boxes
        sortBy(pushed, (x) => x * -dir).forEach((x) => {
            const next = x + dir;
            boxes.delete(x);
            boxes.delete(x + 1);
            boxes.set(next, next);
            boxes.set(next + 1, next);
        });
    }
    return nextIdx;
}

// Perform the bot's moves
const botEndIdx = moves.map((x) => Math.abs(x) > 1 ? x * 2 : x)
    .reduce(doMoveTwo, botStartIdx * 2);

/** Print the current state of the map to the console */
function print(botIdx: number) {
    const chars = Array.from({ length: map.length * 2 }).flatMap((_, n) => {
        if (n === botIdx) return ["@"];
        if (walls.has(n)) {
            return (n + 1) % widthTwo === 0 ? ["#", "\n"] : ["#"];
        }
        const box = boxes.get(n);
        if (box === undefined) return ["."];
        return [(box === n) ? "[" : "]"];
    });
    console.log(chars.join(""));
}

// Print the end state, just for fun
print(botEndIdx);

/** Convert a map index to the GPS co-ordinate */
function idxToGpsTwo(idx: number) {
    return Math.trunc(idx / widthTwo) * 100 + idx % widthTwo;
}

// Sum the GPS co-ordinates of each box
const two = sumOf(new Set(boxes.values()), idxToGpsTwo);

console.log("Part two:", two);
