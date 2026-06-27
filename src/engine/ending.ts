// src/engine/ending.ts
import type { GameState, GameResult, AchievementId } from "./types";
import { checkAchievements, getAchievementScore, getAllAchievementIds } from "./achievements";

export function computeResult(state: GameState): GameResult {
  const { attributes, eventLog, relationships, career, age } = state;

  // ── 第一层：基础分（35%，0~350）──
  const attrSum = Object.values(attributes).reduce((sum, v) => sum + v, 0);
  const baseScore = Math.round((attrSum / 600) * 350);

  // ── 第二层：成就分（40%，0~400）──
  const achievements = checkAchievements(state);
  const achievementScore = Math.min(400, getAchievementScore(achievements));

  // ── 第三层：叙事分（25%，0~250）──
  const uniqueEvents = new Set(eventLog.map((e) => e.eventId)).size;
  const eventDiversity = Math.min(100, uniqueEvents * 4);

  const confidant = relationships.find((r) => r.tag === "confidant");
  const relationshipScore = confidant ? Math.abs(confidant.affinity) : 0;

  const careerPeak = Math.min(80, (career?.level ?? 0) * 8);

  // 隐藏结局加权：活过壮年期 + 触发过即死事件但未死
  let hiddenBonus = 0;
  if (age > 60) hiddenBonus += 10;
  if (achievements.includes("cheating_death")) hiddenBonus += 10;

  const narrativeScore = Math.min(250, eventDiversity + relationshipScore + careerPeak + hiddenBonus);

  // ── 总分 ──
  const totalScore = baseScore + achievementScore + narrativeScore;

  // ── 评星 ──
  let starRating: number;
  if (totalScore >= 750) starRating = 5;
  else if (totalScore >= 550) starRating = 4;
  else if (totalScore >= 350) starRating = 3;
  else if (totalScore >= 150) starRating = 2;
  else starRating = 1;

  // ── 称号 ──
  const titles: Record<number, string[]> = {
    1: ["草木一瞬", "过客匆匆", "浮萍无根"],
    2: ["寂寥旅人", "安分耕者", "平凡过客"],
    3: ["功成身退", "诗酒趁年华", "不负此生"],
    4: ["沧海一声笑", "此心安处是吾乡", "青云直上"],
    5: ["半生戎马半生花", "一世风雨一世霞", "万古长空一轮月"],
  };
  const pool = titles[starRating] ?? titles[1];
  const title = pool[Math.floor(Math.random() * pool.length)];

  // ── 人生亮点 ──
  const highlights: string[] = [];
  if (attrSum >= 400) highlights.push("六边形战士——属性全面发展");
  if (career && career.level >= 7) highlights.push(`${career.title}——职业生涯辉煌`);
  if (age >= 90) highlights.push("长寿之人——享年九旬以上");
  if (uniqueEvents >= 30) highlights.push("经历丰富——人生波澜壮阔");
  if (achievements.length >= 5) highlights.push(`成就猎人——解锁了 ${achievements.length} 项成就`);
  if (achievements.includes("century")) highlights.push("百年孤独——活到了世界的尽头");
  if (achievements.includes("phoenix")) highlights.push("不死鸟——在死亡边缘反复横跳");

  return {
    starRating,
    title,
    description: `享年 ${age} 岁 · 基础 ${baseScore} + 成就 ${achievementScore} + 叙事 ${narrativeScore}`,
    totalScore: Math.round(totalScore),
    highlights: highlights.length > 0 ? highlights : ["平平淡淡才是真"],
    achievements,
    allAchievements: getAllAchievementIds(),
    baseScore,
    achievementScore,
    narrativeScore,
  };
}
