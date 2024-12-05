import { distinct, mapValues, sumOf } from "jsr:@std/collections";

import { getInput } from "./util.ts";

const input = await getInput(5);

// Part one

const sections = input.split("\n\n", 2);

// Rules: Second number in each rule must not be FOLLOWED by the first number
// so group rules by the second number - get array of first numbers for each
const rules = mapValues(
    Object.groupBy(sections[0].matchAll(/(\d+)\|(\d+)/g), (match) => match[2]),
    (matches) => matches!.map((match) => match[1]),
);

// Extract all updates
const updates = sections[1].trim().split("\n").map((line) => line.split(","));

const goodUpdates = updates.filter((update) =>
    update.every((x, n) => {
        const notAfter = rules[x];
        if (notAfter === undefined) return true;
        return update.slice(n + 1).every((y) => !notAfter.includes(y));
    })
);

const one = sumOf(goodUpdates, (x) => parseInt(x[(x.length - 1) / 2]));

console.log("Part one:", one);

// Part two

const badUpdates = updates.filter((x) => !goodUpdates.includes(x));

/** Breadth-first search traversal to find pages that must come before */
function bfs(page: string, update: Set<string>): string[] {
    update.delete(page);
    const before = rules[page]?.filter((x) => update.has(x)) ?? [];
    return [...before.flatMap((x) => bfs(x, update)), page];
}

const fixedUpdates = badUpdates.map((update) =>
    distinct(update.flatMap((page) => bfs(page, new Set(update))))
);

const two = sumOf(fixedUpdates, (x) => parseInt(x[(x.length - 1) / 2]));

console.log("Part two:", two);
