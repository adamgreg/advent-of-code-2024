import "jsr:@std/dotenv/load";
import { sumOf, unzip, zip } from "jsr:@std/collections";

const resp = await fetch(
    "https://adventofcode.com/2024/day/1/input",
    { headers: { cookie: Deno.env.get("SESSION_COOKIES")! } },
);

const input = await resp.text();

// Part one

const nums = input.matchAll(/(\d+) +(\d+)/g).map((x) =>
    x.slice(1).map((y) => parseInt(y))
);

const [left, right] = unzip(nums.toArray() as [number, number][]);

const one = sumOf(
    zip(left.sort(), right.sort()),
    ([l, r]) => Math.abs(r - l),
);

console.log("Part one:", one);

// Part two

const rightCounts = right.reduce(
    (count, x) => count.set(x, (count.get(x) ?? 0) + 1),
    new Map(),
);

const two = sumOf(left, (x) => x * (rightCounts.get(x) ?? 0));

console.log("Part two:", two);
