// src/data/life/story-arcs.ts
import type { Age } from "../../engine/types";

export interface StoryArcDefinition {
  id: string;
  name: string;      // CMYS 四字篇名 + 篇
  alias: string;     // 用户可读别名
  minAge: number;
  maxAge: number;
  description: string;
}

export const STORY_ARCS: StoryArcDefinition[] = [
  {
    id: "arc_infant",
    name: "初梦幼生篇",
    alias: "婴幼篇",
    minAge: 0,
    maxAge: 5,
    description: "出生、学步、认人、最早的世界轮廓。",
  },
  {
    id: "arc_elementary",
    name: "春苗幼生篇",
    alias: "萌娃篇 · 小学",
    minAge: 6,
    maxAge: 11,
    description: "小学、玩伴、村口、作业、第一次知道世界比家门口更大。",
  },
  {
    id: "arc_middle_school",
    name: "沉默应试篇",
    alias: "esu篇 · 中学",
    minAge: 12,
    maxAge: 17,
    description: "中学、考试、沉默、友情萌芽，以及第一次被命运推着向前。",
  },
  {
    id: "arc_university",
    name: "出门远涉篇",
    alias: "大学篇",
    minAge: 18,
    maxAge: 22,
    description: "离家、大学、初恋、毕业，人生第一次真正走向远方。",
  },
  {
    id: "arc_young_adult",
    name: "城暮游生篇",
    alias: "青年篇",
    minAge: 23,
    maxAge: 30,
    description: "城市、工作、漂泊、失败、灵感与孤独。",
  },
  {
    id: "arc_midlife",
    name: "承命应世篇",
    alias: "壮年篇",
    minAge: 31,
    maxAge: 60,
    description: "事业、家庭、债务、责任，以及越来越具体的代价。",
  },
  {
    id: "arc_elder",
    name: "迟暮影深篇",
    alias: "晚年篇",
    minAge: 61,
    maxAge: 100,
    description: "退休、回望、病痛、故人、黄昏，以及最终的结算。",
  },
];

export function getStoryArcByAge(age: number | Age): StoryArcDefinition {
  const n = Number(age);
  return STORY_ARCS.find((arc) => n >= arc.minAge && n <= arc.maxAge) ?? STORY_ARCS[STORY_ARCS.length - 1];
}

export function getStoryArcById(id: string | null | undefined): StoryArcDefinition | null {
  if (!id) return null;
  return STORY_ARCS.find((arc) => arc.id === id) ?? null;
}

export function getStoryArcName(id: string | null | undefined): string | null {
  return getStoryArcById(id)?.name ?? null;
}
