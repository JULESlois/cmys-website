// src/data/life/events-anchors.ts
import type { AnchorEvent } from "../../engine/types";
import { createAge } from "../../engine/types";

export const ANCHOR_EVENTS: AnchorEvent[] = [
  // ── 婴幼期 0-5 ──
  {
    type: "anchor", id: "a_birth", title: "初明夜色",
    description: "你诞生在这个世界上。第一声啼哭撕破了新乡夜晚的宁静，产房里灯火通明。母亲疲惫却温柔地笑着，父亲握着她的手，眼眶湿润。你的故事，从这声啼哭开始。",
    minAge: createAge(0), maxAge: createAge(0), triggerAge: 0,
    choices: [{ text: "（自动）", effects: { attributes: { physique: 2, luck: 1 } } , resultText: "你呱呱坠地，第一声啼哭撕破了产房的宁静。护士熟练地将你擦净裹进襁褓，母亲在产床上虚弱地笑了，父亲握着她的手，眼眶泛红。"}],
  },
  {
    type: "anchor", id: "a_firstword", title: "初鸣语声",
    description: "你学会说第一个字。大人们围着你，屏住呼吸，期待着一个奇迹。你含糊不清地喊出了'妈妈'，整个世界都笑了。",
    minAge: createAge(1), maxAge: createAge(1), triggerAge: 1,
    choices: [{ text: "（自动）", effects: { attributes: { intelligence: 1, creativity: 1 } } , resultText: "你含糊地喊出那个字，大人们先是愣住，随后全都笑了。母亲把你抱得更紧，父亲在旁边一遍遍重复，像是在确认这真是一场奇迹。你还不懂语言，却已经学会用声音把人留在身边。"}],
  },
  {
    type: "anchor", id: "a_dimu", title: "慈目盈视",
    description: "你第一次清晰地认出母亲的脸。那双温暖的眼睛、那个熟悉的声音——原来这就是'妈妈'。你伸出小手想要触碰她的笑容，她把你紧紧抱在怀里。你的世界从此有了名字。",
    minAge: createAge(2), maxAge: createAge(2), triggerAge: 2,
    choices: [{ text: "（自动）", effects: { attributes: { luck: 1, appearance: 1 } } , resultText: "你盯着母亲的脸看了很久，终于把那双眼睛、那个声音和怀抱里的温度连在了一起。你伸出手摸她的脸，她笑着低头亲了亲你的手指。世界从一团模糊的光，慢慢有了可以相信的轮廓。"}],
  },
  {
    type: "anchor", id: "a_kindergarten", title: "彩墨幼时",
    description: "你进入幼儿园。老师发给你一盒蜡笔，你毫不犹豫地在纸上画了一个歪歪扭扭的太阳。手心上沾满了彩色颜料，你觉得这比任何玩具都有趣。",
    minAge: createAge(3), maxAge: createAge(3), triggerAge: 3,
    choices: [{ text: "（自动）", effects: { attributes: { intelligence: 1, creativity: 1 } } , resultText: "你把太阳画得很大，颜色涂出了边框，老师却说它很暖。放学时你举着画给家人看，纸角被你攥得皱巴巴的。那一天你第一次知道，手里的颜色可以把心里的东西搬到纸上。"}],
  },
  {
    type: "anchor", id: "a_panlan", title: "初迈幼身",
    description: "你扶着公园的栏杆，颤颤巍巍地站了起来。世界在你的眼中忽然变得高大而陌生。你松开手，迈出第一步——然后跌坐在地上。你没有哭，又爬了起来。远处母亲张开双臂等着你。",
    minAge: createAge(4), maxAge: createAge(4), triggerAge: 4,
    choices: [{ text: "（自动）", effects: { attributes: { physique: 2, creativity: 1 } } , resultText: "你扶着栏杆站起来，又松开手迈出一步。摔倒的瞬间你扁了扁嘴，却没有哭，只是又爬了起来。母亲张开双臂等你，你摇摇晃晃地扑过去，像一艘刚学会离岸的小船。"}],
  },
  {
    type: "anchor", id: "a_child_end", title: "纯梦永生",
    description: "你五岁了。你指着夜空中最亮的那颗星星问妈妈：'星星上面有人吗？'妈妈笑着把你举过头顶。你眯着眼睛，仿佛看到了星河彼岸。那一夜你做了一个梦——梦里你乘着一只纸船，顺着月光漂流，去往了宇宙的尽头。",
    minAge: createAge(5), maxAge: createAge(5), triggerAge: 5,
    choices: [{ text: "（自动）", effects: { attributes: { intelligence: 1, creativity: 2 } } , resultText: "你指着星星问了一个大人也答不好的问题。母亲把你举得很高，夜风从耳边吹过去。那晚你梦见自己坐着纸船顺着月光漂流，醒来时还记得满天星河，像有人把宇宙悄悄放进了你的枕边。"}],
  },

  // ── 少年期 6-17 ──
  {
    type: "anchor", id: "a_primary", title: "初明应试",
    description: "你进入小学。第一次考试，你握紧铅笔，手心出汗。",
    minAge: createAge(6), maxAge: createAge(6), triggerAge: 6,
    choices: [
      { text: "认真答题", effects: { attributes: { intelligence: 1, physique: -1} } , resultText: "你低头认真答题，铅笔在纸上沙沙作响。手心还是出汗，但你把会做的题一道道写完。交卷时你长长松了一口气，第一次明白考试不是怪兽，只是把学过的东西排队交出来。"},
      { text: "偷偷看同桌", effects: { attributes: { intelligence: 1, luck: -2 } } , resultText: "你偷偷瞄了一眼同桌的卷子，心跳快得像要被老师听见。最后分数还不错，但那一点侥幸让你整天都不踏实。你开始明白，有些答案抄得到，安心抄不到。"},
    ],
  },
  {
    type: "anchor", id: "a_go_start", title: "揣猫一身",
    description: "你开始学围棋。黑白棋子如星辰布阵，你第一次体会到'势'的感觉。",
    minAge: createAge(7), maxAge: createAge(7), triggerAge: 7,
    choices: [
      { text: "专心学棋", effects: { attributes: { intelligence: 1, creativity: 2, physique: -1} } , resultText: "你盯着棋盘，一颗一颗把黑白子放下去。老师说你不只是会下棋，而是在学会等待和判断。输棋的时候你会皱眉，赢棋的时候也不敢太得意，因为下一盘总会重新开始。"},
      { text: "只想随便玩玩", effects: { attributes: { intelligence: 1, physique: -1} } , resultText: "你把棋子当成玩具，摆成小动物和奇怪的图案。老师叹了口气，却也没有责怪你。也许你暂时没有学会布局，但你记住了黑白棋子碰在棋盘上的声音，那声音像雨点，很好听。"},
    ],
  },
  {
    type: "anchor", id: "a_mid_school", title: "驰马野山",
    description: "你进入初中。新的环境，新的同学，你感到自己正在加速成长。",
    minAge: createAge(12), maxAge: createAge(12), triggerAge: 12,
    choices: [
      { text: "努力学习", effects: { attributes: { intelligence: 1, creativity: 1, physique: -1} } , resultText: "进考场前，我深呼吸了三次。遇到不会的题也没有慌张，跳过、回头、再试。最后一道作文题我写得格外顺畅——也许放松的心态反而让脑子更清醒了。"},
      { text: "多交朋友", effects: { attributes: { appearance: 2, wealth: 1, intelligence: -1} } , resultText: "你主动和前后左右的同学搭话，很快记住了几张新面孔。放学路上有人叫你一起去小卖部，你点头跟了上去。新的环境仍然陌生，但有了朋友，陌生就没那么可怕了。"},
    ],
  },
  {
    type: "anchor", id: "a_flood", title: "踩没雨水",
    description: "7·21 新乡特大暴雨。洪水吞噬了街道，你趟过齐腰深的水，帮助邻居搬运物资。",
    minAge: createAge(14), maxAge: createAge(14), triggerAge: 14,
    choices: [
      { text: "全力抗洪救灾", effects: { attributes: { physique: 3, luck: 1, wealth: -1} } , resultText: "你咬咬牙趟进齐腰深的水里，帮邻居搬运沙袋和物资。浑浊的洪水冰冷刺骨，你一趟又一趟地往返。后来听说那次抢出了不少东西，你也受到了表扬，只是回家后发了两天低烧。"},
      { text: "保自己安全为先", effects: { attributes: { physique: 1, creativity: -1} } , resultText: "你安顿好自己，躲到高处的安全地带。看着楼下奔涌的洪水，你暗暗庆幸自己没事。没有人责怪你，但你心里某个角落仍有些说不上来的愧疚：原来安全有时也会带着重量。"},
    ],
  },
  {
    type: "anchor", id: "a_high_school", title: "沉默预说",
    description: "进入高中。你担任了班干部，学会了在沉默中观察，在关键时表达。",
    minAge: createAge(15), maxAge: createAge(15), triggerAge: 15,
    choices: [
      { text: "积极管理班级", effects: { attributes: { appearance: 2, intelligence: 1, physique: -1} } , resultText: "你站上讲台组织班会，声音从微微颤抖到逐渐沉稳。你学会在嘈杂中掌控局面，也学会在冲突中调解矛盾。同学们开始信任你，你也开始相信自己能在关键时刻站出来。"},
      { text: "专注自己学业", effects: { attributes: { intelligence: 1, physique: -1} } , resultText: "你把更多时间留给课本和错题本。班级里的热闹偶尔从耳边滑过，你没有追上去。成绩慢慢稳定下来，但你也发现，专注不是没有代价——有些关系会在沉默里变远。"},
    ],
  },

  // ── 青年期 18-30 ──
  {
    type: "anchor", id: "a_gaokao", title: "出马应试",
    description: "高考。十二年磨一剑，你走进考场，笔尖落纸的声音像千军万马。",
    minAge: createAge(18), maxAge: createAge(18), triggerAge: 18,
    choices: [
      { text: "全力以赴", effects: { attributes: { intelligence: 3, luck: 1, physique: -1} } , resultText: "那两天你几乎没怎么合眼，笔芯用掉了三根。交卷的那一刻，手抖得几乎握不住笔。但你把十二年所学的一切都倾泻在答卷上——无论结果如何，你知道自己没有辜负那张书桌。"},
      { text: "心态平和，尽力就好", effects: { attributes: { intelligence: 1, creativity: 2, physique: -1} } , resultText: "进考场前，你深呼吸了三次。遇到不会的题也没有慌张，跳过、回头、再试。最后一道作文题写得格外顺畅。也许放松的心态反而让脑子更清醒，尽力本身就是一种答案。"},
    ],
  },
  {
    type: "anchor", id: "a_university", title: "辞母远送",
    description: "你离开家乡上大学。母亲在车站挥手的身影越来越小，你第一次真正感到'独立'的重量。",
    minAge: createAge(19), maxAge: createAge(19), triggerAge: 19,
    choices: [
      { text: "拥抱母亲，承诺常回家", effects: { attributes: { creativity: 2, luck: 1, wealth: -1} } , resultText: "你紧紧抱住母亲，闻到她发间熟悉的味道。她瘦了。你在她耳边说会常回家，她笑着点头，眼眶却红了。车开动后你看着站台越来越远，终于明白独立不是不回头，而是带着牵挂往前走。"},
      { text: "头也不回地走", effects: { attributes: { intelligence: 1, wealth: -1 } } , resultText: "你没有回头。不是不想，是不敢——你怕一回头就再也走不动。后来母亲在电话里说，她在站台上一直站到车看不见。你挂掉电话，在宿舍坐了很久，把想家的力气一点点按进书页里。"},
    ],
  },
  {
    type: "anchor", id: "a_love_first", title: "春梦一时",
    description: "第一次心动。那个人出现在图书馆的窗边，阳光正好。",
    minAge: createAge(20), maxAge: createAge(22), triggerAge: 20,
    choices: [
      { text: "鼓起勇气表白", effects: { attributes: { appearance: 2, luck: 1, wealth: -1} } , resultText: "你走到那个人面前，心脏快要从嗓子眼跳出来。你说喜欢，声音小得连自己都差点听不清。对方愣了一下，然后笑了。无论答案是什么，那一刻的阳光都会在你记忆里停很久。"},
      { text: "默默藏在心里", effects: { attributes: { creativity: 2, physique: -1} } , resultText: "你把那三个字咽了回去，连同那个午后的阳光一起锁进日记本里。后来每次在图书馆遇见对方，你都假装在看窗外。暗恋是一场一个人的兵荒马乱，你是唯一的士兵，也是唯一的逃兵。"},
    ],
  },
  {
    type: "anchor", id: "a_graduate", title: "岔陌云深",
    description: "大学毕业了。同窗四散，各奔前程。你站在校门口，不知道下一步该往哪里走。",
    minAge: createAge(22), maxAge: createAge(23), triggerAge: 22,
    choices: [
      { text: "投身职场，大干一场", effects: { attributes: { wealth: 3, intelligence: 1, physique: -1} } , resultText: "你脱下学士服，换上正装，挤进早高峰的地铁。办公室的格子间比宿舍的书桌还小，但你觉得自己像一头准备冲撞世界的公牛。第一份工作的工牌挂在胸前，沉甸甸的——那是名为大人的入场券。"},
      { text: "继续深造，充实自己", effects: { attributes: { intelligence: 1, creativity: 1, physique: -1} } , resultText: "当同学们忙着投简历时，你回到图书馆的老位置坐下。窗外还是那棵银杏树，只是叶子又黄了一次。你知道自己在逃避什么，也知道自己在追寻什么。读书是一场漫长的修行，而你还不想下山。"},
    ],
  },

  // ── 壮年期 31-60 ──
  {
    type: "anchor", id: "a_mid_thirty", title: "承命应世",
    description: "三十岁了。你站在人生的十字路口，肩上扛着家庭、事业和社会的期待。少年意气渐褪，中年的担当正要开始。父母开始变老，孩子正在长大，而你还在学着做一个合格的大人。",
    minAge: createAge(31), maxAge: createAge(31), triggerAge: 31,
    choices: [
      { text: "扛起责任，一往无前", effects: { attributes: { physique: 2, wealth: 2, intelligence: 1, luck: -1} } , resultText: "你开始习惯在凌晨醒来，脑子里排满一整天的日程。房贷、父母的体检费、孩子的辅导班，这些数字压在肩上，却也让你感到前所未有的踏实。原来被需要，也是一种力量。"},
      { text: "再给自己几年自由", effects: { attributes: { creativity: 2, luck: -1 } } , resultText: "你推掉了一些不必要的应酬，重新给自己留出空白。有人说你还不够稳，你却第一次认真想：如果人生只剩责任，那自由要被放到哪里？几年自由也许不多，但足够你听见自己的声音。"},
    ],
  },
  {
    type: "anchor", id: "a_mid_peak", title: "仓满盈实",
    description: "事业如日中天。你站在办公室的落地窗前，俯瞰这座城市，想起当年那个懵懂的少年。",
    minAge: createAge(35), maxAge: createAge(40), triggerAge: 38,
    choices: [
      { text: "乘胜追击，再上一层", effects: { attributes: { wealth: 5, physique: -1 } } , resultText: "你带着团队拿下了那个最难啃的项目。庆功宴上大家轮流敬酒，你笑着喝了一杯又一杯，胃里翻江倒海，面上不动声色。散场后你一个人坐在车里揉了揉太阳穴——高处不胜寒，但你还没打算下来。"},
      { text: "开始思考人生的意义", effects: { attributes: { creativity: 2, luck: 1, physique: -1} } , resultText: "你推掉几个可有可无的会议，一个人在美术馆里待了一下午。站在那幅巨大的油画前，你突然意识到，这些年一直在赶路，却忘了问自己要去哪里。手机亮了一下，你没有接。"},
    ],
  },
  {
    type: "anchor", id: "a_mid_midgame", title: "残没云深",
    description: "四十五岁，人生如棋至中盘。父母的白发多了，孩子的个头高了，你在中间承受着来自两头的重量。某天深夜你从医院陪床回来，对着后视镜里疲惫的自己问：下半场，该怎么走？",
    minAge: createAge(45), maxAge: createAge(45), triggerAge: 45,
    choices: [
      { text: "求稳，守住已有一切", effects: { attributes: { wealth: 3, physique: -1, luck: 1 } } , resultText: "你把家庭账本、父母病历和孩子的学费表放在一起，逐项整理。那些年轻时想做却没做的事被你暂时收进抽屉。求稳不是认输，是承认自己身后已经站着太多人。"},
      { text: "大胆落子，再搏一局", effects: { attributes: { creativity: 2, wealth: -2, luck: -1 } } , resultText: "你抵押了一部分安稳，投向一个外人看不懂的方向。家人沉默了很久，最后还是把晚饭端到你面前。你知道这一局不只是为了赢，也是为了证明自己还没有被生活彻底定型。"},
    ],
  },
  {
    type: "anchor", id: "a_mid_halfwar", title: "驰马一生",
    description: "五十岁，知天命之年。你回望半生——那些奋斗过的日夜、喝过的酒、熬过的苦，都化作了鬓边的白发和眼中的沉静。你终于明白有些事强求不来，有些人留不住，有些路只能走一次。",
    minAge: createAge(50), maxAge: createAge(50), triggerAge: 50,
    choices: [
      { text: "功成身退，颐养天年", effects: { attributes: { luck: 1, physique: 2, intelligence: -1} } , resultText: "你在一份交接表上签了字，第一次准点离开办公室。路过公园时，夕阳正照在长椅上。你坐了一会儿，手机没有响。那种安静起初让你不适应，后来却像一床刚晒过的被子。"},
      { text: "老当益壮，再干一场", effects: { attributes: { wealth: 3, intelligence: 1, physique: -1 } } , resultText: "你接下一个新的项目，把旧笔记重新翻开。年轻人叫你前辈，你笑着说自己只是多摔过几次。身体不如从前，但脑子还热着。五十岁不是退场，只是换一种步法继续往前。"},
    ],
  },
  {
    type: "anchor", id: "a_mid_harvest", title: "仓满欲实",
    description: "五十五岁，秋收冬藏之时。你盘点一生的收成——事业、家庭、友情。哪些是你的骄傲，哪些又是你的遗憾？人到这个年纪，终于学会了与自己的不完美和解。",
    minAge: createAge(55), maxAge: createAge(55), triggerAge: 55,
    choices: [
      { text: "知足常乐，享受晚年", effects: { attributes: { luck: 1, creativity: 2, wealth: -2} }, resultText: "你把账本合上，把院子里的躺椅搬到阳光下。年轻时总觉得还差一点，到了这个年纪才明白，能慢慢吃饭、慢慢说话、慢慢看一场雨，本身就是收成。" },
      { text: "人生还长，继续耕耘", effects: { attributes: { intelligence: 1, physique: -1, wealth: 1 } }, resultText: "你没有急着把自己交给晚年。你重新整理经验、联系旧友、继续做还能做的事。身体偶尔抗议，但你心里很清楚：收成不是终点，土地还在。" },
    ],
  },

  // ── 晚年期 61-100 ──
  {
    type: "anchor", id: "a_elder_twilight", title: "沉暮影深",
    description: "你老了。某个黄昏，你坐在老屋的门槛上，夕阳把一切都镀成了金色。这一生，值了吗？",
    minAge: createAge(65), maxAge: createAge(70), triggerAge: 68,
    choices: [
      { text: "这一生没有遗憾", effects: { attributes: { luck: 1, creativity: 2, intelligence: -2} }, resultText: "你望着夕阳，忽然发现很多旧痛已经不再尖锐。那些走错的路、说错的话、来不及挽回的人，都被暮色慢慢收拢。你未必真的没有遗憾，只是终于愿意放过自己。" },
      { text: "还有太多未完成的事", effects: { attributes: { intelligence: 1, physique: -1 } }, resultText: "你掰着手指数那些还没做完的事，数到后来自己先笑了。身体不如从前，心却仍不肯停。也许人活着就是这样：明知道时间有限，还是想再往前走一点。" },
    ],
  },
  {
    type: "anchor", id: "a_elder_grandson", title: "春苗又苏",
    description: "你抱起了孙子。那双清澈的眼睛让你想起了很久以前的自己——那个也曾对世界充满好奇的婴儿。",
    minAge: createAge(70), maxAge: createAge(78), triggerAge: 73,
    choices: [
      { text: "把一生的故事讲给他听", effects: { attributes: { creativity: 4, luck: 1, wealth: -2} }, resultText: "你给他讲小时候的井、年轻时的雨夜和那些差点走错的路。他听不全懂，却一直睁大眼睛。讲到最后你才发现，故事不是为了证明自己精彩，而是把火递给后来的人。" },
      { text: "给他最好的物质条件", effects: { attributes: { wealth: -2, luck: 1, appearance: 2 } }, resultText: "你给他买了最好的书包、最软的鞋和一只会发光的玩具。钱包轻了不少，他却抱着玩具笑得很亮。你忽然明白，爱有时很俗，就是想让孩子少受一点苦。" },
    ],
  },
  {
    type: "anchor", id: "a_elder_last_stand", title: "揣猫一生",
    description: "八旬高龄，你坐在棋盘前。对手是当年一起学棋的老友。你们下了一盘很慢的棋，每一步都在回味这一生。",
    minAge: createAge(78), maxAge: createAge(88), triggerAge: 82,
    choices: [
      { text: "从容落子，不计胜负", effects: { attributes: { intelligence: 1, luck: 1, creativity: 2, physique: -2} }, resultText: "你落子很慢，每一步都像在和旧日重逢。老友催你，你只是笑。棋局终了时你们都忘了谁赢，只记得茶已经凉了，窗外的光也安静地退到墙角。" },
      { text: "依然争胜，初心不改", effects: { attributes: { intelligence: 1, physique: -1 } }, resultText: "你盯着棋盘，像年轻时盯着考卷、合同和人生的岔路。最后一手落下，老友笑骂你还是不肯让人。你也笑了：有些争胜不是不服老，而是不肯把热气交出去。" },
    ],
  },

  // ══ 新增锚点事件 ══

  // ── 少年期 ──
  {
    type: "anchor", id: "a_kid_epidemic", title: "愁没影身",
    description: "那一年流感大流行。学校里每天都有同学被接走。你开始发烧，体温计的数字越来越高。",
    minAge: createAge(11), maxAge: createAge(11), triggerAge: 11,
    choices: [
      { text: "在家硬扛，不去医院", effects: { attributes: { physique: -4, luck: -3, intelligence: -1 } }, resultText: "高烧到第四天的时候，呼吸开始变得困难。等我被送进急诊时已经发展成严重肺炎。医生把我从鬼门关拽了回来，但那场病像在骨头里钉了一根钉子——此后很久，我一到冬天就咳得停不下来。" },
      { text: "第一时间去卫生所", effects: { attributes: { physique: 2, luck: 1, intelligence: -1} }, resultText: "妈妈带我去卫生所挂了水。高烧到第三天退了，我瘦了一圈，但活了下来。桌上有同学送来的笔记，我在病床上翻了翻——落下的课，还能补回来。命只有一次。" },
    ],
  },

  // ── 青年期 ──
  {
    type: "anchor", id: "a_young_lost", title: "沉没永逝",
    description: "毕业旅行的最后一晚，你和朋友在异乡的海滩上喝醉了。有人提议游到那个发光的浮标那边——月光很美，海浪很温柔。",
    minAge: createAge(23), maxAge: createAge(23), triggerAge: 23,
    choices: [
      { text: "脱了衣服跳进海里", effects: { attributes: { physique: -6, luck: -4, creativity: -1 } }, resultText: "海水在晚上比看起来远，也比看起来冷。游到一半时腿抽筋了，朋友们终于发现不对，把我拖回岸边时我已经呛得说不出话。那晚之后，我再也没觉得月光下的海温柔。" },
      { text: "躺在沙滩上看星星就好", effects: { attributes: { creativity: 2, luck: 1, wealth: -1} }, resultText: "我仰躺在温热的沙滩上，夜空像一口倒扣的锅盖满了芝麻。朋友们陆续睡了，我一个人醒着听海浪。那个晚上我用手机备忘录写了一首诗——很幼稚，但很真实。活着真好。" },
    ],
  },

  // ── 壮年期 ──
  {
    type: "anchor", id: "a_mid_fire", title: "残明雨散",
    description: "深夜火灾警报响起。酒店走廊浓烟滚滚，你裹着被子站在房门口。走廊尽头是安全通道，但浓烟中看不清方向。你的本能告诉你往外跑——但是否有人还在房间里？",
    minAge: createAge(42), maxAge: createAge(42), triggerAge: 42,
    choices: [
      { text: "用湿毛巾捂住口鼻冲出走廊", effects: { attributes: {}, isLethal: true }, resultText: "我冲了出去，但走廊里的浓烟太厚了。在拐角处我被呛得弯下了腰——然后没能站起来。消防员说烟雾比火焰更快致命。我的房间门还开着，被子散落在地毯上。" },
      { text: "堵住门缝，在窗口等待救援", effects: { attributes: { intelligence: 1, physique: 1, luck: 1, creativity: -1} }, resultText: "我用湿毛巾堵住门缝，打开所有窗户。在窗台上挥手的时候消防车的云梯过来了。获救后在避难所喝了三杯热茶，手还在抖。但学会了火灾第一课：不要往浓烟里跑。" },
    ],
  },

  // ── 晚年期 ──
  {
    type: "anchor", id: "a_elder_last_winter", title: "沉暮远逝",
    description: "最冷的一个冬天，暖气坏了。窗外零下十五度，屋子里的温度在慢慢下降。你有两个选择：穿上所有衣服撑到明天等修理工，或者去两公里外的儿子家住——但外面雪很深。",
    minAge: createAge(78), maxAge: createAge(78), triggerAge: 78,
    choices: [
      { text: "步行去儿子家", effects: { attributes: {}, isLethal: true }, resultText: "出门时以为自己穿得够多了。走了不到一里地就开始喘——冷空气像刀片一样割着肺。我想赶紧走，但腿抬不动了。后来邻居说我在雪地里坐下后就没再站起来。老寒雪，收人魂。" },
      { text: "给儿子打电话，裹着被子等", effects: { attributes: { intelligence: 1, luck: 1, wealth: -1} }, resultText: "我拨了儿子的电话：'别来——路太滑。我裹了被子，没事。'挂掉电话我把所有能穿的都穿上，缩在被子里。天亮的时候暖气修好了。儿子过来看我，嘴唇紧紧抿着——他怕失去我。我更怕让他失去。" },
    ],
  },

  // ── 青年期职业陷阱 ──
  {
    type: "anchor", id: "a_young_fraud", title: "出没永生",
    description: "一个'海外高薪'的工作机会摆在面前。面试官很专业，合同上的数字好得不像真的。他们说公司在东南亚——到了就能签正式合同。",
    minAge: createAge(21), maxAge: createAge(26), triggerAge: 24,
    choices: [
      { text: "买了机票出发", effects: { attributes: { wealth: -6, physique: -3, luck: -4, intelligence: -1 } }, resultText: "下了飞机后有辆面包车来接我。车越开越偏，手机被收走，护照也被扣下。后来我靠一通求救电话逃了出来，回国时只剩一只破背包和很长一段不愿提起的沉默。那不是高薪机会，是一口会吞人的井。" },
      { text: "上网查一下这家公司", effects: { attributes: { intelligence: 1, luck: 1, physique: -1} }, resultText: "我在谷歌上搜了那个公司名——第三页就出现了'诈骗'两个字。我又搜了那栋大楼，街景图和面试时看到的完全不一样。我关上聊天窗口，把这个'机会'拉黑了。好险——有些幸运不是天上掉的馅饼，是你比别人多花了几分钟怀疑。" },
    ],
  },

  // ── 壮年期健康陷阱 ──
  {
    type: "anchor", id: "a_mid_checkup", title: "赤明影深",
    description: "医生说你的肺部 CT 显示了一个阴影。可能是炎症，也可能是更糟的东西。'需要做穿刺活检才能确认。'他说话时没有看你的眼睛。",
    minAge: createAge(50), maxAge: createAge(50), triggerAge: 50,
    choices: [
      { text: "拖延随访，害怕知道结果", effects: { attributes: { physique: -4, luck: -2 }, isLethal: false }, resultText: "我把检查申请单锁进抽屉。半年后症状出现了——那时肿瘤已经从早期发展到了中期。后来回想，那个没有打开的抽屉，才是真正致命的。" },
      { text: "第二天就去做活检", effects: { attributes: { physique: -1, luck: 1 } }, resultText: "我深吸一口气，第二天早上第一个到达检验科。活检结果：良性炎症。医生说你再年轻五岁都没必要做这个检查——但我做了。有时候害怕是对的，但正因为害怕，才要勇敢。" },
    ],
  },
];
