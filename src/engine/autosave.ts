// src/engine/autosave.ts
import type { EventTriggerRecord, GameState } from "./types";
import { normalizeChapterState, syncStoryArcForAge } from "./chapters";

const SAVE_KEY = "cmys_life_autosave";
const SAVE_VERSION = 2;

interface SaveData {
  version: number;
  state: GameState;
  timestamp: number;
}

export interface SaveMetadata {
  age: number;
  timestamp: number | null;
  storyArcId: string;
  activeChapterId: string | null;
}

function normalizeState(raw: any): GameState {
  let triggered: EventTriggerRecord = {};
  if (Array.isArray(raw.triggeredEventIds)) {
    for (const id of raw.triggeredEventIds) {
      triggered[id] = raw.age ?? 0;
    }
  } else if (raw.triggeredEventIds && typeof raw.triggeredEventIds === "object") {
    triggered = raw.triggeredEventIds;
  }

  return {
    ...raw,
    triggeredEventIds: triggered,
    chapter: syncStoryArcForAge(normalizeChapterState(raw.chapter), raw.age ?? 0),
    pendingEventId: raw.pendingEventId ?? null,
    pendingChapterIntroId: raw.pendingChapterIntroId ?? null,
    pendingChoiceOrder: raw.pendingChoiceOrder ?? (raw.pendingChoices?.map((_: unknown, index: number) => index) ?? null),
    attributeEndingId: raw.attributeEndingId ?? null,
    nearDeathCount: raw.nearDeathCount ?? 0,
  };
}

function parseSave(json: string): { state: GameState; timestamp: number | null } {
  const raw = JSON.parse(json);

  // v2：带时间戳的包装结构。
  if (raw && typeof raw === "object" && raw.state) {
    return {
      state: normalizeState(raw.state),
      timestamp: typeof raw.timestamp === "number" ? raw.timestamp : null,
    };
  }

  // 兼容旧版直接保存 GameState 的格式。
  return {
    state: normalizeState(raw),
    timestamp: null,
  };
}

function writeSave(state: GameState): void {
  const data: SaveData = {
    version: SAVE_VERSION,
    state,
    timestamp: Date.now(),
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

/**
 * 保存人生进度。
 * 默认只在关键年龄保存；force=true 用于事件展示、事件结算、篇章切换和终局等关键节点。
 */
export function saveGame(state: GameState, force = false): void {
  const checkpoints = [6, 18, 31, 61];
  if (!force && !checkpoints.includes(state.age as number)) return;

  try {
    writeSave(state);
  } catch {
    // localStorage 满或不可用，静默失败。
  }
}

export function hasSave(): boolean {
  try {
    const json = localStorage.getItem(SAVE_KEY);
    if (!json) return false;
    parseSave(json);
    return true;
  } catch {
    clearSave();
    return false;
  }
}

export function loadGame(): GameState | null {
  try {
    const json = localStorage.getItem(SAVE_KEY);
    if (!json) return null;
    return parseSave(json).state;
  } catch {
    clearSave();
    return null;
  }
}

export function getSaveMetadata(): SaveMetadata | null {
  try {
    const json = localStorage.getItem(SAVE_KEY);
    if (!json) return null;
    const { state, timestamp } = parseSave(json);
    return {
      age: state.age as number,
      timestamp,
      storyArcId: state.chapter.currentArcId,
      activeChapterId: state.chapter.activeChapterId,
    };
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // 静默失败。
  }
}
