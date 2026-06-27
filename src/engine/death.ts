// src/engine/death.ts
import type { GameState, AttributeName } from "./types";

const LETHAL_ATTRIBUTES: AttributeName[] = ["appearance", "intelligence", "physique", "wealth"];

const ZERO_PENALTY: Record<string, string> = {
  creativity: "才脉尽失，你的天赋被封印了一个",
  luck: "运势耗尽，前路晦暗不明",
};

export interface DeathCheck {
  isDead: boolean;
  cause?: string;
  deathType?: import("./types").DeathType;
  penalty?: { attribute: AttributeName; description: string };
  sealedTalent?: boolean;
  luckCursed?: boolean;
}

/** 分龄获取致死阈值：少年/青年归零才死，壮年/晚年 ≤10 即死 */
export function getLethalThreshold(age: number): number {
  if (age <= 30) return 0;
  return 10;
}

export function checkDeath(state: GameState): DeathCheck {
  const { age, attributes } = state;

  if (age <= 5) return { isDead: false };

  const threshold = getLethalThreshold(age);

  for (const attr of LETHAL_ATTRIBUTES) {
    if (attributes[attr] <= threshold) {
      const causeMap: Record<string, string> = {
        physique: "身体被经年累月的伤病与疲惫彻底耗尽，油尽灯枯",
        appearance: "那个曾经光彩照人的面容在岁月的刀锋下破碎，带走了生的意志",
        intelligence: "那些曾活跃的思绪如烛火般熄灭，心智沉入无边的黑暗中",
        wealth: "一贫如洗。在这个寒冷的世间，没有钱就意味着没有活下去的资格",
      };
      return {
        isDead: true,
        cause: causeMap[attr],
        deathType: "attribute",
      };
    }
  }

  if (attributes.creativity <= 0) {
    return {
      isDead: false,
      penalty: { attribute: "creativity", description: ZERO_PENALTY.creativity },
      sealedTalent: true,
    };
  }

  if (attributes.luck <= 0) {
    return {
      isDead: false,
      penalty: { attribute: "luck", description: ZERO_PENALTY.luck },
      luckCursed: true,
    };
  }

  if (age >= 100) {
    return { isDead: true, cause: "寿终正寝，百年人生圆满落幕", deathType: "natural" };
  }

  return { isDead: false };
}

/** 随机意外死亡：按年龄分概率 */
export function checkRandomDeath(age: number): DeathCheck {
  if (age <= 17) return { isDead: false }; // 少年期无随机死亡

  let probability: number;
  if (age <= 30) probability = 0.01;       // 青年 1%/年
  else if (age <= 60) probability = 0.02;  // 壮年 2%/年
  else probability = 0.03;                  // 晚年 3%/年

  if (Math.random() < probability) {
    const causes = [
      "一场毫无预兆的车祸。红绿灯、斑马线、安全气囊——这些词汇在命运面前轻如鸿毛",
      "一种从未听说过的急病在几天内席卷了全身。医生尽了全力，但生命有时就是这样不讲道理",
      "命运伸出了它冰冷的触须——一次再平常不过的意外，却在那个瞬间成了终局",
    ];
    return {
      isDead: true,
      cause: causes[Math.floor(Math.random() * causes.length)],
      deathType: "accident",
    };
  }

  return { isDead: false };
}

/** 体质自然衰减：30岁起每5年-1，仅整5年节点触发 */
export function applyNaturalDecay(age: number): Partial<Record<AttributeName, number>> {
  if (age <= 30) return {};
  if ((age - 30) % 5 === 0) return { physique: -1 };
  return {};
}
