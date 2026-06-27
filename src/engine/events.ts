// src/engine/events.ts
import type { GameState, GameEvent, AttributeName } from "./types";
import { ANCHOR_EVENTS } from "../data/life/events-anchors";
import { PARAMETRIC_EVENTS } from "../data/life/events-parametric";

// 构建年龄段索引
function buildEventIndex(): Map<number, GameEvent[]> {
  const all: GameEvent[] = [...ANCHOR_EVENTS, ...PARAMETRIC_EVENTS];
  const index = new Map<number, GameEvent[]>();

  for (const event of all) {
    const decadeKey = Math.floor(event.minAge / 10) * 10;
    if (!index.has(decadeKey)) index.set(decadeKey, []);
    index.get(decadeKey)!.push(event);
  }

  return index;
}

let eventIndexCache: Map<number, GameEvent[]> | null = null;

function getEventIndex(): Map<number, GameEvent[]> {
  if (!eventIndexCache) eventIndexCache = buildEventIndex();
  return eventIndexCache;
}

// 检查事件是否可触发
function isEventEligible(event: GameEvent, state: GameState): boolean {
  const { age, attributes, triggeredEventIds, talents } = state;

  // 年龄范围
  if (age < event.minAge || age > event.maxAge) return false;

  // 锚点事件：检查是否在精确年龄
  if (event.type === "anchor") {
    const triggers = Array.isArray(event.triggerAge) ? event.triggerAge : [event.triggerAge];
    if (!triggers.includes(age as number)) return false;
  }

  // 参数化事件：属性要求
  if (event.type === "parametric") {
    if (event.statRequirements) {
      for (const [key, val] of Object.entries(event.statRequirements) as [AttributeName, number][]) {
        if (attributes[key] < val) return false;
      }
    }
    if (event.requiredTalents) {
      const talentIds = talents.map((t) => t.id);
      if (!event.requiredTalents.every((tid) => talentIds.includes(tid))) return false;
    }
    if (event.excludedTalents) {
      const talentIds = talents.map((t) => t.id);
      if (event.excludedTalents.some((tid) => talentIds.includes(tid))) return false;
    }
    // 触发次数限制
    if (event.maxTriggers !== undefined && event.maxTriggers > 0) {
      const count = event.id in state.triggeredEventIds ? 1 : 0;
      if (count >= event.maxTriggers) return false;
    }
  }

  // 冷却期检查（在 maxTriggers 检查之后）
  if (event.type === "parametric" || event.type === "anchor") {
    if (event.cooldownYears !== undefined && event.cooldownYears > 0) {
      const lastAge = state.triggeredEventIds[event.id];
      if (lastAge !== undefined) {
        const yearsSinceLastTrigger = (state.age as number) - lastAge;
        if (yearsSinceLastTrigger < event.cooldownYears) return false;
      }
    }
  }

  return true;
}

// 获取符合条件的可触发事件
export function getEligibleEvents(state: GameState): GameEvent[] {
  const index = getEventIndex();
  const decadeKey = Math.floor(state.age / 10) * 10;

  // 查询当前 decade 和相邻 decade
  const candidates: GameEvent[] = [];
  for (const dk of [decadeKey - 10, decadeKey, decadeKey + 10]) {
    const events = index.get(dk);
    if (events) candidates.push(...events);
  }

  return candidates.filter((e) => isEventEligible(e, state));
}

// 加权随机选择事件
export function selectEvent(state: GameState): GameEvent | null {
  const eligible = getEligibleEvents(state);
  if (eligible.length === 0) return null;

  // 按权重加权随机
  const totalWeight = eligible.reduce((sum, e) => sum + (e.weight ?? 1), 0);
  let random = Math.random() * totalWeight;

  for (const event of eligible) {
    random -= event.weight ?? 1;
    if (random <= 0) return event;
  }

  return eligible[0];
}

// 判断当前年龄是否应该触发事件
export function shouldTriggerEvent(age: number): boolean {
  if (age <= 5) return false; // 婴幼期自动叙事，不走事件引擎
  if (age <= 30) return true;  // 少年/青年期每岁
  if (age <= 60) return (age - 31) % 3 === 0; // 壮年期每3年
  if (age <= 70) return (age - 61) % 3 === 0;
  if (age <= 85) return (age - 71) % 5 === 0;
  return (age - 86) % 7 === 0;
}
