import { getInput } from "./util.ts";

const input = await getInput(14);
const width = 101;
const height = 103;

type Bot = {
    /** X co-ordinate */
    x: number;
    /** Y co-ordinate */
    y: number;
    /** X-direction velocity */
    vx: number;
    /** Y-direction velocity */
    vy: number;
};

// Parse the input
const bots = input.matchAll(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/g).map((m) => ({
    x: parseInt(m[1]),
    y: parseInt(m[2]),
    vx: parseInt(m[3]),
    vy: parseInt(m[4]),
})).toArray();

/** Wrap a number to within the specified length */
function wrap(x: number, length: number) {
    const wrapped = x % length;
    return wrapped < 0 ? wrapped + length : wrapped;
}

/** Return the state for a bot after t seconds */
function step({ x, y, vx, vy }: Bot, t: number): Bot {
    return { x: wrap(x + vx * t, width), y: wrap(y + vy * t, height), vx, vy };
}

const botsEnd = bots.map((x) => step(x, 100));

// Group the bots by quadrant
const xMid = Math.floor(width / 2);
const yMid = Math.floor(height / 2);
const quads = Map.groupBy(
    botsEnd.filter(({ x, y }) => (x !== xMid) && (y !== yMid)),
    ({ x, y }) => Math.sign(x - xMid) * 2 + Math.sign(y - yMid),
);

const one = quads.values().reduce((acc, x) => acc * x.length, 1);

console.log("Part one:", one);

// Part two

// Function to generate SVG from the bot positions
function genSvg(botsIn: Bot[]): string {
    const rects = botsIn.map(({ x, y }) =>
        `<rect x="${x}" y="${y}" width="1" height="1" fill="green" />`
    ).join("\n");

    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="${width}"
        height="${height}"
        viewBox="0 0 ${width} ${height}">
        ${rects}
      </svg>
    `;
}

let iteration = 0;

Deno.serve(() => {
    console.log("Part two:", iteration += 1);
    return new Response(genSvg(bots.map((x) => step(x, iteration))), {
        headers: { "Content-Type": "image/svg+xml" },
    });
});

// There was a repeating pattern every 103 seconds
// and another every 101 seconds. Solved by finding where they coincided.
const two = 6475;
console.log("Part two:", two);
