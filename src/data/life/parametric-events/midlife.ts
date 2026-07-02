import type { ParametricEvent } from "../../../engine/types";
import { createAge } from "../../../engine/types";

export const MIDLIFE_PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ── 壮年期 31-60 ──
  {
    type: "parametric", id: "p_mid_career", title: "撑明永世",
    description: "你的事业到了关键转折点。一个重大项目摆在面前，成则飞升，败则重来。整个团队都在看着你——你已经不是那个可以输得起的少年了。",
    minAge: createAge(31), maxAge: createAge(50), weight: 3, eventTags: ["career", "pressure"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "全力以赴，背水一战", effects: { attributes: { wealth: 5, intelligence: 1, physique: -1 } } , resultText: "你带着核心团队连续奋战了三个月，办公室的灯几乎没熄过。项目上线那天凌晨，你站在落地窗前看着城市的轮廓在晨光中浮现——你赢了。你摸了摸鬓角，又多了几根白发，但这都不重要了。"},
      { text: "委托团队稳健推进", effects: { attributes: { wealth: 2, luck: 1, creativity: -1} } , resultText: "你把任务拆分得清清楚楚，交给最信任的几个骨干。每周的例会上你听取汇报、把控方向，不越级也不插手。项目平稳交付那天，你准时下班回家，陪家人吃了一顿久违的晚饭。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_family", title: "春梦永世",
    description: "你站在婚礼的殿堂上，看着TA的眼睛。这一生的承诺，从此刻开始。",
    minAge: createAge(25), maxAge: createAge(35), weight: 2, eventTags: ["family", "pressure"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "深情宣誓", effects: { attributes: { luck: 1, creativity: 2, wealth: -1} } , resultText: "你站在聚光灯下，握着TA的手，那些准备好的誓词忽然全部忘了。沉默了几秒，你只说了句：'以后的路，我们一起走。'台下有人笑了，也有人偷偷抹眼泪。那一夜，你第一次觉得'归宿'这个词有了形状。"},
      { text: "务实规划未来", effects: { attributes: { wealth: 2, intelligence: 1, physique: -1} } , resultText: "你和TA在厨房餐桌上摊开账本，一笔一笔地算——房贷、育儿基金、养老储备。没有海誓山盟，只有密密麻麻的数字。但你知道，这比任何情话都实在：真正的承诺，写在柴米油盐里。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_crisis", title: "愁眠雨声",
    description: "中年危机如约而至。你坐在深夜的阳台上，雨声敲打着内心的不安。",
    minAge: createAge(38), maxAge: createAge(50), weight: 2, eventTags: ["pressure", "wealth"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "重新审视人生方向", effects: { attributes: { creativity: 2, intelligence: 1, physique: -1} } , resultText: "你报了一个心理咨询课程，每周去见一次治疗师。第一次说出'我不快乐'的时候，你哭了。治疗师递来纸巾，你擦了擦脸，觉得心里那块压了多年的石头终于松动了一点。"},
      { text: "买一辆跑车", effects: { attributes: { wealth: -2, appearance: 1 } } , resultText: "你提了那辆关注了三年的跑车。发动引擎的轰鸣声让你笑了出来，像一个叛逆的少年。回家后你看到女儿惊讶的眼神，忽然有点不好意思——但你不打算解释，这是你为自己做的一个梦。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_health", title: "草木有衰",
    description: "体检报告上出现了几个红字。你盯着它们，第一次认真思考'健康'的意义。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, eventTags: ["health", "illness"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "开始规律运动", effects: { attributes: { physique: 5, luck: -1} } , resultText: "你办了健身卡，每天早晨六点准时出现在健身房。最开始那两周浑身酸痛，上楼梯都龇牙咧嘴。一个月后你发现精神好了很多，连脾气都变好了——原来身体不会骗你，你对它好，它就对你好。"},
      { text: "无所谓，继续喝酒", effects: { attributes: { physique: -4, luck: -2 } } , resultText: "你照常参加每一个酒局，红光满面地谈笑风生。深夜回家你把体检报告塞进抽屉最深处，不去看那些加粗的指标。反正人都有一死——你这样安慰自己，但半夜醒来时，心慌得怎么也睡不着。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_invest", title: "沉没一瞬",
    description: "一个朋友拉你合伙创业。你看着商业计划书，热血沸腾。",
    minAge: createAge(32), maxAge: createAge(45),
    statRequirements: { wealth: 5 }, weight: 2, eventTags: ["wealth", "invest", "risk"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "全力投入创业", effects: { attributes: { wealth: 6, intelligence: 1, physique: -2 } } , resultText: "你辞了职，全身心扑在那个项目上。每天只睡五个小时，凌晨还在和团队讨论方案。你瘦了，但眼睛亮了。妻子说你看起来像回到了二十岁——你知道她没说出口的是，她也担心你会像年轻时那样狠狠摔一跤。"},
      { text: "谨慎注资，不参与管理", effects: { attributes: { wealth: 2, luck: 1, physique: -1} } , resultText: "你投了一笔钱，签了协议，不干涉日常运营。每个季度看看报表，偶尔去办公室转转。朋友说你太谨慎，你摇摇头——这个年纪，稳比快重要。你知道自己几斤几两。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_greyhair", title: "愁明银色",
    description: "清晨洗漱时，你对着镜子愣住了——鬓角多了一根白发。你小心翼翼地拔掉它，却发现旁边还有两根。时光从不说谎，它把所有痕迹都刻在你的身上。",
    minAge: createAge(35), maxAge: createAge(45), weight: 2, eventTags: ["health", "pressure"], maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "坦然接受变老的事实", effects: { attributes: { creativity: 2, luck: 1, physique: -1} } , resultText: "你把白发留在那里，任它们占领你的鬓角和头顶。同事们夸你'有味道了'，你苦笑着想——不接受又能怎样？但你发现，当你不再和这件事较劲的时候，反而觉得自在了许多。"},
      { text: "染发，跟时间较劲", effects: { attributes: { appearance: 2, physique: -1 } } , resultText: "你每两个月去一次理发店，坐在镜前看着染发膏一点点遮住白色。走出来的时候确实年轻了几岁，可你也知道，下次白发还会长出来，就像潮水一定会再次涌起。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_nightwork", title: "迟暮夜深",
    description: "凌晨一点，你终于走出写字楼。月光洒在空荡荡的街道上，你的影子被拉得很长。出租车里，电台放着老歌，你靠着车窗，眼皮越来越重。手机屏幕还亮着——家人发来的消息没来得及回。",
    minAge: createAge(32), maxAge: createAge(48), weight: 3, eventTags: ["career", "pressure", "health"], maxTriggers: 3, cooldownYears: 10,
    choices: [
      { text: "再拼几年就好了", effects: { attributes: { wealth: 3, physique: -1, intelligence: 1 } } , resultText: "你把回不了的消息设成自动回复，把错过晚饭的愧疚藏在心里。凌晨的出租车上，你默默算了一笔账——再熬两年就能还清房贷。你闭上眼睛，让疲惫随着车身的晃动沉入夜色。"},
      { text: "命要紧，换份轻松的工作", effects: { attributes: { wealth: -1, physique: 3, luck: 1 } } , resultText: "你递交了辞呈，主管惊讶地看了你三秒：'想清楚了？'你点点头。走出写字楼的那一刻，阳光有些刺眼，你深呼吸了一口——空气里有种久违的自由的味道。虽然薪水少了一半，但你又能看到日出了。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_toast", title: "愁迷影碎",
    description: "酒桌上觥筹交错。你举起酒杯，透过琥珀色的液体看着对面那张笑脸——是真心还是假意？中年人的社交，每一杯酒都有它的价钱，推杯换盏间全是算计。",
    minAge: createAge(35), maxAge: createAge(50),
    statRequirements: { wealth: 3 }, weight: 2, eventTags: ["social", "pressure", "danger"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "一饮而尽，谈成生意", effects: { attributes: { wealth: 3, physique: -1, appearance: 1 } } , resultText: "你仰头把酒灌下去，火辣辣地划过喉咙。对面的人笑了，向你伸出了手。你握住那只手，知道这笔生意成了。但你也知道，今晚又要胃痛了——你摸了摸口袋里的胃药，心想，这就是代价。"},
      { text: "以茶代酒，守住底线", effects: { attributes: { physique: 2, luck: 1, creativity: -1} } , resultText: "你端起茶杯，在觥筹交错间显得格格不入。有人打趣你'老了'，你笑笑不说话。酒局散场时你是唯一清醒的人，送同事回家的路上，你靠着车窗，心里出奇地平静。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_storm", title: "沉没雨时",
    description: "家里出了大事。你拖着疲惫的身躯回到家，TA什么也没说，只是默默给你倒了一杯热水，然后坐在你身边。那一刻你明白，所谓夫妻，就是同一条船上的人，风浪再大也不松手。",
    minAge: createAge(33), maxAge: createAge(50), weight: 2, eventTags: ["danger", "accident", "family"], maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "紧紧握住TA的手", effects: { attributes: { luck: 1, creativity: 2, wealth: -1} } , resultText: "你握住TA的手，指节发白。千言万语堵在喉咙里，最后只挤出一句：'有我呢。'TA的眼泪滴在你手背上，滚烫。那晚你们在沙发上坐了很久，谁也没有松开谁——有些风雨，握紧了手就能走过去。"},
      { text: "一个人扛，不让TA担心", effects: { attributes: { physique: -1, intelligence: 1, wealth: 1 } } , resultText: "你笑着说'没事'，转身走进书房，轻轻关上了门。你坐在黑暗里，盯着手机上的数字发呆。你不想让TA看到你崩溃的样子——不是不信任，而是你觉得，有些重量注定只能一个人扛。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_alone", title: "垂目影深",
    description: "周末下午，你一个人坐在江边垂钓。水面平静如镜，倒映着你不再年轻的脸。手机响了——是工作群的消息。你没有点开，继续盯着水面发呆。人到中年，热闹是别人的，孤独是自己的。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, eventTags: ["lonely", "social"], maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "享受这份独处的宁静", effects: { attributes: { creativity: 2, luck: 1, wealth: -1} } , resultText: "你把手机调成静音，扣在石头上。浮漂在水面轻轻晃动，你的思绪也跟着漂到了很远的地方。这些年你一直在扮演各种角色——员工、父母、子女——只有这一刻，你只是你自己。"},
      { text: "收起鱼竿，回到人群中去", effects: { attributes: { appearance: 2, wealth: 1, intelligence: -1} } , resultText: "你收起鱼竿，回到家中。妻子问你钓到没有，你说'没有'，她也不失望。你坐在沙发上看电视，女儿发来视频，小外孙在镜头里叫你'爷爷'。你笑了——或许你并不是真的想独处，只是累了。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_help", title: "持梅应手",
    description: "老友遇到困难，深夜打来电话，声音哽咽。你听着电话那头的倾诉，想起当年他也曾帮过你。人到了这个年纪，朋友就像冬天的炭火——越来越少，但每一个都珍贵得舍不得用。",
    minAge: createAge(35), maxAge: createAge(55),
    statRequirements: { wealth: 3 }, weight: 2, eventTags: ["social", "family"], maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "倾囊相助，情义无价", effects: { attributes: { wealth: -3, luck: 1, appearance: 2 } } , resultText: "你把银行卡递过去的时候，老友的泪水夺眶而出。你拍了拍他的肩膀，什么也没说。回家的路上妻子看了你一眼，欲言又止，最终只说了句：'做得对。'你知道那笔钱可能回不来了，但你更知道，有些东西比钱珍贵得多。"},
      { text: "量力而行，点到为止", effects: { attributes: { wealth: 1, intelligence: 1, creativity: -1} } , resultText: "你借出一笔在他偿还能力范围内的数目，又帮忙联系了几个熟人。老友千恩万谢，你说'都是小事'。回到办公室你记了一笔账——不只是钱的账，也是人情的账。中年人的友谊，经不起透支。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_fame", title: "尘没云散",
    description: "你升职了，但内心毫无波澜。坐在更大的办公室里，你看着墙上那些奖状和锦旗，突然觉得很空。这些曾经让你热血沸腾的东西，如今不过是墙上的灰尘。你拿起一块奖牌擦了擦，又放下了。",
    minAge: createAge(45), maxAge: createAge(58),
    statRequirements: { wealth: 5 }, weight: 2, eventTags: ["social", "career"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "看淡名利，追求内心", effects: { attributes: { creativity: 3, luck: 1, wealth: -1 } } , resultText: "你把那些奖杯从柜子上拿下来，一件件擦拭干净，收进了纸箱。儿子不解地问：'爸，这不是你的荣誉吗？'你摸了摸他的头：'荣誉在心里，不在柜子上。'那天下午，你翻开了一本想了很久却一直没空看的书。"},
      { text: "位置越高责任越大", effects: { attributes: { wealth: 3, intelligence: 1, physique: -1 } } , resultText: "你坐在新办公室里，窗外的视野更开阔了，但你看到的不是风景，是更多的责任。会议一个接一个，决策文件堆满了桌角。你揉了揉太阳穴，想起刚入职时的自己——那个只想'混口饭吃'的年轻人，如今扛着一千多人的生计。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_undercurrent", title: "沉脉隐生",
    description: "公司里的人心开始浮动。两个派系都在拉拢你，同事在茶水间的窃窃私语多了起来。你知道，站队的时候到了。选错了，前半生的积累可能付诸东流；不选，两边都不会把你当自己人。",
    minAge: createAge(35), maxAge: createAge(50),
    statRequirements: { intelligence: 5 }, weight: 2, eventTags: ["career", "risk"], maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "明哲保身，谁也不站", effects: { attributes: { intelligence: 1, luck: -1 } } , resultText: "你在办公室里挂了一幅字——'静观其变'。两边的人都来拉拢你，你始终是同一副笑容：'做好自己的事就好。'你知道这样做两面都不讨好，但在职场活了二十年的老狐狸都明白——不站队，才能站到最后。"},
      { text: "选择有前途的一方", effects: { attributes: { wealth: 3, appearance: 1, luck: -2 } } , resultText: "你斟酌了整整一周，分析了每个派系的势力和走向。最终你选定了那一方，在下班后的'偶遇'中递出了橄榄枝。这是一场赌博——中年人的职场就像棋盘，不动棋子的人，最先被吃掉。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_radical", title: "抽脉隐伤",
    description: "你手里握着辞职信，在总经理办公室门口站了很久。这份做了十五年的工作，像一个温暖的牢笼——让你饿不死也撑不着。是继续安稳还是破釜沉舟？你听见自己的心跳声。",
    minAge: createAge(38), maxAge: createAge(52),
    statRequirements: { wealth: 5, intelligence: 5 }, weight: 2, eventTags: ["risk", "career", "danger"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "辞职，自己创业", effects: { attributes: { wealth: 5, creativity: 2, physique: -2, luck: -2 } } , resultText: "你端着纸箱走出公司大门，保安小哥敬了个礼。你回头看了一眼那栋工作了十五年的楼，忽然觉得自己像一个刚出狱的人——自由，但也茫然。你深吸一口气，拨通了第一个客户的电话。"},
      { text: "忍了，稳定压倒一切", effects: { attributes: { wealth: 1, luck: 1, creativity: -2 } } , resultText: "你把辞职信撕碎，扔进垃圾桶。然后打开电脑，继续做那份做了十五年的PPT。下班时同事问你晚上有局吗，你摇了摇头。开车回家的路上收音机里放着老歌，你跟着哼了两句——其实也不算太差。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_mentor", title: "传脉永生",
    description: "一个年轻人叫你'师傅'。你看着他求知若渴的眼神，想起三十年前的自己——也是这么莽撞、这么热忱。你知道自己这辈子的经验和教训，总得有个地方传下去。",
    minAge: createAge(42), maxAge: createAge(58),
    statRequirements: { intelligence: 6, wealth: 3 }, weight: 2, eventTags: ["career", "social", "study"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "倾囊相授，毫无保留", effects: { attributes: { intelligence: 1, luck: 1, creativity: 2, physique: -1} } , resultText: "你把自己几十年的经验整理成文档，从方法论到踩过的坑，事无巨细。那个年轻人每次听完都两眼放光，笔记记了厚厚一本。你看着他，像看着一棵正在长大的树——你知道他终将超越你，而你觉得那很好。"},
      { text: "教七分留三分", effects: { attributes: { intelligence: 1, wealth: 1, physique: -1} } , resultText: "你教他业务，教他为人，但从不把自己压箱底的心法全部说出。这不是自私——你告诉自己——有些路必须自己走过才算数。你在一旁看着，偶尔点拨一句。既为师徒，便不能替他走路。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_ruin", title: "船没夜深",
    description: "最坏的消息来了。你看着财务报表上刺眼的赤字，或者那份解聘通知，又或者是合伙人带着核心客户消失了。世界在你面前崩塌，但你必须站着——身后还有一家老小指望你。",
    minAge: createAge(40), maxAge: createAge(55),
    statRequirements: { wealth: 4 }, weight: 2, eventTags: ["wealth", "risk"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "咬牙坚持，从头再来", effects: { attributes: { physique: -1, luck: 1, creativity: 2, wealth: -2 } } , resultText: "你卖掉了车，退掉了办公室，坐在空荡荡的客厅里打了一圈电话。合伙人走了一半，但手里还有几个愿意相信你的人。你在白纸上重新写下了计划书——字迹有些抖，但每一笔都比从前更用力。"},
      { text: "及时止损，另找出路", effects: { attributes: { wealth: -1, intelligence: 1, luck: 1 } } , resultText: "你在最后一份文件上签了字，结束了这场噩梦。清算师同情地看着你，你反倒安慰他：'没事，人还在。'你走出大楼，天正下着小雨。你没有打伞，在雨里走了很久，想着接下来该怎么办。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_silence", title: "沉眠欲逝",
    description: "凌晨三点，你突然醒来，再也睡不着。身边人睡得很沉。你披着外套走到窗边，看着沉睡的城市。万籁俱寂中，你第一次听见自己内心的声音——它已经沉默了太多年。你问自己：这是我想要的生活吗？",
    minAge: createAge(38), maxAge: createAge(55), weight: 2, eventTags: ["lonely", "pressure"], maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "直面内心，承认不快乐", effects: { attributes: { creativity: 2, luck: -1 } } , resultText: "你在日记本上写下第一行字：'我不快乐。'笔尖戳破了纸。你继续写——深夜的焦躁、白天的面具、无声的争吵。写到手指发酸的时候抬头看窗外，天快亮了。你觉得自己像一块冰，正在慢慢融化。"},
      { text: "明天还要上班，继续睡", effects: { attributes: { physique: 2, intelligence: 1, luck: -1} } , resultText: "你翻了个身，把被子裹紧。闹钟在四个小时后会准时响起，你需要那点睡眠去应付明天的会议。你闭上眼睛，把那些没用的念头赶走——想这些干什么？又不能当饭吃。你很快睡着了，呼吸均匀。"},
    ],
  },
];

export const MIDLIFE_LETHAL_EVENTS: ParametricEvent[] = [
  // ══ 新增：壮年期即死事件 31-60 ══
  {
    type: "parametric", id: "p_mid_alcohol", title: "愁漫永逝",
    description: "多年的应酬让你有了酗酒的习惯。体检报告上的肝功能指标已经标红了好几年。今晚又是一场推不掉的酒局。客户把酒杯推到你面前：'感情深，一口闷。'",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, eventTags: ["danger", "health", "social"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "仰头干完，不给面子不行", effects: { attributes: { physique: -6, wealth: 2 }, isLethal: false }, resultText: "白酒烧进胃里的那一瞬间，我就知道今晚要出事。凌晨三点腹痛难忍进了急诊——急性胰腺炎。医生说我再喝就要在ICU过年了。回家后我把酒柜清空了，这辈子再没碰过一口。" },
      { text: "放下酒杯，换茶", effects: { attributes: { physique: 3, luck: 1, wealth: -1 } }, resultText: "我端起茶杯：'以茶代酒。'客户愣了一下，然后笑了：'行行行，现在不兴灌酒了。'散场后我一个人站在饭店门口，冬天的冷风吹在脸上——原来戒酒不需要勇气，只需要一个开口的瞬间。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_fight", title: "赤没夜深",
    description: "深夜在小巷里迎面走来两个醉汉。其中一个人撞了你一下，然后骂骂咧咧地把手伸向腰间。你看到了一道金属的反光。",
    minAge: createAge(32), maxAge: createAge(48), weight: 1, eventTags: ["danger", "social"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "冲上去夺刀，不能怂", effects: { attributes: {}, isLethal: true }, resultText: "我冲向那个拿刀的人，抓住了他的手腕。但我低估了他的力量——刀尖转了一个角度刺进了我的左胸。警察后来调取了监控。同事们在公司群里沉默了很久，有人说我不值——人到中年，为了一口气把命搭上，真的不值。" },
      { text: "转身就跑，报警处理", effects: { attributes: { intelligence: 1, luck: 1, wealth: -1 } }, resultText: "我转身就跑——不是怂，是活够了才懂得命比面子贵。跑出巷子马上掏出手机报了警。几天后派出所在例行巡逻中抓到了那两人。我把那晚的经历讲给儿子听，当安全教育。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_bloodpressure", title: "沉默已逝",
    description: "早上醒来右臂抬不起来了。医生看着你的血压计读数，倒吸了一口凉气：'你这么高的血压还扛着？随时可能脑出血。'你苦笑着说还有两个会要开。",
    minAge: createAge(45), maxAge: createAge(58), weight: 2, eventTags: ["health", "illness", "pressure"], maxTriggers: 2, cooldownYears: 10,
    statRequirements: { physique: 4 },
    choices: [
      { text: "先开会，事后再看", effects: { attributes: {}, isLethal: true }, resultText: "我在会议室里讲话讲到一半，突然右边的视野开始变暗。同事们说我站了一会儿，然后像一棵被砍倒的树一样直直地倒下去。脑干出血——医生说走得不痛苦。只是太快了，太早了。" },
      { text: "马上住院，什么会都不开了", effects: { attributes: { physique: -2, luck: 1, wealth: -2 } }, resultText: "我拨了三个电话：取消今天的两个会、给妻子发了一条消息、然后叫了 120。躺在救护车里看着输液瓶的药水一滴滴落下，鼻子一酸——这条命，差一点就被会议室里的 PPT 带走了。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_debt", title: "沉脉已碎",
    description: "你投资了一个'稳赚'的项目，为此抵押了房子、借了高利贷。现在是还款日——电话响个不停，窗外催债的人已经把车停在了楼下。一个朋友说他有路子可以翻盘——但需要你做一件违法的事。",
    minAge: createAge(38), maxAge: createAge(52), weight: 2, eventTags: ["wealth", "debt", "pressure"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 5 },
    choices: [
      { text: "铤而走险，走朋友的'路子'", effects: { attributes: {}, isLethal: true }, resultText: "我在看守所里睡了最后一个晚上。有人说是'经济犯罪'，但对我来说这些词都太遥远了——我只是想让家人过得更好，结果连陪伴他们的权利都输掉了。铁门合上的声音，比所有讨债的电话都更响。" },
      { text: "卖掉一切，从头还债", effects: { attributes: { wealth: -15, intelligence: 1, luck: 1 } }, resultText: "我签了卖房合同，交出了车钥匙。搬进出租屋那天妻子哭了，我说'别哭，人还在呢'。之后的五年我白天上班晚上跑滴滴，一分一分地还。还清最后一笔债的时候我站在银行门口，感觉像刚出狱一样——自由了。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_overwork", title: "沉眠永世",
    description: "你已经连续两周每天只睡四个小时。镜子里那个眼窝深陷的男人有些陌生。太阳穴突突地跳着，左臂隐隐发麻。同事劝你回去休息——'还有一个报表，做完就走。'你打开抽屉又吞了两片咖啡因片。",
    minAge: createAge(35), maxAge: createAge(50), weight: 3, eventTags: ["career", "health", "pressure"], maxTriggers: 2, cooldownYears: 12,
    statRequirements: { physique: 3, wealth: 4 },
    choices: [
      { text: "继续熬夜，做完这个项目", effects: { attributes: {}, isLethal: true }, resultText: "心肺功能在凌晨四点彻底罢工。他趴在键盘上，屏幕上还有没写完的最后一行数据。医生说这在医学上叫做'青壮年猝死综合征'——在媒体上它有一个更简单的名字：过劳死。他最后发的消息是一天前，对妻子说：'今晚加班，不用等我。'" },
      { text: "关机回家睡觉", effects: { attributes: { physique: 4, luck: 1, wealth: -1 } }, resultText: "我长按电源键把电脑关了——屏幕黑掉的那一刻，心里某根绷紧的弦也跟着松了。在家昏睡了十二个小时后醒来，看到同事凌晨三点发的消息：'你还好吗？'窗外阳光正好，我还活着。有些班不值得透支命来加。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_cancer", title: "残命疑生",
    description: "体检报告放在桌上。你盯着那行字看了很久——'肺部占位性病变，建议进一步检查'。医生说你有一周的时间考虑治疗方案：激进手术还是保守治疗。",
    minAge: createAge(48), maxAge: createAge(58), weight: 2, eventTags: ["health", "illness", "danger"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { physique: 4 },
    choices: [
      { text: "拖延，先用偏方试试", effects: { attributes: {}, isLethal: true }, resultText: "我听了那个'老中医'的偏方，喝了两个月草药汤。复查的时候已经扩散了。医生叹了口气——如果能早一个月来，还有手术的机会。我走出诊室的时候腿在发抖。不是害怕死，是后悔当时没有给自己一个活的机会。" },
      { text: "立即安排手术", effects: { attributes: { physique: -4, luck: 1, wealth: -5 } }, resultText: "手术安排在两天后。被推进手术室时我握着妻子的手说'等我'。六个小时后主刀医生给了我一个OK的手势——切干净了。胸口的伤疤很难看，但每一次看见它我就知道：我还在。疤痕是生命给的勋章。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_betrayal", title: "赤没应生",
    description: "合伙人带着核心客户和资金消失了，留下一屁股烂账。供应商堵在公司门口要钱。此时你只有一个选择——报警立案。但你查到他在此之前已经买好了出国的机票，今天下午飞。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, eventTags: ["social", "career", "danger"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 5 },
    choices: [
      { text: "独自去机场拦住他", effects: { attributes: {}, isLethal: true }, resultText: "我在机场航站楼追到了他——他正在过安检。我冲上去揪住他的衣领，两个保安上来把我推开。争执中我撞到了安检台，倒下的时候后脑勺磕在大理石地板上。机场的急救人员来过，但为时已晚。" },
      { text: "收集证据走法律程序", effects: { attributes: { intelligence: 1, luck: 1, wealth: -2 } }, resultText: "我冷静下来，把所有转账记录、通话录音、邮件往来打印了厚厚一摞交给律师。他跑到了国外，但账户被冻结、上了国际通缉名单。钱大部分追不回来——但我守住了底线。有时候正义不是把对方打倒，而是你没有被他拉下水。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_train", title: "迟没远逝",
    description: "你站在地铁站台上等末班车。站台上只有你一个人。头晕晕的——今晚喝得有点多。轨道深处传来列车进站的轰隆声，你往站台边缘迈了一步想看看车来了没有。",
    minAge: createAge(35), maxAge: createAge(50), weight: 1, eventTags: ["travel", "accident", "danger"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "往前探身看看", effects: { attributes: {}, isLethal: true }, resultText: "酒精让我的判断慢了一拍——等我意识到自己离边缘太近的时候，列车已经进站。一阵风将我卷入轨道。这一生最后一个念头是一句没来得及说的话：我应该打车回家的。" },
      { text: "扶住墙、退到黄线后", effects: { attributes: { luck: 1, intelligence: 1, wealth: -1} }, resultText: "我往后踉跄了一步，一只手撑在墙上。列车呼啸进站，带起的风拍在脸上，酒醒了大半。上车后我给妻子发了条消息：'以后晚上喝酒我打车回家。'有些事情，侥幸了一次就不能再赌第二次。" },
    ],
  },
];

