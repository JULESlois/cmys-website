// src/engine/reducer.ts
import {
  type GameState, type GameAction, type Attributes, type AttributeName, type Age,
  attr, createAge,
} from "./types";
import { checkDeath, checkRandomDeath, applyNaturalDecay } from "./death";
import { selectEvent, shouldTriggerEvent } from "./events";
import { generateConfidant, updateAffinity } from "./relationship";

// ── 属性初始化 ──
function rollD6(): number {
  return Math.floor(Math.random() * 3) + 3; // 3~5
}

export function createInitialAttributes(bonusPoints: Partial<Record<AttributeName, number>> = {}): Attributes {
  const base: Attributes = {
    appearance: attr(rollD6()),
    intelligence: attr(rollD6()),
    physique: attr(rollD6()),
    wealth: attr(rollD6()),
    creativity: attr(rollD6()),
    luck: attr(rollD6()),
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
    eventLog: [],
    triggeredEventIds: {},
    currentEvent: null,
    pendingChoices: null,
    lastResult: null,
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

    const isLastStep = step === delta - 1;
    if (isLastStep && shouldTriggerEvent(nextAge)) {
      const event = selectEvent(currentState);
      if (event) {
        currentState.currentEvent = event;
        if (event.type === "procedural") {
          attrs = applyAttributeChanges(attrs, event.effects);
          currentState.attributes = attrs;
          currentState.eventLog = [...currentState.eventLog, {
            age: currentState.age,
            eventId: event.id,
            title: event.title,
            choiceText: "（自动）",
            attributeChanges: event.effects,
          }];
          currentState.triggeredEventIds = { ...currentState.triggeredEventIds, [event.id]: nextAge };
        } else {
          currentState.pendingChoices = event.choices;
          currentState.phase = { type: "playing", step: "event_presenting" };
        }
      }
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

      let attrs = applyAttributeChanges(state.attributes, choice.effects.attributes ?? {});
      const event = state.currentEvent;
      const newTriggeredIds = { ...state.triggeredEventIds };

      // 锚点/参数化事件记录触发
      if (event.type === "anchor" || event.type === "parametric") {
        newTriggeredIds[event.id] = state.age as number;
      }

      // 检查选择是否致死
      if (choice.effects.isLethal) {
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
            attributeChanges: choice.effects.attributes ?? {},
          }],
          triggeredEventIds: newTriggeredIds,
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

      // 检查当前事件是否包含致死选项（用于不死鸟成就追踪）
      const eventHasLethalOption = (event.type === "anchor" || event.type === "parametric") &&
        (event as any).choices?.some((c: any) => c.effects?.isLethal);

      const resolvedState: GameState = {
        ...state,
        attributes: attrs,
        talents,
        relationships,
        career,
        eventLog: [...state.eventLog, {
          age: state.age,
          eventId: event.id,
          title: event.title,
          choiceText: choice.text,
          attributeChanges: choice.effects.attributes ?? {},
        }],
        triggeredEventIds: newTriggeredIds,
        nearDeathCount: state.nearDeathCount + (eventHasLethalOption ? 1 : 0),
        phase: { type: "playing", step: "effect_resolving" },
        currentEvent: null,
        pendingChoices: null,
        lastResult: {
          text: choice.resultText ?? `你选择了"${choice.text}"。`,
          attributeChanges: choice.effects.attributes ?? {},
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

      return resolvedState;
    }

    case "DISMISS_RESULT":
      return advanceYears({ ...state, lastResult: null }, 1);

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
      return {
        ...loaded,
        triggeredEventIds: triggered,
        nearDeathCount: loaded.nearDeathCount ?? 0,
      };
    }

    default:
      return state;
  }
}
