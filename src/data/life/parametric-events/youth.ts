import type { ParametricEvent } from "../../../engine/types";
import { createAge } from "../../../engine/types";

export const YOUTH_PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ── 青年期 18-30 ──
  {
    type: "parametric", id: "p_young_work", title: "出马应声",
    description: "你找到了第一份兼职工作。社会的第一课，比学校残酷。",
    minAge: createAge(19), maxAge: createAge(24),
    statRequirements: { intelligence: 3 }, weight: 3, eventTags: ["career", "wealth", "pressure"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "踏实工作积累经验", effects: { attributes: { wealth: 2, intelligence: 1, physique: -1} } , resultText: "我每天第一个到公司，给前辈们倒好咖啡。那些复印、整理、跑腿的活儿，我做得很认真。三个月后，主管开始让我碰真正的业务——原来所有的弯路，都是为了让你看清正路的样子。"},
      { text: "投机取巧走捷径", effects: { attributes: { wealth: 3, luck: -2 } } , resultText: "我发现了一些'聪明'的做法——比如虚报工时、把别人的功劳往自己身上揽。工资条上的数字确实好看了，但同事们看我的眼神变了。深夜躺在床上，我问自己：这就是我想要的成功吗？"},
    ],
  },
  {
    type: "parametric", id: "p_young_travel", title: "船没云水",
    description: "你独自背包旅行。火车穿过陌生的田野，你感到前所未有的自由。",
    minAge: createAge(19), maxAge: createAge(26), weight: 2, eventTags: ["travel", "adventure", "youth"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "深度体验当地文化", effects: { attributes: { creativity: 2, intelligence: 1, physique: -1} } , resultText: "我在小巷里迷了路，却误入一家当地人常去的老茶馆。老板用方言和我说了很多，我大半没听懂，只是笑着点头。离开时他拍了拍我的肩——那一刻我忽然明白，旅行的意义不是看到什么，而是感受到什么。"},
      { text: "拍照打卡发朋友圈", effects: { attributes: { appearance: 2, wealth: -1} } , resultText: "我举着手机在每一个网红景点前摆出精心设计的pose。朋友圈的点赞数在飙升，但我坐在民宿的床上翻看照片时，却记不起那些景点背后的故事。镜头里的笑容很完美，心里却有个声音在问：你究竟是来旅行，还是来收集点赞的？"},
    ],
  },
  {
    type: "parametric", id: "p_young_network", title: "诚盟远溯",
    description: "一个重要的社交场合。你遇到了可以改变你职业轨迹的人。",
    minAge: createAge(22), maxAge: createAge(28),
    statRequirements: { appearance: 5 }, weight: 2, eventTags: ["social", "career"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "真诚介绍自己", effects: { attributes: { wealth: 3, luck: 1, physique: -1} } , resultText: "我没有用那些华丽的修饰词，只是诚实地说了自己的经历和想法。那个行业前辈听完后沉默了几秒，然后说：'年轻人，你很特别。'他递给我一张名片——那是我职业生涯的第一个转折点。原来真诚，才是最高级的社交技巧。"},
      { text: "夸夸其谈", effects: { attributes: { wealth: 1, appearance: -1 } } , resultText: "我把简历上的经历放大了一倍，添油加醋地描述自己的'辉煌战绩'。对方笑着点头，但我看到他眼神里的敷衍。散场后，我连他的联系方式都没要到。牛皮吹得越大，摔得越惨——年轻的虚荣，给我上了现实的第一课。"},
    ],
  },
  {
    type: "parametric", id: "p_young_create", title: "沉眠欲深",
    description: "凌晨三点，你被一个绝妙的创意惊醒。你打开电脑，开始疯狂敲字。",
    minAge: createAge(20), maxAge: createAge(28),
    statRequirements: { creativity: 7 }, weight: 3, eventTags: ["creation", "lonely", "youth"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "通宵完成它", effects: { attributes: { creativity: 3, physique: -1 } } , resultText: "我灌下第三杯咖啡，手指在键盘上飞舞。窗外的天空从漆黑变成深蓝，又从深蓝变成鱼肚白。当我敲完最后一个字保存时，整个人瘫在椅子里，手都在抖。但看着屏幕上完整的方案，我觉得值了——那是我人生中第一个真正属于自己的作品。"},
      { text: "记录下来明天再说", effects: { attributes: { creativity: 1, physique: -1} } , resultText: "我打开备忘录快速记下了那个灵感的骨架，然后强迫自己关掉电脑。躺在床上，脑子里还在疯狂运转，所有细节争先恐后地涌现。第二天醒来，笔记上的几行字显得那么单薄——有些灵感就像夜里的梦，天亮就散了。"},
    ],
  },
  {
    type: "parametric", id: "p_young_health", title: "常明夜室",
    description: "你连续熬夜后病倒了。高烧中，你梦见月亮被阴影吞没。",
    minAge: createAge(20), maxAge: createAge(28),
    statRequirements: { physique: 3 }, weight: 2, eventTags: ["health", "physique"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "好好休养", effects: { attributes: { physique: 3, intelligence: -1} } , resultText: "我请了病假，把自己裹在被子里。母亲打来电话，听到我的声音沙哑，急得差点要买票过来。我笑着说没事，挂掉电话后鼻子一酸。原来在生病的时候，人才会承认自己不是铁打的。"},
      { text: "硬撑着继续工作", effects: { attributes: { physique: -2, intelligence: 1 } } , resultText: "我吞了两片退烧药，把电脑搬到床上继续改方案。额头发烫，视线模糊，但deadline不会等人。凌晨终于交稿时，我瘫倒在床上，感觉自己像一台过度运转后冒烟的机器——年轻的身体，原来也是有额度的。"},
    ],
  },
  {
    type: "parametric", id: "p_young_money", title: "错买饮食",
    description: "你心血来潮做了一笔投资，但标的不太对劲。",
    minAge: createAge(22), maxAge: createAge(30), weight: 1, eventTags: ["wealth", "comfort"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "及时止损", effects: { attributes: { wealth: -1, intelligence: 1 } } , resultText: "我看着账户里缩水的数字，心痛得不行。但还是在跌停前咬牙卖掉了——后来那只股票果然一路狂跌。朋友说我运气好，只有我知道，那不是什么运气，是学会了跟自己的贪欲和解。吃一堑，长一智。"},
      { text: "加倍投入博反弹", effects: { attributes: { wealth: -3, luck: -2 }, isLethal: false } , resultText: "我不信命，又投了一笔进去。盯着K线图的眼睛熬得通红，心脏随着数字的跳动忽上忽下。最后爆仓的那天，我蹲在出租屋的阳台上抽了一整包烟。赌徒心态，是年轻人最容易犯的错——而我用真金白银交了学费。"},
    ],
  },
  {
    type: "parametric", id: "p_young_snow_plum", title: "春陌云生",
    description: "寒冬腊月，你独自踏雪而行。天地苍茫间，一树红梅傲然绽放，像极了你不肯熄灭的理想。你伸手触碰花瓣，指尖的冰凉让你愈发清醒——原来美好，从来都需要穿越风雪才能遇见。",
    minAge: createAge(20), maxAge: createAge(26), weight: 2, eventTags: ["creation", "lonely"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "折一枝带回出租屋", effects: { attributes: { creativity: 2, luck: 1, physique: -1} } , resultText: "我把那枝红梅插在矿泉水瓶里，放在窗台上。简陋的出租屋因为这抹颜色，忽然有了生气。每天清晨醒来看到它，就觉得这座城市也不是那么冰冷——至少还有一朵花，是为你而开的。"},
      { text: "拍张照片继续赶路", effects: { attributes: { intelligence: 1, physique: 1, creativity: -1} } , resultText: "我掏出手机拍了张照片，然后把手缩回口袋，缩着脖子继续赶路。后来那张照片一直躺在相册里，每次翻到，都会想起那个冬天的早上——有一树梅花在风雪里开得那么好，而我匆匆路过了它。"},
    ],
  },
  {
    type: "parametric", id: "p_young_dim_lights", title: "城暮夜疏",
    description: "深夜的城市万家灯火，却没有一盏为你而亮。你站在天桥上，看车流如河，忽然意识到自己不过是这座城市里的一粒尘埃——但尘埃也有尘埃的骄傲，至少你还在路上。",
    minAge: createAge(22), maxAge: createAge(28), weight: 2, eventTags: ["lonely", "city", "creation"], maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "给自己买一碗热汤", effects: { attributes: { physique: 2, luck: 1, wealth: -1} } , resultText: "我走进街角那家还亮着灯的馄饨店。热汤下肚的瞬间，冻僵的手指和脚趾开始恢复知觉。老板多给我加了两颗馄饨，说'年轻人别太省'。我低头喝汤，热气模糊了眼镜——也模糊了眼眶。"},
      { text: "匿名给陌生人点一份外卖", effects: { attributes: { appearance: 1, luck: 1, wealth: -1} } , resultText: "我打开外卖软件，选了一家深夜还营业的店，匿名给备注里写着'加班到凌晨'的陌生人点了一份热粥。做完这件事，心里好像没那么空了——原来在陌生的城市里温暖另一个人，也是在温暖自己。"},
    ],
  },
  {
    type: "parametric", id: "p_young_drunken", title: "沉梦远逝",
    description: "你喝醉了，躺在出租屋的地板上。耳边回响着李白那句'仰天大笑出门去，我辈岂是蓬蒿人'——可你连明天的早会都还没准备。理想和现实之间，隔着一地空酒瓶。",
    minAge: createAge(20), maxAge: createAge(26),
    statRequirements: { creativity: 4 }, weight: 2, eventTags: ["social", "danger", "comfort"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "借着酒劲写一首诗", effects: { attributes: { creativity: 3, physique: -1 } } , resultText: "我拿起笔，字迹歪歪扭扭，但句子像洪水一样倾泻而出。写了什么已经记不太清了，只记得那些字里行间全是不甘——不甘平庸，不甘认命，不甘就这样在出租屋里老去。第二天醒来看到满纸潦草的诗句，笑了。酒后吐的真言，其实一直都在心底。"},
      { text: "洗把脸，明天还要上班", effects: { attributes: { intelligence: 1, wealth: 1, physique: -1} } , resultText: "我用冷水冲了把脸，看着镜子里狼狈的自己。那个意气风发的少年什么时候变成了这样？我深吸一口气，定好闹钟，关灯躺下。成年人的崩溃是无声的，也是有时限的——明天早会还要汇报，容不得你矫情太久。"},
    ],
  },
  {
    type: "parametric", id: "p_young_night_rain", title: "愁漫雨声",
    description: "职场如江湖。你被同事暗算背了黑锅，一个人在雨夜加班到凌晨。那些表面笑脸，不过是一场无声的厮杀。你盯着电脑屏幕，屏幕上的字渐渐模糊成一片——原来长大，就是学会咽下委屈。",
    minAge: createAge(22), maxAge: createAge(30),
    statRequirements: { intelligence: 2 }, weight: 3, eventTags: ["lonely", "creation", "pressure"], maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "收集证据，保护自己", effects: { attributes: { intelligence: 1, luck: 1, physique: -1} } , resultText: "我开始不动声色地保留邮件截图、聊天记录，整理每一个时间线。两个月后，当领导追责时，我拿出了完整的证据链。会议室里鸦雀无声——我没有报复任何人，只是学会了在这个江湖里保护好自己。"},
      { text: "忍一时风平浪静", effects: { attributes: { luck: 1, physique: 1, intelligence: -1} } , resultText: "我咽下了这口气，默默把黑锅背了。后来那个陷害我的同事又故技重施，终于被公司开除了。我庆幸自己没冲动，但也明白了一个道理——善良如果没有牙齿，就是软弱。忍一时风平浪静，退一步未必海阔天空。"},
    ],
  },
  {
    type: "parametric", id: "p_young_reforge", title: "残铓永生",
    description: "你失败了。你赌上一切的事，以惨败告终。你坐在河边，把石头狠狠扔进水里，溅起的水花打湿了你的脸。剑已断，可你还不想认输——因为你知道，真正的剑客不是从不倒下，而是每次倒下都能站起来。",
    minAge: createAge(22), maxAge: createAge(30), weight: 2, eventTags: ["career", "pressure", "will"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "从零开始，再来一次", effects: { attributes: { creativity: 3, luck: 1, physique: -1 } } , resultText: "我擦干眼泪，把所有的积蓄重新摊在桌上。这一次我什么都没有了，但也什么都不怕了。失败像一盆冷水，浇醒了我所有的幻想。我开始认真复盘每一个错误——真正的强者不是从不失败，而是把失败踩成台阶。"},
      { text: "换一条路走", effects: { attributes: { intelligence: 1, luck: 1, physique: -1} } , resultText: "我承认了——这条路走不通。不是认输，是换一条赛道。那些打不倒你的，确实会让你变得更强大——但前提是，你得懂得转弯。我收起残剑，走向了另一片江湖。谁规定一条路必须走到底呢？"},
    ],
  },
  {
    type: "parametric", id: "p_young_barefoot", title: "赤迈洋沙",
    description: "为了省下房租，你住在没有暖气的隔断间。清晨赤脚踩在冰冷的地板上，寒意从脚底窜到头顶。你咬了咬牙——今年冬天一定要撑过去。春天会来的，只要你不放弃。",
    minAge: createAge(19), maxAge: createAge(25), weight: 1, eventTags: ["travel", "adventure", "physique"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "咬牙坚持", effects: { attributes: { physique: 3, wealth: 1, luck: -1} } , resultText: "我买了一条最厚的棉被，晚上裹着它看书。早上闹钟一响，赤脚踩在冰冷的地板上，那股寒意从脚底窜到头顶，人也彻底清醒了。我在日历上画了一个圈——'春天来的那天，我要去吃一顿火锅'。这个念头支撑我熬过了整个冬天。"},
      { text: "向家里求助", effects: { attributes: { wealth: 2, luck: -1 } } , resultText: "我拨通了家里的电话，听到母亲声音的那一刻，眼泪不争气地掉了下来。我说'妈，最近手头有点紧'，她二话不说就转了钱。挂掉电话后我看着那条转账记录发了很久的呆——二十多岁了还在让父母操心，愧疚比寒冷更让人难受。"},
    ],
  },
  {
    type: "parametric", id: "p_young_star_chase", title: "采梦云上",
    description: "你报名了一个看似遥不可及的比赛。报名表上的截止日期刺眼地提醒着你——离截止只有三天。周围人都说你疯了，可你偏要试试。万一呢？万一那颗星星，真的能被你摘到呢？",
    minAge: createAge(20), maxAge: createAge(27),
    statRequirements: { creativity: 5 }, weight: 2, eventTags: ["creation", "adventure"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "通宵三天也要完成", effects: { attributes: { creativity: 3, physique: -1 } } , resultText: "我把窗帘拉上，切断了和外界的所有联系。困了就趴十分钟，醒了继续。第三天凌晨，当我点击'提交'按钮的那一刻，整个人虚脱般倒在键盘上。显示器散发着微弱的光，像一颗终于被摘到的星星，虽然微小，却是我自己的光。"},
      { text: "理性评估，量力而行", effects: { attributes: { intelligence: 1, creativity: 1, physique: -1} } , resultText: "我拿出纸笔，认真分析了参赛需要的时间和能力，最后决定——暂时放弃。不是懦弱，是把这次冲动转化为下一年的积累。我在计划本上写下：'等我准备好了，一定会来。'少年人的热血不一定要在当下挥洒，沉淀后的力量才更持久。"},
    ],
  },
  {
    type: "parametric", id: "p_young_upstream", title: "船没远驶",
    description: "同期入职的朋友已经开始躺平，而你还在咬牙进修。深夜的图书馆里，只有你的台灯还亮着。你揉了揉酸涩的眼睛，翻开下一页。不进则退，你不想退——因为你知道，所有看似无用的努力，都在悄悄塑造未来的你。",
    minAge: createAge(20), maxAge: createAge(28), weight: 3, eventTags: ["travel", "adventure", "pressure"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "坚持学下去", effects: { attributes: { intelligence: 1, physique: -1 } } , resultText: "眼皮在打架，咖啡已经喝到第三杯。身边的座位一个个空了，只有头顶那盏灯还亮着。我揉了揉发酸的眼睛，在笔记本上又写了一页。走出图书馆时已经是深夜，路灯把我的影子拉得很长——但我在这条路上，每一步都算数。"},
      { text: "休息一天，别太累", effects: { attributes: { physique: 2, intelligence: 1, wealth: -1} } , resultText: "我合上书本，去操场走了几圈。晚风很凉，吹散了脑中的混沌。回来后又翻了几页书，效率反而比硬撑着高了许多。原来有时候，停下来是为了走得更远——这个道理我用了很久才真正明白。"},
    ],
  },
  {
    type: "parametric", id: "p_young_drifting", title: "草茂叶生",
    description: "你又搬家了。这已经是毕业后的第五个住处。打包行李时你忽然想不起来——'家'到底在哪里。你看着房间里渐渐空掉的墙壁，有些恍惚。浮萍虽无根，却也能在漂泊中开出花来。",
    minAge: createAge(20), maxAge: createAge(27), weight: 2, eventTags: ["growth", "travel"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "给老家的父母打个电话", effects: { attributes: { luck: 1, creativity: 2, wealth: -1} } , resultText: "电话响了两声就接通了，仿佛母亲一直在等。我没说搬家的事，只是问她最近身体怎么样。她絮絮叨叨说了很多——院子里的柿子树今年结了很多果，隔壁家的狗又生了。我听着听着就笑了，原来无论搬到哪里，电话那头的声音就是家的坐标。"},
      { text: "在新家种一盆植物", effects: { attributes: { physique: 1, luck: 1, wealth: -1} } , resultText: "我在楼下的花店买了一盆绿萝，放在新房间的窗台上。给它浇水的时候，忽然觉得这个陌生的房间有了一点烟火气。植物不会说话，但它倔强地绿着，好像在替我给这座城市——我打算在这里待下去了。"},
    ],
  },
  {
    type: "parametric", id: "p_young_butterfly", title: "出明羽身",
    description: "你终于走出了舒适区。那个曾经在人群中不敢说话的自己，现在站在讲台上侃侃而谈。台下的掌声响起时，你忽然有点想哭——原来破茧的痛，是为了飞翔的这一刻。所有的怯懦，都化作了翅膀上的鳞粉。",
    minAge: createAge(22), maxAge: createAge(30),
    statRequirements: { appearance: 3 }, weight: 3, eventTags: ["social", "appearance"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "接受更大的挑战", effects: { attributes: { appearance: 4, luck: 1, physique: -1 } } , resultText: "我接下了一个难度远超我能力范围的项目。准备方案的那几周，我每天只睡四五个小时，PPT改了十几版。汇报那天，我从头到尾讲完后，台下响起了掌声。那一刻我忽然明白——成长不是准备好了才出发，而是出发了才能准备好。"},
      { text: "享受这个时刻", effects: { attributes: { appearance: 2, luck: 1, wealth: -1} } , resultText: "我站在镜子前，看着那个坦然微笑的自己。从前的我从不敢直视自己的眼睛。我给妈妈打了个电话，说'妈，我今天在台上讲话没有发抖'。她在电话那头笑了很久。我知道这只是开始，但至少——我终于迈出了那一步。"},
    ],
  },
  {
    type: "parametric", id: "p_young_moon_toast", title: "愁满夜深",
    description: "又是一个人的生日。你给自己买了瓶酒，对着窗外的月亮碰杯。孤独吗？也许吧。但也自由。你忽然理解了李白为什么总是一个人喝酒——有些路，注定要一个人走；有些月光，只属于独自仰望的人。",
    minAge: createAge(22), maxAge: createAge(29), weight: 1, eventTags: ["social", "lonely"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "写下给自己的信", effects: { attributes: { creativity: 2, luck: 1, wealth: -1} } , resultText: "我打开手机备忘录，写下：'亲爱的自己，今天你25岁了。你一个人在这座城市，一事无成，但又拥有一切可能。'写完后我读了一遍，又读了一遍，眼泪不知道什么时候流了下来。月光洒在屏幕上，那些字亮晶晶的，像星星。"},
      { text: "找个朋友视频聊天", effects: { attributes: { appearance: 2, luck: 1, wealth: -1} } , resultText: "我拨通了老友的视频，屏幕那头的他也刚下班，脸上的疲惫和我一模一样。我们隔着屏幕干了一杯——他喝啤酒，我喝二锅头。聊到凌晨两点，从理想到现实，从过去到未来。挂掉电话时，孤独还在，但没那么重了。"},
    ],
  },
  {
    type: "parametric", id: "p_young_forest", title: "策马云山",
    description: "你接到了一个需要去陌生城市的offer。前途未卜，但心里有团火在烧。你想起小时候看过的武侠片——少年提剑入江湖，凭的就是一腔孤勇。你不知道前方是什么，但你知道，不去会后悔一辈子。",
    minAge: createAge(19), maxAge: createAge(26),
    statRequirements: { physique: 3, creativity: 3 }, weight: 2, eventTags: ["travel", "adventure", "nature"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "义无反顾地出发", effects: { attributes: { creativity: 3, luck: 1, wealth: -2 } } , resultText: "我递了辞呈，拖着行李箱去了那座陌生的城市。出站的那一刻，潮湿的海风扑面而来，我深吸了一口气——这味道里有未知，有自由，也有一丝恐惧。我给朋友发了条消息：'我到了。'然后关掉手机，走进了那片属于我的森林。"},
      { text: "做好万全准备再走", effects: { attributes: { intelligence: 1, wealth: 2, physique: -1} } , resultText: "我没有急着走，而是先在网上了解了那座城市的情况，存够了半年的房租，甚至提前联系了几个可能的住处。当终于坐上火车时，我比想象中平静。年少时的冲动很美，但深思熟虑后的出发，才是成年人该有的勇敢。"},
    ],
  },
];

export const YOUTH_LETHAL_EVENTS: ParametricEvent[] = [
  // ══ 新增：青年期即死事件 18-30 ══
  {
    type: "parametric", id: "p_young_motor", title: "驰没远山",
    description: "朋友新买了摩托车，说带你去兜风。引擎轰鸣声中，他把头盔递给你：'上来吧，带你感受一下什么叫自由。'车速表已经指向了 120。",
    minAge: createAge(19), maxAge: createAge(25), weight: 2, eventTags: ["danger", "accident", "travel"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "戴上头盔上车", effects: { attributes: {}, isLethal: true }, resultText: "风在耳边尖叫，路灯的光连成一条线。弯道来得太急——我甚至没来得及喊出声。摩托车撞上了护栏，世界在金属与火花的交响中戛然而止。" },
      { text: "摆手拒绝，太危险了", effects: { attributes: { intelligence: 1, physique: 1, wealth: -1} }, resultText: "我接过头盔看了看——上面有划痕。我把头盔还给他：'下次吧，我今天还有事。'后来听说他出了车祸。我摸了摸自己的脑袋，还在。" },
    ],
  },
  {
    type: "parametric", id: "p_young_blood", title: "持命应生",
    description: "你连续加班一周后开始咳血。凌晨三点的医院走廊空无一人，你满嘴铁锈味，手里捏着一张写着'CT平扫'的单子。医生说可能是肺炎、也可能是肺结核——也可能是更糟的东西。",
    minAge: createAge(20), maxAge: createAge(28), weight: 2, eventTags: ["health", "illness", "danger"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { physique: 3 },
    choices: [
      { text: "吃抗生素硬撑，项目不能断", effects: { attributes: {}, isLethal: true }, resultText: "我把药往嘴里一塞，继续赶那份明天要交的PPT。第三天同事发现我倒在办公桌前——呼吸已经停了。医生说年轻人心肺衰竭的原因很简单：对命运的透支，超过了生命的限额。" },
      { text: "请假住院彻底治疗", effects: { attributes: { physique: -1, wealth: -1, luck: 1 } }, resultText: "我请了两周病假，每天输液、吃药、看窗外那棵树从枯枝长到发芽。出院时我用沙哑的声音对医生说谢谢。命只有一条——这个道理，咳了血才真正学到。" },
    ],
  },
  {
    type: "parametric", id: "p_young_river", title: "春末夜深",
    description: "有人在河边喊救命。河水很急，那个身影在水中挣扎。你环顾四周——附近没有别人。",
    minAge: createAge(20), maxAge: createAge(28), weight: 2, eventTags: ["danger", "accident", "water"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "跳下去救人", effects: { attributes: {}, isLethal: true }, resultText: "我蹬掉鞋子跳了进去。水太冷了，瞬间吸走了所有力气。我抓到那个人的衣角，但暗流把我们两个一起拖了下去。救命声渐渐消失了，河水恢复了平静。" },
      { text: "跑去找竹竿和绳索", effects: { attributes: { intelligence: 1, luck: 1, appearance: 2, physique: -1} }, resultText: "我没有慌。冲到旁边的工棚找到一根长竹竿和绳索，跑回来的时候那人已经快沉下去了。我趴在岸边把竹竿伸过去——他抓住了。两个人在岸边喘了很久，然后都笑了。" },
    ],
  },
  {
    type: "parametric", id: "p_young_drugs", title: "沉眠欲碎",
    description: "酒吧里，一个陌生人递过来一粒药丸：'试试这个，比喝酒有意思多了。'灯光闪烁中，你看不清他的表情。周围的人都在看着你——'怂了？'",
    minAge: createAge(18), maxAge: createAge(25), weight: 1, eventTags: ["danger", "addiction"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "一口吞下那粒药丸", effects: { attributes: {}, isLethal: true }, resultText: "药丸卡在嗓子眼——然后一股热流冲进脑子。有人在喊叫，有人在呕吐。我的身体像被扔进搅拌机——然后意识溶解了。法医后来说是劣质毒品导致的心脏骤停。" },
      { text: "把药丸扔进垃圾桶", effects: { attributes: { intelligence: 1, luck: 1, physique: -1} }, resultText: "我捏着那粒药丸，在所有人的注视下把它丢进垃圾桶。有人说我没种，我转过身直视他的眼睛：'你说的对。'那晚我走回家的时候，街道安静极了——我第一次觉得这种安静是我自己捡回来的。" },
    ],
  },
  {
    type: "parametric", id: "p_young_gamble", title: "赤没银山",
    description: "有人拉你去地下赌场。前几把你赢了小钱，带你来的人拍着你的肩膀：'今晚是你的幸运夜！'他示意你下一把大的——把全部身家押上。",
    minAge: createAge(22), maxAge: createAge(30), weight: 2, eventTags: ["wealth", "risk", "luck"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 4 },
    choices: [
      { text: "一把梭哈，赢了翻身", effects: { attributes: { wealth: -18, luck: -3 }, isLethal: false }, resultText: "我推上所有筹码。开牌的瞬间我闭了一下眼——不是赢。走出赌场的时候口袋空了，连坐公交的硬币都没剩下。走了两小时回家，一路上都在想那个笑吟吟的荷官。他不是在祝福我，是在等我跳下去。" },
      { text: "见好就收，拿钱走人", effects: { attributes: { wealth: 2, intelligence: 1, physique: -1} }, resultText: "我把赢来的零钱装进口袋，起身就走。'再坐一会儿嘛'——我摆摆手，头也不回。外面的冷风吹在脸上，我摸了摸兜里的钞票。今晚赢了，但真正的赢是知道什么时候该走。" },
    ],
  },
  {
    type: "parametric", id: "p_young_hike", title: "赤没雨深",
    description: "独自徒步时你偏离了主路，走进了一片未曾走过的峡谷。GPS没有信号，天色渐暗，干粮只剩半块压缩饼干。两条路：继续往前找出口，或者原路返回——但原路要经过一片夜间可能有野兽的树林。",
    minAge: createAge(20), maxAge: createAge(27), weight: 1, eventTags: ["travel", "adventure", "danger"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { physique: 4 },
    choices: [
      { text: "继续往前走，赌一把", effects: { attributes: {}, isLethal: true }, resultText: "我沿着峡谷越走越窄，最后走到了悬崖边缘。试着往下爬——岩石在手心滑脱，我坠入了黑暗中。三天后搜救队在谷底找到了我。那个峡谷，当地人叫它'回不来'。" },
      { text: "原路返回，保持谨慎", effects: { attributes: { intelligence: 1, physique: 1, luck: 1, creativity: -1} }, resultText: "我咬咬牙转身往回走。穿过那片树林时远处有动物在叫，我攥紧登山杖走得很快。到主路时天已全黑，手电筒的光打在前方路面上——安全了。冒险很酷，但活着回来更酷。" },
    ],
  },
  {
    type: "parametric", id: "p_young_lightning", title: "沉明雨势",
    description: "暴雨如注，你骑车经过一片空旷的农田。天空被紫光撕裂，雷声越来越近。你看见前方有个公交站亭——但那只有铁皮顶棚，可能更招雷。",
    minAge: createAge(19), maxAge: createAge(26), weight: 2, eventTags: ["danger", "accident", "luck"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "冲向公交站亭躲雨", effects: { attributes: {}, isLethal: true }, resultText: "雷击在一瞬间。有人说被雷电击中的人会先听到一声巨大的蜂鸣——然后世界从彩色退成了黑白。我的自行车倒在路中间，车轮还在转。" },
      { text: "趴在路边的低洼处", effects: { attributes: { physique: -1, intelligence: 1 } }, resultText: "我跳下自行车，趴在路边排水沟的泥水里。雷声在头顶炸裂——那道闪电击中了我刚才骑车的位置。泥水浸透了衣服，冷得发抖，但我活着。在泥里打了个滚爬起来，笑着继续骑。" },
    ],
  },
  {
    type: "parametric", id: "p_young_tide", title: "潮没影深",
    description: "退潮时你走过沙滩去对面的礁石岛赶海。玩得太投入没注意涨潮的速度。当你抬起头——来时的路已经被淹没了半米深，潮水还在涨。",
    minAge: createAge(20), maxAge: createAge(27), weight: 1, eventTags: ["danger", "accident", "travel"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "趁着还没淹太高，赶紧游回去", effects: { attributes: {}, isLethal: true }, resultText: "我跳进水里，冰冷的海水让我倒吸一口气。游到一半时一个浪头打过来——方向感全乱了。海岸线在眼前摇晃，然后下沉、消失。我被暗流拖进了深水区。" },
      { text: "爬上礁石高处呼救", effects: { attributes: { luck: 1, physique: 1, intelligence: -1} }, resultText: "我手脚并用地爬上最高的那块礁石，掏出手机——还有一格信号。救援快艇二十分钟后到了，开船的大叔一边抛救生圈一边骂我不看潮汐表。我缩在船尾裹着毯子，冷，但活着。" },
    ],
  },
];

export const LOVE_PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ══ 爱情事件（情圣成就扩展）══
  {
    type: "parametric", id: "p_love_unrequited", title: "春梦雨散",
    description: "你喜欢的那个人今天在朋友圈官宣了——不是跟你。你刷到那条动态的时候正在吃泡面，筷子停在半空中整整十秒。窗外下着小雨，你忽然理解了为什么古人说'多情却被无情恼'。",
    minAge: createAge(19), maxAge: createAge(24), weight: 2, eventTags: ["love", "lonely", "creation"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "默默删掉对话框和照片", effects: { attributes: { creativity: 2, appearance: 1, physique: -1} }, resultText: "我把聊天记录从头翻到尾——那些秒回的、转账的、凌晨两点的、对方只回了一个'嗯'的。然后点了删除键。删除只需要一秒钟，但接受'我从来没有在那个人的未来里存在过'，需要的时间比想象中长得多。雨停之后我出门走了很远——走到路灯都亮了又灭了。" },
      { text: "发一条仅自己可见的朋友圈", effects: { attributes: { creativity: 2, luck: 1, wealth: -2} }, resultText: "我在朋友圈编辑框里打了五百多个字——从初见写到此刻。每一个字都像从身体里抠出来的。然后设置为'仅自己可见'。发出去的那一刻眼泪滴在屏幕上。那段文字我后来再没打开看过——但我知道它一直在那里，像一枚埋在身体里的子弹。" },
    ],
  },
  {
    type: "parametric", id: "p_love_reunion", title: "迟梦永生",
    description: "多年后的同学会上，你见到了当年那个人。对方胖了一点、笑得没那么好看了——身上的光环也似乎褪尽了。有人说TA最近刚离婚，过得不怎么好。你们的目光在人群里碰了一下，然后各自移开了。",
    minAge: createAge(28), maxAge: createAge(38), weight: 2, eventTags: ["love", "social"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "走过去，敬TA一杯\"敬往事\"", effects: { attributes: { creativity: 2, appearance: 2, luck: 1, wealth: -3} }, resultText: "我端着杯子走过去说：'这些年你还好吗？'——开场白很老套，但我找不到更好的了。我们聊了很久，从工作到生活，从过去的误解到现在的不易。散场时TA说：'其实我以前也有点喜欢你，只是那时候说不出口。'我在停车场站了很久，对着手机屏幕笑了笑——有些答案，等了很多年。但来了就好。" },
      { text: "远远看着，不打扰", effects: { attributes: { intelligence: 1, luck: 1, physique: -1} }, resultText: "我站在人群的另一侧，没有走过去。有那么一瞬间我想迈开步子——但脚像钉在了原地。散场后回家的路上，广播里放了一首老歌，是当年TA最喜欢的那首。我调高了音量，跟着哼了几句。有些人的意义不在于重逢，而在于他们曾经如何在你的青春里留下过痕迹。" },
    ],
  },
];

