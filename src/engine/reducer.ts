// src/engine/reducer.ts
import {
  type GameState, type GameAction, type Attributes, type AttributeName, type Age, type GameEvent, type DeathType, type EventChoice,
  attr, createAge,
} from "./types";
import { checkDeath, checkRandomDeath, applyNaturalDecay, type DeathCheck } from "./death";
import { selectEvent, selectChapterEvent, shouldTriggerEvent } from "./events";
import { createInitialChapterState, normalizeChapterState, syncStoryArcForAge, unlockChapter, completeChapter, setChapterFlags } from "./chapters";
import { getChapterName, shouldPlayChapterEntryAnimation } from "../data/life/chapters";
import { getStoryArcByAge } from "../data/life/story-arcs";
import { generateConfidant, updateAffinity } from "./relationship";
import { rollInitialAttribute, scaleAttributeChanges } from "./balance";
import { applyTalentModifiers, applyTalentToAttributes, getActiveTalents } from "./talent";
import { getLethalChoiceConversion } from "./lethal";
import { getAttributeEnding } from "../data/life/attribute-endings";
import { TALENT_POOL } from "../data/life/talents";
import { getLifeEventById } from "../data/life/events-registry";

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
    phase: { type: "talent_selection" },
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
    pendingChoiceOrder: null,
    lastResult: null,
    pendingEventId: null,
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

function getEventAgeDelta(event: GameEvent | null | undefined): number {
  const raw = event?.ageDelta ?? 0;
  if (!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(100, Math.floor(raw)));
}

function hasTalentIds(state: GameState, required: string[] | undefined): boolean {
  if (!required || required.length === 0) return true;
  const talentIds = new Set(state.talents.map((talent) => talent.id));
  return required.every((talentId) => talentIds.has(talentId));
}

function hasExcludedTalentIds(state: GameState, excluded: string[] | undefined): boolean {
  if (!excluded || excluded.length === 0) return false;
  const talentIds = new Set(state.talents.map((talent) => talent.id));
  return excluded.some((talentId) => talentIds.has(talentId));
}

function resolveChoiceByTalents(choice: import("./types").EventChoice, state: GameState): Pick<import("./types").EventChoice, "effects" | "resultText"> {
  for (const conditional of choice.conditionalEffects ?? []) {
    if (!hasTalentIds(state, conditional.requiredTalents)) continue;
    if (hasExcludedTalentIds(state, conditional.excludedTalents)) continue;
    return {
      effects: conditional.effects,
      resultText: conditional.resultText ?? choice.resultText,
    };
  }

  return {
    effects: choice.effects,
    resultText: choice.resultText,
  };
}

function lockAttributeEndingIfNeeded(state: GameState): GameState {
  if (state.attributeEndingId) return state;
  if (state.phase.type === "dying" || state.phase.type === "result" || state.phase.type === "ending_prelude") return state;

  // 属性满值结局是人生终局，不应在少年/青年期因安全策略堆数值过早截断。
  if ((state.age as number) < 60) return state;

  const ending = getAttributeEnding(state.attributes);
  if (!ending) return state;

  return {
    ...state,
    attributeEndingId: ending.attribute,
    pendingEventId: null,
    pendingChapterIntroId: null,
    phase: { type: "ending_prelude", endingId: ending.attribute },
    currentEvent: null,
    pendingChoices: null,
    pendingChoiceOrder: null,
    lastResult: null,
  };
}



function getChoiceOrder(choiceCount: number): number[] {
  const order = Array.from({ length: choiceCount }, (_, index) => index);
  for (let index = order.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
  }
  return order;
}

function createChoicePresentation(choices: EventChoice[]): Pick<GameState, "pendingChoices" | "pendingChoiceOrder"> {
  const pendingChoiceOrder = getChoiceOrder(choices.length);
  return {
    pendingChoiceOrder,
    pendingChoices: pendingChoiceOrder.map((choiceIndex) => choices[choiceIndex]),
  };
}

function clearPendingChoicePresentation(): Pick<GameState, "pendingChoices" | "pendingChoiceOrder"> {
  return {
    pendingChoices: null,
    pendingChoiceOrder: null,
  };
}

function getNumberFlag(state: GameState, key: string): number {
  const value = state.chapter.chapterFlags[key];
  return typeof value === "number" ? value : 0;
}


function composeDeathConversionText(baseText: string | undefined, conversionText: string): string {
  const base = baseText?.trim();
  const conversion = conversionText.trim();
  if (!base || base === conversion) return conversion;
  return `${base}

然而，这次死亡被改写了：${conversion}`;
}

function deathTypeMatches(expected: DeathType | "any" | undefined, actual: DeathType | undefined): boolean {
  if (!actual) return false;
  return !expected || expected === "any" || expected === actual;
}

function getLethalChoiceDeathType(event: GameEvent): DeathType {
  const tags = event.eventTags ?? [];
  if (tags.includes("accident")) return "accident";
  return "lethal_choice";
}

function presentSpecificEvent(state: GameState, event: GameEvent): GameState {
  if (event.type === "procedural") {
    const talentModifierResult = applyTalentModifiers(scaleAttributeChanges(event.effects), getActiveTalents(state));
    const scaledEffects = talentModifierResult.changes;
    const attrs = applyAttributeChanges(state.attributes, scaledEffects);
    return lockAttributeEndingIfNeeded({
      ...state,
      attributes: attrs,
      pendingEventId: null,
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
    pendingEventId: null,
    currentEvent: event,
    ...createChoicePresentation(event.choices),
    phase: { type: "playing", step: "event_presenting" },
  };
}

function enterPendingEvent(state: GameState): GameState {
  const pendingEventId = state.pendingEventId;
  if (!pendingEventId) return state;
  const event = getLifeEventById(pendingEventId);
  const clearedState = { ...state, pendingEventId: null };
  if (!event) return clearedState;
  return presentSpecificEvent(clearedState, event);
}

function applyTalentDeathConversion(state: GameState, deathCheck: DeathCheck): GameState | null {
  if (!deathCheck.isDead || !deathCheck.deathType) return null;

  for (const talent of getActiveTalents(state)) {
    const conversions = talent.effects?.deathConversions ?? [];
    for (const [index, conversion] of conversions.entries()) {
      if (!deathTypeMatches(conversion.deathType, deathCheck.deathType)) continue;
      if (conversion.attribute && deathCheck.attribute !== conversion.attribute) continue;
      const flagKey = `talent_death_conversion_${talent.id}_${index}`;
      const used = getNumberFlag(state, flagKey);
      if (conversion.maxUses !== undefined && used >= conversion.maxUses) continue;

      let chapter = setChapterFlags(normalizeChapterState(state.chapter), {
        ...(conversion.setChapterFlags ?? {}),
        [flagKey]: used + 1,
      });
      let pendingEventId = state.pendingEventId ?? null;
      let pendingChapterIntroId = state.pendingChapterIntroId ?? null;
      let chapterTransition: string | undefined;
      if (conversion.triggerChapterId) {
        chapter = unlockChapter(chapter, conversion.triggerChapterId);
        chapterTransition = `进入${getChapterName(conversion.triggerChapterId) ?? conversion.triggerChapterId}`;
        if (shouldPlayChapterEntryAnimation(conversion.triggerChapterId)) {
          pendingChapterIntroId = conversion.triggerChapterId;
        }
      }

      const attributeChanges = conversion.attributes ?? {};
      const convertedState: GameState = {
        ...state,
        attributes: applyAttributeChanges(state.attributes, attributeChanges),
        chapter,
        pendingEventId: conversion.triggerEventId ?? state.pendingEventId ?? null,
        pendingChapterIntroId,
        currentEvent: null,
        pendingChoices: null,
        pendingChoiceOrder: null,
        deathRecord: null,
        nearDeathCount: state.nearDeathCount + 1,
        phase: { type: "playing", step: "effect_resolving" },
        lastResult: {
          text: composeDeathConversionText(deathCheck.cause, conversion.resultText),
          attributeChanges,
          chapterTransition,
          talentEffects: [`天赋「${talent.name}」改写了${deathCheck.deathType === "accident" ? "意外死亡" : "死亡"}`],
          holdAge: false,
        },
      };

      return lockAttributeEndingIfNeeded(convertedState);
    }
  }

  return null;
}

function shouldCheckForEvent(state: GameState): boolean {
  return shouldTriggerEvent(state.age as number) || Boolean(state.chapter.activeChapterId);
}

function enterCurrentAge(state: GameState): GameState {
  if (!shouldCheckForEvent(state)) return state;

  const event = selectEvent(state);
  if (!event) return state;

  if (event.type === "procedural") {
    const talentModifierResult = applyTalentModifiers(scaleAttributeChanges(event.effects), getActiveTalents(state));
    const scaledEffects = talentModifierResult.changes;
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
    ...createChoicePresentation(event.choices),
    phase: { type: "playing", step: "event_presenting" },
  };
}

function enterChapterAtCurrentAge(state: GameState): GameState {
  const event = selectChapterEvent(state);
  if (!event) return state;

  if (event.type === "procedural") {
    const talentModifierResult = applyTalentModifiers(scaleAttributeChanges(event.effects), getActiveTalents(state));
    const scaledEffects = talentModifierResult.changes;
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
    ...createChoicePresentation(event.choices),
    phase: { type: "playing", step: "event_presenting" },
  };
}

function advanceYears(state: GameState, delta: number, options: { skipStoryArcSummary?: boolean } = {}): GameState {
  let currentState = { ...state };
  let attrs = { ...currentState.attributes };

  for (let step = 0; step < delta; step++) {
    const nextAge = (currentState.age as number) + 1 > 100 ? 100 : (currentState.age as number) + 1;
    const currentArcId = currentState.chapter.currentArcId;
    const nextArc = getStoryArcByAge(nextAge);
    const isEnteringOrInsideSpecialChapter = Boolean(
      currentState.pendingChapterIntroId || currentState.chapter.activeChapterId,
    );
    if (!options.skipStoryArcSummary && !isEnteringOrInsideSpecialChapter && nextArc.id !== currentArcId) {
      return {
        ...currentState,
        phase: { type: "story_arc_summary", arcId: currentArcId, nextAge: createAge(nextAge) },
        currentEvent: null,
        pendingChoices: null,
        pendingChoiceOrder: null,
      };
    }

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
      pendingChoiceOrder: null,
    };

    const deathCheck = checkDeath(currentState);
    if (deathCheck.isDead) {
      const convertedDeath = applyTalentDeathConversion(currentState, deathCheck);
      if (convertedDeath) return convertedDeath;
      return {
        ...currentState,
        phase: { type: "dying", cause: deathCheck.cause! },
        deathRecord: { age: currentState.age, cause: deathCheck.cause!, deathType: deathCheck.deathType ?? "attribute", attribute: deathCheck.attribute },
      };
    }

    const randomDeath = checkRandomDeath(nextAge, currentState.attributes);
    if (randomDeath.isDead) {
      const convertedDeath = applyTalentDeathConversion(currentState, randomDeath);
      if (convertedDeath) return convertedDeath;
      return {
        ...currentState,
        phase: { type: "dying", cause: randomDeath.cause! },
        deathRecord: { age: currentState.age, cause: randomDeath.cause!, deathType: randomDeath.deathType ?? "accident", attribute: randomDeath.attribute },
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

    case "DISMISS_STORY_ARC_SUMMARY": {
      if (state.phase.type !== "story_arc_summary") return state;
      return advanceYears({
        ...state,
        phase: { type: "playing", step: "aging" },
        currentEvent: null,
        pendingChoices: null,
        pendingChoiceOrder: null,
      }, 1, { skipStoryArcSummary: true });
    }

    case "RESOLVE_EVENT": {
      if (!state.currentEvent || !state.pendingChoices) return state;
      const choice = state.pendingChoices[action.choiceIndex];
      if (!choice) return state;
      // pendingChoices 已经是玩家实际看到的展示顺序。
      // 结算必须直接使用展示选项本身；否则 pendingChoiceOrder 与视图不同步时会出现
      // “点击 A，结果却像 B”的错位。
      const resolvedChoice = resolveChoiceByTalents(choice, state);
      const choiceEffects = resolvedChoice.effects;
      const resultText = resolvedChoice.resultText;

      const talentModifierResult = applyTalentModifiers(
        scaleAttributeChanges(choiceEffects.attributes ?? {}),
        getActiveTalents(state),
      );
      const scaledAttributeChanges = talentModifierResult.changes;
      const talentEffects = talentModifierResult.descriptions;
      let attrs = applyAttributeChanges(state.attributes, scaledAttributeChanges);
      const event = state.currentEvent;
      const newTriggeredIds = { ...state.triggeredEventIds };
      let chapter = normalizeChapterState(state.chapter);
      let chapterTransition: string | undefined;
      let pendingEventId = state.pendingEventId ?? null;
      let pendingChapterIntroId = state.pendingChapterIntroId ?? null;

      // 锚点/参数化事件记录触发
      if (event.type === "anchor" || event.type === "parametric") {
        newTriggeredIds[event.id] = state.age as number;
      }

      // 检查选择是否致死；非强制即死选项先尝试天赋死亡改写，再进入普通濒死转化。
      if (choiceEffects.isLethal) {
        const deathNarrative = resultText
          ?? `在"${event.title}"中做出了致命的选择。`;

        if (!choiceEffects.forceLethal) {
          const lethalChoiceState: GameState = {
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
            currentEvent: null,
            pendingChoices: null,
            pendingChoiceOrder: null,
          };
          const talentConvertedDeath = applyTalentDeathConversion(lethalChoiceState, {
            isDead: true,
            cause: deathNarrative,
            deathType: getLethalChoiceDeathType(event),
          });
          if (talentConvertedDeath) return talentConvertedDeath;
        }

        const conversion = choiceEffects.forceLethal ? null : getLethalChoiceConversion(state, event, choice);
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
            pendingChoiceOrder: null,
            lastResult: {
              text: composeDeathConversionText(deathNarrative, conversion.text),
              attributeChanges: combinedChanges,
              chapterTransition: "黄泉债 +1",
              talentEffects,
              holdAge: false,
              ageDelta: getEventAgeDelta(event),
            },
          };
          const convertedDeathCheck = checkDeath(convertedState);
          if (convertedDeathCheck.isDead) {
            return {
              ...convertedState,
              phase: { type: "dying", cause: convertedDeathCheck.cause! },
              deathRecord: { age: convertedState.age, cause: convertedDeathCheck.cause!, deathType: convertedDeathCheck.deathType ?? "attribute", attribute: convertedDeathCheck.attribute },
            };
          }
          return lockAttributeEndingIfNeeded(convertedState);
        }

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
          pendingChoiceOrder: null,
        };
      }

      // 应用关系效果
      let relationships = [...state.relationships];
      if (choiceEffects.relationshipEffect) {
        const { targetId, change } = choiceEffects.relationshipEffect;
        relationships = relationships.map((r) => {
          if (r.id === targetId || (targetId === "confidant" && r.tag === "confidant")) {
            return updateAffinity(r, change);
          }
          return r;
        });
      }

      // 应用职业等级变化
      let career = state.career;
      if (choiceEffects.careerLevelDelta && career) {
        const newLevel = Math.max(1, Math.min(10, career.level + choiceEffects.careerLevelDelta));
        career = { ...career, level: newLevel };
      }

      // 应用天赋授予/移除
      let talents = [...state.talents];
      if (choiceEffects.grantTalents) {
        const existingIds = new Set(talents.map((t) => t.id));
        for (const talentId of choiceEffects.grantTalents) {
          if (existingIds.has(talentId)) continue;
          const talent = TALENT_POOL.find((t) => t.id === talentId);
          if (!talent) continue;
          const hasConflict = talents.some((selected) =>
            selected.exclusiveWith?.includes(talent.id) || talent.exclusiveWith?.includes(selected.id)
          );
          if (hasConflict) continue;
          talents = [...talents, talent];
          existingIds.add(talent.id);
        }
      }
      if (choiceEffects.removeTalents) {
        talents = talents.filter((t) => !choiceEffects.removeTalents!.includes(t.id));
      }

      if (choiceEffects.setChapterFlags) {
        chapter = setChapterFlags(chapter, choiceEffects.setChapterFlags);
      }
      if (choiceEffects.triggerEventId) {
        pendingEventId = choiceEffects.triggerEventId;
      }
      if (choiceEffects.triggerChapterId) {
        chapter = unlockChapter(chapter, choiceEffects.triggerChapterId);
        chapterTransition = `进入${getChapterName(choiceEffects.triggerChapterId) ?? choiceEffects.triggerChapterId}`;
        if (shouldPlayChapterEntryAnimation(choiceEffects.triggerChapterId)) {
          pendingChapterIntroId = choiceEffects.triggerChapterId;
        }
      }
      if (choiceEffects.completeChapterId) {
        chapter = completeChapter(chapter, choiceEffects.completeChapterId);
        chapterTransition = chapterTransition ?? `完成${getChapterName(choiceEffects.completeChapterId) ?? choiceEffects.completeChapterId}`;
      }
      if (choiceEffects.exitChapter) {
        const exited = chapter.activeChapterId;
        chapter = { ...chapter, activeChapterId: null };
        chapterTransition = chapterTransition ?? `离开${getChapterName(exited) ?? "篇章"}`;
      }

      const shouldHoldAge = choiceEffects.holdAge
        ?? Boolean(chapter.activeChapterId && (event.chapterId || choiceEffects.triggerChapterId));

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
        pendingEventId,
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
        pendingChoiceOrder: null,
        lastResult: {
          text: resultText ?? `你选择了"${choice.text}"。`,
          attributeChanges: scaledAttributeChanges,
          chapterTransition,
          talentEffects,
          holdAge: shouldHoldAge,
          ageDelta: getEventAgeDelta(event),
        },
      };

      // 选项结算后再次判定死亡
      const postDeathCheck = checkDeath(resolvedState);
      if (postDeathCheck.isDead) {
        const convertedDeath = applyTalentDeathConversion(resolvedState, postDeathCheck);
        if (convertedDeath) return convertedDeath;
        return {
          ...resolvedState,
          phase: { type: "dying", cause: postDeathCheck.cause! },
          deathRecord: { age: resolvedState.age, cause: postDeathCheck.cause!, deathType: postDeathCheck.deathType ?? "attribute", attribute: postDeathCheck.attribute },
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
          pendingChoiceOrder: null,
        };
      }

      const clearedState: GameState = {
        ...state,
        lastResult: null,
        phase: { type: "playing", step: "aging" },
        currentEvent: null,
        pendingChoices: null,
        pendingChoiceOrder: null,
      };

      if (clearedState.pendingChapterIntroId) {
        return {
          ...clearedState,
          phase: { type: "chapter_intro", chapterId: clearedState.pendingChapterIntroId },
        };
      }

      if (clearedState.pendingEventId) {
        return enterPendingEvent(clearedState);
      }

      const ageDelta = state.lastResult?.ageDelta ?? 0;
      if (ageDelta > 0) {
        return advanceYears(clearedState, ageDelta);
      }

      const currentAgeState = enterCurrentAge(clearedState);
      if (currentAgeState !== clearedState) return currentAgeState;

      return clearedState;
    }

    case "DISMISS_CHAPTER_INTRO": {
      const clearedState: GameState = {
        ...state,
        pendingChapterIntroId: null,
        phase: { type: "playing", step: "aging" },
        currentEvent: null,
        pendingChoices: null,
        pendingChoiceOrder: null,
      };

      if (clearedState.pendingEventId) {
        return enterPendingEvent(clearedState);
      }

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
      if (state.phase.type !== "talent_selection") return state;
      const talent = TALENT_POOL.find((item) => item.id === action.talentId);
      if (!talent) return state;

      return {
        ...state,
        talents: [talent],
        attributes: applyTalentToAttributes(state.attributes, talent),
        phase: { type: "playing", step: "aging" },
        age: createAge(0),
        currentEvent: null,
        pendingChoices: null,
        pendingChoiceOrder: null,
        lastResult: null,
      };
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
        pendingEventId: loaded.pendingEventId ?? null,
        pendingChapterIntroId: loaded.pendingChapterIntroId ?? null,
        pendingChoiceOrder: loaded.pendingChoiceOrder ?? (loaded.pendingChoices?.map((_, index) => index) ?? null),
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
