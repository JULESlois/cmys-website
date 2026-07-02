declare const process: {
  argv: string[];
  exitCode?: number;
};

import { createInitialState, gameReducer } from "../engine/reducer";
import { TALENT_POOL } from "../data/life/talents";
import { getLifeEventById } from "../data/life/events-registry";
import type {
  AttributeName,
  EventChoice,
  EventChoiceEffects,
  GameAction,
  GameState,
  Talent,
} from "../engine/types";

type Strategy = "random" | "safe" | "risky";
type TerminalKind = "death" | "attribute_ending" | "century" | "stuck" | "unknown";

type RunSummary = {
  strategy: Strategy;
  runIndex: number;
  seed: number;
  terminalKind: TerminalKind;
  age: number;
  eventCount: number;
  uniqueEventCount: number;
  stepCount: number;
  deathType?: string;
  deathAttribute?: string;
  attributeEndingId?: string;
  talents: string[];
  unlockedChapters: string[];
  completedChapters: string[];
  activeChapterId: string | null;
  specialChapterTouched: boolean;
  memeEvents: number;
  lethalChoicesEncountered: number;
  deathCause?: string;
  eventIds: string[];
  memeEventIds: string[];
  finalAttributes: Record<AttributeName, number>;
};

type Aggregate = {
  strategy: Strategy;
  runs: number;
  seed: number;
  terminalKinds: Record<string, number>;
  deathTypes: Record<string, number>;
  deathAttributes: Record<string, number>;
  attributeEndings: Record<string, number>;
  avgAge: number;
  medianAge: number;
  avgEvents: number;
  medianEvents: number;
  avgUniqueEvents: number;
  specialChapterRate: number;
  avgMemeEvents: number;
  avgLethalChoicesEncountered: number;
  avgAttributes: Record<AttributeName, number>;
  minAttributes: Record<AttributeName, number>;
  maxAttributes: Record<AttributeName, number>;
  ageBuckets: Record<string, number>;
  topEvents: Array<{ id: string; count: number }>;
  topMemeEvents: Array<{ id: string; count: number }>;
  topDeathEvents: Array<{ id: string; count: number }>;
  sampleRuns: RunSummary[];
};

const ATTRIBUTES: AttributeName[] = [
  "appearance",
  "intelligence",
  "physique",
  "wealth",
  "creativity",
  "luck",
];

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseArgs() {
  const args = new Map<string, string>();
  for (const raw of process.argv.slice(2)) {
    if (!raw.startsWith("--")) continue;
    const [key, value = "true"] = raw.slice(2).split("=");
    args.set(key, value);
  }

  const strategyArg = args.get("strategy") ?? "all";
  const strategies: Strategy[] = strategyArg === "all"
    ? ["random", "safe", "risky"]
    : strategyArg.split(",").filter(Boolean) as Strategy[];

  for (const strategy of strategies) {
    if (!["random", "safe", "risky"].includes(strategy)) {
      throw new Error(`Invalid strategy: ${strategy}`);
    }
  }

  return {
    runs: Number(args.get("runs") ?? 200),
    seed: Number(args.get("seed") ?? 20260702),
    strategies,
    json: args.get("json") === "true",
    maxSteps: Number(args.get("maxSteps") ?? 4000),
  };
}

function randomInt(rng: () => number, max: number): number {
  return Math.floor(rng() * max);
}

function pickRandom<T>(rng: () => number, values: T[]): T {
  return values[randomInt(rng, values.length)];
}

function talentScore(talent: Talent, strategy: Strategy): number {
  const p = talent.positive;
  const n = talent.negative;
  const value = (attr: AttributeName) => (p[attr] ?? 0) + (n[attr] ?? 0);
  const deathConversionBonus = talent.effects?.deathConversions?.length ? 5 : 0;
  const specialBonus = talent.kind === "special" ? 4 : 0;

  if (strategy === "safe") {
    return (
      value("physique") * 4 +
      value("wealth") * 3 +
      value("luck") * 2 +
      value("intelligence") * 1.5 +
      deathConversionBonus * 2 -
      specialBonus
    );
  }

  if (strategy === "risky") {
    return (
      value("luck") * 4 +
      value("creativity") * 3 +
      value("physique") * 1.5 +
      specialBonus * 3 +
      deathConversionBonus
    );
  }

  return 0;
}

function chooseTalent(state: GameState, strategy: Strategy, rng: () => number): string {
  if (strategy === "random") return pickRandom(rng, TALENT_POOL).id;
  const ranked = [...TALENT_POOL].sort((a, b) => talentScore(b, strategy) - talentScore(a, strategy));
  const top = ranked.slice(0, Math.min(4, ranked.length));
  return pickRandom(rng, top).id;
}

function hasRequiredTalents(state: GameState, required: string[] | undefined): boolean {
  if (!required?.length) return true;
  const selected = new Set(state.talents.map((talent) => talent.id));
  return required.every((id) => selected.has(id));
}

function hasExcludedTalents(state: GameState, excluded: string[] | undefined): boolean {
  if (!excluded?.length) return false;
  const selected = new Set(state.talents.map((talent) => talent.id));
  return excluded.some((id) => selected.has(id));
}

function effectiveEffects(choice: EventChoice, state: GameState): EventChoiceEffects {
  for (const conditional of choice.conditionalEffects ?? []) {
    if (!hasRequiredTalents(state, conditional.requiredTalents)) continue;
    if (hasExcludedTalents(state, conditional.excludedTalents)) continue;
    return conditional.effects;
  }
  return choice.effects;
}

function rawNet(changes: Partial<Record<AttributeName, number>> | undefined): number {
  return ATTRIBUTES.reduce((sum, attr) => sum + (changes?.[attr] ?? 0), 0);
}

function negativeMagnitude(changes: Partial<Record<AttributeName, number>> | undefined): number {
  return ATTRIBUTES.reduce((sum, attr) => {
    const value = changes?.[attr] ?? 0;
    return value < 0 ? sum + Math.abs(value) : sum;
  }, 0);
}

function choiceScore(choice: EventChoice, state: GameState, strategy: Strategy): number {
  const effects = effectiveEffects(choice, state);
  const changes = effects.attributes ?? {};
  const net = rawNet(changes);
  const negative = negativeMagnitude(changes);

  if (strategy === "safe") {
    return (
      (effects.forceLethal ? -100000 : 0) +
      (effects.isLethal ? -20000 : 0) +
      (changes.physique ?? 0) * 6 +
      (changes.wealth ?? 0) * 4 +
      (changes.intelligence ?? 0) * 2.5 +
      (changes.appearance ?? 0) * 2 +
      (changes.luck ?? 0) * 2 +
      (changes.creativity ?? 0) * 0.75 +
      net -
      negative * 0.5 +
      (effects.triggerChapterId ? 2 : 0)
    );
  }

  if (strategy === "risky") {
    return (
      (effects.forceLethal ? -5000 : 0) +
      (effects.isLethal ? 3 : 0) +
      (changes.wealth ?? 0) * 3 +
      (changes.luck ?? 0) * 3 +
      (changes.creativity ?? 0) * 2.5 +
      (changes.intelligence ?? 0) * 1.5 +
      (changes.appearance ?? 0) +
      net * 0.5 -
      Math.max(0, -(changes.physique ?? 0)) * 0.5 +
      (effects.triggerChapterId ? 8 : 0) +
      (effects.triggerEventId ? 4 : 0)
    );
  }

  return 0;
}

function chooseChoiceIndex(state: GameState, strategy: Strategy, rng: () => number): number {
  const choices = state.pendingChoices ?? [];
  if (choices.length === 0) return 0;
  if (strategy === "random") return randomInt(rng, choices.length);

  const scored = choices.map((choice, index) => ({
    index,
    score: choiceScore(choice, state, strategy),
  }));
  scored.sort((a, b) => b.score - a.score);

  // safe 策略必须稳定选最高分，避免诊断时混入随机冒险。
  if (strategy === "safe") return scored[0].index;

  // risky 保留少量非最优选择，扩大覆盖面。
  const pool = scored.slice(0, Math.min(3, scored.length));
  return pickRandom(rng, pool).index;
}

function autoAdvanceDelta(age: number): number {
  return age >= 31 && age <= 60 ? 3 : 1;
}

function dispatch(state: GameState, action: GameAction): GameState {
  return gameReducer(state, action);
}

function stepGame(state: GameState, strategy: Strategy, rng: () => number): GameState {
  const phase = state.phase;

  if (phase.type === "talent_selection") {
    return dispatch(state, { type: "SELECT_TALENT", talentId: chooseTalent(state, strategy, rng) });
  }

  if (phase.type === "story_arc_summary") {
    return dispatch(state, { type: "DISMISS_STORY_ARC_SUMMARY" });
  }

  if (phase.type === "chapter_intro") {
    return dispatch(state, { type: "DISMISS_CHAPTER_INTRO" });
  }

  if (phase.type === "ending_prelude") {
    return dispatch(state, { type: "SHOW_RESULT" });
  }

  if (phase.type === "playing") {
    if (phase.step === "event_presenting" || phase.step === "awaiting_choice") {
      return dispatch(state, { type: "RESOLVE_EVENT", choiceIndex: chooseChoiceIndex(state, strategy, rng) });
    }

    if (phase.step === "effect_resolving") {
      return dispatch(state, { type: "DISMISS_RESULT" });
    }

    if (phase.step === "aging") {
      if (state.age >= 100) return dispatch(state, { type: "SHOW_RESULT" });
      return dispatch(state, { type: "ADVANCE_AGE", delta: autoAdvanceDelta(state.age) });
    }
  }

  return state;
}

function terminalKind(state: GameState, stoppedByMaxSteps: boolean): TerminalKind {
  if (stoppedByMaxSteps) return "stuck";
  if (state.phase.type === "dying") return "death";
  if (state.phase.type === "result" && state.attributeEndingId) return "attribute_ending";
  if (state.phase.type === "result" && state.age >= 100) return "century";
  if (state.phase.type === "result") return "unknown";
  return "unknown";
}

function summarizeRun(strategy: Strategy, runIndex: number, seed: number, state: GameState, stepCount: number, stoppedByMaxSteps: boolean): RunSummary {
  const eventIds = state.eventLog.map((event) => event.eventId);
  const uniqueEventIds = new Set(eventIds);
  const memeEventIds: string[] = [];
  let memeEvents = 0;
  let specialChapterTouched = false;

  for (const id of eventIds) {
    const event = getLifeEventById(id);
    if (event?.eventTags?.includes("meme")) {
      memeEvents += 1;
      memeEventIds.push(id);
    }
    if (event?.chapterId || event?.requiredChapter || event?.eventTags?.includes("well") || event?.eventTags?.includes("yomi")) {
      specialChapterTouched = true;
    }
  }

  if (state.chapter.unlockedChapterIds.length || state.chapter.completedChapterIds.length || state.chapter.activeChapterId) {
    specialChapterTouched = true;
  }

  return {
    strategy,
    runIndex,
    seed,
    terminalKind: terminalKind(state, stoppedByMaxSteps),
    age: state.age,
    eventCount: eventIds.length,
    uniqueEventCount: uniqueEventIds.size,
    stepCount,
    deathType: state.deathRecord?.deathType,
    deathAttribute: state.deathRecord?.attribute,
    attributeEndingId: state.attributeEndingId ?? undefined,
    talents: state.talents.map((talent) => talent.name),
    unlockedChapters: state.chapter.unlockedChapterIds,
    completedChapters: state.chapter.completedChapterIds,
    activeChapterId: state.chapter.activeChapterId,
    specialChapterTouched,
    memeEvents,
    lethalChoicesEncountered: state.nearDeathCount,
    deathCause: state.deathRecord?.cause,
    eventIds,
    memeEventIds,
    finalAttributes: Object.fromEntries(
      ATTRIBUTES.map((attr) => [attr, state.attributes[attr] as number]),
    ) as Record<AttributeName, number>,
  };
}

function runOne(strategy: Strategy, seed: number, runIndex: number, maxSteps: number): RunSummary {
  const rng = mulberry32(seed);
  const originalRandom = Math.random;
  Math.random = rng;

  try {
    let state = createInitialState();
    let stoppedByMaxSteps = false;
    let stepCount = 0;

    for (; stepCount < maxSteps; stepCount++) {
      if (state.phase.type === "dying" || state.phase.type === "result") break;
      const next = stepGame(state, strategy, rng);
      if (next === state) {
        stoppedByMaxSteps = true;
        break;
      }
      state = next;
    }

    if (stepCount >= maxSteps && state.phase.type !== "dying" && state.phase.type !== "result") {
      stoppedByMaxSteps = true;
    }

    return summarizeRun(strategy, runIndex, seed, state, stepCount, stoppedByMaxSteps);
  } finally {
    Math.random = originalRandom;
  }
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function inc(record: Record<string, number>, key: string | undefined): void {
  const safeKey = key ?? "none";
  record[safeKey] = (record[safeKey] ?? 0) + 1;
}

function ageBucket(age: number): string {
  if (age <= 17) return "0-17";
  if (age <= 30) return "18-30";
  if (age <= 60) return "31-60";
  if (age <= 99) return "61-99";
  return "100";
}

function topEntries(record: Record<string, number>, limit = 12): Array<{ id: string; count: number }> {
  return Object.entries(record)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, count]) => ({ id, count }));
}

function aggregate(strategy: Strategy, seed: number, runs: RunSummary[]): Aggregate {
  const terminalKinds: Record<string, number> = {};
  const deathTypes: Record<string, number> = {};
  const deathAttributes: Record<string, number> = {};
  const attributeEndings: Record<string, number> = {};
  const ageBuckets: Record<string, number> = {};
  const eventCounts: Record<string, number> = {};
  const memeEventCounts: Record<string, number> = {};
  const deathEventCounts: Record<string, number> = {};
  const attrSums = Object.fromEntries(ATTRIBUTES.map((attr) => [attr, 0])) as Record<AttributeName, number>;
  const attrMins = Object.fromEntries(ATTRIBUTES.map((attr) => [attr, 101])) as Record<AttributeName, number>;
  const attrMaxs = Object.fromEntries(ATTRIBUTES.map((attr) => [attr, -1])) as Record<AttributeName, number>;

  for (const run of runs) {
    inc(terminalKinds, run.terminalKind);
    inc(deathTypes, run.deathType);
    inc(deathAttributes, run.deathAttribute);
    inc(attributeEndings, run.attributeEndingId);
    inc(ageBuckets, ageBucket(run.age));

    for (const id of run.eventIds) inc(eventCounts, id);
    for (const id of run.memeEventIds) inc(memeEventCounts, id);
    if (run.terminalKind === "death") inc(deathEventCounts, run.eventIds.at(-1));

    for (const attr of ATTRIBUTES) {
      const value = run.finalAttributes[attr];
      attrSums[attr] += value;
      attrMins[attr] = Math.min(attrMins[attr], value);
      attrMaxs[attr] = Math.max(attrMaxs[attr], value);
    }
  }

  return {
    strategy,
    runs: runs.length,
    seed,
    terminalKinds,
    deathTypes,
    deathAttributes,
    attributeEndings,
    avgAge: average(runs.map((run) => run.age)),
    medianAge: median(runs.map((run) => run.age)),
    avgEvents: average(runs.map((run) => run.eventCount)),
    medianEvents: median(runs.map((run) => run.eventCount)),
    avgUniqueEvents: average(runs.map((run) => run.uniqueEventCount)),
    specialChapterRate: average(runs.map((run) => run.specialChapterTouched ? 1 : 0)),
    avgMemeEvents: average(runs.map((run) => run.memeEvents)),
    avgLethalChoicesEncountered: average(runs.map((run) => run.lethalChoicesEncountered)),
    avgAttributes: Object.fromEntries(ATTRIBUTES.map((attr) => [attr, attrSums[attr] / runs.length])) as Record<AttributeName, number>,
    minAttributes: attrMins,
    maxAttributes: attrMaxs,
    ageBuckets,
    topEvents: topEntries(eventCounts),
    topMemeEvents: topEntries(memeEventCounts),
    topDeathEvents: topEntries(deathEventCounts),
    sampleRuns: runs.slice(0, 5),
  };
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatAggregate(aggregate: Aggregate): string {
  const attrs = ATTRIBUTES.map((attr) => `${attr}:${round(aggregate.avgAttributes[attr])}`).join("  ");
  return [
    `\n== ${aggregate.strategy} ==`,
    `runs=${aggregate.runs} seed=${aggregate.seed}`,
    `terminal=${JSON.stringify(aggregate.terminalKinds)} deathTypes=${JSON.stringify(aggregate.deathTypes)} deathAttributes=${JSON.stringify(aggregate.deathAttributes)} attributeEndings=${JSON.stringify(aggregate.attributeEndings)}`,
    `age avg/median=${round(aggregate.avgAge)}/${round(aggregate.medianAge)} events avg/median=${round(aggregate.avgEvents)}/${round(aggregate.medianEvents)} uniqueAvg=${round(aggregate.avgUniqueEvents)}`,
    `specialChapterRate=${round(aggregate.specialChapterRate * 100)}% avgMemeEvents=${round(aggregate.avgMemeEvents)} avgNearDeath=${round(aggregate.avgLethalChoicesEncountered)}`,
    `ageBuckets=${JSON.stringify(aggregate.ageBuckets)}`,
    `avgAttributes ${attrs}`,
    `topDeathEvents=${JSON.stringify(aggregate.topDeathEvents.slice(0, 8))}`,
    `topMemeEvents=${JSON.stringify(aggregate.topMemeEvents.slice(0, 8))}`,
  ].join("\n");
}

function main() {
  const options = parseArgs();
  if (!Number.isInteger(options.runs) || options.runs <= 0) throw new Error("--runs must be a positive integer");
  if (!Number.isInteger(options.seed)) throw new Error("--seed must be an integer");

  const aggregates: Aggregate[] = [];
  for (const strategy of options.strategies) {
    const runs: RunSummary[] = [];
    for (let i = 0; i < options.runs; i++) {
      const runSeed = options.seed + i * 9973 + strategy.length * 7919;
      runs.push(runOne(strategy, runSeed, i, options.maxSteps));
    }
    aggregates.push(aggregate(strategy, options.seed, runs));
  }

  if (options.json) {
    console.log(JSON.stringify({ options, aggregates }, null, 2));
    return;
  }

  console.log(aggregates.map(formatAggregate).join("\n"));
  console.log("\nUse --json=true for machine-readable output.");
}

main();
