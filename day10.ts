import { sumOf } from "jsr:@std/collections/sum-of";
import { decInt, getInput } from "./util.ts";

const input = await getInput(10);

// Part one

// Convert input to 1D array of numbers. Allow newlines to persist as NaN.
const map = input.split("").map(decInt);

// Cardinal directions, converted to map index strides
const width = input.indexOf("\n") + 1;
const directions = [-1, 1, width, -width];

/** Walk from a trailhead and return the number of reachable peaks */
function startTrail(loc: number) {
    // The set of peak (elevation 9) locations visited
    const peakLocs = new Set<number>();

    /** Recursive function to step from a map location */
    function step(loc: number, targetElevation: number) {
        // Get elevation at this map location
        const elevation = map[loc];

        // Check this is a valid next step to make
        if (elevation !== targetElevation) return;

        // End condition. Remember this peak location as visited
        if (elevation === 9) peakLocs.add(loc);
        else {
            // Check the next step in each direction
            const nextElevation = elevation + 1;
            for (const dir of directions) step(loc + dir, nextElevation);
        }
    }

    step(loc, 0);
    return peakLocs.size;
}

// Check for trailheads
const one = map.reduce(
    (acc, x, loc) => (x === 0) ? acc + startTrail(loc) : acc,
    0,
);

console.log("Part one:", one);

// Part two

/** Recursive function to step from a map location */
function stepRate(loc: number, targetElevation: number): number {
    // Get elevation at this map location
    const elevation = map[loc];

    // Check this is a valid next step to make
    if (elevation !== targetElevation) return 0;

    // End condition - route to peak complete
    if (elevation === 9) return 1;
    else {
        // Check the next step in each direction
        const nextElevation = elevation + 1;
        return sumOf(directions, (dir) => stepRate(loc + dir, nextElevation));
    }
}

const two = map.reduce((acc, _, loc) => acc + stepRate(loc, 0), 0);
console.log("Part two:", two);
