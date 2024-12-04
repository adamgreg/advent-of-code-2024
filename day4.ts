import { sumOf } from "jsr:@std/collections";

import { getInput } from "./util.ts";

const input = await getInput(4);

// Part one

// Determine the dimensions of the grid
const width = input.indexOf("\n") + 1;
const height = (input.length + 1) / width;

// Split the word into first letter and remainder
const word = "XMAS";
const [firstLetter, ...checkLetters] = word;

// Identify the boundaries of the grid within which matches on the first letter
// should be checked for the full word in various directions
const leftEdge = checkLetters.length;
const rightEdge = width - checkLetters.length;
const topEdge = checkLetters.length * width;
const bottomEdge = (height - checkLetters.length) * width;

/** Check for the word, from a start index and an offset (direction) */
function check(idx: number, offset: number) {
    return (checkLetters.every((x, n) => input[idx + (n + 1) * offset] === x));
}

/** Count the number of words starting from a match on the first letter */
function countWords({ index }: RegExpExecArray) {
    // Check first letter index proximity to left and right edge of the grid
    const x = index % width;
    const checkRight = x < rightEdge;
    const checkLeft = x >= leftEdge;

    // Check for the word in each direction, unless close to the edge
    let count = 0;
    if (index >= topEdge) {
        if (check(index, -width)) count += 1;
        if (checkLeft && check(index, -(width + 1))) count += 1;
        if (checkRight && check(index, 1 - width)) count += 1;
    }
    if (index < bottomEdge) {
        if (check(index, width)) count += 1;
        if (checkLeft && check(index, width - 1)) count += 1;
        if (checkRight && check(index, width + 1)) count += 1;
    }
    if (checkRight && check(index, 1)) count += 1;
    if (checkLeft && check(index, -1)) count += 1;

    return count;
}

const one = sumOf(input.matchAll(new RegExp(firstLetter, "g")), countWords);

console.log("Part one:", one);

// Part two

/**
 * Check if the match of an "A" is the centre of an X-MAS in the input
 * @returns 1 if it is a match, otherwise 0
 */
function isCrossMas({ index }: RegExpExecArray) {
    const downRight = input[index - width - 1] + input[index + width + 1];
    if (!["MS", "SM"].includes(downRight)) return 0;
    const upRight = input[index + width - 1] + input[index - width + 1];
    return ["MS", "SM"].includes(upRight) ? 1 : 0;
}

const two = sumOf(input.matchAll(/A/g), isCrossMas);

console.log("Part two:", two);
