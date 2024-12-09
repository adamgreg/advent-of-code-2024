import { decInt, getInput } from "./util.ts";

const input = await getInput(9);

// Part one

// Expand filesystem blocks
const fs = input.split("").flatMap((x, n) =>
    Array<number | null>(decInt(x)).fill(n % 2 === 0 ? n / 2 : null)
);

// Filter out free space, leaving only file blocks. Reverse.
const files = fs.filter((x) => x !== null).reverse();

function* genCompacted() {
    // Iterator over file blocks, in reverse order
    const endBlocks = files.values();

    // Yield block if full, otherwise file block from the end
    for (const x of fs) yield x ?? endBlocks.next().value!;
}

const compacted = genCompacted().take(files.length);

const one = compacted.map((x, n) => x * n).reduce((acc, x) => acc + x);

console.log("Part one:", one);

// Part two

// Areas of the filesystem
const areas = input.split("").map((x, n) => ({
    id: n % 2 === 0 ? n / 2 : null,
    len: parseInt(x),
    idx: n,
}));

// Move rightmost files to leftmost free space. N.B. mutates areas array.
areas.toReversed().forEach((file) => {
    if (file.id === null) return;

    // Find the leftmost area of free space that can fit this file
    const freeIdx = areas.findIndex((x) => x.id === null && x.len >= file.len);

    // Move the file to the free space
    if (freeIdx !== -1) {
        const free = areas[freeIdx];

        // Do not move files to the right
        if (free.idx > file.idx) return;

        if (free.len > file.len) {
            areas.splice(freeIdx, 1, { ...file }, {
                id: null,
                len: free.len - file.len,
                idx: free.idx,
            });
        } else {
            areas.splice(freeIdx, 1, { ...file });
        }
        file.id = null;
    }
});

// Expand filesystem blocks
const compactedTwo = areas.flatMap(({ id, len }) => Array(len).fill(id ?? 0));

const two = compactedTwo.map((x, n) => x * n).reduce((acc, x) => acc + x);
console.log("Part two:", two);
