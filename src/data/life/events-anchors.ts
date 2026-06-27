// src/data/life/events-anchors.ts
import type { AnchorEvent } from "../../engine/types";
import { createAge } from "../../engine/types";

export const ANCHOR_EVENTS: AnchorEvent[] = [
  // ── 婴幼期 0-5 ──
  {
    type: "anchor", id: "a_birth", title: "初明夜色",
    description: "你诞生在这个世界上。第一声啼哭撕破了新乡夜晚的宁静，产房里灯火通明。母亲疲惫却温柔地笑着，父亲握着她的手，眼眶湿润。你的故事，从这声啼哭开始。",
    minAge: createAge(0), maxAge: createAge(0), triggerAge: 0,
    choices: [{ text: "（自动）", effects: { attributes: { physique: 2, luck: 2 } } , resultText: "你呱呱坠地，第一声啼哭撕破了产房的宁静。护士熟练地将你擦净裹进襁褓，母亲在产床上虚弱地笑了，父亲握着她的手，眼眶泛红。"}],
  },
  {
    type: "anchor", id: "a_firstword", title: "初鸣语声",
    description: "你学会说第一个字。大人们围着你，屏住呼吸，期待着一个奇迹。你含糊不清地喊出了'妈妈'，整个世界都笑了。",
    minAge: createAge(1), maxAge: createAge(1), triggerAge: 1,
    choices: [{ text: "（自动）", effects: { attributes: { intelligence: 2, creativity: 1 } } , resultText: "我沉浸在黑白世界里，琢磨着每一步的玄机。老师说我有天赋，我心里偷偷高兴。我渐渐明白，棋盘上的每一颗子都有自己的脾气，而我在学会跟它们相处。"}],
  },
  {
    type: "anchor", id: "a_dimu", title: "慈目盈视",
    description: "你第一次清晰地认出母亲的脸。那双温暖的眼睛、那个熟悉的声音——原来这就是'妈妈'。你伸出小手想要触碰她的笑容，她把你紧紧抱在怀里。你的世界从此有了名字。",
    minAge: createAge(2), maxAge: createAge(2), triggerAge: 2,
    choices: [{ text: "（自动）", effects: { attributes: { luck: 2, appearance: 1 } } , resultText: "我敷衍地落下几颗子，心思早飞到窗外去了。围棋对我来说不过是另一种游戏——会下就行，何必认真。老师叹了口气，没再说什么。"}],
  },
  {
    type: "anchor", id: "a_kindergarten", title: "彩墨幼时",
    description: "你进入幼儿园。老师发给你一盒蜡笔，你毫不犹豫地在纸上画了一个歪歪扭扭的太阳。手心上沾满了彩色颜料，你觉得这比任何玩具都有趣。",
    minAge: createAge(3), maxAge: createAge(3), triggerAge: 3,
    choices: [{ text: "（自动）", effects: { attributes: { intelligence: 1, creativity: 1 } } , resultText: "我一头扎进书本里，第一次觉得知识是有趣的。数学的严谨、语文的浪漫——我像一块海绵，贪婪地吸收着一切。排名在不知不觉中爬升。"}],
  },
  {
    type: "anchor", id: "a_panlan", title: "初迈幼身",
    description: "你扶着公园的栏杆，颤颤巍巍地站了起来。世界在你的眼中忽然变得高大而陌生。你松开手，迈出第一步——然后跌坐在地上。你没有哭，又爬了起来。远处母亲张开双臂等着你。",
    minAge: createAge(4), maxAge: createAge(4), triggerAge: 4,
    choices: [{ text: "（自动）", effects: { attributes: { physique: 2, creativity: 1 } } , resultText: "我主动和前后左右的同学搭话，很快就交到了一群朋友。放学后大家一起涌向小卖部，我请客的次数多了，零花钱流水般花出去，但那种被簇拥的感觉让我着迷。"}],
  },
  {
    type: "anchor", id: "a_child_end", title: "纯梦永生",
    description: "你五岁了。你指着夜空中最亮的那颗星星问妈妈：'星星上面有人吗？'妈妈笑着把你举过头顶。你眯着眼睛，仿佛看到了星河彼岸。那一夜你做了一个梦——梦里你乘着一只纸船，顺着月光漂流，去往了宇宙的尽头。",
    minAge: createAge(5), maxAge: createAge(5), triggerAge: 5,
    choices: [{ text: "（自动）", effects: { attributes: { intelligence: 2, creativity: 2 } } , resultText: "我咬咬牙跳进齐腰深的水里，帮着邻居搬运沙袋和物资。浑浊的洪水冰冷刺骨，我咬着牙一趟又一趟地往返。后来听说那次抗洪救了不少物资，我也因此受到了表扬。"}],
  },

  // ── 少年期 6-17 ──
  {
    type: "anchor", id: "a_primary", title: "初明应试",
    description: "你进入小学。第一次考试，你握紧铅笔，手心出汗。",
    minAge: createAge(6), maxAge: createAge(6), triggerAge: 6,
    choices: [
      { text: "认真答题", effects: { attributes: { intelligence: 3 } } , resultText: "我安顿好自己，躲在高处的安全地带。看着楼下奔涌的洪水，我暗暗庆幸还好自己没事。虽然没有人责怪我，但我心里某个角落，总觉得有些说不上来的愧疚。"},
      { text: "偷偷看同桌", effects: { attributes: { intelligence: 1, luck: -2 } } , resultText: "我站上讲台组织班会，声音从微微颤抖到逐渐沉稳。我学会了在嘈杂中掌控局面，在冲突中调解矛盾。同学们开始信任我，我也开始相信自己。"},
    ],
  },
  {
    type: "anchor", id: "a_go_start", title: "揣猫一身",
    description: "你开始学围棋。黑白棋子如星辰布阵，你第一次体会到'势'的感觉。",
    minAge: createAge(7), maxAge: createAge(7), triggerAge: 7,
    choices: [
      { text: "专心学棋", effects: { attributes: { intelligence: 2, creativity: 2 } } , resultText: "我把全部精力都放在课本和习题上，两耳不闻窗外事。成绩一路飙升，我成了老师口中的“别人家的孩子”。只是某天我抬头环顾教室，发现同学们讨论的话题，我一句都插不上。"},
      { text: "只想随便玩玩", effects: { attributes: { intelligence: 1 } } , resultText: "那两天我几乎没怎么合眼，笔芯用掉了三根。交卷的那一刻，手抖得几乎握不住笔。但我把十二年所学的一切都倾泻在了答卷上——无论结果如何，我无愧于心。"},
    ],
  },
  {
    type: "anchor", id: "a_mid_school", title: "驰马野山",
    description: "你进入初中。新的环境，新的同学，你感到自己正在加速成长。",
    minAge: createAge(12), maxAge: createAge(12), triggerAge: 12,
    choices: [
      { text: "努力学习", effects: { attributes: { intelligence: 3, creativity: 1 } } , resultText: "进考场前，我深呼吸了三次。遇到不会的题也没有慌张，跳过、回头、再试。最后一道作文题我写得格外顺畅——也许放松的心态反而让脑子更清醒了。"},
      { text: "多交朋友", effects: { attributes: { appearance: 2, wealth: 1 } } , resultText: "我紧紧抱住母亲，闻到她发间熟悉的味道。她瘦了。我在她耳边说'妈，我会经常回来的'，她笑着点头，眼眶却红了。火车开动后我哭了很久，但心里有一个声音在说：你要对得起这份牵挂。"},
    ],
  },
  {
    type: "anchor", id: "a_flood", title: "踩没雨水",
    description: "7·21 新乡特大暴雨。洪水吞噬了街道，你趟过齐腰深的水，帮助邻居搬运物资。",
    minAge: createAge(14), maxAge: createAge(14), triggerAge: 14,
    choices: [
      { text: "全力抗洪救灾", effects: { attributes: { physique: 3, luck: 2 } } , resultText: "我没有回头。不是不想，是不敢——我怕一回头就再也走不动了。后来母亲在电话里说，她在站台上一直站到火车看不见。我挂掉电话，去图书馆待到闭馆。只有把所有的力气都用在学习上，才能不去想那个越来越远的背影。"},
      { text: "保自己安全为先", effects: { attributes: { physique: 1 } } , resultText: "我走到她面前，心脏快要从嗓子眼跳出来。我说'我喜欢你'，声音小得连自己都听不清。她愣了一下，然后笑了。那个笑容比图书馆窗边的阳光还要明亮——无论答案是什么，这一刻我都会记一辈子。"},
    ],
  },
  {
    type: "anchor", id: "a_high_school", title: "沉默预说",
    description: "进入高中。你担任了班干部，学会了在沉默中观察，在关键时表达。",
    minAge: createAge(15), maxAge: createAge(15), triggerAge: 15,
    choices: [
      { text: "积极管理班级", effects: { attributes: { appearance: 2, intelligence: 1 } } , resultText: "我把那三个字咽了回去，连同那个午后的阳光一起锁进日记本里。后来每次在图书馆遇见TA，我都假装在看窗外。暗恋是一场一个人的兵荒马乱，而我是唯一的士兵和唯一的逃兵。"},
      { text: "专注自己学业", effects: { attributes: { intelligence: 3 } } , resultText: "我脱下学士服，换上正装，挤进早高峰的地铁。办公室的格子间比宿舍的书桌还小，但我觉得自己像一头准备冲撞世界的公牛。第一份工作的工牌挂在胸前，沉甸甸的——那是名为'大人'的入场券。"},
    ],
  },

  // ── 青年期 18-30 ──
  {
    type: "anchor", id: "a_gaokao", title: "出马应试",
    description: "高考。十二年磨一剑，你走进考场，笔尖落纸的声音像千军万马。",
    minAge: createAge(18), maxAge: createAge(18), triggerAge: 18,
    choices: [
      { text: "全力以赴", effects: { attributes: { intelligence: 5, luck: 2 } } , resultText: "当同学们忙着投简历时，我回到图书馆的老位置坐下。窗外还是那棵银杏树，只是叶子又黄了一次。我知道自己在逃避什么——但也知道自己在追寻什么。读书是一场漫长的修行，而我还不想下山。"},
      { text: "心态平和，尽力就好", effects: { attributes: { intelligence: 3, creativity: 2 } } , resultText: "你开始习惯在凌晨醒来，脑子里排满一整天的日程。房贷、父母的体检费、孩子的辅导班——这些数字压在你肩上，却也让你感到前所未有的踏实。原来被需要，也是一种力量。"},
    ],
  },
  {
    type: "anchor", id: "a_university", title: "辞母远送",
    description: "你离开家乡上大学。母亲在车站挥手的身影越来越小，你第一次真正感到'独立'的重量。",
    minAge: createAge(19), maxAge: createAge(19), triggerAge: 19,
    choices: [
      { text: "拥抱母亲，承诺常回家", effects: { attributes: { creativity: 2, luck: 2 } } , resultText: "你婉拒了那个升职的机会，推掉了几个应酬。朋友们都说你疯了，但你心里清楚——有些风景，过了这个年纪就再也看不到了。你背着包去了年轻时想去的地方，在异乡的街头，给家里打了一个长长的电话。"},
      { text: "头也不回地走", effects: { attributes: { intelligence: 3, wealth: -1 } } , resultText: "你带着团队拿下了那个最难啃的项目。庆功宴上大家轮流敬酒，你笑着喝了一杯又一杯，胃里翻江倒海，面上不动声色。散场后你一个人坐在车里，揉了揉太阳穴——高处不胜寒，但你还没打算下来。"},
    ],
  },
  {
    type: "anchor", id: "a_love_first", title: "春梦一时",
    description: "第一次心动。那个人出现在图书馆的窗边，阳光正好。",
    minAge: createAge(20), maxAge: createAge(22), triggerAge: 20,
    choices: [
      { text: "鼓起勇气表白", effects: { attributes: { appearance: 2, luck: 3 } } , resultText: "你推掉了几个可有可无的会议，一个人在美术馆里待了一下午。站在那幅巨大的油画前，你突然意识到，这些年你一直在赶路，却忘了问自己要去哪里。手机亮了一下，你没有接。"},
      { text: "默默藏在心里", effects: { attributes: { creativity: 2 } } , resultText: "你把资金撤出了高风险项目，给全家买了更全面的保险。老同学笑你太保守，你只是笑笑——他们不知道，你夜里常常惊醒，满身冷汗。这个年纪，输不起了。"},
    ],
  },
  {
    type: "anchor", id: "a_graduate", title: "岔陌云深",
    description: "大学毕业了。同窗四散，各奔前程。你站在校门口，不知道下一步该往哪里走。",
    minAge: createAge(22), maxAge: createAge(23), triggerAge: 22,
    choices: [
      { text: "投身职场，大干一场", effects: { attributes: { wealth: 3, intelligence: 2 } } , resultText: "你抵押了房子，投进一个外人看不懂的方向。妻子沉默了一整晚，第二天早上给你下了碗面。你吃着面，眼泪差点掉进碗里——你知道，这一局，不只是为了赢。"},
      { text: "继续深造，充实自己", effects: { attributes: { intelligence: 4, creativity: 1 } } , resultText: "你在退休申请上签了字，放下笔的那一刻，手有些抖。整理办公桌时翻出二十年前的名片，上面的自己意气风发。你把名片夹进笔记本，轻轻合上——这一页，翻过去了。"},
    ],
  },

  // ── 壮年期 31-60 ──
  {
    type: "anchor", id: "a_mid_thirty", title: "承命应世",
    description: "三十岁了。你站在人生的十字路口，肩上扛着家庭、事业和社会的期待。少年意气渐褪，中年的担当正要开始。父母开始变老，孩子正在长大，而你还在学着做一个合格的大人。",
    minAge: createAge(31), maxAge: createAge(31), triggerAge: 31,
    choices: [
      { text: "扛起责任，一往无前", effects: { attributes: { physique: 2, wealth: 2, intelligence: 1 } } , resultText: "你拒绝了公司的退休方案，转身接了一个谁都不看好的咨询项目。老部下劝你歇歇，你说：'歇？我这一辈子就没学会怎么歇。'屏幕的光映在你花白的头发上，你的眼睛却比年轻人还亮。"},
      { text: "再给自己几年自由", effects: { attributes: { creativity: 2, luck: -1 } } , resultText: "你在阳台上种了满架的花，每天浇水、剪枝、看日落。老伴说你终于像个正常人了。你哈哈大笑，笑声在黄昏的小区里回荡——这一生的拼命，不就是为了这一刻的安宁吗？"},
    ],
  },
  {
    type: "anchor", id: "a_mid_peak", title: "仓满盈实",
    description: "事业如日中天。你站在办公室的落地窗前，俯瞰这座城市，想起当年那个懵懂的少年。",
    minAge: createAge(35), maxAge: createAge(40), triggerAge: 38,
    choices: [
      { text: "乘胜追击，再上一层", effects: { attributes: { wealth: 5, physique: -1 } } , resultText: "你报了老年大学的书法班，每周三下午准时去上课。同学们都比你年轻，但你不在乎。笔尖落在宣纸上的那一刻，你觉得自己才刚开始活明白。"},
      { text: "开始思考人生的意义", effects: { attributes: { creativity: 3, luck: 2 } } , resultText: "你闭上眼，这一生的画面如走马灯般闪过。那些欢笑、泪水、遗憾和骄傲，都在这一刻化作了嘴角的一抹微笑。夕阳很暖。"},
    ],
  },
  {
    type: "anchor", id: "a_mid_midgame", title: "残没云深",
    description: "四十五岁，人生如棋至中盘。父母的白发多了，孩子的个头高了，你在中间承受着来自两头的重量。某天深夜你从医院陪床回来，对着后视镜里疲惫的自己问：下半场，该怎么走？",
    minAge: createAge(45), maxAge: createAge(45), triggerAge: 45,
    choices: [
      { text: "求稳，守住已有一切", effects: { attributes: { wealth: 3, physique: -1, luck: 2 } } , resultText: "你想起了那本只写了一半的书、那个搁置多年的计划。心中涌起一股不甘——但随即又平静下来。有遗憾，才是真实的人生。"},
      { text: "大胆落子，再搏一局", effects: { attributes: { creativity: 3, wealth: -2, luck: -1 } } , resultText: "你抱着孙儿，从童年的萤火虫讲起，一直讲到鬓角的白发。小家伙睁大了眼睛，在你怀里安静下来。你忽然明白——生命就是这样，一代又一代，故事连着故事。"},
    ],
  },
  {
    type: "anchor", id: "a_mid_halfwar", title: "驰马一生",
    description: "五十岁，知天命之年。你回望半生——那些奋斗过的日夜、喝过的酒、熬过的苦，都化作了鬓边的白发和眼中的沉静。你终于明白有些事强求不来，有些人留不住，有些路只能走一次。",
    minAge: createAge(50), maxAge: createAge(50), triggerAge: 50,
    choices: [
      { text: "功成身退，颐养天年", effects: { attributes: { luck: 3, physique: 2 } } , resultText: "你看着孙儿在玩具堆中笑闹，心里却泛起一丝复杂。物质的丰裕固然重要，但你更希望他长大后能记得这个午后——记得爷爷看他的眼神。你的手轻轻抚过他的头。"},
      { text: "老当益壮，再干一场", effects: { attributes: { wealth: 3, intelligence: 2, physique: -2 } } , resultText: "你落下一子，不紧不慢。对面的老友笑了，说你还是当年的你。你也笑了。棋至终局，胜负早已不重要——能坐到一起，就已经赢了。"},
    ],
  },
  {
    type: "anchor", id: "a_mid_harvest", title: "仓满欲实",
    description: "五十五岁，秋收冬藏之时。你盘点一生的收成——事业、家庭、友情。哪些是你的骄傲，哪些又是你的遗憾？人到这个年纪，终于学会了与自己的不完美和解。",
    minAge: createAge(55), maxAge: createAge(55), triggerAge: 55,
    choices: [
      { text: "知足常乐，享受晚年", effects: { attributes: { luck: 4, creativity: 2 } } },
      { text: "人生还长，继续耕耘", effects: { attributes: { intelligence: 3, physique: -1, wealth: 1 } } },
    ],
  },

  // ── 晚年期 61-100 ──
  {
    type: "anchor", id: "a_elder_twilight", title: "沉暮影深",
    description: "你老了。某个黄昏，你坐在老屋的门槛上，夕阳把一切都镀成了金色。这一生，值了吗？",
    minAge: createAge(65), maxAge: createAge(70), triggerAge: 68,
    choices: [
      { text: "这一生没有遗憾", effects: { attributes: { luck: 5, creativity: 3 } } },
      { text: "还有太多未完成的事", effects: { attributes: { intelligence: 3, physique: -2 } } },
    ],
  },
  {
    type: "anchor", id: "a_elder_grandson", title: "春苗又苏",
    description: "你抱起了孙子。那双清澈的眼睛让你想起了很久以前的自己——那个也曾对世界充满好奇的婴儿。",
    minAge: createAge(70), maxAge: createAge(78), triggerAge: 73,
    choices: [
      { text: "把一生的故事讲给他听", effects: { attributes: { creativity: 5, luck: 3 } } },
      { text: "给他最好的物质条件", effects: { attributes: { wealth: -2, luck: 2, appearance: 2 } } },
    ],
  },
  {
    type: "anchor", id: "a_elder_last_stand", title: "揣猫一生",
    description: "八旬高龄，你坐在棋盘前。对手是当年一起学棋的老友。你们下了一盘很慢的棋，每一步都在回味这一生。",
    minAge: createAge(78), maxAge: createAge(88), triggerAge: 82,
    choices: [
      { text: "从容落子，不计胜负", effects: { attributes: { intelligence: 3, luck: 3, creativity: 3 } } },
      { text: "依然争胜，初心不改", effects: { attributes: { intelligence: 5, physique: -2 } } },
    ],
  },

  // ══ 新增锚点事件 ══

  // ── 少年期 ──
  {
    type: "anchor", id: "a_kid_epidemic", title: "愁没影身",
    description: "那一年流感大流行。学校里每天都有同学被接走。你开始发烧，体温计的数字越来越高。",
    minAge: createAge(11), maxAge: createAge(11), triggerAge: 11,
    choices: [
      { text: "在家硬扛，不去医院", effects: { attributes: {}, isLethal: true }, resultText: "高烧到第四天的时候，开始呼吸困难。等我被送进急诊的时候已经严重肺炎。这场流感带走了很多老人和孩子——你是其中之一。" },
      { text: "第一时间去卫生所", effects: { attributes: { physique: 2, luck: 1 } }, resultText: "妈妈带我去卫生所挂了水。高烧到第三天退了，我瘦了一圈，但活了下来。桌上有同学送来的笔记，我在病床上翻了翻——落下的课，还能补回来。命只有一次。" },
    ],
  },

  // ── 青年期 ──
  {
    type: "anchor", id: "a_young_lost", title: "沉没永逝",
    description: "毕业旅行的最后一晚，你和朋友在异乡的海滩上喝醉了。有人提议游到那个发光的浮标那边——月光很美，海浪很温柔。",
    minAge: createAge(23), maxAge: createAge(23), triggerAge: 23,
    choices: [
      { text: "脱了衣服跳进海里", effects: { attributes: {}, isLethal: true }, resultText: "海水在晚上比看起来远，也比看起来冷。游到一半时腿抽筋了。朋友们以为我在开玩笑。天亮的时候救援队才找到我。二十三岁的夏天，永远停在了那片看似温柔的海里。" },
      { text: "躺在沙滩上看星星就好", effects: { attributes: { creativity: 3, luck: 2 } }, resultText: "我仰躺在温热的沙滩上，夜空像一口倒扣的锅盖满了芝麻。朋友们陆续睡了，我一个人醒着听海浪。那个晚上我用手机备忘录写了一首诗——很幼稚，但很真实。活着真好。" },
    ],
  },

  // ── 壮年期 ──
  {
    type: "anchor", id: "a_mid_fire", title: "残明雨散",
    description: "深夜火灾警报响起。酒店走廊浓烟滚滚，你裹着被子站在房门口。走廊尽头是安全通道，但浓烟中看不清方向。你的本能告诉你往外跑——但是否有人还在房间里？",
    minAge: createAge(42), maxAge: createAge(42), triggerAge: 42,
    choices: [
      { text: "用湿毛巾捂住口鼻冲出走廊", effects: { attributes: {}, isLethal: true }, resultText: "我冲了出去，但走廊里的浓烟太厚了。在拐角处我被呛得弯下了腰——然后没能站起来。消防员说烟雾比火焰更快致命。我的房间门还开着，被子散落在地毯上。" },
      { text: "堵住门缝，在窗口等待救援", effects: { attributes: { intelligence: 2, physique: 1, luck: 2 } }, resultText: "我用湿毛巾堵住门缝，打开所有窗户。在窗台上挥手的时候消防车的云梯过来了。获救后在避难所喝了三杯热茶，手还在抖。但学会了火灾第一课：不要往浓烟里跑。" },
    ],
  },

  // ── 晚年期 ──
  {
    type: "anchor", id: "a_elder_last_winter", title: "沉暮远逝",
    description: "最冷的一个冬天，暖气坏了。窗外零下十五度，屋子里的温度在慢慢下降。你有两个选择：穿上所有衣服撑到明天等修理工，或者去两公里外的儿子家住——但外面雪很深。",
    minAge: createAge(78), maxAge: createAge(78), triggerAge: 78,
    choices: [
      { text: "步行去儿子家", effects: { attributes: {}, isLethal: true }, resultText: "出门时以为自己穿得够多了。走了不到一里地就开始喘——冷空气像刀片一样割着肺。我想赶紧走，但腿抬不动了。后来邻居说我在雪地里坐下后就没再站起来。老寒雪，收人魂。" },
      { text: "给儿子打电话，裹着被子等", effects: { attributes: { intelligence: 2, luck: 2 } }, resultText: "我拨了儿子的电话：'别来——路太滑。我裹了被子，没事。'挂掉电话我把所有能穿的都穿上，缩在被子里。天亮的时候暖气修好了。儿子过来看我，嘴唇紧紧抿着——他怕失去我。我更怕让他失去。" },
    ],
  },

  // ── 青年期职业陷阱 ──
  {
    type: "anchor", id: "a_young_fraud", title: "出没永生",
    description: "一个'海外高薪'的工作机会摆在面前。面试官很专业，合同上的数字好得不像真的。他们说公司在东南亚——到了就能签正式合同。",
    minAge: createAge(21), maxAge: createAge(26), triggerAge: 24,
    choices: [
      { text: "买了机票出发", effects: { attributes: {}, isLethal: true }, resultText: "下了飞机后有辆面包车来接我。车越开越偏，手机被收走，护照被扣下。后面的事像一场醒不来的噩梦。我的故事停在了二十四岁，再也没有人见过我。" },
      { text: "上网查一下这家公司", effects: { attributes: { intelligence: 3, luck: 2 } }, resultText: "我在谷歌上搜了那个公司名——第三页就出现了'诈骗'两个字。我又搜了那栋大楼，街景图和面试时看到的完全不一样。我关上聊天窗口，把这个'机会'拉黑了。好险——有些幸运不是天上掉的馅饼，是你比别人多花了几分钟怀疑。" },
    ],
  },

  // ── 壮年期健康陷阱 ──
  {
    type: "anchor", id: "a_mid_checkup", title: "赤明影深",
    description: "医生说你的肺部 CT 显示了一个阴影。可能是炎症，也可能是更糟的东西。'需要做穿刺活检才能确认。'他说话时没有看你的眼睛。",
    minAge: createAge(50), maxAge: createAge(50), triggerAge: 50,
    choices: [
      { text: "拖延随访，害怕知道结果", effects: { attributes: { physique: -10, luck: -3 }, isLethal: false }, resultText: "我把检查申请单锁进抽屉。半年后症状出现了——那时肿瘤已经从早期发展到了中期。后来回想，那个没有打开的抽屉，才是真正致命的。" },
      { text: "第二天就去做活检", effects: { attributes: { physique: -3, luck: 3 } }, resultText: "我深吸一口气，第二天早上第一个到达检验科。活检结果：良性炎症。医生说你再年轻五岁都没必要做这个检查——但我做了。有时候害怕是对的，但正因为害怕，才要勇敢。" },
    ],
  },
];
