import type { ParametricEvent } from "../../../engine/types";
import { createAge } from "../../../engine/types";

export const RELATIONSHIP_PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ══ 知己关系事件（esu狗子）══
  {
    type: "parametric", id: "p_rel_kid_friend", title: "赤没影深",
    description: "你和新来的转学生 esu狗子 成了同桌。他教你把课本立在桌上挡住老师的视线，在下面传小纸条。那是你第一次觉得——上学也没那么无聊。",
    minAge: createAge(8), maxAge: createAge(14), weight: 2, eventTags: ["social", "childhood"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "跟他一起逃课去操场", effects: { relationshipEffect: { targetId: "confidant", change: 20 }, attributes: { creativity: 2 } }, resultText: "我们翻过围墙溜到后操场上，躺在草地上看云。狗子说他以后想当飞行员，问我想干什么。我认真想了想——好像想干什么都行，只要跟他一块。友谊这种东西，来得没道理，但好像一来了就再没走过。" },
      { text: "劝他回教室好好上课", effects: { relationshipEffect: { targetId: "confidant", change: 5 }, attributes: { intelligence: 1 } }, resultText: "我把他拽回教室。狗子嘟囔了一整节课，但最后还是把笔记抄整齐了。放学时他说：'你管我，但管得还行。'我翻了个白眼，心里却有点暖。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_kid_fight", title: "沉默雨散",
    description: "你们因为一件小事闹翻了——你忘了在狗子生日那天赴约。他在雨中等了你两个多小时。第二天见面时，他一声不吭，看都不看你一眼。",
    minAge: createAge(10), maxAge: createAge(16), weight: 2, eventTags: ["social", "danger"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "买了他最喜欢的零食去道歉", effects: { relationshipEffect: { targetId: "confidant", change: 10 }, attributes: { appearance: 1 } }, resultText: "我拎着一袋旺仔牛奶蹲在他家门口。他开了门，看了我一眼，又看了看旺仔——没忍住笑了一下。然后板着脸说：'进来。'那个夏天的雨下了很久，但我们的冷战只撑了四天。" },
      { text: "我没错，他不来是他小气", effects: { relationshipEffect: { targetId: "confidant", change: -15 }, attributes: { creativity: 1 } }, resultText: "我们又冷战了两周。在走廊上擦肩而过假装不认识，体育课分组也各站一边。后来有人告诉我狗子家里出了事——那个生日是他最需要一个朋友的一次。我站在操场角落沉默了半个下午。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_young_drunk", title: "赤没夜深",
    description: "大学那年你失恋喝得烂醉如泥。凌晨两点手机响了——是狗子打来的。他什么都没问就说了一句：'你在哪，我来接你。'",
    minAge: createAge(18), maxAge: createAge(25), weight: 2, eventTags: ["social", "danger"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "在电话里把所有的委屈都倒出来", effects: { relationshipEffect: { targetId: "confidant", change: 25 }, attributes: { creativity: 2 } }, resultText: "他骑着电动车过来接我，我坐在后座上抱着他的腰哭了一路。回到他家后他给我泡了碗泡面，坐在旁边听我语无伦次地说了一夜——关于那个人，关于愚蠢的爱情，关于我到底有多傻。天亮的时候他说：'没事，我在这。'" },
      { text: "说没事，挂掉电话自己走回家", effects: { relationshipEffect: { targetId: "confidant", change: 5 }, attributes: { physique: 1 } }, resultText: "我挂了电话，一个人歪歪扭扭地走了四十分钟回家。第二天狗子发了一长串消息，都是问号。我回了句'没事啊昨晚喝多了就睡了'。他没有再追问，但我总觉得那条消息里藏着一种我没能开口的孤独。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_young_debt", title: "沉没应逝",
    description: "你毕业后手头紧，从狗子那里借了一笔钱。说好三个月还，现在已经拖了九个月。你没脸接他的电话，他的消息也越回越短。今天他直接站在了你出租屋门口。",
    minAge: createAge(20), maxAge: createAge(28), weight: 2, eventTags: ["social", "wealth", "debt"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 3 },
    choices: [
      { text: "开门面对，把实情说出来", effects: { relationshipEffect: { targetId: "confidant", change: -5 }, attributes: { wealth: -3, intelligence: 1 } }, resultText: "我开了门，把我们实习公司欠薪的事全说了。狗子坐在我那张塌了半个角的沙发上，沉默了半分钟，然后说：'你早说啊。'他没说不要我还，只说了句：'有钱了再还，不着急。'我知道这段关系里我欠了一笔账——不只是钱。" },
      { text: "编个借口从后窗溜走", effects: { relationshipEffect: { targetId: "confidant", change: -20 }, attributes: { luck: -2 } }, resultText: "我从后窗翻了出去，给他的手机发了一句'不在家'。过了一个小时他回了一个字：'哦。'从那以后这个字成了我们之间最常见的聊天内容——哦。哦。哦。我们之间终于只剩下了一个语气词。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_mid_brother", title: "赤明永生",
    description: "你出了事——具体什么事已经不重要了。重要的是你躺在医院里，第一个出现在病房门口的是狗子。他看起来一夜没睡，手里拎着一袋水果，表情很难看。",
    minAge: createAge(32), maxAge: createAge(48), weight: 2, eventTags: ["family", "social"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "抓住他的手，说一声\"兄弟\"", effects: { relationshipEffect: { targetId: "confidant", change: 20 }, attributes: { luck: 1 } }, resultText: "我伸出手，狗子握住了。他的掌心很粗糙——这些年他过得也不容易。我们什么都没说，但好像什么都说了。他递给我一个橘子：'给你剥好了。'橘子很甜，比医院食堂的饭菜好吃一万倍。" },
      { text: "强撑着说没事，让他走", effects: { relationshipEffect: { targetId: "confidant", change: 5 }, attributes: { physique: 2 } }, resultText: "我说'没事你回去吧'，他看了我一眼，放下水果转身走了。走廊里他的脚步停了大概两秒，然后又响了起来。后来他再也没有主动来看过我。我想叫他，但话始终堵在喉咙里。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_mid_betray", title: "沉默欲碎",
    description: "一个你们共同的朋友在你和狗子之间传了话——两边各说了一半，两边都觉得自己被背叛了。狗子发了一条很长的消息来质问你，字字句句都带着你从未见过的冰冷。",
    minAge: createAge(35), maxAge: createAge(50), weight: 2, eventTags: ["social", "danger"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "去找他当面把话说清楚", effects: { relationshipEffect: { targetId: "confidant", change: -10 }, attributes: { intelligence: 1 } }, resultText: "我开车去了他家，在楼下等了两个小时。他最终下来了，眼睛有点红。我们在小区长椅上把事情从头捋了一遍——发现那个'共同朋友'两边都在撒谎。误会解开了，但裂痕还在。有些话说出口就收不回来，即使你知道那不是真的。" },
      { text: "回一条更狠的消息，绝交", effects: { relationshipEffect: { targetId: "confidant", change: -25 }, attributes: { creativity: -2 } }, resultText: "我写了一千字的长消息回过去，最后一句是'你要是这么想，那没什么好说的了'。发出去之后我看着手机屏幕从亮变暗，他没有再回复。后来听说他换了城市。那句话成了我们之间的句号。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_elder_reunion", title: "沉暮永生",
    description: "多年以后在街上遇到了狗子。他头发白了，你也白了。你们站在原地互相看了很久——然后都笑了。时间把很多恩怨都冲刷成了砂砾，金子在阳光下还在发亮。",
    minAge: createAge(62), maxAge: createAge(78), weight: 2, eventTags: ["elder", "social", "family"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "请他到家里吃一顿饭", effects: { relationshipEffect: { targetId: "confidant", change: 25 }, attributes: { luck: 1, creativity: 2 } }, resultText: "老伴做了一桌子菜，狗子带了瓶老酒。我们喝到深夜，把年轻时的事一件一件翻出来——那些当时觉得天大的事，现在看来都像笑话。他临走的时候拍着我的肩膀说：'这辈子交你这个朋友，值了。'我站在门口看着他的车灯消失，眼眶有点热。" },
      { text: "寒暄两句然后告别", effects: { relationshipEffect: { targetId: "confidant", change: 5 }, attributes: { luck: 1 } }, resultText: "我们站在街边聊了十分钟——工作、孩子、身体。然后他说要赶公交，转身走了。我看着他的背影，想起几十年前在操场上等我的那个少年。有些关系像河，不刻意维护就会干涸——而我们两个都太久没有浇过水了。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_elder_help", title: "赤没永逝",
    description: "狗子病重了。他的家人打电话给你——说他一直在念叨你的名字。你赶到医院，他躺在病床上，人瘦了一圈，但看见你的时候眼睛亮了一下。",
    minAge: createAge(65), maxAge: createAge(82), weight: 2, eventTags: ["elder", "social", "family"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "每天来医院陪他，直到最后", effects: { relationshipEffect: { targetId: "confidant", change: 30 }, attributes: { luck: 1, wealth: -5 } }, resultText: "我每天下午来医院，给他读报纸、讲笑话、唠叨他的药有没有按时吃。有一天他忽然说：'谢谢你。'声音很轻，但我知道这是他这辈子对我说过最重的话。后来他走了。走的时候握着我的手。我很久没有哭过了——但那天哭了。" },
      { text: "来看了几次，但生活实在太忙了", effects: { relationshipEffect: { targetId: "confidant", change: -30 }, attributes: { wealth: 2 } }, resultText: "我来了三次——第一次、第二次、然后过了很久才来第三次。他的家人说他已经不怎么能说话了。我站在病床前，他睁眼看着我，嘴动了动——不知道是在叫我，还是在说算了。我走出医院大楼的时候，觉得有什么东西永远留在了那间病房里。" },
    ],
  },
];

