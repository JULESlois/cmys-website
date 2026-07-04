import type { ParametricEvent } from "../../../engine/types";
import { createAge } from "../../../engine/types";

export const WEALTH_PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ══ 财富大波动事件 ══
  {
    type: "parametric", id: "p_wealth_scam", title: "沉没银山",
    description: "一个老同学突然联系你，说带你去'听课'，可以快速致富。你心里知道这听起来不太对，但看着满场热血沸腾的演讲，你的理智开始摇摆。",
    minAge: createAge(22), maxAge: createAge(28), weight: 2, eventTags: ["wealth", "danger"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { intelligence: 2 },
    choices: [
      { text: "投入全部积蓄\"创业\"", effects: { attributes: { wealth: -18, intelligence: 1 } }, resultText: "我把工作两年攒的八万块投了进去。一个月后，那个'公司'被查封了——传销。老同学的微信头像变成了灰色。我站在出租屋里的镜子前看着自己，觉得这个教训比任何一堂课都贵——但至少，我以后不会再上同样的当了。" },
      { text: "觉得不对劲，拒绝离开", effects: { attributes: { intelligence: 1, wealth: 2, creativity: -1} }, resultText: "我悄悄拿出手机搜了一下那个'项目'的名字——第一条结果就是'诈骗'。我趁上厕所的机会溜了。后来听说那个人骗了好几个老同学的钱，最多的投了二十万。我庆幸自己的那一瞬间犹豫。" },
    ],
  },
  {
    type: "parametric", id: "p_wealth_invest", title: "赤明银生",
    description: "一个做技术的朋友让你投一笔钱到他刚做的项目。你不太懂技术，但他说十个点——十个点就是翻倍。你看着账上那笔存款，想：万一这次是真的呢？",
    minAge: createAge(24), maxAge: createAge(30), weight: 2, eventTags: ["wealth", "invest"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 3 },
    choices: [
      { text: "投一半试试", effects: { attributes: { wealth: 20, luck: 1, physique: -1} }, resultText: "我投了五万。半年后他发来截图——产品被收购了。五万变成了二十一万。我盯着银行短信看了五分钟，然后给家里打了个电话。这是我人生中第一次不是因为借钱才打回家的电话。这种感觉太他妈好了。" },
      { text: "保守，还是存定期吧", effects: { attributes: { wealth: 3, luck: -1 } }, resultText: "我把那笔钱存了定期。三年后朋友的公司上市了——新闻上说他身价翻了二十倍。我举着报纸看了很久，然后把那杯咖啡喝完了。不是后悔，只是有点羡慕当初那个敢赌一把的自己。" },
    ],
  },
  {
    type: "parametric", id: "p_wealth_fail", title: "沉没银碎",
    description: "你和人合伙开了公司。起初每天都是希望——见客户、签合同、扩张招人。但这一年风向变了，客户回款断了，合伙人开始频频请假。今天推开办公室门，保险箱开着，电脑硬盘被拆走，桌上只剩下一张纸条：'对不起。'",
    minAge: createAge(32), maxAge: createAge(45), weight: 2, eventTags: ["wealth", "risk"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 4 },
    choices: [
      { text: "报警、清算、重新开始", effects: { attributes: { wealth: -20, intelligence: 1, luck: 1 } }, resultText: "我给律师打了电话，整理好所有财务记录报了案。公司清算那天，办公室只剩几张被搬空的桌子和一地灰尘。欠款没有因为报警就消失，信用也不是一夜能修回来。后来我确实重新开始了，但那是很久以后的事——在此之前，我先学会了怎么把每一笔债一行一行还清。" },
      { text: "算了，认栽。找份工作安稳过", effects: { attributes: { wealth: -10, luck: 1, physique: 1 } }, resultText: "我拿了最后的工资走人。新工作薪水不高但稳定——不用再担心回款和工资。坐在格子间里有时候会想起以前创业的日子，像一场梦。说实话，有时晚上睡不着会想象——如果我没放弃会怎样？但没有如果了。" },
    ],
  },
  {
    type: "parametric", id: "p_wealth_house", title: "仓满银实",
    description: "老家来电话说那片老宅要拆迁了。政策很优惠——补偿金不是一笔小数目。父母把决定权交给你。",
    minAge: createAge(35), maxAge: createAge(50), weight: 2, eventTags: ["wealth", "family", "comfort"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "签字，拿补偿金改善生活", effects: { attributes: { wealth: 25, creativity: -1 } }, resultText: "签完字那天我站在那片即将消失的巷子里发了一会呆。小时候在这里捉迷藏、放风筝、挨过打也挨过糖。那些记忆换了一笔钱——我知道这不公平，但日子还要过。我用那笔钱付了房子的首付，剩下的存给了孩子。" },
      { text: "不签，留住老宅", effects: { attributes: { wealth: 5, luck: 1, creativity: 2, appearance: -2} }, resultText: "我在协议上写了'不同意'三个字交还给了工作组。后来那片老宅被政府保留改成了文化街区——我每次回去都觉得，那不仅是留住了一栋房子，是留住了一段不会被拆迁的记忆。钱可以再赚，但有些东西没了就真的没了。" },
    ],
  },
  {
    type: "parametric", id: "p_wealth_illness", title: "残明银逝",
    description: "医院走廊的白炽灯嗡嗡响。缴费单上的数字让你头皮发麻——手术加住院加后期康复，差不多是你这些年的全部积蓄。护士第三次来催缴费了。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, eventTags: ["wealth", "illness", "family"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { physique: 3 },
    choices: [
      { text: "全部积蓄拿出来治病", effects: { attributes: { wealth: -25, physique: 6, luck: 1 } }, resultText: "我在银行转出了最后一笔钱的时候手是抖的。但手术很顺利，住院的那三周是我这辈子第一次这么认真地看窗外的日出——一天一天，天亮了。出院那天账单清零，口袋也清零了。但只要人还在，账就是一本可以重新写的空白本子。" },
      { text: "保守治疗，省下钱留给家人", effects: { attributes: { physique: -2, wealth: -5, luck: -1 } }, resultText: "我没做那个最贵的手术。省下的钱留给家人，自己靠药物慢慢养。后来虽然落了点后遗症，但看着孩子的学费有着落的时候，我咬咬牙觉得——这买卖不亏。只是有时候夜里痛醒，会想那个更好的方案。但也就是想想。" },
    ],
  },
  {
    type: "parametric", id: "p_wealth_mentor", title: "赤明银升",
    description: "一位行业前辈约你喝咖啡。他快退休了，没有孩子，说看中你很多年了——想把手里一个盈利的项目和一部分客户资源转给你。只有一个条件：保持项目的初心。",
    minAge: createAge(38), maxAge: createAge(52), weight: 2, eventTags: ["wealth", "career", "social"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 3, intelligence: 5 },
    choices: [
      { text: "郑重接受，接下这份衣钵", effects: { attributes: { wealth: 20, intelligence: 1, appearance: 1, physique: -1} }, resultText: "我花了三个月完成交接，把每一个流程跑通、每一个客户走访一遍。老前辈在电话里说'我没看错你'，然后笑着挂了。我对着窗外的晚霞端了一杯咖啡——不是咖啡店的，是办公室里的。苦，但我自己冲的。" },
      { text: "婉拒，不想背负别人的期望", effects: { attributes: { wealth: 5, creativity: 2, luck: 1, physique: -1} }, resultText: "我恭敬地谢绝了。走出咖啡馆的时候心里有一丝可惜，但更多的是释然——有些责任太重了，接不住就是接不住。我走自己的路，虽然慢一点，但踏实。那杯咖啡的味道我一直记得——干净，没有负担。" },
    ],
  },
];

