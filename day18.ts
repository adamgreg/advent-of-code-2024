import { minBy } from "jsr:@std/collections";

import { getInput } from "./util.ts";

const input = await getInput(18);
const width = 71;

/** Build graph of all connections between squares */
function* range(end: number) {
    for (let i = 0; i < end; i++) yield i;
}
const nSquares = width * width;
const graph = new Map(
    range(nSquares).map((n) => {
        const neighbours = [];
        if (n % width > 0) neighbours.push(n - 1);
        if ((n + 1) % width !== 0) neighbours.push(n + 1);
        if (n - width >= 0) neighbours.push(n - width);
        if (n + width < nSquares) neighbours.push(n + width);
        return [n, neighbours];
    }),
);

/** Array of corrupt nodes in the graph */
const corrupt = input.matchAll(/(\d+),(\d+)/g).map((m) =>
    parseInt(m[1]) + parseInt(m[2]) * width
).toArray();

/** Djikstra's algorithm. All edges cost 1. Takes a set of "unavailable" nodes. */
function djikstra(
    g: Map<number, number[]>,
    start: number,
    target: number,
    unavailable: Set<number>,
) {
    // Distance from start for each reached but as-yet unvisited node
    const dist = new Map<number, number>();

    // Set of visited nodes
    const visited = new Set<number>();

    for (
        let next = [start, 0];
        next !== undefined;
        next = minBy(dist.entries(), (x) => x[1])!
    ) {
        // Pop the current node and its distance (cost) from the start
        const [current, cost] = next;
        dist.delete(current);

        // Return the cost and predecessor map if we have reached the target
        if (current === target) return cost;

        // Add/update unvisited neighours in the node distance map
        g.get(current)!.forEach((x) => {
            // Do not revisit nodes (path would be longer)
            if (visited.has(x)) return;

            // Skip neighbour if it is in the unavailable set
            if (unavailable.has(x)) return;

            // Update cost of the neighbour
            dist.set(x, cost + 1);
        });

        // Do not visit this node again
        visited.add(current);
    }
}

// Part one

const one = djikstra(
    graph,
    0,
    nSquares - 1,
    new Set(corrupt.slice(0, 1024)),
);
console.log("Part one:", one);

// Part two

// Use binary search to find the first byte which makes the target unreachable
let start = 1024;
let end = corrupt.length;
while (end - start > 1) {
    const mid = Math.trunc((start + end) / 2);
    if (djikstra(graph, 0, nSquares - 1, new Set(corrupt.slice(0, mid)))) {
        start = mid;
    } else end = mid;
}

const two = `${corrupt[start] % width},${Math.trunc(corrupt[start] / width)}`;

console.log("Part two:", two);
