// src/engine/chapters.ts
import type { ChapterState } from "./types";
import { getStoryArcByAge } from "../data/life/story-arcs";

export function createInitialChapterState(age = 0): ChapterState {
  const arc = getStoryArcByAge(age);
  return {
    currentArcId: arc.id,
    visitedArcIds: [arc.id],
    activeChapterId: null,
    unlockedChapterIds: [],
    completedChapterIds: [],
    chapterFlags: {},
    chapterDepth: 0,
  };
}

export function normalizeChapterState(chapter: Partial<ChapterState> | undefined | null): ChapterState {
  const initial = createInitialChapterState();
  if (!chapter || typeof chapter !== "object") return initial;
  return {
    currentArcId: typeof chapter.currentArcId === "string" ? chapter.currentArcId : initial.currentArcId,
    visitedArcIds: Array.isArray(chapter.visitedArcIds) ? chapter.visitedArcIds : initial.visitedArcIds,
    activeChapterId: chapter.activeChapterId ?? null,
    unlockedChapterIds: Array.isArray(chapter.unlockedChapterIds) ? chapter.unlockedChapterIds : [],
    completedChapterIds: Array.isArray(chapter.completedChapterIds) ? chapter.completedChapterIds : [],
    chapterFlags: chapter.chapterFlags && typeof chapter.chapterFlags === "object" ? chapter.chapterFlags : {},
    chapterDepth: typeof chapter.chapterDepth === "number" ? chapter.chapterDepth : 0,
  };
}

export function syncStoryArcForAge(chapter: ChapterState, age: number): ChapterState {
  const arc = getStoryArcByAge(age);
  return {
    ...chapter,
    currentArcId: arc.id,
    visitedArcIds: chapter.visitedArcIds.includes(arc.id)
      ? chapter.visitedArcIds
      : [...chapter.visitedArcIds, arc.id],
  };
}

export function unlockChapter(chapter: ChapterState, chapterId: string): ChapterState {
  return {
    ...chapter,
    activeChapterId: chapterId,
    unlockedChapterIds: chapter.unlockedChapterIds.includes(chapterId)
      ? chapter.unlockedChapterIds
      : [...chapter.unlockedChapterIds, chapterId],
    chapterDepth: Math.max(1, chapter.chapterDepth + 1),
  };
}

export function completeChapter(chapter: ChapterState, chapterId: string): ChapterState {
  return {
    ...chapter,
    activeChapterId: chapter.activeChapterId === chapterId ? null : chapter.activeChapterId,
    completedChapterIds: chapter.completedChapterIds.includes(chapterId)
      ? chapter.completedChapterIds
      : [...chapter.completedChapterIds, chapterId],
  };
}

export function setChapterFlags(
  chapter: ChapterState,
  flags: Record<string, boolean | number | string>,
): ChapterState {
  return {
    ...chapter,
    chapterFlags: {
      ...chapter.chapterFlags,
      ...flags,
    },
  };
}
