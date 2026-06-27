// src/engine/lethal.ts
import type { GameEvent, GameState, EventChoice } from "./types";
import type { AttributeChangeMap } from "./balance";

interface LethalConversion {
  text: string;
  attributeChanges: AttributeChangeMap;
  chapterFlags?: Record<string, boolean | number | string>;
}

function numFlag(state: GameState, key: string): number {
  const value = state.chapter.chapterFlags[key];
  return typeof value === "number" ? value : 0;
}

function hasAny(id: string, parts: string[]): boolean {
  return parts.some((part) => id.includes(part));
}

/**
 * 将一部分即死选项转为濒死分支。
 *
 * 规则：
 * - 隐藏篇章内部的终局选择仍可直接死亡；
 * - 95 岁后的自然终局不强行转化；
 * - 毒品、犯罪、持械冲突等明确极端行为保留直接死亡；
 * - 其他现实事故优先转化为黄泉债、海渊凝视、雷痕等后续触发器。
 */
export function getLethalChoiceConversion(
  state: GameState,
  event: GameEvent,
  _choice: EventChoice,
): LethalConversion | null {
  const age = state.age as number;
  const id = event.id.toLowerCase();

  if (event.chapterId) return null;
  if (age >= 95) return null;
  if (hasAny(id, ["drug", "crime", "knife", "blade", "murder"])) return null;

  const nextDebt = numFlag(state, "yomi_debt") + 1;

  if (hasAny(id, ["tide", "lost", "river", "sea"])) {
    return {
      text: "水没有立刻收走你。你被拖回岸边时，肺里像塞满了盐和黑夜。从那以后，雨声里偶尔会混进潮声，像有什么东西记住了你的名字。",
      attributeChanges: { physique: -20, luck: 5, creativity: 5 },
      chapterFlags: {
        abyss_gaze: numFlag(state, "abyss_gaze") + 1,
        sea_called_name: true,
        yomi_debt: nextDebt,
      },
    };
  }

  if (hasAny(id, ["lightning", "thunder"])) {
    return {
      text: "雷光落下时，你短暂地看见另一个世界的白昼。醒来后，医生说你能活下来已经是奇迹。你的掌心留下了树枝一样的淡痕，每逢雨夜都会发烫。",
      attributeChanges: { physique: -18, intelligence: 6, luck: -8, creativity: 5 },
      chapterFlags: {
        storm_mark: numFlag(state, "storm_mark") + 1,
        yomi_debt: nextDebt,
      },
    };
  }

  if (hasAny(id, ["ice", "mountain", "roof", "motor", "fire", "winter"])) {
    return {
      text: "那本该是终点。可你在黑暗里听见有人替你多签了一行字。醒来时，身体像被拆开又粗暴地装回去；命还在，但某处已经欠下了账。",
      attributeChanges: { physique: -22, luck: -6, creativity: 4 },
      chapterFlags: {
        yomi_debt: nextDebt,
        near_death_trace: numFlag(state, "near_death_trace") + 1,
      },
    };
  }

  if (hasAny(id, ["sick", "cancer", "bloodpressure", "overwork", "bath", "cold", "epidemic"])) {
    return {
      text: "病痛没有放过你，只是暂时没有带走你。白色病房、消毒水、签字单和彻夜未眠的人影成了新的记忆。你活了下来，但身体从此记住了这次透支。",
      attributeChanges: { physique: -20, wealth: -8, luck: -6, intelligence: 4 },
      chapterFlags: {
        yomi_debt: nextDebt,
        body_debt: numFlag(state, "body_debt") + 1,
      },
    };
  }

  if (hasAny(id, ["fraud", "scam"])) {
    return {
      text: "那辆车没有把你带到终点。你在一个陌生服务区逃了出来，手机、证件和积蓄都不见了。很久以后你仍会在夜里惊醒，确认门有没有反锁。",
      attributeChanges: { wealth: -25, luck: -12, appearance: -8, intelligence: 5 },
      chapterFlags: {
        yomi_debt: nextDebt,
        stranger_danger: true,
      },
    };
  }

  if (age < 61) {
    return {
      text: "死亡擦着你过去。你不知道自己为什么还能睁开眼，只知道世界从那天起不再完全可靠。某个看不见的账本上，多了一笔关于你的延期记录。",
      attributeChanges: { physique: -20, luck: -8, creativity: 4 },
      chapterFlags: {
        yomi_debt: nextDebt,
        near_death_trace: numFlag(state, "near_death_trace") + 1,
      },
    };
  }

  return null;
}
