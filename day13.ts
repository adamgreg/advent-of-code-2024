import { minOf, sumOf } from "jsr:@std/collections";

import { decInt, getInput } from "./util.ts";

const input = await getInput(13);

type Machine = {
    /** The X co-ordinate increment of button A */
    xA: number;
    /** The Y co-ordinate increment of button A */
    yA: number;
    /** The X co-ordinate increment of button B */
    xB: number;
    /** The Y co-ordinate increment of button B */
    yB: number;
    /** The X co-ordinate of the prize */
    x: number;
    /** The Y co-ordinate of the prize */
    y: number;
};

type Solution = {
    /** Number of presses of A button */
    nA: number;
    /** Number of presses of B button */
    nB: number;
};

// Parse the numbers for each machine from the input
const machines: Machine[] = input.matchAll(
    /A: X\+(\d+), Y\+(\d+)\n.*B: X\+(\d+), Y\+(\d+)\n.*X=(\d+), Y=(\d+)/g,
).map(
    (m) => {
        const [xA, yA, xB, yB, x, y] = m.slice(1).map(decInt);
        return { xA, yA, xB, yB, x, y };
    },
).toArray();

// Part one

/** Solve the machine, returning array of solutions */
function solve(
    { xA, yA, xB, yB, x, y }: Machine,
): Solution[] {
    // Check for a unique real solution, if buttons are linearly independent
    const det = xA * yB - xB * yA; // Determinant of linear equation matrix
    if (det !== 0) {
        const nA = (yB * x - xB * y) / det;
        const nB = (xA * y - yA * x) / det;
        if (Number.isInteger(nA) && Number.isInteger(nB)) {
            return [{ nA, nB }];
        } else return [];
    }

    throw Error("Buttons not linearly independent! Another technique needed.");
}

// Sum minimum tokens for each machine
const one = sumOf(
    machines,
    (x) => minOf(solve(x), ({ nA, nB }) => nA * 3 + nB) ?? 0,
);

console.log("Part one:", one);

// Part two

// Sum minimum tokens for each machine, with prize offset
const two = sumOf(
    machines.map(({ x, y, ...rest }) => ({
        x: x + 1e13,
        y: y + 1e13,
        ...rest,
    })),
    (x) => minOf(solve(x), ({ nA, nB }) => nA * 3 + nB) ?? 0,
);

console.log("Part two:", two);
