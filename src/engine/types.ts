// src/engine/types.ts

// ── Branded types ──
export type Age = number & { __brand: "Age" };
export type AttributeValue = number & { __brand: "AttributeValue" };

export function createAge(n: number): Age {
  if (!Number.isInteger(n) || n < 0 || n > 100) throw new Error(`Invalid age: ${n}`);
  return n as Age;
}

export function attr(v: number): AttributeValue {
  if (!Number.isFinite(v)) throw new Error("Invalid attribute value");
  return Math.max(0, Math.min(100, Math.round(v))) as AttributeValue;
}

export function incrementAge(a: Age): Age {
  const next = a + 1;
  return next > 100 ? (100 as Age) : (next as Age);
}

// ── Attributes ──
export type AttributeName = "appearance" | "intelligence" | "physique" | "wealth" | "creativity" | "luck";
export type Attributes = Record<AttributeName, AttributeValue>;

export const LETHAL_ATTRIBUTES: AttributeName[] = ["appearance", "intelligence", "physique", "wealth"];

// ── Talent ──
export interface Talent {
  id: string;
  name: string;           // CMYS 四字缩写
  description: string;
  category: "childhood" | "prime" | "lifelong";  // 童年 / 壮年 / 终身
  tags: string[];
  positive: Partial<Record<AttributeName, number>>;
  negative: Partial<Record<AttributeName, number>>;
  exclusiveWith?: string[];
}

// ── Events ──
export interface EventBase {
  id: string;
  title: string;          // CMYS 四字缩写
  description: string;
  minAge: Age;
  maxAge: Age;
  weight?: number;
  cooldownYears?: number;  // 新增：触发后冷却年数
}

export interface AnchorEvent extends EventBase {
  type: "anchor";
  triggerAge: number | number[];
  choices: EventChoice[];
}

export interface ParametricEvent extends EventBase {
  type: "parametric";
  statRequirements?: Partial<Record<AttributeName, number>>;
  requiredTalents?: string[];
  excludedTalents?: string[];
  maxTriggers?: number;
  choices: EventChoice[];
}

export interface ProceduralEvent extends EventBase {
  type: "procedural";
  autoResolve: true;
  effects: Partial<Record<AttributeName, number>>;
}

export type GameEvent = AnchorEvent | ParametricEvent | ProceduralEvent;

export interface EventChoice {
  text: string;
  resultText?: string;
  effects: {
    attributes?: Partial<Record<AttributeName, number>>;
    grantTalents?: string[];
    removeTalents?: string[];
    triggerEventId?: string;
    relationshipEffect?: { targetId: string; change: number };
    careerLevelDelta?: number;  // 新增：职业等级变化
    isLethal?: boolean;
  };
}

export interface EventResult {
  text: string;
  attributeChanges: Partial<Record<AttributeName, number>>;
}

// ── Relationship ──
export interface Relationship {
  id: string;
  name: string;
  tag: "confidant" | "partner" | "friend" | "rival";
  affinity: number;   // -100 ~ +100
}

// ── Career ──
export type CareerPath = "academic" | "merchant" | "artist" | null;

export interface Career {
  path: CareerPath;
  title: string;
  level: number;       // 1~10
  milestones: string[];
}

// ── Event Trigger Record ──
/** 事件ID → 最后触发年龄，替代 Set<string> */
export type EventTriggerRecord = Record<string, number>;

// ── Achievements ──
export type AchievementId =
  | "great_ups_and_downs"    // 大起大落
  | "cheating_death"          // 向死而生
  | "soulmate"                // 伯牙子期
  | "defy_fate"               // 逆天改命
  | "young_grey"              // 少年白头
  | "ladykiller"              // 情圣
  | "phoenix"                 // 不死鸟
  | "rags_to_riches"          // 白手起家
  | "scholar"                 // 学富五车
  | "century"                 // 百年孤独
  | "early_death"             // 早夭
  | "homewrecker"             // 杀手本能
  | "careerist"               // 青云直上
  | "survivor"                // 劫后余生
  | "hedonist"                // 及时行乐
  | "stoic"                   // 不动如山
  ;

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  score: number;
  /** 判定函数，返回是否达成 */
  check: (state: GameState) => boolean;
}

// ── Game State ──
export type GamePhase =
  | { type: "save_choice" }
  | { type: "talent_selection"; round: number }
  | { type: "playing"; step: "aging" | "event_presenting" | "awaiting_choice" | "effect_resolving" }
  | { type: "dying"; cause: string }
  | { type: "result" };

export interface GameState {
  phase: GamePhase;
  age: Age;
  attributes: Attributes;
  talents: Talent[];
  relationships: Relationship[];
  career: Career | null;
  eventLog: ResolvedEvent[];
  triggeredEventIds: EventTriggerRecord;  // 改: 从 Set<string> 变为 Record<string, number>
  currentEvent: GameEvent | null;
  pendingChoices: EventChoice[] | null;
  lastResult: EventResult | null;
  nearDeathCount: number;  // 新增：遭遇即死选项的次数
  deathRecord: DeathRecord | null;
}

export type GameAction =
  | { type: "SELECT_TALENT"; talentId: string }
  | { type: "START_GAME" }
  | { type: "ADVANCE_AGE"; delta?: number }
  | { type: "RESOLVE_EVENT"; choiceIndex: number }
  | { type: "TRIGGER_DEATH"; cause: string }
  | { type: "DISMISS_RESULT" }
  | { type: "SHOW_RESULT" }
  | { type: "RESTART" }
  | { type: "LOAD_SAVE"; state: GameState };

// ── Results ──
export interface ResolvedEvent {
  age: Age;
  eventId: string;
  title: string;
  choiceText: string;
  attributeChanges: Partial<Record<AttributeName, number>>;
}

export type DeathType = "attribute" | "lethal_choice" | "accident" | "natural";

export interface DeathRecord {
  age: Age;
  cause: string;
  deathType: DeathType;
}

export interface GameResult {
  starRating: number;       // 1~5
  title: string;            // 结局称号
  description: string;
  totalScore: number;
  highlights: string[];
  achievements: AchievementId[];           // 新增：已触发的成就
  allAchievements: AchievementId[];         // 新增：所有成就列表（前端展示灰掉的）
  baseScore: number;                        // 新增：基础分
  achievementScore: number;                 // 新增：成就分
  narrativeScore: number;                   // 新增：叙事分
}
