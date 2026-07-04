import { getLifeEventById } from "../data/life/events-registry";
import { getStoryArcById } from "../data/life/story-arcs";
import type { AttributeName, GameState, ResolvedEvent } from "./types";

type MotifId =
  | "study"
  | "family"
  | "social"
  | "danger"
  | "health"
  | "wealth"
  | "creation"
  | "travel"
  | "pressure"
  | "well"
  | "yomi"
  | "meme"
  | "quiet";

export interface StoryArcNarrativeSummary {
  heading: string;
  paragraphs: string[];
  motifs: string[];
}

const ATTRIBUTE_LABELS: Record<AttributeName, string> = {
  appearance: "颜值",
  intelligence: "智力",
  physique: "体质",
  wealth: "家境",
  creativity: "才脉",
  luck: "运势",
};

const ARC_OPENING: Record<string, string> = {
  arc_infant: "最早的世界没有边界，只有光、声音、怀抱和那些被大人反复念起的名字。",
  arc_elementary: "你开始知道家门外还有学校、同伴、作业和村口的风。世界不再只是被照顾，也开始要求你回答。",
  arc_middle_school: "沉默、试卷、朋友和自尊在这一段时间里同时生长。你学会把话咽下去，也学会在关键处抬头。",
  arc_university: "离家之后，远方不再只是地图上的词。它变成车站、宿舍、图书馆、心动和毕业时没说完的话。",
  arc_young_adult: "城市把每个人都拆成很多部分：工作的一部分、漂泊的一部分、孤独的一部分，以及仍然想发光的一部分。",
  arc_midlife: "责任开始有了具体重量。账单、病历、合同、饭局和家人的目光，把你推到人生中盘。",
  arc_elder: "黄昏慢慢靠近，时间不再催促你证明什么，只把旧人旧事一件件放回你手里。",
};

const MOTIF_LABELS: Record<MotifId, string> = {
  study: "学业",
  family: "家人",
  social: "关系",
  danger: "险境",
  health: "病痛",
  wealth: "钱与债",
  creation: "创作",
  travel: "远行",
  pressure: "压力",
  well: "井下回声",
  yomi: "黄泉债",
  meme: "时代噪声",
  quiet: "静默",
};

const MOTIF_LINES: Record<MotifId, string> = {
  study: "试卷、作业和那些没写完的答案反复出现，像是在提醒你：成长首先是一场漫长的应试。",
  family: "家人的身影一直在场。有时是牵挂，有时是压力，有时只是深夜里一盏没有熄掉的灯。",
  social: "你和别人之间的距离不断改变。有人靠近，有人离开，也有人只在一句话之后改变了位置。",
  danger: "危险擦着你经过。那些差一点、来不及和幸好，给这一篇留下了更深的阴影。",
  health: "身体在这一篇里开始发出声音。它不总是服从你的意志，也不总能替你承受代价。",
  wealth: "钱、机会、债务和安全感交替出现。你逐渐明白，账本有时比命运还冷。",
  creation: "有些孤独没有白费，它们沉到心里，变成了故事、灵感和无法对别人解释的冲动。",
  travel: "离开原地之后，你才发现远方不是逃离，而是把旧问题带到新的地方重新回答。",
  pressure: "压力像潮水一样堆上来。你没有总是赢，但每一次撑住都改变了你的形状。",
  well: "井下的潮声曾经贴近现实边缘。另一个你、另一条路、另一份名单，都在暗处留下痕迹。",
  yomi: "黄泉债没有真正消失。那些被延期的死亡、被代签的名字和潮湿的收据，仍在账本背面等你。",
  meme: "时代的噪声也钻进了人生缝隙。玩笑、弹幕、抽象图和短暂的热闹，构成了这一代人的旁白。",
  quiet: "这一篇没有留下特别剧烈的波纹，但安静本身也是一种叙事：你仍然向前，仍然没有停下。",
};

function motifFromTags(tags: string[]): MotifId[] {
  const motifs = new Set<MotifId>();
  for (const tag of tags) {
    if (["study", "exam", "school", "growth"].includes(tag)) motifs.add("study");
    if (["family", "childhood", "comfort"].includes(tag)) motifs.add("family");
    if (["social", "relationship", "persuasion", "lonely"].includes(tag)) motifs.add("social");
    if (["danger", "accident", "risk", "adventure"].includes(tag)) motifs.add("danger");
    if (["health", "illness", "physique"].includes(tag)) motifs.add("health");
    if (["wealth", "debt", "invest"].includes(tag)) motifs.add("wealth");
    if (["creation", "memory", "peace"].includes(tag)) motifs.add("creation");
    if (["travel", "career"].includes(tag)) motifs.add("travel");
    if (["pressure", "will"].includes(tag)) motifs.add("pressure");
    if (["well", "hidden"].includes(tag)) motifs.add("well");
    if (["yomi"].includes(tag)) motifs.add("yomi");
    if (["meme", "internet"].includes(tag)) motifs.add("meme");
  }
  return [...motifs];
}

function getArcEvents(state: GameState, arcId: string): ResolvedEvent[] {
  return state.eventLog.filter((entry) => entry.storyArcId === arcId);
}

function getMotifCounts(entries: ResolvedEvent[]): Map<MotifId, number> {
  const counts = new Map<MotifId, number>();
  for (const entry of entries) {
    const event = getLifeEventById(entry.eventId);
    const motifs = motifFromTags(event?.eventTags ?? []);
    for (const motif of motifs) {
      counts.set(motif, (counts.get(motif) ?? 0) + 1);
    }
    if (entry.chapterId === "well_otherworld") counts.set("well", (counts.get("well") ?? 0) + 1);
    if (entry.chapterId === "yomi_debt") counts.set("yomi", (counts.get("yomi") ?? 0) + 1);
  }
  return counts;
}

function getTopMotifs(entries: ResolvedEvent[]): MotifId[] {
  const counts = getMotifCounts(entries);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([motif]) => motif);
}

function getAttributeTotals(entries: ResolvedEvent[]): Partial<Record<AttributeName, number>> {
  const totals: Partial<Record<AttributeName, number>> = {};
  for (const entry of entries) {
    for (const [attribute, value] of Object.entries(entry.attributeChanges) as [AttributeName, number][]) {
      totals[attribute] = (totals[attribute] ?? 0) + value;
    }
  }
  return totals;
}

function getAttributeLine(entries: ResolvedEvent[]): string | null {
  const totals = getAttributeTotals(entries);
  const ranked = (Object.entries(totals) as [AttributeName, number][])
    .filter(([, value]) => value !== 0)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  const [attribute, value] = ranked[0] ?? [];
  if (!attribute || !value) return null;

  const label = ATTRIBUTE_LABELS[attribute];
  if (value >= 8) return `${label}在这一篇里明显抬升，像是这段人生给你留下的主要赠礼。`;
  if (value >= 3) return `${label}有了细微增长，它不是奇迹，更像许多选择慢慢叠出来的痕迹。`;
  if (value <= -8) return `${label}在这一篇里付出了沉重代价，有些损耗不会在结算页上立刻显得温柔。`;
  if (value <= -3) return `${label}被削去了一点，像一块被生活磨过的边角。`;
  return null;
}

function getChoiceEcho(entries: ResolvedEvent[]): string | null {
  const meaningful = entries
    .filter((entry) => entry.choiceText && entry.choiceText !== "（自动）")
    .slice(-3);
  if (meaningful.length === 0) return null;
  const last = meaningful[meaningful.length - 1];
  return `最后留在这一篇里的选择是“${last.choiceText}”。它未必最大，却像一枚书签，夹在你刚刚翻过的页尾。`;
}

function hasTouchedChapter(state: GameState, chapterId: string): boolean {
  return Boolean(
    state.chapter.activeChapterId === chapterId ||
    state.chapter.unlockedChapterIds.includes(chapterId) ||
    state.chapter.completedChapterIds.includes(chapterId) ||
    state.eventLog.some((entry) => entry.chapterId === chapterId),
  );
}

export function getStoryArcNarrativeSummary(state: GameState, arcId: string): StoryArcNarrativeSummary {
  const arc = getStoryArcById(arcId);
  const entries = getArcEvents(state, arcId);
  const topMotifs = getTopMotifs(entries);
  const motifs = topMotifs.length > 0 ? topMotifs : (["quiet"] as MotifId[]);
  const paragraphs: string[] = [];

  paragraphs.push(ARC_OPENING[arcId] ?? arc?.description ?? "这一篇悄然结束，像一页被风翻过的纸。");

  const motifText = motifs.map((motif) => MOTIF_LINES[motif]).join(" ");
  const countText = entries.length > 0
    ? `你在这一篇里经历了 ${entries.length} 个关键片段。`
    : "这一篇没有留下太多可被量化的事件，但时间仍然从你身上经过。";
  paragraphs.push(`${countText}${motifText}`);

  const attributeLine = getAttributeLine(entries);
  const choiceEcho = getChoiceEcho(entries);
  if (attributeLine || choiceEcho) {
    paragraphs.push([attributeLine, choiceEcho].filter(Boolean).join(" "));
  } else if (entries.length === 0) {
    paragraphs.push("没有被记录，不等于没有发生。那些太小的动作、太早的梦和来不及成为选择的瞬间，也在悄悄塑造你。");
  }

  if (hasTouchedChapter(state, "well_otherworld")) {
    paragraphs.push("至于井下的事，现实不会替你解释。它只把潮湿的影子留在记忆边缘，等你在某一年再次听见。");
  } else if (hasTouchedChapter(state, "yomi_debt")) {
    paragraphs.push("至于那张黄泉债的收据，它没有被彻底结清。你只是暂时回到了现实，账还在另一边等着。");
  }

  return {
    heading: arc ? `${arc.name} · 回声` : "篇章回声",
    paragraphs: paragraphs.slice(0, 4),
    motifs: motifs.map((motif) => MOTIF_LABELS[motif]),
  };
}
