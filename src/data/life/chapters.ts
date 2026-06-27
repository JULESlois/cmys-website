// src/data/life/chapters.ts
import type { ChapterDefinition } from "../../engine/types";

export const CHAPTERS: ChapterDefinition[] = [
  {
    id: "well_otherworld",
    name: "沉没异生篇",
    subtitle: "井底没有水，只有向下的楼梯。",
    description: "童年废井之后，现实开始出现通往旧乡的裂缝。",
    tone: "isekai",
    entryEventIds: ["p_kid_well", "p_kid_well_dream"],
    exitEventIds: ["c_well_return"],
    endingEventIds: ["c_well_stay", "c_well_blank_substitute"],
    entryAnimation: {
      enabled: true,
      chars: ["沉", "没", "异", "生"],
      subtitle: "井底没有水，只有向下的楼梯。",
      durationMs: 3400,
      motif: "well",
    },
  },
  {
    id: "yomi_debt",
    name: "沉命余赊篇",
    subtitle: "黄泉不收钱，只收延期过的人生。",
    description: "多次逃过死亡后，你开始收到来自黄泉柜台的欠条。",
    tone: "reincarnation",
    entryEventIds: ["p_yomi_receipt"],
    exitEventIds: ["c_yomi_return"],
    endingEventIds: ["c_yomi_substitute"],
    entryAnimation: {
      enabled: true,
      chars: ["沉", "命", "余", "赊"],
      subtitle: "黄泉不收钱，只收延期过的人生。",
      durationMs: 3400,
      motif: "yomi",
    },
  },
];

export function getChapterById(id: string | null | undefined) {
  if (!id) return null;
  return CHAPTERS.find((chapter) => chapter.id === id) ?? null;
}

export function getChapterName(id: string | null | undefined): string | null {
  if (!id) return null;
  return getChapterById(id)?.name ?? id;
}

export function shouldPlayChapterEntryAnimation(id: string | null | undefined): boolean {
  return Boolean(getChapterById(id)?.entryAnimation?.enabled);
}
