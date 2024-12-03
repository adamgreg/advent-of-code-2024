import { sumOf } from "jsr:@std/collections";

import { decInt, getInput } from "./util.ts";

const input = await getInput(3);

// Part one

/** Extract mul() instructions, multiply, sum & return the result */
function calc(text: string) {
    return sumOf(
        text.matchAll(/mul\((\d+),(\d+)\)/g),
        ([_, a, b]) => decInt(a) * decInt(b),
    );
}

const one = calc(input);

console.log("Part one:", one);

// Part two

const two = calc(input.replace(/don't\(\).*?(do\(\)|$)/gs, ""));

console.log("Part two:", two);
