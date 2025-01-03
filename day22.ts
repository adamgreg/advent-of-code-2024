import { sumOf } from "jsr:@std/collections";

import { decInt, getInput } from "./util.ts";

const input = await getInput(22);

const seeds = input.trim().split("\n").map(decInt);

function nextSecret(secret: number) {
    let x = BigInt(secret);
    x = (x ^ (x * 64n)) % 16777216n;
    x = (x ^ (x / 32n)) % 16777216n;
    return Number((x ^ (x * 2048n)) % 16777216n);
}

// Part one

const one = sumOf(seeds, (x) => Array(2000).fill(null).reduce(nextSecret, x));

console.log("Part one:", one);

// Part two

// console.log("Part two:", two);
