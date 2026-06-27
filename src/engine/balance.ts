// src/engine/balance.ts
import type { AttributeName } from "./types";

export type AttributeChangeMap = Partial<Record<AttributeName, number>>;

/**
 * 0~100 百分制初始属性。
 * 旧版本为 3~5，和 UI 百分比状态条、30 岁后死亡阈值不匹配。
 */
export function rollInitialAttribute(): number {
  return Math.floor(Math.random() * 21) + 38; // 38~58
}

/**
 * 将旧事件数据中的小幅度变化缩放到 0~100 属性尺度。
 *
 * 旧数据大量使用 ±1~±6：
 * - 在 3~20 的旧尺度中能明显改变命运；
 * - 在 0~100 的新尺度中太弱。
 *
 * 这里保留事件数据本身，只在结算时映射：
 * 正负变化使用接近对称的百分制映射，保持旧事件在 0~100 尺度下的影响力。
 */
export function scaleAttributeDelta(delta: number): number {
  if (!Number.isFinite(delta) || delta === 0) return 0;

  const abs = Math.abs(delta);
  const positiveTable: Record<number, number> = {
    1: 4,
    2: 7,
    3: 10,
    4: 13,
    5: 16,
    6: 18,
  };
  const negativeTable: Record<number, number> = {
    1: 4,
    2: 6,
    3: 9,
    4: 12,
    5: 14,
    6: 16,
  };

  if (delta > 0) {
    if (abs in positiveTable) return positiveTable[abs];
    return Math.min(30, Math.round(abs * 3));
  }

  if (abs in negativeTable) return -negativeTable[abs];
  return -Math.min(24, Math.round(abs * 2.5));
}

export function scaleAttributeChanges(changes: AttributeChangeMap): AttributeChangeMap {
  const scaled: AttributeChangeMap = {};
  for (const [key, value] of Object.entries(changes) as [AttributeName, number][]) {
    scaled[key] = scaleAttributeDelta(value);
  }
  return scaled;
}
