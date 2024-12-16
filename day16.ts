import { minBy } from "jsr:@std/collections";

import { getInput } from "./util.ts";

const input = await getInput(16);

const width = input.indexOf("\n") + 1;

// Convert map to a boolean array. True for empty (passable) squares.
const passable = input.split("").map((x) => x !== "#" && x !== "\n");

// Find the start and end positions
const start = input.indexOf("S");
const end = input.indexOf("E");

// Construct a graph. One or two nodes for each empty square
// Each node is associated with vertical or horizontal movement
// Represent "vertical" movement nodes using the negative square index
const graph = new Map(passable.flatMap((canPass, n) => {
    if (!canPass) return []; // Square is impassable

    // Get horizontal and vertical edges
    const horz = [n + 1, n - 1].filter((x) => passable.at(x));
    const vert = [n + width, n - width].filter((x) => passable.at(x))
        .map((x) => -x);

    // Add edge between "vertical" node and "horizontal" node
    if (horz.length > 0 && vert.length > 0) {
        horz.push(-n);
        vert.push(n);
    }

    const ret: [number, number[]][] = [];
    if (horz) ret.push([n, horz]);
    if (vert) ret.push([-n, vert]);
    return ret;
}));

/** Djikstra's algorithm. Edge cost is 1 if nodes have same sign, else 1000. */
function djikstra(
    g: Map<number, number[]>,
    startIdx: number,
    targetIdx: number,
) {
    // Distance from start for each reached but as-yet unvisited node
    const dist = new Map<number, number>();

    // Set of visited nodes
    const visited = new Set<number>();

    // Predecessor nodes for visited nodes
    const pred = new Map<number, number[]>();

    // There are two acceptable target nodes, for horz and vert travel
    const targets = [targetIdx, -targetIdx];

    for (
        let next = [startIdx, 0];
        next !== undefined;
        next = minBy(dist.entries(), (x) => x[1])!
    ) {
        // Pop the current node and its distance (cost) from the start
        const [current, cost] = next;
        dist.delete(current);

        // Return the cost if we have reached the target
        if (targets.includes(current)) return { cost, pred };

        // Get direction of node (1 = horzizontal, 0 = vertical)
        const dir = Math.sign(current);

        // Add/update unvisited neighours in the node distance map
        g.get(current)!.forEach((x) => {
            // Do not revisit nodes (path would be longer)
            if (visited.has(x)) return;

            // Add current node to the neighbour's predecessors
            pred.set(x, [...(pred.get(x) ?? []), current]);

            // Update cost of the neighbour
            dist.set(x, cost + ((Math.sign(x) === dir) ? 1 : 1000));
        });

        // Do not visit this node again
        visited.add(current);
    }
}

// Part one

const solution = djikstra(graph, start, end);
if (solution === undefined) throw Error("No routes found!");
const { cost: one, pred } = solution;

console.log("Part one:", one);

// Part two

/** Backtrack through predecessor nodes, yielding visited square indices */
function* backtrack(current: number): Generator<number> {
    for (const previous of pred.get(current) ?? []) yield* backtrack(previous);
    yield Math.abs(current);
}

// Get set of squares found when backtracking from the end square
const squares = new Set([...backtrack(end), ...backtrack(-end)]);

const two = squares.size;
console.log("Part two:", two);
