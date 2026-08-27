/**
 * Logic checks for /redact. Run with:  npx tsx src/dev/redact.test.ts
 * (No test runner is configured in this repo, so this is a standalone script.)
 */

import type { Cut, Puzzle } from "../lib/redact";
import { PUZZLES, buildVisible, isSolved, mergeCuts, selectionToCut } from "../lib/redact";

let failures = 0;

function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/** Minimum number of contiguous removals needed to turn source into target. */
function minCuts(source: string, target: string): number {
  const INF = 99;
  const memo = new Map<string, number>();
  const go = (i: number, j: number, cutting: boolean): number => {
    if (j === target.length) return i === source.length ? 0 : cutting ? 0 : 1;
    if (i === source.length) return INF;
    const key = `${i}|${j}|${cutting ? 1 : 0}`;
    const cached = memo.get(key);
    if (cached !== undefined) return cached;
    let best = go(i + 1, j, true) + (cutting ? 0 : 1);
    if (source[i] === target[j]) best = Math.min(best, go(i + 1, j + 1, false));
    memo.set(key, best);
    return best;
  };
  return go(0, 0, false);
}

/** Replay a puzzle the way the keyboard path does: pick visible spans, commit each. */
function playVisibleSpans(puzzle: Puzzle, spans: Array<[number, number]>) {
  let cuts: Cut[] = [];
  for (const [from, to] of spans) {
    const { map } = buildVisible(puzzle.source, cuts);
    const cut = selectionToCut(map, from, to);
    if (!cut) throw new Error(`invalid span ${from}-${to}`);
    cuts = mergeCuts([...cuts, cut]);
  }
  const { text, merged } = buildVisible(puzzle.source, cuts);
  return { text, cutCount: merged.length };
}

console.log("\nmergeCuts");
check(
  "overlapping intervals collapse",
  JSON.stringify(mergeCuts([{ start: 0, end: 5 }, { start: 3, end: 8 }])) ===
    JSON.stringify([{ start: 0, end: 8 }]),
);
check(
  "touching intervals collapse",
  JSON.stringify(mergeCuts([{ start: 0, end: 3 }, { start: 3, end: 6 }])) ===
    JSON.stringify([{ start: 0, end: 6 }]),
);
check(
  "disjoint intervals stay separate",
  mergeCuts([{ start: 6, end: 9 }, { start: 0, end: 3 }]).length === 2,
);
check(
  "unsorted input is normalised",
  mergeCuts([{ start: 6, end: 9 }, { start: 0, end: 3 }])[0].start === 0,
);

console.log("\nbuildVisible");
{
  const { text, map } = buildVisible("ABCDEFG", [{ start: 2, end: 5 }]);
  check("text drops the cut span", text === "ABFG", text);
  check("map points back at source indices", JSON.stringify(map) === JSON.stringify([0, 1, 5, 6]));
  check("map length matches text length", map.length === text.length);
}
{
  const { text } = buildVisible("ABCDEFG", []);
  check("no cuts returns the source unchanged", text === "ABCDEFG");
}

console.log("\nselectionToCut (visible -> source offsets, across an existing cut)");
{
  // "ABCDEFG" minus [2,5) is visible "ABFG"; selecting visible [1,3) is "BF" -> source [1,6)
  const { map } = buildVisible("ABCDEFG", [{ start: 2, end: 5 }]);
  const cut = selectionToCut(map, 1, 3);
  check("maps across a hole", cut !== null && cut.start === 1 && cut.end === 6, JSON.stringify(cut));
  check("rejects a collapsed selection", selectionToCut(map, 2, 2) === null);
  check("rejects an out-of-range selection", selectionToCut(map, 9, 12) === null);
}

console.log("\npuzzles — authored solution reaches an accepted reading");
for (const puzzle of PUZZLES) {
  const target = puzzle.accepted[0];
  const needed = minCuts(puzzle.source, target);
  check(
    `${puzzle.id} solvable within budget (${needed}/${puzzle.maxCuts})`,
    needed <= puzzle.maxCuts,
    `needs ${needed}, budget ${puzzle.maxCuts}`,
  );
  check(`${puzzle.id} target differs from source`, puzzle.source !== target);
  check(`${puzzle.id} is not solved before any cut`, !isSolved(puzzle, puzzle.source));
}

console.log("\npuzzle 04 — competing readings, only one fits the budget");
{
  const p4 = PUZZLES.find((p) => p.id === "erasure-04")!;
  const fits = minCuts(p4.source, "灯还亮着但没有人在等我了");
  const doesNot = minCuts(p4.source, "屋子里早已经没有人");
  check(`accepted reading fits (${fits} <= ${p4.maxCuts})`, fits <= p4.maxCuts);
  check(`decoy reading does not fit (${doesNot} > ${p4.maxCuts})`, doesNot > p4.maxCuts);
}

console.log("\nreplay — commit spans in sequence, like the keyboard path does");
{
  // 沉默是我[在那场争吵之后]唯一的回答  -> one cut at visible [4,11)
  const p1 = PUZZLES[0];
  const r1 = playVisibleSpans(p1, [[4, 11]]);
  check("erasure-01 resolves", isSolved(p1, r1.text), r1.text);
  check("erasure-01 used 1 cut", r1.cutCount === 1, String(r1.cutCount));

  // 春[天的]风吹过夏[日的]雨落在秋[色的]叶上 — later spans use post-reflow offsets
  const p3 = PUZZLES[2];
  const r3 = playVisibleSpans(p3, [[1, 3], [5, 7], [9, 11]]);
  check("erasure-03 resolves after reflow", isSolved(p3, r3.text), r3.text);
  check("erasure-03 used 3 cuts", r3.cutCount === 3, String(r3.cutCount));
  check("erasure-03 fused adjacent characters", r3.text.startsWith("春风"), r3.text);
}

console.log("\nundo determinism");
{
  const p1 = PUZZLES[0];
  const history: Cut[][] = [[]];
  const { map } = buildVisible(p1.source, history[0]);
  history.push(mergeCuts([...history[0], selectionToCut(map, 4, 11)!]));
  const afterCut = buildVisible(p1.source, history[history.length - 1]).text;
  history.pop();
  const afterUndo = buildVisible(p1.source, history[history.length - 1]).text;
  check("cut changes the text", afterCut !== p1.source);
  check("undo restores the source exactly", afterUndo === p1.source, afterUndo);
}

console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} check(s) FAILED.\n`);
process.exit(failures === 0 ? 0 : 1);
