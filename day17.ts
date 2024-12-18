import { decInt, getInput } from "./util.ts";

const input = await getInput(17);

/** Initial values for the registers */
const initRegister = Object.fromEntries(
    input.matchAll(/Register ([A-C]): (\d+)/g)
        .map((m) => [m[1], BigInt(parseInt(m[2]))]),
) as State["register"];

/** Program, as a series of 3-bit numbers */
const prog = input.match(/Program: (\d(?:,\d)*)/)?.[1].split(",").map(decInt)!;

/** Processor state object */
type State = {
    /** Register values */
    register: { A: bigint; B: bigint; C: bigint };
    /** Output array */
    out: number[];
    /** Instruction pointer */
    isp: number;
};

/** Process a combo operand */
function combo(x: number, register: State["register"]) {
    switch (x) {
        case 4:
            return register.A;
        case 5:
            return register.B;
        case 6:
            return register.C;
        case 7:
            throw Error("Invalid combo operand");
        default:
            return BigInt(x);
    }
}

/** Enum of opcodes */
enum Opcode {
    adv,
    bxl,
    bst,
    jnz,
    bxc,
    out,
    bdv,
    cdv,
}

/** Map of operation functions, keyed by opcode */
const operation = new Map<Opcode, (x: number, state: State) => void>([
    [Opcode.adv, (x, { register }) => register.A >>= combo(x, register)],
    [Opcode.bxl, (x, { register }) => register.B ^= BigInt(x)],
    [Opcode.bst, (x, { register }) => register.B = combo(x, register) % 8n],
    [Opcode.jnz, (x, state) => {
        if (state.register.A !== 0n) state.isp = x - 2;
    }],
    [Opcode.bxc, (_, { register }) => register.B ^= register.C],
    [
        Opcode.out,
        (x, { out, register }) => out.push(Number(combo(x, register) % 8n)),
    ],
    [
        Opcode.bdv,
        (x, { register }) => register.B = register.A >> combo(x, register),
    ],
    [
        Opcode.cdv,
        (x, { register }) => register.C = register.A >> combo(x, register),
    ],
]);

/**
 * Run the program. Return the output.
 * @param regA - Optional override of initial state of register A.
 */
function run(regA?: bigint) {
    // Create state object
    const state = {
        register: { ...initRegister, A: regA ?? initRegister.A, B: 0n, C: 0n },
        out: [],
        isp: 0,
    };

    /** First out-of-bounds program address */
    const oob = prog.length - 1;

    // Run the program
    for (; state.isp < oob; state.isp += 2) {
        const [op, x] = prog.slice(state.isp, state.isp + 2);
        operation.get(op as Opcode)!(x, state);
    }

    return state.out;
}

// Part one

const one = run().join(",");
console.log("Part one:", one);

// Part two

// The program iterates, outputting a single number,
// and shifting register A right by 3, until register A is zero.
// The only state preserved between iterations is register A.
// This means the register A value can be discovered 3 bits at a time.

/**
 * Recursive function to discover the value of A that outputs the program.
 * Finds a 3-bit register A value that outputs only the last value,
 * shifts it right by 3, finds a 6-bit value that outputs the last 2 values,
 * and carries on working left until it can output the full program.
 */
function recurse(prevA: bigint, outStartIdx: number): bigint | null {
    if (outStartIdx < 0) return prevA;
    for (let x = 0n; x < 8n; x++) {
        const a = (prevA << 3n) + x;
        if (run(a)[0] === prog[outStartIdx]) {
            const next = recurse(a, outStartIdx - 1);
            if (next !== null) return next;
        }
    }
    return null;
}

const two = Number(recurse(0n, prog.length - 1));

console.log("Part two:", two);
