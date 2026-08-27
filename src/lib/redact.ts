/**
 * /redact — pure game logic.
 *
 * The visible passage is ALWAYS derived from `source` + committed cuts.
 * DOM Ranges are never the source of truth: reflow and removal invalidate
 * node boundaries, so every cut is stored as stable source-local offsets.
 */

export type Cut = { start: number; end: number };

export type Puzzle = {
  id: string;
  source: string;
  accepted: string[];
  maxCuts: number;
  brief: string;
};

export const PUZZLES: Puzzle[] = [
  {
    id: "erasure-01",
    source: "沉默是我在那场争吵之后唯一的回答",
    accepted: ["沉默是我唯一的回答"],
    maxCuts: 1,
    brief: "只裁一次，让这句话回到它最短的样子。",
  },
  {
    id: "erasure-02",
    source: "有些话我想了很久说出口的瞬间就会碎掉在地上",
    accepted: ["有些话说出口就会碎掉"],
    maxCuts: 3,
    brief: "留下三座孤岛，其余交给空白。",
  },
  {
    id: "erasure-03",
    source: "春天的风吹过夏日的雨落在秋色的叶上",
    accepted: ["春风吹过夏雨落在秋叶上"],
    maxCuts: 3,
    brief: "裁去中间，两个字会自己贴成一个词。",
  },
  {
    id: "erasure-04",
    source: "灯还亮着但屋子里其实早已经没有人在等我了",
    accepted: ["灯还亮着但没有人在等我了"],
    maxCuts: 2,
    brief: "这里藏着两句话，只有一句裁得起。",
  },
  {
    id: "erasure-05",
    source: "如果有一天我不再说话了那不是因为我没有话想说",
    accepted: ["有一天我不再说话"],
    maxCuts: 2,
    brief: "掐头去尾，剩下的才是原话。",
  },
  {
    id: "erasure-06",
    source: "他把所有想说的话都写进了一封从来没有寄出去的信里",
    accepted: ["他把话写进信里"],
    maxCuts: 3,
    brief: "把修饰全部拿走，只留骨头。",
  },
];

/** Overlapping and touching intervals collapse into one cut, deterministically. */
export function mergeCuts(cuts: Cut[]): Cut[] {
  const sorted = [...cuts].sort((a, b) => a.start - b.start);
  const out: Cut[] = [];
  for (const cut of sorted) {
    const last = out[out.length - 1];
    if (last && cut.start <= last.end) last.end = Math.max(last.end, cut.end);
    else out.push({ ...cut });
  }
  return out;
}

/**
 * Derive the surviving text plus a visible-index -> source-index map.
 * The map is what turns a live Selection back into stable source offsets.
 */
export function buildVisible(source: string, cuts: Cut[]) {
  const merged = mergeCuts(cuts);
  let text = "";
  const map: number[] = [];
  let cursor = 0;
  for (const cut of merged) {
    for (let i = cursor; i < cut.start; i += 1) {
      text += source[i];
      map.push(i);
    }
    cursor = Math.max(cursor, cut.end);
  }
  for (let i = cursor; i < source.length; i += 1) {
    text += source[i];
    map.push(i);
  }
  return { text, map, merged };
}

/** Map a visible [from, to) selection onto a source-local cut. */
export function selectionToCut(map: number[], from: number, to: number): Cut | null {
  if (to <= from || from < 0 || from >= map.length) return null;
  const end = Math.min(to, map.length);
  return { start: map[from], end: map[end - 1] + 1 };
}

export function isSolved(puzzle: Puzzle, text: string) {
  return puzzle.accepted.includes(text.replace(/\s+/g, ""));
}
