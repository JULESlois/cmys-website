export const backgroundWords = [
  "揣摩意识", "沉默有诗", "初梦已逝", "沉迷夜色", "辞母远送", "愁眠雨声", "触摸月色", "出门远送", "缠绵雨丝", "草没雨湿",
  "春苗雨苏", "村木已疏", "草茂雨顺", "残梦月色", "船没于水", "丛木掩舍", "藏猫引鼠", "踩没雨水", "出马应试", "垂目言事",
  "诚默养善", "纯美意识", "沉默预说", "成命已遂", "慈母遗书", "初梦易逝", "重觅因说", "揣谜演说", "辞母远涉", "吃馍咽屎",
  "揣猫一身", "炒面盐水", "存猫饮食", "出门咬虱", "吹灭烟水", "藏谜演示", "铲煤用手", "长眠月食", "沉迷盐水", "采蜜养生",
  "辞暮迎曙", "粗麻夜色", "策马远涉", "仓满雨水", "草茂雨水", "苍茫夜色", "沉默艺术", "辞母远思", "春眠夜宿", "纯棉夜衫",
  "揣摩运势", "纯明雨水", "错买饮食", "侧面演示", "侧面因素", "草木一生", "草木雨水", "沉迷夜色", "沉默一瞬", "垂暮一生",
  "垂暮夜色", "春梦一时", "春梦有失", "纯美月色", "仓满盈实", "草木有死", "草木有盛", "草木有衰"
];

export type TimelineEvent = {
  id: string;
  yearRange: string;
  category: "Leadership" | "Technical" | "Sensory" | "Narrative";
  title: string;
  description?: string;
  level: "Future" | "Growth" | "Roots";
  colSpan?: number;
};

export const timelineData: TimelineEvent[] = [
  // Future/Recent (2025-2026)
  {
    id: "f1",
    yearRange: "2026",
    category: "Narrative",
    title: "小米公益\n保护母亲河公益行动",
    level: "Future",
    colSpan: 8,
  },
  {
    id: "f2",
    yearRange: "2025-至今",
    category: "Leadership",
    title: "新乡开放大学\n班长 / 先进个人 / 优秀班干部",
    level: "Future",
    colSpan: 10,
  },
  {
    id: "f3",
    yearRange: "2025",
    category: "Narrative",
    title: "中足协女超联邦/U21联赛/河南省女排城联球迷组织",
    level: "Future",
    colSpan: 12,
  },

  // Growth (2021-2024)
  {
    id: "g1",
    yearRange: "2021",
    category: "Narrative",
    title: "7·21新乡特大暴雨抗洪救灾",
    level: "Growth",
    colSpan: 14,
  },
  {
    id: "g2",
    yearRange: "2021-2023",
    category: "Leadership",
    title: "新乡市第二十二中学\n副班长 / 物理课代表 / 卫生委员",
    level: "Growth",
    colSpan: 10,
  },
  {
    id: "g3",
    yearRange: "2023",
    category: "Narrative",
    title: "新乡市雨花老年公益事业发展中心\n养老助餐志愿活动",
    level: "Growth",
    colSpan: 12,
  },
  {
    id: "g4",
    yearRange: "认证",
    category: "Technical",
    title: "民航局轻型民用无人机操作\n国际航空租赁培训",
    level: "Growth",
    colSpan: 6,
  },
  {
    id: "g5",
    yearRange: "技能",
    category: "Technical",
    title: "Python编程一级 / 图形化二级\n急救知识项目培训(合格) / 普测二甲",
    level: "Growth",
    colSpan: 8,
  },
  {
    id: "g6",
    yearRange: "体艺",
    category: "Sensory",
    title: "二十二中秋季运动会 100米 第3名",
    level: "Growth",
    colSpan: 6,
  },

  // Roots (2015-2020)
  {
    id: "r1",
    yearRange: "2015-2021",
    category: "Leadership",
    title: "新乡市育才小学\n中队长 / 中队委 / 校园安全员",
    level: "Roots",
    colSpan: 12,
  },
  {
    id: "r2",
    yearRange: "2018",
    category: "Leadership",
    title: "新乡市“萌娃小交警”",
    level: "Roots",
    colSpan: 6,
  },
  {
    id: "r3",
    yearRange: "才艺",
    category: "Sensory",
    title: "中华青少年文艺英才大赛\n声乐少儿组 铜奖",
    level: "Roots",
    colSpan: 8,
  },
  {
    id: "r4",
    yearRange: "2015-2020",
    category: "Sensory",
    title: "省围棋协会 业余围棋2级\n无极棋联杯 全国围棋邀请赛银奖",
    level: "Roots",
    colSpan: 10,
  },
  {
    id: "r5",
    yearRange: "学科",
    category: "Sensory",
    title: "育才小学汉字大赛 二等奖",
    level: "Roots",
    colSpan: 6,
  }
];
