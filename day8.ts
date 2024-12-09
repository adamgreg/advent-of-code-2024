import { getInput } from "./util.ts";

const input = await getInput(8);

// Part one

// Identify the dimensions of the map, then remove newlines for convenience
const width = input.indexOf("\n");
const inputFlat = input.replaceAll("\n", "");

// Group the different frequency antennae
const freqs = Object.groupBy(inputFlat.matchAll(/[^.\n]/g), (m) => m[0]);

// Get an array of locations (input indices) for each frequency
const locations = Object.values(freqs).map((matches) =>
    matches!.map((m) => m.index)
);

/** Test if anti-node position is valid, given pair of antenna positions */
function isValidAntinode(a: number, b: number, antiNode: number) {
    // Check against vertical boundaries
    if (antiNode < 0 || antiNode >= inputFlat.length) return false;

    // Check against horizontal boundaries - the X co-ordinates of
    // a, b & antiNode will be ordered, unless we've wrapped around
    return (b % width - a % width) * (antiNode % width - b % width) > 0;
}

// Calculate the antinodes created by a pair of antennas
const antiNodesOne = new Set(
    locations.flatMap((locs) =>
        locs.flatMap((a) =>
            locs.flatMap((b) => {
                // Do not pair an antenna with itself
                if (a === b) return [];

                const antiNode = 2 * b - a;
                return isValidAntinode(a, b, antiNode) ? antiNode : [];
            })
        )
    ),
);

const one = antiNodesOne.size;
console.log("Part one:", one);

// Part two

// Generate the antinodes created by a pair of antennas
function* genAntiNodesTwo(a: number, b: number) {
    const diff = b - a;

    // Do not pair an antenna with itself
    if (diff === 0) return;

    // Antinode at the antenna
    yield b;

    // Yield antinodes in a straignt line until we exceed a map boundary
    for (let x = b + diff; isValidAntinode(a, b, x); x += diff) {
        yield x;
    }
}

const antiNodesTwo = new Set(
    locations.flatMap((locs) =>
        locs.flatMap((a) =>
            locs.flatMap((b) => genAntiNodesTwo(a, b).toArray())
        )
    ),
);

const two = antiNodesTwo.size;
console.log("Part two:", two);
