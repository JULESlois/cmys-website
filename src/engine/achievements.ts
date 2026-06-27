// src/engine/achievements.ts
import type { GameState, AchievementId } from "./types";
import { ALL_ACHIEVEMENTS } from "../data/life/achievements";

export function checkAchievements(state: GameState): AchievementId[] {
  return ALL_ACHIEVEMENTS
    .filter((a) => {
      try {
        return a.check(state);
      } catch {
        return false;
      }
    })
    .map((a) => a.id);
}

export function getAchievementScore(ids: AchievementId[]): number {
  return ids.reduce((sum, id) => {
    const achievement = ALL_ACHIEVEMENTS.find((a) => a.id === id);
    return sum + (achievement?.score ?? 0);
  }, 0);
}

export function getAllAchievementIds(): AchievementId[] {
  return ALL_ACHIEVEMENTS.map((a) => a.id);
}
