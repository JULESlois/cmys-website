// src/engine/reducer.ts
import {
  type GameState, type GameAction, type Attributes, type AttributeName, type Age,
  attr, createAge,
} from "./types";
import { checkDeath, checkRandomDeath, applyNaturalDecay } from "./death";
import { selectEvent, selectChapterEvent, shouldTriggerEvent } from "./events";
import { createInitialChapterState, normalizeChapterState, syncStoryArcForAge, unlockChapter, completeChapter, setChapterFlags } from "./chapters";
import { getChapterName, shouldPlayChapterEntryAnimation } from "../data/life/chapters";
import { getStoryArcByAge } from "../data/life/story-arcs";
import { generateConfidant, updateAffinity } from "./relationship";
import { rollInitialAttribute, scaleAttributeChanges } from "./balance";
import { getLethalChoiceConversion } from "./lethal";
import { getAttributeEnding } from "../data/life/attribute-endings";

// ── 属性初始化 ──
export function createInitialAttributes(bonusPoints: Partial<Record<AttributeName, number>> = {}): Attributes {
  const base: Attributes = {
    appearance: attr(rollInitialAttribute()),
    intelligence: attr(rollInitialAttribute()),
    physique: attr(rollInitialAttribute()),
    wealth: attr(rollInitialAttribute()),
    creativity: attr(rollInitialAttribute()),
    luck: attr(rollInitialAttribute()),
  };

  const bonusEntries = Object.entries(bonusPoints) as [AttributeName, number][];
  for (const [key, val] of bonusEntries) {
    if (val > 0) {
      base[key] = attr(base[key] + val);
    }
  }

  return base;
}

export function createInitialState(talents: string[] = []): GameState {
  return {
    phase: { type: "talent_selection", round: 0 },
    age: createAge(0),
    attributes: createInitialAttributes(),
    talents: [],
    relationships: [generateConfidant()],
    career: null,
    chapter: createInitialChapterState(),
    eventLog: [],
    triggeredEventIds: {},
    currentEvent: null,
    pendingChoices: null,
    lastResult: null,
    pendingChapterIntroId: null,
    attributeEndingId: null,
    nearDeathCount: 0,
    deathRecord: null,
  };
}

function applyAttributeChanges(
  attrs: Attributes,
  changes: Partial<Record<AttributeName, number>>,
): Attributes {
  const next = { ...attrs };
  for (const [key, val] of Object.entries(changes) as [AttributeName, number][]) {
    next[key] = attr(next[key] + val);
  }
  return next;
}

function mergeAttributeChanges(
  base: Partial<Record<AttributeName, number>>,
  extra: Partial<Record<AttributeName, number>>,
): Partial<Record<AttributeName, number>> {
  const next = { ...base };
  for (const [key, val] of Object.entries(extra) as [AttributeName, number][]) {
    next[key] = (next[key] ?? 0) + val;
  }
  return next;
}

function lockAttributeEndingIfNeeded(state: GameState): GameState {
  if (state.attributeEndingId) return state;
  if (state.phase.type === "dying" || state.phase.type === "result" || state.phase.type === "ending_prelude") return state;

  const ending = getAttributeEnding(state.attributes);
  if (!ending) return state;

  return {
    ...state,
    attributeEndingId: ending.attribute,
    pendingChapterIntroId: null,
    phase: { type: "ending_prelude", endingId: ending.attribute },
    currentEvent: null,
    pendingChoices: null,
    lastResult: null,
  };
}

function shouldCheckForEvent(state: GameState): boolean {
  return shouldTriggerEvent(state.age as number) || Boolean(state.chapter.activeChapterId);
}

function enterCurrentAge(state: GameState): GameState {
  if (!shouldCheckForEvent(state)) return state;

  const event = selectEvent(state);
  if (!event) return state;

  if (event.type === "procedural") {
    const scaledEffects = scaleAttributeChanges(event.effects);
    const attrs = applyAttributeChanges(state.attributes, scaledEffects);
    return lockAttributeEndingIfNeeded({
      ...state,
      attributes: attrs,
      eventLog: [...state.eventLog, {
        age: state.age,
        eventId: event.id,
        title: event.title,
        choiceText: "（自动）",
        attributeChanges: scaledEffects,
        storyArcId: event.storyArcId ?? getStoryArcByAge(state.age).id,
        chapterId: event.chapterId,
      }],
      triggeredEventIds: { ...state.triggeredEventIds, [event.id]: state.age as number },
    });
  }

  return {
    ...state,
    currentEvent: event,
    pendingChoices: event.choices,
    phase: { type: "playing", step: "event_presenting" },
  };
}

function enterChapterAtCurrentAge(state: GameState): GameState {
  const event = selectChapterEvent(state);
  if (!event) return state;

  if (event.type === "procedural") {
    const scaledEffects = scaleAttributeChanges(event.effects);
    const attrs = applyAttributeChanges(state.attributes, scaledEffects);
    return lockAttributeEndingIfNeeded({
      ...state,
      attributes: attrs,
      eventLog: [...state.eventLog, {
        age: state.age,
        eventId: event.id,
        title: event.title,
        choiceText: "（自动）",
        attributeChanges: scaledEffects,
        storyArcId: event.storyArcId ?? getStoryArcByAge(state.age).id,
        chapterId: event.chapterId,
      }],
      triggeredEventIds: { ...state.triggeredEventIds, [event.id]: state.age as number },
    });
  }

  return {
    ...state,
    currentEvent: event,
    pendingChoices: event.choices,
    phase: { type: "playing", step: "event_presenting" },
  };
}

function advanceYears(state: GameState, delta: number): GameState {
  let currentState = { ...state };
  let attrs = { ...currentState.attributes };

  for (let step = 0; step < delta; step++) {
    const nextAge = (currentState.age as number) + 1 > 100 ? 100 : (currentState.age as number) + 1;
    const decay = applyNaturalDecay(nextAge);
    attrs = applyAttributeChanges(attrs, decay);

    currentState = {
      ...currentState,
      age: createAge(nextAge),
      attributes: attrs,
      chapter: syncStoryArcForAge(currentState.chapter, nextAge),
      phase: { type: "playing", step: "aging" },
      currentEvent: null,
      pendingChoices: null,
    };

    const deathCheck = checkDeath(currentState);
    if (deathCheck.isDead) {
      return {
        ...currentState,
        phase: { type: "dying", cause: deathCheck.cause! },
        deathRecord: { age: currentState.age, cause: deathCheck.cause!, deathType: deathCheck.deathType ?? "attribute" },
      };
    }

    const randomDeath = checkRandomDeath(nextAge);
    if (randomDeath.isDead) {
      return {
        ...currentState,
        phase: { type: "dying", cause: randomDeath.cause! },
        deathRecord: { age: currentState.age, cause: randomDeath.cause!, deathType: randomDeath.deathType ?? "accident" },
      };
    }

    currentState = enterCurrentAge(currentState);
    if (currentState.phase.type !== "playing" || currentState.phase.step !== "aging") {
      return currentState;
    }
  }

  return currentState;
}

// ── Reducer ──
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case "START_GAME":
      return { ...state, phase: { type: "playing", step: "aging" }, age: createAge(0) };

    case "ADVANCE_AGE": {
      return advanceYears(state, action.delta ?? 1);
    }

    case "RESOLVE_EVENT": {
      if (!state.currentEvent || !state.pendingChoices) return state;
      const choice = state.pendingChoices[action.choiceIndex];
      if (!choice) return state;

      const scaledAttributeChanges = scaleAttributeChanges(choice.effects.attributes ?? {});
      let attrs = applyAttributeChanges(state.attributes, scaledAttributeChanges);
      const event = state.currentEvent;
      const newTriggeredIds = { ...state.triggeredEventIds };
      let chapter = normalizeChapterState(state.chapter);
      let chapterTransition: string | undefined;
      let pendingChapterIntroId = state.pendingChapterIntroId ?? null;

      // 锚点/参数化事件记录触发
      if (event.type === "anchor" || event.type === "parametric") {
        newTriggeredIds[event.id] = state.age as number;
      }

      // 检查选择是否致死；部分致死选项会转化为濒死触发器
      if (choice.effects.isLethal) {
        const conversion = getLethalChoiceConversion(state, event, choice);
        if (conversion) {
          const combinedChanges = mergeAttributeChanges(scaledAttributeChanges, conversion.attributeChanges);
          attrs = applyAttributeChanges(attrs, conversion.attributeChanges);
          if (conversion.chapterFlags) {
            chapter = setChapterFlags(chapter, conversion.chapterFlags);
          }
          const convertedState: GameState = {
            ...state,
            attributes: attrs,
            eventLog: [...state.eventLog, {
              age: state.age,
              eventId: event.id,
              title: event.title,
              choiceText: choice.text,
              attributeChanges: combinedChanges,
              storyArcId: event.storyArcId ?? getStoryArcByAge(state.age).id,
              chapterId: event.chapterId,
            }],
            triggeredEventIds: newTriggeredIds,
            chapter,
            nearDeathCount: state.nearDeathCount + 1,
            phase: { type: "playing", step: "effect_resolving" },
            currentEvent: null,
            pendingChoices: null,
            lastResult: {
              text: conversion.text,
              attributeChanges: combinedChanges,
              chapterTransition: "黄泉债 +1",
              holdAge: false,
            },
          };
          const convertedDeathCheck = checkDeath(convertedState);
          if (convertedDeathCheck.isDead) {
            return {
              ...convertedState,
              phase: { type: "dying", cause: convertedDeathCheck.cause! },
              deathRecord: { age: convertedState.age, cause: convertedDeathCheck.cause!, deathType: convertedDeathCheck.deathType ?? "attribute" },
            };
          }
          return lockAttributeEndingIfNeeded(convertedState);
        }

        const deathNarrative = choice.resultText
          ?? `在"${event.title}"中做出了致命的选择。`;
        return {
          ...state,
          attributes: attrs,
          eventLog: [...state.eventLog, {
            age: state.age,
            eventId: event.id,
            title: event.title,
            choiceText: choice.text,
            attributeChanges: scaledAttributeChanges,
            storyArcId: event.storyArcId ?? getStoryArcByAge(state.age).id,
            chapterId: event.chapterId,
          }],
          triggeredEventIds: newTriggeredIds,
          chapter,
          phase: { type: "dying", cause: deathNarrative },
          deathRecord: { age: state.age, cause: deathNarrative, deathType: "lethal_choice" },
          currentEvent: null,
          pendingChoices: null,
        };
      }

      // 应用关系效果
      let relationships = [...state.relationships];
      if (choice.effects.relationshipEffect) {
        const { targetId, change } = choice.effects.relationshipEffect;
        relationships = relationships.map((r) => {
          if (r.id === targetId || (targetId === "confidant" && r.tag === "confidant")) {
            return updateAffinity(r, change);
          }
          return r;
        });
      }

      // 应用职业等级变化
      let career = state.career;
      if (choice.effects.careerLevelDelta && career) {
        const newLevel = Math.max(1, Math.min(10, career.level + choice.effects.careerLevelDelta));
        career = { ...career, level: newLevel };
      }

      // 应用天赋授予/移除
      let talents = [...state.talents];
      if (choice.effects.grantTalents) {
        // 延迟实现
      }
      if (choice.effects.removeTalents) {
        talents = talents.filter((t) => !choice.effects.removeTalents!.includes(t.id));
      }

      if (choice.effects.setChapterFlags) {
        chapter = setChapterFlags(chapter, choice.effects.setChapterFlags);
      }
      if (choice.effects.triggerChapterId) {
        chapter = unlockChapter(chapter, choice.effects.triggerChapterId);
        chapterTransition = `进入${getChapterName(choice.effects.triggerChapterId) ?? choice.effects.triggerChapterId}`;
        if (shouldPlayChapterEntryAnimation(choice.effects.triggerChapterId)) {
          pendingChapterIntroId = choice.effects.triggerChapterId;
        }
      }
      if (choice.effects.completeChapterId) {
        chapter = completeChapter(chapter, choice.effects.completeChapterId);
        chapterTransition = chapterTransition ?? `完成${getChapterName(choice.effects.completeChapterId) ?? choice.effects.completeChapterId}`;
      }
      if (choice.effects.exitChapter) {
        const exited = chapter.activeChapterId;
        chapter = { ...chapter, activeChapterId: null };
        chapterTransition = chapterTransition ?? `离开${getChapterName(exited) ?? "篇章"}`;
      }

      const shouldHoldAge = choice.effects.holdAge
        ?? Boolean(chapter.activeChapterId && (event.chapterId || choice.effects.triggerChapterId));

      // 检查当前事件是否包含致死选项（用于不死鸟成就追踪）
      const eventHasLethalOption = (event.type === "anchor" || event.type === "parametric") &&
        (event as any).choices?.some((c: any) => c.effects?.isLethal);

      const resolvedState: GameState = {
        ...state,
        attributes: attrs,
        talents,
        relationships,
        career,
        chapter,
        pendingChapterIntroId,
        attributeEndingId: state.attributeEndingId,
        eventLog: [...state.eventLog, {
          age: state.age,
          eventId: event.id,
          title: event.title,
          choiceText: choice.text,
          attributeChanges: scaledAttributeChanges,
          storyArcId: event.storyArcId ?? getStoryArcByAge(state.age).id,
          chapterId: event.chapterId,
        }],
        triggeredEventIds: newTriggeredIds,
        nearDeathCount: state.nearDeathCount + (eventHasLethalOption ? 1 : 0),
        phase: { type: "playing", step: "effect_resolving" },
        currentEvent: null,
        pendingChoices: null,
        lastResult: {
          text: choice.resultText ?? `你选择了"${choice.text}"。`,
          attributeChanges: scaledAttributeChanges,
          chapterTransition,
          holdAge: shouldHoldAge,
        },
      };

      // 选项结算后再次判定死亡
      const postDeathCheck = checkDeath(resolvedState);
      if (postDeathCheck.isDead) {
        return {
          ...resolvedState,
          phase: { type: "dying", cause: postDeathCheck.cause! },
          deathRecord: { age: resolvedState.age, cause: postDeathCheck.cause!, deathType: postDeathCheck.deathType ?? "attribute" },
        };
      }

      return lockAttributeEndingIfNeeded(resolvedState);
    }

    case "DISMISS_RESULT": {
      if (state.lastResult?.endGame) {
        return {
          ...state,
          lastResult: null,
          phase: { type: "result" },
          currentEvent: null,
          pendingChoices: null,
        };
      }

      const clearedState: GameState = {
        ...state,
        lastResult: null,
        phase: { type: "playing", step: "aging" },
        currentEvent: null,
        pendingChoices: null,
      };

      if (clearedState.pendingChapterIntroId) {
        return {
          ...clearedState,
          phase: { type: "chapter_intro", chapterId: clearedState.pendingChapterIntroId },
        };
      }

      if (state.lastResult?.holdAge && clearedState.chapter.activeChapterId) {
        const chapterState = enterChapterAtCurrentAge(clearedState);
        if (chapterState !== clearedState) return chapterState;
      }

      return clearedState;
    }

    case "DISMISS_CHAPTER_INTRO": {
      const clearedState: GameState = {
        ...state,
        pendingChapterIntroId: null,
        phase: { type: "playing", step: "aging" },
        currentEvent: null,
        pendingChoices: null,
      };

      if (clearedState.chapter.activeChapterId) {
        const chapterState = enterChapterAtCurrentAge(clearedState);
        if (chapterState !== clearedState) return chapterState;
      }

      return clearedState;
    }

    case "TRIGGER_DEATH":
      return {
        ...state,
        phase: { type: "dying", cause: action.cause },
        deathRecord: { age: state.age, cause: action.cause, deathType: "accident" },
      };

    case "SHOW_RESULT":
      return { ...state, phase: { type: "result" } };

    case "RESTART":
      return createInitialState();

    case "SELECT_TALENT": {
      return state;
    }

    case "LOAD_SAVE": {
      const loaded = action.state;
      const raw: unknown = loaded.triggeredEventIds;
      let triggered: Record<string, number> = {};
      if (raw instanceof Set) {
        // 兼容旧格式：Set → Record（所有事件视为在当前年龄触发）
        for (const id of raw) {
          triggered[id] = loaded.age as number;
        }
      } else if (raw && typeof raw === "object") {
        triggered = { ...(raw as Record<string, number>) };
      }
      const normalized: GameState = {
        ...loaded,
        triggeredEventIds: triggered,
        chapter: syncStoryArcForAge(normalizeChapterState(loaded.chapter), loaded.age as number),
        pendingChapterIntroId: loaded.pendingChapterIntroId ?? null,
        attributeEndingId: loaded.attributeEndingId ?? null,
        nearDeathCount: loaded.nearDeathCount ?? 0,
      };
      const locked = lockAttributeEndingIfNeeded(normalized);
      if (locked !== normalized) return locked;
      if (normalized.phase.type === "playing" && normalized.phase.step === "aging" && !normalized.currentEvent) {
        return enterCurrentAge(normalized);
      }
      return normalized;
    }

    default:
      return state;
  }
}
