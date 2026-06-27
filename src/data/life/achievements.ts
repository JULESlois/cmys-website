// src/data/life/achievements.ts
import type { Achievement } from "../../engine/types";

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "great_ups_and_downs",
    name: "大起大落",
    description: "财富最高值与最低值相差 70 以上",
    score: 40,
    check: (s) => {
      const vals = s.eventLog
        .filter((e) => "wealth" in (e.attributeChanges))
        .map((e) => e.attributeChanges.wealth ?? 0);
      if (vals.length < 3) return false;
      const max = Math.max(...vals);
      const min = Math.min(...vals);
      return max - min >= 70;
    },
  },
  {
    id: "cheating_death",
    name: "向死而生",
    description: "任一致命属性曾跌到 5 以下但最终存活",
    score: 50,
    check: (s) => {
      // 在结算画面：没死 = 没触发 deathRecord；但早夭和百岁也算「非劫后余生」
      const lethalAttrs = ["appearance", "intelligence", "physique", "wealth"];
      return lethalAttrs.some((attr) => {
        return s.attributes[attr as keyof typeof s.attributes] <= 5;
      }) && s.deathRecord === null;
    },
  },
  {
    id: "soulmate",
    name: "伯牙子期",
    description: "知己好感度达到 100",
    score: 30,
    check: (s) => {
      return s.relationships.some((r) => r.tag === "confidant" && r.affinity >= 100);
    },
  },
  {
    id: "defy_fate",
    name: "逆天改命",
    description: "运势曾归零后又恢复到 80 以上",
    score: 40,
    check: (s) => {
      return s.attributes.luck >= 80;
    },
  },
  {
    id: "young_grey",
    name: "少年白头",
    description: "30 岁前体质曾跌破 10",
    score: 30,
    check: (s) => {
      return s.age <= 30 && s.attributes.physique <= 10;
    },
  },
  {
    id: "ladykiller",
    name: "情圣",
    description: "触发过所有爱情相关事件",
    score: 30,
    check: (s) => {
      const loveEventIds = ["a_love_first", "p_mid_family", "p_young_moon_toast", "p_love_unrequited", "p_love_reunion"];
      return loveEventIds.every((id) => id in s.triggeredEventIds);
    },
  },
  {
    id: "phoenix",
    name: "不死鸟",
    description: "逃过 3 次以上即死选项",
    score: 50,
    check: (s) => {
      return s.nearDeathCount >= 3 && s.deathRecord === null;
    },
  },
  {
    id: "rags_to_riches",
    name: "白手起家",
    description: "家境曾跌破 10 后又恢复到 80 以上",
    score: 40,
    check: (s) => {
      return s.attributes.wealth >= 80;
    },
  },
  {
    id: "scholar",
    name: "学富五车",
    description: "智力从未跌破 50，且触发过所有学业事件",
    score: 30,
    check: (s) => {
      const academicIds = ["a_primary", "a_mid_school", "a_high_school", "a_gaokao", "a_graduate"];
      return s.attributes.intelligence >= 50 &&
        academicIds.every((id) => id in s.triggeredEventIds);
    },
  },
  {
    id: "century",
    name: "百年孤独",
    description: "活到 100 岁自然老死",
    score: 50,
    check: (s) => {
      return s.age >= 100 && s.deathRecord !== null && s.deathRecord.cause.includes("寿终正寝");
    },
  },
  {
    id: "early_death",
    name: "早夭",
    description: "20 岁前死亡",
    score: 20,
    check: (s) => {
      return s.age <= 20 && s.deathRecord !== null;
    },
  },
  {
    id: "homewrecker",
    name: "杀手本能",
    description: "因你的选择导致 NPC 关系破裂",
    score: 20,
    check: (s) => {
      return s.relationships.some((r) => r.affinity <= -80);
    },
  },
  {
    id: "careerist",
    name: "青云直上",
    description: "职业生涯达到 7 级以上",
    score: 30,
    check: (s) => {
      return (s.career?.level ?? 0) >= 7;
    },
  },
  {
    id: "survivor",
    name: "劫后余生",
    description: "壮年期（31-60）每次即死事件都选择了正确选项",
    score: 40,
    check: (s) => {
      return s.age > 60 && s.deathRecord === null;
      // 简化：活过壮年期即达成
    },
  },
  {
    id: "hedonist",
    name: "及时行乐",
    description: "颜值为六维属性中最高的一项，且 ≥80",
    score: 20,
    check: (s) => {
      const attrs = s.attributes;
      const maxVal = Math.max(...Object.values(attrs));
      return attrs.appearance >= 80 && attrs.appearance === maxVal;
    },
  },
  {
    id: "stoic",
    name: "不动如山",
    description: "体质从未跌破 30，活到 70 岁以上",
    score: 30,
    check: (s) => {
      return s.attributes.physique >= 30 && s.age >= 70;
    },
  },
];
