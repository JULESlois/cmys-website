// src/engine/talent.ts
import type { Talent, GameState, AttributeName, Attributes } from "./types";
import { attr } from "./types";
import { scaleAttributeDelta } from "./balance";

export function isSpecialTalent(talent: Talent | undefined): boolean {
  return talent?.kind === "special";
}

function shuffleTalents(talents: Talent[]): Talent[] {
  return [...talents].sort(() => Math.random() - 0.5);
}

// 获取当前年龄生效的天赋
export function getActiveTalents(state: GameState): Talent[] {
  const { age, talents } = state;
  return talents.filter((t) => {
    switch (t.category) {
      case "childhood": return age <= 17;
      case "prime": return age >= 18 && age <= 60;
      case "lifelong": return true;
      default: return false;
    }
  });
}

export interface TalentModifierResult {
  changes: Partial<Record<AttributeName, number>>;
  descriptions: string[];
}

const ATTR_LABEL: Record<AttributeName, string> = {
  appearance: "颜值",
  intelligence: "智力",
  physique: "体质",
  wealth: "家境",
  creativity: "才脉",
  luck: "运势",
};

function getTalentModifierAmount(rawValue: number): number {
  const scaled = Math.abs(scaleAttributeDelta(rawValue));
  if (scaled >= 10) return 2;
  return 1;
}

function applyContextualModifier(
  current: number | undefined,
  amount: number,
  kind: "positive" | "negative",
): number | null {
  if (!current) return null;
  if (kind === "positive") {
    if (current > 0) return amount;
    return Math.min(Math.abs(current), amount);
  }
  if (current > 0) return -Math.min(current, amount);
  return -amount;
}

// 应用当前年龄生效的天赋持续修正。
// 该函数只修饰事件已有的属性变化，不凭空添加属性，以避免天赋在每个事件中无限灌属性。
export function applyTalentModifiers(
  baseEffect: Partial<Record<AttributeName, number>>,
  activeTalents: Talent[]
): TalentModifierResult {
  const result: Partial<Record<AttributeName, number>> = { ...baseEffect };
  const descriptions: string[] = [];

  for (const talent of activeTalents) {
    for (const [key, val] of Object.entries(talent.positive) as [AttributeName, number][]) {
      const delta = applyContextualModifier(result[key], getTalentModifierAmount(val), "positive");
      if (delta === null || delta === 0) continue;
      result[key] = (result[key] ?? 0) + delta;
      descriptions.push(`天赋「${talent.name}」影响${ATTR_LABEL[key]}${delta > 0 ? "+" : ""}${delta}`);
    }
    for (const [key, val] of Object.entries(talent.negative) as [AttributeName, number][]) {
      const delta = applyContextualModifier(result[key], getTalentModifierAmount(val), "negative");
      if (delta === null || delta === 0) continue;
      result[key] = (result[key] ?? 0) + delta;
      descriptions.push(`天赋「${talent.name}」影响${ATTR_LABEL[key]}${delta > 0 ? "+" : ""}${delta}`);
    }
  }

  return { changes: result, descriptions };
}

// 从天赋池中为当前轮次随机选 3 个天赋。
// 特殊天赋是路线门票：三轮选择中只在第 1 轮最多出现 1 个；一旦已选择特殊天赋，后续不再出现特殊天赋。
export function selectTalentsForRound(
  pool: Talent[],
  selectedIds: string[],
  round: number
): Talent[] {
  const selectedTalents = selectedIds
    .map((id) => pool.find((p) => p.id === id))
    .filter((talent): talent is Talent => Boolean(talent));
  const hasSelectedSpecialTalent = selectedTalents.some(isSpecialTalent);

  const available = pool.filter((t) => {
    if (selectedIds.includes(t.id)) return false;
    if (isSpecialTalent(t) && (hasSelectedSpecialTalent || round > 0)) return false;
    // 互斥检查
    const hasConflict = selectedIds.some((sid) => {
      const selectedTalent = pool.find((p) => p.id === sid);
      return selectedTalent?.exclusiveWith?.includes(t.id) || t.exclusiveWith?.includes(sid);
    });
    if (hasConflict) return false;
    return true;
  });

  const special = shuffleTalents(available.filter(isSpecialTalent)).slice(0, 1);
  const normal = shuffleTalents(available.filter((talent) => !isSpecialTalent(talent))).slice(0, 3 - special.length);
  return shuffleTalents([...special, ...normal]);
}

// 应用单个天赋到属性
export function applyTalentToAttributes(
  attrs: Attributes,
  talent: Talent
): Attributes {
  const next = { ...attrs };
  for (const [key, val] of Object.entries(talent.positive) as [AttributeName, number][]) {
    next[key] = attr(next[key] + scaleAttributeDelta(val));
  }
  for (const [key, val] of Object.entries(talent.negative) as [AttributeName, number][]) {
    next[key] = attr(next[key] + scaleAttributeDelta(val));
  }
  return next;
}
