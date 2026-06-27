// src/engine/autosave.ts
import type { EventTriggerRecord, GameState } from "./types";

const SAVE_KEY = "cmys_life_autosave";

interface SaveData {
  state: GameState;
  timestamp: number;
}

/** 序列化：EventTriggerRecord 直接 JSON 可序列化，无需特殊处理 */
function serializeState(state: GameState): string {
  return JSON.stringify({
    ...state,
    // triggeredEventIds 是 Record<string, number>，JSON 原生支持
    currentEvent: state.currentEvent,
    pendingChoices: state.pendingChoices,
  });
}

function deserializeState(json: string): GameState {
  const raw = JSON.parse(json);
  // triggeredEventIds 在 JSON 中就是普通对象，直接使用
  // 兼容旧 Set 格式：如果是数组则转为 Record
  let triggered: EventTriggerRecord = {};
  if (Array.isArray(raw.triggeredEventIds)) {
    // 旧格式：Set 序列化成的数组
    for (const id of raw.triggeredEventIds) {
      triggered[id] = raw.age ?? 0;
    }
  } else if (raw.triggeredEventIds && typeof raw.triggeredEventIds === "object") {
    triggered = raw.triggeredEventIds;
  }
  return {
    ...raw,
    triggeredEventIds: triggered,
  };
}

/**
 * 在关键年龄节点自动存档。
 * 存档年龄点：6岁（小学）、18岁（成年）、31岁（而立）、61岁（退休）。
 */
export function saveGame(state: GameState): void {
  const SAVE_CHECKPOINTS = [6, 18, 31, 61];
  if (!SAVE_CHECKPOINTS.includes(state.age as number)) return;

  try {
    const data: SaveData = { state, timestamp: Date.now() };
    localStorage.setItem(SAVE_KEY, serializeState(state));
  } catch {
    // localStorage 满或不可用，静默失败
  }
}

/** 检查是否存在存档 */
export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

/** 读取存档，解析失败时自动清除无效存档 */
export function loadGame(): GameState | null {
  try {
    const json = localStorage.getItem(SAVE_KEY);
    if (!json) return null;
    return deserializeState(json);
  } catch {
    clearSave();
    return null;
  }
}

/** 清除存档 */
export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // 静默失败
  }
}
