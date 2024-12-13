import { sumOf } from "jsr:@std/collections";

import { getInput } from "./util.ts";

const input = await getInput(12);

const width = input.indexOf("\n") + 1;

// Part one

/** Yield a set of input indices for each contiguous region */
function* genRegions() {
    const visited = new Set<number>(); // Set of already-checked indices

    /** Recursive function to build region from adjacent squares */
    function* walk(idx: number, label: string): Generator<number> {
        // Add square to current region
        yield idx;

        // Remember this square has been visited
        visited.add(idx);

        // Check adjacent squares
        for (const dir of [-1, 1, -width, width]) {
            const nextIdx = idx + dir;
            if (!visited.has(nextIdx) && input[nextIdx] === label) {
                yield* walk(nextIdx, label);
            }
        }
    }

    // Iterate over squares, starting a region from each, if not already visited
    for (let startIdx = 0; startIdx < input.length; startIdx++) {
        // Skip this square if it already belongs to another region
        if (visited.has(startIdx)) continue;

        // The label of this region. Skip the newlines.
        const label = input[startIdx];
        if (label === "\n") continue;

        // Create a new region starting at this index
        yield new Set<number>(walk(startIdx, label));
    }
}

// Array of regions - each is a set of indices in the input
const regions = genRegions().toArray();

/** Calculate the total perimeter of a region */
function perimeter(region: Set<number>) {
    return sumOf(
        region,
        (idx) =>
            // Calculate the perimeter contributed by this square
            sumOf(
                [-1, 1, -width, width],
                (dir) => region.has(idx + dir) ? 0 : 1,
            ),
    );
}

const one = sumOf(regions, (region) => perimeter(region) * region.size);

console.log("Part one:", one);

// Part two

/** Calculate the number of sides of a region */
function sides(region: Set<number>) {
    // Strides for cardinal directions, in clockwise order
    const dirs = [1, width, -1, -width];

    // Sum the corners (outer & inner of each square in the region)
    return sumOf(region, (pos) =>
        sumOf(dirs, (dir) => {
            if (region.has(pos + dir)) return 0; // No corner

            const nextDir = dirs[(dirs.indexOf(dir) + 1) % 4];

            if (!region.has(pos + nextDir)) return 1; // Outer corner

            return (region.has(pos + dir + nextDir)) ? 1 : 0; // Inner corner
        }));
}

const two = sumOf(regions, (region) => sides(region) * region.size);

console.log("Part two:", two);
