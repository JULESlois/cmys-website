// src/engine/death.ts
import type { GameState, AttributeName, Attributes } from "./types";

const LETHAL_ATTRIBUTES: AttributeName[] = ["appearance", "intelligence", "physique", "wealth"];

const ZERO_PENALTY: Record<string, string> = {
  creativity: "才脉尽失，你的天赋被封印了一个",
  luck: "运势耗尽，前路晦暗不明",
};

export interface DeathCheck {
  isDead: boolean;
  cause?: string;
  deathType?: import("./types").DeathType;
  attribute?: AttributeName;
  penalty?: { attribute: AttributeName; description: string };
  sealedTalent?: boolean;
  luckCursed?: boolean;
}

/**
 * 分龄获取致死阈值。
 *
 * 属性已改为 0~100 尺度：
 * - 30 岁前只有致死属性归零才死亡，避免少年/青年期被单次选择误杀；
 * - 31~60 岁低于 6 视为长期崩溃；
 * - 61~80 岁阈值为 12；
 * - 81 岁后阈值升到 18，体现晚年脆弱性。
 */
export function getLethalThreshold(age: number): number {
  if (age <= 30) return 0;
  if (age <= 60) return 6;
  if (age <= 80) return 12;
  return 18;
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
        attribute: attr,
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

function getRandomRiskByAttribute(value: number): number {
  if (value >= 70) return 0;
  if (value >= 50) return 0.15;
  if (value >= 35) return 0.35;
  if (value >= 20) return 0.65;
  return 1;
}

function getRandomDeathMaxProbability(age: number): number {
  if (age <= 30) return 0.004;
  if (age <= 60) return 0.009;
  if (age <= 80) return 0.016;
  return 0.025;
}

function getRandomDeathBaseline(age: number): number {
  if (age <= 60) return 0;
  if (age <= 80) return 0.002;
  return 0.005;
}

export function getRandomDeathProbability(age: number, attributes: Attributes): number {
  if (age <= 17) return 0;

  const physiqueRisk = getRandomRiskByAttribute(attributes.physique);
  const luckRisk = getRandomRiskByAttribute(attributes.luck);
  const riskScore = physiqueRisk * 0.7 + luckRisk * 0.3;
  const maxProbability = getRandomDeathMaxProbability(age);
  const baseline = getRandomDeathBaseline(age);

  return Math.min(maxProbability, baseline + maxProbability * riskScore);
}

/**
 * 随机意外死亡。
 *
 * 不再使用纯年龄随机死：
 * - 体质越低，急病、摔倒、过劳等风险越高；
 * - 运势越低，交通事故、突发意外等风险越高；
 * - 体质和运势都高时，青年/壮年不会凭空随机死亡；
 * - 晚年保留很低的基础风险，避免长寿局完全没有外部不确定性。
 */
export function checkRandomDeath(age: number, attributes: Attributes): DeathCheck {
  const probability = getRandomDeathProbability(age, attributes);
  if (probability <= 0 || Math.random() >= probability) return { isDead: false };

  const physiqueRisk = getRandomRiskByAttribute(attributes.physique);
  const luckRisk = getRandomRiskByAttribute(attributes.luck);
  const causes = physiqueRisk >= luckRisk
    ? [
        "长期透支终于在一次寻常清晨集中反噬。身体没有再给你第二次警告",
        "一场急病击穿了本就虚弱的身体。医生尽了全力，但根基已经被岁月掏空",
        "疲惫、旧伤与衰弱在这一年同时压下。你没有输给某个瞬间，而是输给了长期亏空",
      ]
    : [
        "运势低垂时，最普通的路口也会变成命运的缺口。一场意外带走了之后的所有年份",
        "你已经避开了很多次坏结局，但这一次，命运没有再让开",
        "一个微小的差错连成无法挽回的事故。前路晦暗时，偶然也会变得锋利",
      ];

  return {
    isDead: true,
    cause: causes[Math.floor(Math.random() * causes.length)],
    deathType: "accident",
  };
}

/** 体质自然衰减：30 岁起每 5 年 -2，仅整 5 年节点触发 */
export function applyNaturalDecay(age: number): Partial<Record<AttributeName, number>> {
  if (age <= 30) return {};
  if ((age - 30) % 5 === 0) return { physique: -2 };
  return {};
}
