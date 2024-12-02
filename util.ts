// import "jsr:@std/dotenv/load";

export async function getInput(day: number): Promise<string> {
    const resp = await fetch(
        `https://adventofcode.com/2024/day/${day}/input`,
        { headers: { cookie: Deno.env.get("SESSION_COOKIES")! } },
    );

    const text = await resp.text();
    return text.trim();
}

/** Wrapper for parseInt() that takes a single argument (radix 10) */
export function decInt(input: string): number {
    return parseInt(input);
}
