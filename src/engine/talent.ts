// src/engine/talent.ts
import type { Talent, GameState, AttributeName, Attributes } from "./types";
import { attr } from "./types";
import { scaleAttributeDelta } from "./balance";

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

// 应用天赋的属性修正
export function applyTalentModifiers(
  baseEffect: Partial<Record<AttributeName, number>>,
  activeTalents: Talent[]
): Partial<Record<AttributeName, number>> {
  const result: Partial<Record<AttributeName, number>> = { ...baseEffect };

  for (const talent of activeTalents) {
    for (const [key, val] of Object.entries(talent.positive) as [AttributeName, number][]) {
      result[key] = (result[key] ?? 0) + scaleAttributeDelta(val);
    }
    for (const [key, val] of Object.entries(talent.negative) as [AttributeName, number][]) {
      result[key] = (result[key] ?? 0) + scaleAttributeDelta(val);
    }
  }

  return result;
}

// 从天赋池中为当前轮次随机选 3 个天赋
export function selectTalentsForRound(
  pool: Talent[],
  selectedIds: string[],
  round: number
): Talent[] {
  const available = pool.filter((t) => {
    if (selectedIds.includes(t.id)) return false;
    // 互斥检查
    const hasConflict = selectedIds.some((sid) => {
      const selectedTalent = pool.find((p) => p.id === sid);
      return selectedTalent?.exclusiveWith?.includes(t.id) || t.exclusiveWith?.includes(sid);
    });
    if (hasConflict) return false;
    return true;
  });

  // 打乱并取前 3 个
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
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
