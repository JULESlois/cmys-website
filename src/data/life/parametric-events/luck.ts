import type { ParametricEvent } from "../../../engine/types";
import { createAge } from "../../../engine/types";

export const LUCK_PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ══ 运势极端事件（涨→跌→续跌→翻盘）══
  {
    type: "parametric", id: "p_luck_rise", title: "春明运升",
    description: "这一阵你的人生好像开了挂——考试押题全中，参加比赛拿了一等奖，走在路上都能被街拍的夸长得好看。连路边捡的刮刮乐都中了二十块。你开始觉得：命运是不是终于站在自己这边了？",
    minAge: createAge(10), maxAge: createAge(15), weight: 2, eventTags: ["luck", "opportunity"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "保持谦逊，继续做好自己", effects: { attributes: { luck: 1, intelligence: 1, wealth: -4} }, resultText: "我把那些幸运攒在心里，没有到处炫耀。依旧每天最早到教室，依旧把作业写得工工整整。妈妈说你变了——变得稳重了。其实我没变，我只是怕把这些好运一口气都用完。但心里有一个声音悄悄说——原来我也值得被命运垂青。" },
      { text: "沾沾自喜，到处炫耀", effects: { attributes: { luck: 1, appearance: -2 } }, resultText: "我把奖状贴在书包外面，把街拍照发到所有群聊里。同学们开始疏远我——但我没注意到。青春期的膨胀像气球，越吹越大，看不到那根针已经举起来了。但至少在当下——我觉得自己无所不能。" },
    ],
  },
  {
    type: "parametric", id: "p_luck_crash", title: "残明运碎",
    description: "运势急转直下。比赛失利、朋友疏远、家里开始出现争吵——所有你在意的东西都在同时崩塌。你觉得自己像站在风暴中心的一根稻草，什么都抓不住。那些曾经的好运去哪了？",
    minAge: createAge(18), maxAge: createAge(25), weight: 2, eventTags: ["luck", "danger"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "闭门不出，一个人待着", effects: { attributes: { luck: -20, creativity: 2 } }, resultText: "我在出租屋里闷了两周，把窗帘拉得严严实实。翻了所有能翻的书，听遍了所有能听的歌——但心里那个黑洞还是越来越大。这两周里，我错过了比赛复盘、朋友的邀约和一个本可以补救的机会。最低谷的某天深夜，我在日记本上写了一句话：'只有当一切都不顺的时候，你才知道自己真正想要什么。'" },
      { text: "硬撑着笑对所有人", effects: { attributes: { luck: -12, appearance: 2, intelligence: 1 } }, resultText: "我假装什么都没发生——继续上课、继续社交、继续发朋友圈。但每晚关上门以后，我连洗澡的力气都没有。有一天在图书馆角落里，一个不太熟的同学递来一包纸巾。他什么都没说，但那一刻我差点崩溃。原来逞强比示弱累得多。" },
    ],
  },
  {
    type: "parametric", id: "p_luck_deep", title: "沉默运逝",
    description: "烂事好像潮水一样一波接着一波——丢了工作、房东涨租、手机也在这个月碎了屏。你去买个彩票想转转运，结果连末等奖都没中。你蹲在彩票亭门口，忽然笑了——不是开心，是觉得荒谬。",
    minAge: createAge(22), maxAge: createAge(30), weight: 2, eventTags: ["luck", "risk"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "放弃抵抗，随波逐流", effects: { attributes: { luck: -12, creativity: -1 } }, resultText: "我把碎屏的手机插上充电器，继续投着石沉大海的简历。屏幕裂痕里漏出来的光像极了我四分五裂的生活。我开始接受——也许这就是我的人生剧本。就这样吧。但偶尔半夜醒来，心底深处还有那么一小簇不肯熄灭的火苗。" },
      { text: "咬着牙一件一件解决", effects: { attributes: { luck: -3, physique: -1, intelligence: 1 } }, resultText: "我先换了手机屏，然后把房东说服延期了两个月，再一份一份地改简历投出去。最崩溃的那个晚上我想过放弃——但第二天早上闹钟一响我还是坐起来了。不是因为坚强，是因为我不知道除了继续走还能做什么。而这恰恰是走出谷底的唯一方式。" },
    ],
  },
  {
    type: "parametric", id: "p_luck_reborn", title: "迟明运生",
    description: "人生最深的谷底之后，一道光照了进来。一个你从未想过会再联系的人主动找上你，给你带来了一个意想不到的机会。你没有理由相信这次会好——但你也没有理由再拒绝了。",
    minAge: createAge(30), maxAge: createAge(45), weight: 2, eventTags: ["luck", "opportunity"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "抓住这个机会，全力翻盘", effects: { attributes: { luck: 1, creativity: 3, wealth: 8, physique: -4} }, resultText: "我挂掉电话后深吸了一口气——机会来得毫无预兆，像是命运忽然记起了那个在谷底不肯认输的人。我用尽全力抓住它，像溺水的人抓住岸边的草。三年后回看——那一通电话改变了一切。正如老话说的：宝剑锋从磨砺出。" },
      { text: "谨慎观望，不敢再信了", effects: { attributes: { luck: 1, intelligence: 1, wealth: 3, creativity: -2} }, resultText: "我说'让我考虑一下'——这些年被骗怕了。花了一周做调查、问熟人、看数据——最后才点了头。这一次我没赌那么大，但每一步都踩得很稳。有些事情不需要孤注一掷，慎重本身也是一种幸运。" },
    ],
  },
];

