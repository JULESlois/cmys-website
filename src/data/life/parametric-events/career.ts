import type { ParametricEvent } from "../../../engine/types";
import { createAge } from "../../../engine/types";

export const CAREER_PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ══ 职业里程碑事件 ══
  {
    type: "parametric", id: "p_career_fired", title: "沉默一瞬",
    description: "你被开除了。HR 说完那些客套话后推过来一份离职协议。你走出写字楼，手里抱着一个不大的纸箱——里面是工位上的全部家当。太阳很刺眼，你眯起眼睛，忽然不知道接下来该往哪个方向走。",
    minAge: createAge(20), maxAge: createAge(26), weight: 2, eventTags: ["career", "pressure"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "总结教训，七天之内找到新工作", effects: { attributes: { intelligence: 1, wealth: 2, physique: -1}, careerLevelDelta: 1 }, resultText: "我在出租屋里复盘了一整个晚上——把那些搞砸的事一条一条写下来。第二天开始疯狂投简历，第四天面了三家公司，第七天收到了offer。新工位比原来的大一倍。人生有些门是被踹开的——因为你自己在踹。" },
      { text: "回家躺了一个月", effects: { attributes: { physique: 2, creativity: 2, wealth: -1}, careerLevelDelta: -1 }, resultText: "我给自己放了个假。躺在沙发上刷完了所有积压的剧，然后翻出大学时的作品集翻了翻——忽然想起自己其实喜欢画东西。那一个月看似在躺平，但种子已经埋下了。找工作的时候我投了一家设计公司——被录了。原来迷路也是路的一部分。" },
    ],
  },
  {
    type: "parametric", id: "p_career_project", title: "驰明永生",
    description: "公司交给你一个足以定义你职业生涯的项目。你握着项目计划书——文件编号是你的工号后三位——手心发热。团队里一半人觉得你有病，另一半觉得你疯了。但你不做点什么的话，十年前的自己大概会失望。",
    minAge: createAge(32), maxAge: createAge(45), weight: 2, eventTags: ["career", "pressure"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { intelligence: 5, wealth: 3 },
    choices: [
      { text: "亲自带队，所有细节过手", effects: { attributes: { wealth: 10, intelligence: 1, physique: -2 }, careerLevelDelta: 2 }, resultText: "我睡在办公室两周，把方案翻了三版，跟合作方吵了两架，最后在交付前一天凌晨三点把终版文件发给了客户。第二天客户回了一句：'这个我们要了。'我瘫在椅子里看着天花板笑了——不是那种轻轻的微笑，是发自胸腔的大笑。这次，干成了。" },
      { text: "委托团队推进，把控方向", effects: { attributes: { wealth: 4, intelligence: 1, luck: 1, physique: -1}, careerLevelDelta: 1 }, resultText: "我把项目分解成十个模块，交给了最信得过的四个人。每周例会听汇报、拍板方向、不越级不插手。项目平稳交付那天，我给团队发了一个大红包——也给了自己一个。有些成功不需要你亲力亲为，盯准方向就够了。" },
    ],
  },
  {
    type: "parametric", id: "p_career_poach", title: "迟明永升",
    description: "猎头发来消息——竞对公司开出了你现在薪资的双倍，职位升一级，但需要搬到另一个城市。你的直属上司昨天刚跟你说过：'你是接班人，我不会亏待你。'你的手悬在手机上方迟疑了整整一个下午。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, eventTags: ["career", "opportunity"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { intelligence: 5, wealth: 4 },
    choices: [
      { text: "跳槽，重新开始", effects: { attributes: { wealth: 15, intelligence: 1, physique: -1 }, careerLevelDelta: 2 }, resultText: "我在新办公室安顿好的那天，窗外是一片陌生的天际线。工资翻了一倍，职级升了一级——但同事们看我的眼神是审视的。我知道在这里我需要重新证明一切。压力很大，但人也轻了——因为这一次每一步都是我自己选的。" },
      { text: "留下，续签忠诚", effects: { attributes: { wealth: 5, luck: 1, creativity: 2, physique: -2}, careerLevelDelta: 1 }, resultText: "我去跟老板谈了涨薪——不是猎头给的那个数，但加上了一份信任和一份期权。签完新合同的那天老板请我喝了杯酒：'我没看错人。'有些选择不是关于钱——是关于想要什么样的路陪你走到最后。" },
    ],
  },
];

