declare const process: { argv: string[]; exitCode?: number };

import { getAllLifeEvents } from "../data/life/events-registry";
import { createInitialState, gameReducer } from "../engine/reducer";
import { attr } from "../engine/types";
import type { AttributeName, EventChoice, GameEvent, GameState } from "../engine/types";

type ReviewStatus = "ok" | "review" | "mismatch";

type SemanticTag =
  | "water" | "fire" | "illness" | "money" | "study" | "family" | "travel" | "crime"
  | "old" | "death" | "luck" | "creation" | "social" | "work" | "danger" | "well"
  | "yomi" | "dog" | "scam" | "hospital" | "gamble" | "weather" | "vehicle" | "home"
  | "memory" | "relationship" | "school" | "body" | "internet";

type ReviewItem = {
  status: ReviewStatus;
  score: number;
  reasons: string[];
  eventId: string;
  title: string;
  ageRange: string;
  displayIndex: number;
  choiceIndexInEvent: number;
  choiceText: string;
  effects: EventChoice["effects"];
  eventTags: string[];
  semanticTags: {
    source: SemanticTag[];
    result: SemanticTag[];
    overlap: SemanticTag[];
  };
  eventDescription: string;
  expectedResultText?: string;
  actualResultText: string;
};

const ATTRIBUTES: AttributeName[] = ["appearance", "intelligence", "physique", "wealth", "creativity", "luck"];

const TAG_PATTERNS: Record<SemanticTag, string[]> = {
  water: ["水", "河", "海", "潮", "井", "湖", "雨", "溺", "游", "浪", "岸", "冰"],
  fire: ["火", "烟", "烧", "烫", "爆", "灰烬"],
  illness: ["病", "癌", "肿瘤", "肺", "感冒", "发烧", "血压", "出血", "咳", "药", "ICU"],
  money: ["钱", "账", "债", "财富", "积蓄", "赔", "工资", "投资", "补偿", "首付", "筹码", "赌场", "转账"],
  study: ["学", "课", "考试", "分数", "作业", "老师", "成绩", "笔记", "书"],
  family: ["家", "父", "母", "儿子", "妻", "老伴", "孩子", "孙", "亲人"],
  travel: ["旅行", "机票", "机场", "出国", "远行", "徒步", "峡谷", "路", "车站"],
  crime: ["违法", "犯罪", "看守所", "报警", "警察", "公安", "刀", "催债", "高利贷", "传销"],
  old: ["老", "晚年", "爷爷", "退休", "拐杖", "暮", "床前", "孙"],
  death: ["死亡", "致命", "带走", "没再站", "不再动", "呼吸机", "呼吸停", "失踪", "为时已晚", "猝死", "过劳死"],
  luck: ["运", "幸运", "机会", "偶然", "差点", "险", "巧", "命运"],
  creation: ["写", "画", "创作", "灵感", "作品", "故事", "诗", "设计", "想象", "日记"],
  social: ["朋友", "同学", "同事", "人群", "社交", "群", "评论", "弹幕", "饭局"],
  work: ["工作", "公司", "项目", "客户", "会议", "合同", "事业", "老板", "办公室"],
  danger: ["危险", "刀", "摔", "坠", "雷", "暗流", "撞", "事故", "急救", "救援", "悬崖"],
  well: ["井", "井下", "井口", "负一层", "石阶", "替身", "书记官"],
  yomi: ["黄泉", "延期", "档案", "账本", "代签", "债", "记录", "返回资格"],
  dog: ["狗", "狗子"],
  scam: ["诈骗", "骗", "传销", "安全账户", "空号", "骗子"],
  hospital: ["医院", "医生", "护士", "病房", "手术", "住院", "救护车", "CT", "ICU"],
  gamble: ["赌", "梭哈", "筹码", "赌场", "荷官", "彩票"],
  weather: ["雨", "雪", "雷", "风", "冬", "冷", "暴雨", "零下"],
  vehicle: ["车", "公交", "自行车", "地铁", "列车", "摩托", "机票", "飞机"],
  home: ["家", "老屋", "房", "出租屋", "院子", "浴室", "卧室"],
  memory: ["记忆", "回想", "回忆", "故事", "过去", "童年", "一生"],
  relationship: ["朋友", "老友", "合伙人", "伴侣", "狗子", "妻", "老伴", "孩子"],
  school: ["学校", "老师", "同学", "作业", "课本", "考试", "成绩"],
  body: ["身体", "肺", "腿", "手", "胸", "血", "疼", "伤", "健康", "体质"],
  internet: ["抽卡", "谷子", "弹幕", "评论区", "AI", "二创", "表情包", "群", "梗", "赛博", "纸片人"],
};

const POSITIVE_WORDS = ["成功", "收获", "赢", "好", "改善", "幸运", "掌声", "成长", "完成", "活了下来", "机会", "温暖", "存给", "首付"];
const NEGATIVE_WORDS = ["损", "亏", "伤", "病", "债", "赔", "失", "痛", "危险", "后悔", "逃", "医院", "空", "没剩", "清零", "被骗", "裂", "崩", "断", "冷", "摔"];
const SURVIVAL_WORDS = ["活了下来", "救", "拖回", "拖上", "医院", "住院", "出院", "逃", "还在", "醒来", "命还在"];
const DEATH_WORDS = ["死亡", "致命", "带走", "没再站", "不再动", "呼吸机", "呼吸停", "失踪", "为时已晚", "猝死", "过劳死"];

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseArgs() {
  const args = new Map<string, string>();
  for (const raw of process.argv.slice(2)) {
    if (!raw.startsWith("--")) continue;
    const [key, value = "true"] = raw.slice(2).split("=");
    args.set(key, value);
  }
  return {
    seed: Number(args.get("seed") ?? 20260703),
    samples: Number(args.get("samples") ?? 40),
    json: args.get("json") === "true",
    onlyReview: args.get("onlyReview") === "true",
    all: args.get("all") === "true",
  };
}

function hasAny(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

function semanticTags(text: string): SemanticTag[] {
  return (Object.entries(TAG_PATTERNS) as [SemanticTag, string[]][]) 
    .filter(([, words]) => hasAny(text, words))
    .map(([tag]) => tag);
}

function overlap<T>(left: T[], right: T[]): T[] {
  const rightSet = new Set(right);
  return [...new Set(left.filter((item) => rightSet.has(item)))];
}

function netAttributes(choice: EventChoice): number {
  return ATTRIBUTES.reduce((sum, attrName) => sum + (choice.effects.attributes?.[attrName] ?? 0), 0);
}

function createReviewState(event: GameEvent, displayedChoices: EventChoice[], order: number[]): GameState {
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
    pendingChoiceOrder: order,
  };
}

function shuffledOrder(length: number, rng: () => number): number[] {
  const order = Array.from({ length }, (_, index) => index);
  for (let index = order.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
  }
  return order;
}

function pick<T>(values: T[], rng: () => number): T {
  return values[Math.floor(rng() * values.length)];
}

function reviewChoice(event: GameEvent, order: number[], displayIndex: number): ReviewItem | null {
  if (event.type === "procedural" || event.choices.length === 0) return null;
  const displayedChoices = order.map((index) => event.choices[index]);
  const choice = displayedChoices[displayIndex];
  const choiceIndexInEvent = order[displayIndex];
  const next = gameReducer(createReviewState(event, displayedChoices, order), { type: "RESOLVE_EVENT", choiceIndex: displayIndex });
  const actualResultText = next.phase.type === "dying" ? next.deathRecord?.cause ?? "" : next.lastResult?.text ?? "";
  const expectedResultText = choice.resultText;
  const sourceTags = semanticTags(`${event.title} ${event.description} ${choice.text}`);
  const resultTags = semanticTags(actualResultText);
  const tagOverlap = overlap(sourceTags, resultTags);
  const reasons: string[] = [];
  let score = 100;

  if (expectedResultText && !actualResultText.includes(expectedResultText)) {
    reasons.push("结果页没有包含被点击选项的原始 resultText。");
    score -= 70;
  }

  const lethalDeathResult = Boolean(choice.effects.isLethal && resultTags.includes("death"));
  if (!lethalDeathResult && sourceTags.length >= 2 && tagOverlap.length === 0) {
    reasons.push(`语义标签无交集：source=${sourceTags.join("/") || "none"} result=${resultTags.join("/") || "none"}`);
    score -= 30;
  } else if (!lethalDeathResult && sourceTags.length >= 3 && tagOverlap.length === 1) {
    reasons.push(`语义交集较弱：overlap=${tagOverlap.join("/")}`);
    score -= 10;
  }

  const net = netAttributes(choice);
  if (choice.effects.isLethal && !hasAny(actualResultText, DEATH_WORDS)) {
    reasons.push("致死选项的实际结果页缺少明确死亡/终止语义。可能是风格化写法，也可能不够直观。");
    score -= 15;
  }
  if (!choice.effects.isLethal && hasAny(actualResultText, DEATH_WORDS) && !hasAny(actualResultText, SURVIVAL_WORDS)) {
    reasons.push("非致死选项的结果页含死亡语义，可能造成误读。");
    score -= 15;
  }
  if (net <= -10 && !hasAny(actualResultText, NEGATIVE_WORDS)) {
    reasons.push(`总属性变化 ${net}，但实际结果页缺少明显代价语义。`);
    score -= 15;
  }
  if (net >= 12 && !hasAny(actualResultText, POSITIVE_WORDS)) {
    reasons.push(`总属性变化 +${net}，但实际结果页缺少明显收益语义。`);
    score -= 15;
  }

  const status: ReviewStatus = score <= 40 ? "mismatch" : score < 80 ? "review" : "ok";
  return {
    status,
    score: Math.max(0, score),
    reasons,
    eventId: event.id,
    title: event.title,
    ageRange: `${event.minAge}-${event.maxAge}`,
    displayIndex,
    choiceIndexInEvent,
    choiceText: choice.text,
    effects: choice.effects,
    eventTags: event.eventTags ?? [],
    semanticTags: { source: sourceTags, result: resultTags, overlap: tagOverlap },
    eventDescription: event.description,
    expectedResultText,
    actualResultText,
  };
}

function reviewOne(event: GameEvent, rng: () => number): ReviewItem | null {
  if (event.type === "procedural" || event.choices.length === 0) return null;
  const order = shuffledOrder(event.choices.length, rng);
  const displayIndex = Math.floor(rng() * order.length);
  return reviewChoice(event, order, displayIndex);
}

function reviewAllChoices(events: GameEvent[]): ReviewItem[] {
  const items: ReviewItem[] = [];
  for (const event of events) {
    if (event.type === "procedural" || event.choices.length === 0) continue;
    const order = Array.from({ length: event.choices.length }, (_, index) => index);
    for (let displayIndex = 0; displayIndex < order.length; displayIndex++) {
      const item = reviewChoice(event, order, displayIndex);
      if (item) items.push(item);
    }
  }
  return items;
}

function main() {
  const options = parseArgs();
  const rng = mulberry32(options.seed);
  const candidates = getAllLifeEvents().filter((event) => event.type !== "procedural" && event.choices.length > 0);
  const items: ReviewItem[] = options.all ? reviewAllChoices(candidates) : [];
  if (!options.all) {
    for (let i = 0; i < options.samples; i++) {
      const item = reviewOne(pick(candidates, rng), rng);
      if (item) items.push(item);
    }
  }

  const visibleItems = options.onlyReview ? items.filter((item) => item.status !== "ok") : items;
  const summary = {
    seed: options.seed,
    samples: options.all ? items.length : options.samples,
    counts: {
      ok: items.filter((item) => item.status === "ok").length,
      review: items.filter((item) => item.status === "review").length,
      mismatch: items.filter((item) => item.status === "mismatch").length,
    },
    items: visibleItems,
  };

  if (options.json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log(`seed=${summary.seed} samples=${summary.samples} ok=${summary.counts.ok} review=${summary.counts.review} mismatch=${summary.counts.mismatch}`);
  for (const item of visibleItems) {
    console.log("\n---");
    console.log(`[${item.status}] score=${item.score} ${item.eventId} ${item.title} choice=${item.choiceText}`);
    if (item.reasons.length) console.log(`reasons: ${item.reasons.join("；")}`);
    console.log(`event: ${item.eventDescription}`);
    console.log(`effects: ${JSON.stringify(item.effects)}`);
    console.log(`result: ${item.actualResultText}`);
  }
}

main();
