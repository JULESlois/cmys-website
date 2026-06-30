// src/data/life/events-registry.ts
import type { GameEvent } from "../../engine/types";
import { ANCHOR_EVENTS } from "./events-anchors";
import { PARAMETRIC_EVENTS } from "./events-parametric";
import { CHAPTER_EVENTS } from "./events-chapters";
import { YOMI_EVENTS } from "./events-yomi";
import { CHAPTERS, getChapterName } from "./chapters";
import { STORY_ARCS, getStoryArcByAge, getStoryArcById } from "./story-arcs";

export type EventPackKind = "mainline" | "hidden";

export interface EventPack {
  id: string;
  kind: EventPackKind;
  name: string;
  alias?: string;
  minAge?: number;
  maxAge?: number;
  events: GameEvent[];
}

function primaryAge(event: GameEvent): number {
  if (event.type === "anchor") {
    const trigger = Array.isArray(event.triggerAge) ? event.triggerAge[0] : event.triggerAge;
    if (typeof trigger === "number") return trigger;
  }
  return Number(event.minAge);
}

export function getEventStoryArcId(event: GameEvent): string {
  return event.storyArcId ?? getStoryArcByAge(primaryAge(event)).id;
}

function withRegistryMetadata(event: GameEvent): GameEvent {
  return {
    ...event,
    storyArcId: getEventStoryArcId(event),
  };
}

export const ANCHOR_EVENT_REGISTRY: GameEvent[] = ANCHOR_EVENTS.map(withRegistryMetadata);
export const PARAMETRIC_EVENT_REGISTRY: GameEvent[] = PARAMETRIC_EVENTS.map(withRegistryMetadata);
export const HIDDEN_CHAPTER_EVENT_REGISTRY: GameEvent[] = [
  ...CHAPTER_EVENTS,
  ...YOMI_EVENTS,
].map(withRegistryMetadata);

export const ALL_LIFE_EVENTS: GameEvent[] = [
  ...ANCHOR_EVENT_REGISTRY,
  ...PARAMETRIC_EVENT_REGISTRY,
  ...HIDDEN_CHAPTER_EVENT_REGISTRY,
];

export function getAllLifeEvents(): GameEvent[] {
  return ALL_LIFE_EVENTS;
}

export function getLifeEventById(id: string): GameEvent | null {
  return ALL_LIFE_EVENTS.find((event) => event.id === id) ?? null;
}

export function getAnchorLifeEvents(): GameEvent[] {
  return ANCHOR_EVENT_REGISTRY;
}

export function getEventsByStoryArc(storyArcId: string): GameEvent[] {
  return ALL_LIFE_EVENTS.filter((event) => getEventStoryArcId(event) === storyArcId && !event.chapterId);
}

export function getEventsByHiddenChapter(chapterId: string): GameEvent[] {
  return ALL_LIFE_EVENTS.filter((event) => {
    if (event.chapterId === chapterId || event.requiredChapter === chapterId) return true;
    if (!("choices" in event)) return false;
    return event.choices.some((choice) =>
      choice.effects.triggerChapterId === chapterId ||
      choice.conditionalEffects?.some((conditional) => conditional.effects.triggerChapterId === chapterId)
    );
  });
}

export function getEventPackById(id: string): EventPack | null {
  return EVENT_TREE.find((pack) => pack.id === id) ?? null;
}

export const MAINLINE_EVENT_PACKS: EventPack[] = STORY_ARCS.map((arc) => ({
  id: arc.id,
  kind: "mainline",
  name: arc.name,
  alias: arc.alias,
  minAge: arc.minAge,
  maxAge: arc.maxAge,
  events: getEventsByStoryArc(arc.id),
}));

export const HIDDEN_EVENT_PACKS: EventPack[] = CHAPTERS.map((chapter) => ({
  id: chapter.id,
  kind: "hidden",
  name: getChapterName(chapter.id) ?? chapter.id,
  events: getEventsByHiddenChapter(chapter.id),
}));

export const EVENT_TREE: EventPack[] = [
  ...MAINLINE_EVENT_PACKS,
  ...HIDDEN_EVENT_PACKS,
];

export function getEventRegistrySummary(): Array<{
  id: string;
  kind: EventPackKind;
  name: string;
  alias?: string;
  count: number;
  anchorCount: number;
  parametricCount: number;
  lethalChoiceCount: number;
}> {
  return EVENT_TREE.map((pack) => {
    const lethalChoiceCount = pack.events.reduce((count, event) => {
      if (!("choices" in event)) return count;
      return count + event.choices.filter((choice) => choice.effects.isLethal).length;
    }, 0);

    return {
      id: pack.id,
      kind: pack.kind,
      name: pack.name,
      alias: pack.alias,
      count: pack.events.length,
      anchorCount: pack.events.filter((event) => event.type === "anchor").length,
      parametricCount: pack.events.filter((event) => event.type === "parametric").length,
      lethalChoiceCount,
    };
  });
}

export function getEventStoryArcName(event: GameEvent): string {
  const arc = getStoryArcById(getEventStoryArcId(event));
  return arc?.name ?? getEventStoryArcId(event);
}
