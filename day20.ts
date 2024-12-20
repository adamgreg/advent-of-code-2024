import { getInput } from "./util.ts";

const input = await getInput(20);

/** Width of the map, including newlines */
const width = input.indexOf("\n") + 1;
/** Strides within the input array representing a single move */
const dirs = [1, -1, width, -width];

/** Generator to build an array of input indices representing the racetrack */
function* mapTrack() {
    const startIdx = input.indexOf("S");
    const endIdx = input.indexOf("E");
    for (let idx = startIdx, dir = 0; dir !== endIdx; idx += dir) {
        yield idx;
        dir = dirs.find((x) => (x !== -dir) && (input[idx + x] === ".")) ??
            endIdx;
    }
    yield endIdx;
}

/** Racetrack. Each element is the index of the square in the input string. */
const track = mapTrack().toArray();

// Part one

function cheats2ps(minSaved: number) {
    const minSkip = minSaved + 2;
    const jumps = dirs.map((x) => x * 2);
    return (from: number, n: number) =>
        jumps.reduce((acc, jump) => {
            const nSkipped = track.slice(n + minSkip).indexOf(from + jump);
            return (nSkipped !== -1) ? acc + 1 : acc;
        }, 0);
}

const one = track.map(cheats2ps(100)).reduce((acc, x) => acc + x);

console.log("Part one:", one);

// Part two

/** Map co-ordinates for each square along the racetrack */
const coords = track.map((x) => [x % width, Math.trunc(x / width)] as const);

function cheats(minSaved: number, maxCheatLen: number) {
    return (from: readonly [number, number], n1: number) =>
        coords.slice(n1 + minSaved).reduce((acc, to, n2) => {
            const cheatLen = Math.abs(to[0] - from[0]) +
                Math.abs(to[1] - from[1]);
            return (cheatLen <= maxCheatLen && n2 >= cheatLen) ? acc + 1 : acc;
        }, 0);
}

const two = coords.map(cheats(100, 20)).reduce((acc, x) => acc + x);

console.log("Part two:", two);
