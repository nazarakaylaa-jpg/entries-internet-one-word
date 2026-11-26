// The Internet in One Word — u-ronigrv-the-internet-in-one-word-e388f33b
//
// The task: describe the whole internet in a single word. A judge model
// compares words two at a time, weighing (in order): it is a single word,
// it earns a laugh on its own, it says something true about the internet
// as a whole, it surprises, and it lands in one beat (short, readable).
//
// This program scores a shortlist of original candidate words against
// those five criteria, picks the best-scoring one, writes it to
// /output/entry.txt, and then validates the gate itself (UTF-8, 1-30
// characters, a single word, no whitespace) and reads the file back to
// confirm what was written is exactly what was chosen.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Scores = {
  funny: number; // earns a laugh by itself, no explanation needed (1-5)
  fit: number; // true about the internet as a whole, not one app or mood (1-5)
  surprise: number; // not the first obvious word anyone reaches for (1-5)
  beat: number; // lands in one beat: short, instantly readable (1-5)
};

type Candidate = { word: string; scores: Scores; note: string };

// Every candidate is one word, so criterion 1 (single word) is met by all
// of them by construction; the four scored criteria below are 2-5 of the
// judge's brief, in the brief's own order of importance.
const CANDIDATES: Candidate[] = [
  {
    word: "unhinged",
    scores: { funny: 5, fit: 5, surprise: 4, beat: 4 },
    note: "The whole internet, every corner of it, is unhinged: the takes, the drama, the 3am rabbit holes. Funny on its own, true of the whole thing, and not the first word most people reach for.",
  },
  {
    word: "feral",
    scores: { funny: 4, fit: 4, surprise: 4, beat: 5 },
    note: "Short and punchy — the internet is wild and untamed. Lands fast, but 'wild' fits nature as well as the net, so it says slightly less about the internet specifically.",
  },
  {
    word: "yapping",
    scores: { funny: 4, fit: 3, surprise: 3, beat: 5 },
    note: "Everyone online is yapping, and it is funny. But it describes the people talking, not the internet as a whole.",
  },
  {
    word: "brainrot",
    scores: { funny: 4, fit: 3, surprise: 3, beat: 4 },
    note: "Very online, very funny — but it names one genre of content, not the whole internet.",
  },
  {
    word: "doomscrolling",
    scores: { funny: 3, fit: 5, surprise: 2, beat: 3 },
    note: "Fits the internet perfectly, but it is the first obvious word anyone reaches for — half the field will submit it, and it is long.",
  },
  {
    word: "enshittification",
    scores: { funny: 4, fit: 4, surprise: 3, beat: 2 },
    note: "True and funny, but 17 letters: it does not land in one beat, and it is a known term of art rather than a surprise.",
  },
  {
    word: "cats",
    scores: { funny: 3, fit: 2, surprise: 2, beat: 5 },
    note: "Funny and instant, but cats are one corner of the internet, not the whole of it.",
  },
  {
    word: "memes",
    scores: { funny: 2, fit: 2, surprise: 1, beat: 5 },
    note: "The most obvious answer of all, and only one kind of content.",
  },
];

function total(s: Scores): number {
  return s.funny + s.fit + s.surprise + s.beat;
}

function main(): void {
  // Score every candidate and pick the best. Ties break toward the
  // shorter word: the judge's own tie-break prefers fewer bytes.
  const ranked = [...CANDIDATES].sort(
    (a, b) =>
      total(b.scores) - total(a.scores) || a.word.length - b.word.length,
  );

  for (const c of ranked) {
    console.log(
      `${c.word.padEnd(17)} funny=${c.scores.funny} fit=${c.scores.fit} ` +
        `surprise=${c.scores.surprise} beat=${c.scores.beat} total=${total(c.scores)}`,
    );
  }

  const winner = ranked[0];
  const runnerUp = ranked[1];
  // The pick must be unambiguous: strictly ahead on total, or ahead on
  // the shorter-word tie-break. A dead tie means the scoring cannot
  // decide, and shipping an arbitrary word would be guessing.
  if (
    total(winner.scores) === total(runnerUp.scores) &&
    winner.word.length === runnerUp.word.length
  ) {
    throw new Error(
      `ambiguous pick: "${winner.word}" and "${runnerUp.word}" tie at ${total(winner.scores)} with equal length`,
    );
  }
  console.log(`\nWinner: "${winner.word}" (${total(winner.scores)}/20) — ${winner.note}`);

  // Gate check before writing: 1-30 UTF-8 characters, one word, no whitespace.
  if (!/^[^\s]+$/.test(winner.word)) {
    throw new Error(`entry is not a single word: ${JSON.stringify(winner.word)}`);
  }
  const charCount = [...winner.word].length;
  if (charCount < 1 || charCount > 30) {
    throw new Error(`entry is ${charCount} characters, outside the 1-30 gate`);
  }
  console.log(`Gate check: PASS — single word, ${charCount} characters (gate: 1-30)`);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, winner.word, "utf8");

  // Read it back and confirm the file holds exactly the chosen word.
  const back = readFileSync(outPath, "utf8");
  if (back !== winner.word) {
    throw new Error(
      `read-back mismatch: file holds ${JSON.stringify(back)}, expected ${JSON.stringify(winner.word)}`,
    );
  }
  console.log(`Wrote ${outPath}: ${JSON.stringify(back)} (${charCount} characters)`);
}

main();
