// src/engine/balance.ts
import type { AttributeName } from "./types";

export type AttributeChangeMap = Partial<Record<AttributeName, number>>;

/**
 * 0~100 百分制初始属性。
 * 初始值保持在 10~20，让后续事件、天赋和篇章选择成为主要成长来源。
 */
export function rollInitialAttribute(): number {
  return Math.floor(Math.random() * 11) + 10; // 10~20
}

/**
 * 将旧事件数据中的小幅度变化缩放到 0~100 属性尺度。
 *
 * 旧数据大量使用 ±1~±6：
 * - 在 3~20 的旧尺度中能明显改变命运；
 * - 在 0~100 的新尺度中太弱。
 *
 * 这里保留事件数据本身，只在结算时映射：
 * 低初始值下使用温和缩放：正收益推动成长，负收益保留代价但不让轻微 -1 直接变成早期死亡。
 */
export function scaleAttributeDelta(delta: number): number {
  if (!Number.isFinite(delta) || delta === 0) return 0;

  const abs = Math.abs(delta);
  const positiveTable: Record<number, number> = {
    1: 2,
    2: 4,
    3: 6,
    4: 8,
    5: 10,
    6: 12,
  };
  const negativeTable: Record<number, number> = {
    1: 1,
    2: 2,
    3: 4,
    4: 6,
    5: 8,
    6: 10,
  };

  if (delta > 0) {
    if (abs in positiveTable) return positiveTable[abs];
    return Math.min(20, Math.round(abs * 2));
  }

  if (abs in negativeTable) return -negativeTable[abs];
  return -Math.min(18, Math.round(abs * 1.7));
}

export function scaleAttributeChanges(changes: AttributeChangeMap): AttributeChangeMap {
  const scaled: AttributeChangeMap = {};
  for (const [key, value] of Object.entries(changes) as [AttributeName, number][]) {
    scaled[key] = scaleAttributeDelta(value);
  }
  return scaled;
}
