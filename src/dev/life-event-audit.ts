declare const process: { argv: string[]; exitCode?: number };

import { getAllLifeEvents } from "../data/life/events-registry";
import { createInitialState, gameReducer } from "../engine/reducer";
import { attr } from "../engine/types";
import type { AttributeName, EventChoice, EventChoiceEffects, GameEvent, GameState } from "../engine/types";

type Severity = "error" | "warn" | "info";

type Issue = {
  severity: Severity;
  rule: string;
  eventId: string;
  title: string;
  choiceIndex?: number;
  choiceText?: string;
  detail: string;
};

const ATTRIBUTES: AttributeName[] = [
  "appearance",
  "intelligence",
  "physique",
  "wealth",
  "creativity",
  "luck",
];

const DEATH_WORDS = [
  "死", "死亡", "致命", "带走", "停在", "再也没有", "再也没", "法医", "救援队才找到", "没能站起来", "呼吸已经停", "戛然而止", "意识溶解",
];

const SURVIVAL_WORDS = [
  "活了下来", "救了回来", "拖上岸", "医院", "石膏", "住院", "出院", "逃了出来", "获救", "没事", "还在", "命还在", "撑过", "醒来时",
];

const ATTRIBUTE_HINTS: Record<AttributeName, string[]> = {
  appearance: ["脸", "美", "外貌", "目光", "形象", "台上", "社交", "朋友", "人群"],
  intelligence: ["学", "课", "考试", "思考", "分析", "计划", "证据", "查", "复盘", "理解"],
  physique: ["身体", "病", "医院", "睡", "跑", "疼", "伤", "体检", "咳", "疲惫", "健康", "石膏"],
  wealth: ["钱", "账", "钱包", "房租", "工资", "投资", "赔", "花", "买", "债", "存款", "转账", "财富"],
  creativity: ["写", "画", "创作", "灵感", "作品", "诗", "故事", "拍", "设计", "想象"],
  luck: ["运", "巧", "险", "差点", "机会", "偶然", "好险", "命运", "幸运"],
};

function parseArgs() {
  const args = new Map<string, string>();
  for (const raw of process.argv.slice(2)) {
    if (!raw.startsWith("--")) continue;
    const [key, value = "true"] = raw.slice(2).split("=");
    args.set(key, value);
  }
  return {
    json: args.get("json") === "true",
    strict: args.get("strict") === "true",
  };
}

function hasAny(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

function netAttributes(effects: EventChoiceEffects): number {
  return ATTRIBUTES.reduce((sum, attr) => sum + (effects.attributes?.[attr] ?? 0), 0);
}

function nonZeroAttributes(effects: EventChoiceEffects): AttributeName[] {
  return ATTRIBUTES.filter((attr) => (effects.attributes?.[attr] ?? 0) !== 0);
}

function hasNonAttributeEffect(effects: EventChoiceEffects): boolean {
  return Boolean(
    effects.grantTalents?.length ||
    effects.removeTalents?.length ||
    effects.triggerEventId ||
    effects.triggerChapterId ||
    effects.setChapterFlags ||
    effects.exitChapter ||
    effects.completeChapterId ||
    effects.relationshipEffect ||
    effects.careerLevelDelta ||
    effects.isLethal ||
    effects.forceLethal,
  );
}

function issue(event: GameEvent, severity: Severity, rule: string, detail: string, choiceIndex?: number, choice?: EventChoice): Issue {
  return {
    severity,
    rule,
    eventId: event.id,
    title: event.title,
    choiceIndex,
    choiceText: choice?.text,
    detail,
  };
}

function auditChoice(event: GameEvent, choice: EventChoice, index: number): Issue[] {
  const issues: Issue[] = [];
  const resultText = choice.resultText?.trim() ?? "";
  const choiceText = choice.text.trim();
  const effects = choice.effects;

  if (!choiceText) issues.push(issue(event, "error", "empty-choice-text", "选项文本为空。", index, choice));
  if (!resultText) issues.push(issue(event, "error", "empty-result-text", "结果文本为空。", index, choice));
  if (resultText.length > 260) issues.push(issue(event, "info", "long-result-text", `结果文本较长：${resultText.length} 字。`, index, choice));
  if (resultText.length > 0 && resultText.length < 18) issues.push(issue(event, "warn", "short-result-text", `结果文本较短：${resultText.length} 字。`, index, choice));

  if (effects.forceLethal && !effects.isLethal) {
    issues.push(issue(event, "error", "force-lethal-without-lethal", "forceLethal 应与 isLethal 同时使用。", index, choice));
  }

  if (effects.isLethal && resultText && !hasAny(resultText, DEATH_WORDS)) {
    issues.push(issue(event, "warn", "lethal-result-without-death-language", "致死选项结果文本没有明显死亡/终止语义。", index, choice));
  }

  if (!effects.isLethal && resultText && hasAny(resultText, DEATH_WORDS) && !hasAny(resultText, SURVIVAL_WORDS)) {
    issues.push(issue(event, "warn", "nonlethal-result-looks-lethal", "非致死选项结果文本含死亡/终止语义，需确认是否应标记 isLethal 或改写。", index, choice));
  }

  const changedAttrs = nonZeroAttributes(effects);
  if (changedAttrs.length === 0 && !hasNonAttributeEffect(effects)) {
    issues.push(issue(event, "info", "no-visible-effect", "选项没有属性变化或特殊效果。", index, choice));
  }

  const net = netAttributes(effects);
  if (net <= -10 && resultText && !hasAny(resultText, ["损", "亏", "伤", "病", "债", "赔", "失", "痛", "危险", "后悔", "逃", "医院"])) {
    issues.push(issue(event, "warn", "large-negative-without-cost-language", `总属性变化 ${net}，但结果文本缺少明显代价语义。`, index, choice));
  }

  if (net >= 12 && resultText && !hasAny(resultText, ["成功", "机会", "成长", "收获", "赢", "掌声", "好", "幸运", "温暖", "完成", "活" ])) {
    issues.push(issue(event, "warn", "large-positive-without-reward-language", `总属性变化 +${net}，但结果文本缺少明显收益语义。`, index, choice));
  }

  for (const attr of changedAttrs) {
    const delta = effects.attributes?.[attr] ?? 0;
    if (Math.abs(delta) >= 6 && resultText && !hasAny(resultText, ATTRIBUTE_HINTS[attr])) {
      issues.push(issue(event, "info", "large-attribute-change-without-hint", `${attr} ${delta > 0 ? "+" : ""}${delta}，结果文本中缺少该属性相关语义。`, index, choice));
    }
  }

  for (const [conditionalIndex, conditional] of (choice.conditionalEffects ?? []).entries()) {
    if (conditional.effects.forceLethal && !conditional.effects.isLethal) {
      issues.push(issue(event, "error", "conditional-force-lethal-without-lethal", `conditionalEffects[${conditionalIndex}] forceLethal 应与 isLethal 同时使用。`, index, choice));
    }
    if (!conditional.resultText?.trim()) {
      issues.push(issue(event, "warn", "conditional-empty-result-text", `conditionalEffects[${conditionalIndex}] 没有专属结果文本。`, index, choice));
    }
  }

  return issues;
}


function allowsBlankTitle(event: GameEvent): boolean {
  const tags = event.eventTags ?? [];
  return Boolean(
    event.chapterId ||
    event.requiredChapter ||
    tags.includes("well") ||
    tags.includes("yomi") ||
    tags.includes("hidden"),
  );
}

function auditEvent(event: GameEvent): Issue[] {
  const issues: Issue[] = [];
  if (!event.id.trim()) issues.push(issue(event, "error", "empty-event-id", "事件 id 为空。"));
  if (!event.title.trim() && !allowsBlankTitle(event)) issues.push(issue(event, "error", "empty-title", "事件标题为空。"));
  if (!event.description.trim()) issues.push(issue(event, "error", "empty-description", "事件描述为空。"));
  if (event.minAge > event.maxAge) issues.push(issue(event, "error", "invalid-age-range", `年龄范围错误：${event.minAge}-${event.maxAge}`));

  if (event.type !== "procedural") {
    if (!event.choices.length) issues.push(issue(event, "error", "no-choices", "非自动事件没有选项。"));
    const choiceTexts = event.choices.map((choice) => choice.text.trim()).filter(Boolean);
    if (new Set(choiceTexts).size !== choiceTexts.length) {
      issues.push(issue(event, "warn", "duplicate-choice-text", "同一事件内存在重复选项文本。"));
    }
    for (const [index, choice] of event.choices.entries()) issues.push(...auditChoice(event, choice, index));
  }

  return issues;
}


type ChoiceResolutionAudit = {
  checked: number;
  mismatches: Array<{
    eventId: string;
    title: string;
    displayIndex: number;
    choiceText: string;
    expected: string;
    got: string;
  }>;
};

function createAuditState(event: GameEvent, displayedChoices: EventChoice[]): GameState {
  return {
    ...createInitialState(),
    phase: { type: "playing", step: "event_presenting" },
    age: event.minAge,
    attributes: {
      appearance: attr(50),
      intelligence: attr(50),
      physique: attr(50),
      wealth: attr(50),
      creativity: attr(50),
      luck: attr(50),
    },
    currentEvent: event,
    pendingChoices: displayedChoices,
    pendingChoiceOrder: [1, 0],
  };
}

function auditChoiceResolution(events: GameEvent[]): ChoiceResolutionAudit {
  const mismatches: ChoiceResolutionAudit["mismatches"] = [];
  let checked = 0;

  for (const event of events) {
    if (event.type === "procedural" || event.choices.length < 2) continue;
    const displayedChoices = [event.choices[1], event.choices[0]];
    for (const displayIndex of [0, 1]) {
      const expectedChoice = displayedChoices[displayIndex];
      const expected = expectedChoice.resultText;
      if (!expected) continue;
      const next = gameReducer(createAuditState(event, displayedChoices), { type: "RESOLVE_EVENT", choiceIndex: displayIndex });
      if (next.phase.type === "dying" || next.phase.type === "ending_prelude") continue;
      const got = next.lastResult?.text ?? "";
      checked += 1;
      if (!got.includes(expected)) {
        mismatches.push({
          eventId: event.id,
          title: event.title,
          displayIndex,
          choiceText: expectedChoice.text,
          expected,
          got,
        });
      }
    }
  }

  return { checked, mismatches };
}

function main() {
  const options = parseArgs();
  const events = getAllLifeEvents();
  const ids = events.map((event) => event.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  const issues = events.flatMap(auditEvent);
  const choiceResolution = auditChoiceResolution(events);
  for (const id of duplicateIds) {
    const event = events.find((item) => item.id === id)!;
    issues.push(issue(event, "error", "duplicate-event-id", `重复事件 id：${id}`));
  }

  const counts = issues.reduce<Record<Severity, number>>((acc, item) => {
    acc[item.severity] += 1;
    return acc;
  }, { error: 0, warn: 0, info: 0 });

  const payload = {
    eventCount: events.length,
    choiceCount: events.reduce((sum, event) => sum + (event.type === "procedural" ? 0 : event.choices.length), 0),
    counts,
    issues,
    choiceResolution,
  };

  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    console.log(`events=${payload.eventCount} choices=${payload.choiceCount}`);
    console.log(`issues error=${counts.error} warn=${counts.warn} info=${counts.info}`);
    console.log(`choiceResolution checked=${choiceResolution.checked} mismatches=${choiceResolution.mismatches.length}`);
    for (const item of choiceResolution.mismatches.slice(0, 20)) {
      console.log(`[error] choice-result-mismatch ${item.eventId} display=${item.displayIndex} ${item.choiceText} :: expected result text was not included in reducer output.`);
    }
    for (const item of issues.filter((i) => options.strict ? i.severity !== "info" : i.severity !== "info").slice(0, 80)) {
      const choice = item.choiceIndex === undefined ? "" : ` choice=${item.choiceIndex}`;
      console.log(`[${item.severity}] ${item.rule} ${item.eventId}${choice} ${item.choiceText ?? ""} :: ${item.detail}`);
    }
    if (issues.length > 80) console.log(`... ${issues.length - 80} more issues. Use --json=true for full output.`);
  }

  if (options.strict && (counts.error > 0 || choiceResolution.mismatches.length > 0)) process.exitCode = 1;
}

main();
