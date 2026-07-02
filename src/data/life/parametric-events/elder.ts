import type { ParametricEvent } from "../../../engine/types";
import { createAge } from "../../../engine/types";

export const ELDER_PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ── 晚年期 61-100 ──
  {
    type: "parametric", id: "p_elder_retire", title: "垂暮夜色",
    description: "你退休了。数十年的职场生涯在一场简单的告别会上画上句号。",
    minAge: createAge(60), maxAge: createAge(65), weight: 3, eventTags: ["elder", "comfort"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "开启人生第二春", effects: { attributes: { creativity: 2, luck: 1 } } , resultText: "你脱下工装的那天，感到的不是失落，而是一种久违的轻盈。余生还长，你的第二程才刚刚开始。窗外的天空比任何时候都要蓝。"},
      { text: "享受悠闲时光", effects: { attributes: { physique: 3, wealth: -1 } } , resultText: "退休后的第一个早晨，你睡到自然醒。阳光透过窗帘洒在地板上，你端着一杯茶，什么也不想做。忙碌了大半辈子，终于可以理直气壮地浪费时间了。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_return", title: "辞母远逝",
    description: "你回到阔别多年的故乡。老屋还在，巷口那棵槐树却已被砍去。物是人非，感慨万千。",
    minAge: createAge(62), maxAge: createAge(72), weight: 2, eventTags: ["elder", "travel", "family"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "重修老屋，落叶归根", effects: { attributes: { wealth: -1, luck: 1, creativity: 2 } } , resultText: "你找来工匠，一砖一瓦地修复老屋。每一道墙缝都藏着记忆，每一扇窗户都照见过往。你决定在这里住下来，不再漂泊。"},
      { text: "只是静静走一圈就走了", effects: { attributes: { creativity: 1, wealth: -1} } , resultText: "你沿着巷子慢慢地走，用手抚摸每一面斑驳的墙。一切都变了，又好像什么都没变。你转身离开，没有回头——故乡在心里，不必强求归期。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_garden", title: "策马远山",
    description: "你在院子里种了一片菜园。日出而作，日落而息。原来陶渊明说的'采菊东篱下'是这样的感觉。",
    minAge: createAge(65), maxAge: createAge(78), weight: 2, eventTags: ["elder", "health", "nature"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "全身心投入田园生活", effects: { attributes: { physique: 3, creativity: 2, luck: -2} } , resultText: "你扛起锄头翻土、播种、浇水，汗水滴在泥土里。看着幼苗破土而出，你心里涌起一种久违的踏实。这一亩三分地，就是你的天下。"},
      { text: "随便种种，打发时间", effects: { attributes: { physique: 1, luck: 1, wealth: -1} } , resultText: "你漫不经心地在院子里撒下几颗种子，没想到它们真的发了芽。你蹲在菜畦边，看着那抹嫩绿出了神。日子，原来可以这样慢。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_memory", title: "尘满云散",
    description: "你坐在窗前，翻看一本旧相册。那些面孔和场景从指间流过，像握不住的沙。你试图留住什么，却发现一切都已成往事。",
    minAge: createAge(65), maxAge: createAge(80),
    statRequirements: { creativity: 5 }, weight: 2, eventTags: ["elder", "memory", "creation"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "写出真实的故事", effects: { attributes: { creativity: 2, luck: 1, wealth: -2} } , resultText: "你铺开稿纸，笔尖停了很久。然后你开始写——不修饰、不回避，把那些真实的欢乐与伤痛都写下来。写到动情处，你摘下老花镜擦了擦眼角。有些故事，只有真实的才动人。"},
      { text: "美化过去", effects: { attributes: { creativity: 1, wealth: -1} } , resultText: "你在回忆中挑挑拣拣，把那些灰暗的部分轻轻抹去。留下的画面温暖而柔和，像一张泛黄的老照片。你知道这不完全是真相，但这样让心里舒坦。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_reunion", title: "春梦玉碎",
    description: "老友聚会。当年的少年如今满头白发，推杯换盏间，那些遥远的名字又被提起。",
    minAge: createAge(68), maxAge: createAge(82), weight: 2, eventTags: ["elder", "family", "social"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "组织定期聚会", effects: { attributes: { appearance: 2, luck: 1, wealth: -1} } , resultText: "你建了个老友群，定下每月一聚的规矩。第一次聚会来了八个人，第二次又少了两个。但你不在乎——能来的，都是时间淘洗后的真朋友。酒不必多，说说话就好。"},
      { text: "珍惜每一次见面", effects: { attributes: { creativity: 2, luck: 1, physique: -1} } , resultText: "你举起酒杯，和每一个老友碰杯。你知道这样的聚会越来越少，所以格外认真地看每个人的脸。席散后你站在门口目送大家离去，路灯把影子拉得很长。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_legacy", title: "草木一生",
    description: "你开始思考这一生留下了什么。后代？作品？还是只是一个故事？",
    minAge: createAge(70), maxAge: createAge(85), weight: 2, eventTags: ["elder", "family", "legacy"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "把经验传授给年轻人", effects: { attributes: { intelligence: 1, luck: 1, physique: -1} } , resultText: "你坐在年轻人中间，把自己一辈子的经验和教训摊开来讲。他们认真地记笔记，问问题。你忽然觉得——原来这一生没有白过，哪怕只点亮了一盏灯。"},
      { text: "写一份遗嘱清单", effects: { attributes: { wealth: 2, physique: -1} } , resultText: "你戴上老花镜，一笔一划地写下这份清单。财产不多，但每一件物品背后都有一个故事。你希望收到它们的人，能明白这些物的重量。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_hospital", title: "沉眠欲逝",
    description: "你因病住进了医院。白色的天花板，点滴的节拍声。你第一次认真思考'终点'这个词。",
    minAge: createAge(72), maxAge: createAge(88),
    statRequirements: { physique: 5 }, weight: 2, eventTags: ["elder", "health", "illness"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "积极配合治疗", effects: { attributes: { physique: 3, luck: 1, wealth: -1} } , resultText: "你每天按时吃药、做康复训练，咬着牙和病痛较劲。护士夸你心态好，你笑了笑——这辈子什么风浪没见过。能多活一天，都是赚的。"},
      { text: "把时间留给家人", effects: { attributes: { appearance: 2, luck: 1, physique: -1 } } , resultText: "你拒绝了部分治疗，选择回家。家人围在身边，你握着每个人的手，仔细端详他们的脸。窗外阳光正好。你忽然觉得，这样就已经很好了。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_wisdom", title: "沧溟遗石",
    description: "你在整理旧物时发现了一本泛黄的笔记本。上面记录的，是你年轻时的一个绝妙创意——它从未被实现。",
    minAge: createAge(75), maxAge: createAge(92),
    statRequirements: { creativity: 6 }, weight: 2, eventTags: ["elder", "study", "creation"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "暮年也要把它做出来", effects: { attributes: { creativity: 2, intelligence: 1, physique: -1 } } , resultText: "你戴上老花镜，从满是灰尘的工作台上翻出当年的图纸。手指已不太灵便，但心还是热的。你花了大半年把它做了出来——虽然晚了五十年，但终究没有带着它进坟墓。"},
      { text: "传给下一代去实现", effects: { attributes: { luck: 1, intelligence: 1, wealth: -1} } , resultText: "你小心翼翼地把那本泛黄的笔记本交给孙辈。他们好奇地翻看着，眼睛里闪着光。你拍拍他们的肩说：'这是我的遗憾，但不是你们的。'"},
    ],
  },
  {
    type: "parametric", id: "p_elder_peace", title: "纯美月色",
    description: "某个夜晚，你独自坐在院子里。月光清澈如水，你感到前所未有的平静。",
    minAge: createAge(75), maxAge: createAge(90), weight: 2, eventTags: ["elder", "peace", "comfort"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "享受这片刻宁静", effects: { attributes: { luck: 1, creativity: 2, wealth: -2} } , resultText: "你靠在藤椅上，月光洒在你的脸上。远处传来几声狗吠，更衬得夜色安静。你闭上眼睛，感觉自己像一片羽毛，漂浮在时间之外。"},
      { text: "叫家人一起赏月", effects: { attributes: { appearance: 2, luck: 1, wealth: -1} } , resultText: "你招呼家人搬了椅子出来。孩子们起初还在看手机，后来也渐渐被这月色打动。一家人就这样静静地坐着，看着同一轮明月。千年前的古人，大概也是这样的吧。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_reborn", title: "残木迎生",
    description: "你年过花甲，本以为人生已无新意。某个寻常的午后，一缕久违的冲动忽然涌上心头——你想学一件年轻时从未触碰的事。枯木逢春，或许为时未晚。",
    minAge: createAge(65), maxAge: createAge(80), weight: 2, eventTags: ["elder", "growth", "creation"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { creativity: 4 },
    choices: [
      { text: "全心投入这迟来的热情", effects: { attributes: { creativity: 2, luck: 1 } } , resultText: "你报了老年大学，坐在第一排认真听讲。旁边的年轻人以为你是来旁听的老教授，你笑了笑没解释。手指有些生疏，但心里的火却越烧越旺。"},
      { text: "不过是一时冲动罢了", effects: { attributes: { creativity: 1, physique: -1} } , resultText: "你放下那个念头，继续过着平静的日子。但偶尔午夜梦回，那缕冲动还是会悄悄冒出来——像一根刺，轻轻地扎你一下。你翻个身，继续睡去。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_unfinished", title: "残没欲收",
    description: "深夜无眠，你想起年轻时那个被搁置的梦想。它像一个未解的生死劫，在心头盘桓了大半生。如今棋子尚在，棋盘却已蒙尘。",
    minAge: createAge(70), maxAge: createAge(90), weight: 2, eventTags: ["elder", "creation", "regret"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { creativity: 4 },
    choices: [
      { text: "去完成它，趁还来得及", effects: { attributes: { creativity: 3, intelligence: 1, physique: -1 } } , resultText: "你重新打开尘封已久的工具箱，双手虽然颤抖，但眼神异常坚定。那些未完成的线条和色彩，在你的手中渐渐活了过来。你赶在日落之前，终于画完了最后一笔。"},
      { text: "把它交给后人去实现", effects: { attributes: { luck: 1, intelligence: 1, wealth: -1} } , resultText: "你把这些年的构思和积累整理成册，郑重地交到年轻人手中。看着他们接下这份未竟的事业，你心里既有释然，也有一丝说不清的酸楚。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_ember", title: "残墨雨湿",
    description: "社区里缺人手，有人来请你帮忙。你本可以推托，但那些求助的眼睛让你想起当年的自己——也曾被人扶过一把。",
    minAge: createAge(70), maxAge: createAge(88), weight: 2, eventTags: ["elder", "creation", "memory"], maxTriggers: 2, cooldownYears: 8,
    statRequirements: { physique: 3 },
    choices: [
      { text: "发挥余热，不计回报", effects: { attributes: { luck: 1, creativity: 2, intelligence: -2} } , resultText: "你穿上志愿者的红马甲，在社区里忙前忙后。帮人修锁、教孩子写毛笔字、陪孤寡老人聊天。虽然累，但心里充实——原来被人需要，是这么温暖的事。"},
      { text: "婉拒，安心养老", effects: { attributes: { physique: 2, luck: 1, wealth: -1} } , resultText: "你婉言谢绝了对方的请求，心里却没有完全放下。夜晚你望着窗外的万家灯火，想那些需要帮助的人是否已经得到了回应。你轻轻叹了口气，合上眼不再想。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_together", title: "苍眉影深",
    description: "你和老伴一起在院子里晒太阳。TA的头发已经全白了，你的也是。你们没说几句话，但手一直握在一起。",
    minAge: createAge(68), maxAge: createAge(85), weight: 2, eventTags: ["elder", "social", "family"], maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "牵起TA的手，说一声'辛苦了'", effects: { attributes: { luck: 1, appearance: 2, wealth: -1} } , resultText: "你握住TA布满皱纹的手，千言万语化作一句'辛苦了'。TA的眼眶湿了，你也湿了。这一路走来不容易，好在——你们一直在一起。"},
      { text: "默默陪伴，不必多言", effects: { attributes: { luck: 1, creativity: 2, wealth: -1} } , resultText: "你什么都没说，只是把TA的手握得更紧了一些。阳光暖暖地照着，你们像两棵老树，根早已纠缠在一起，枝叶在风中沙沙作响。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_friendless", title: "沉默欲散",
    description: "你翻看手机通讯录，发现很多号码已经很久没打过了。你试着拨了一个——接电话的是对方的女儿。TA上个月走了。",
    minAge: createAge(75), maxAge: createAge(92), weight: 2, eventTags: ["elder", "lonely"], maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "去送最后一程", effects: { attributes: { luck: 1, creativity: 2, physique: -1} } , resultText: "你拄着拐杖参加了葬礼。看着墓碑上那张熟悉的笑脸，你没有哭。你只是站在那儿，在心里和他说了很久的话。老朋友，你先走一步，我们终会再见。"},
      { text: "在心底默默告别", effects: { attributes: { creativity: 2, physique: 1, wealth: -1} } , resultText: "你没有去葬礼，而是在那天独自去了你们常去的小公园。你坐在长椅上，看着落叶一片片飘下来。有些告别不需要仪式，心里的那声'再见'同样沉重。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_great", title: "沉默永逝",
    description: "你坐在院中老槐树下看落日。邻家的孩子跑来问你：'爷爷，人活着到底为了什么？'你沉默了很久，然后笑了。",
    minAge: createAge(78), maxAge: createAge(98), weight: 2, eventTags: ["elder", "memory", "lonely"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { intelligence: 6 },
    choices: [
      { text: "'好好活着就是答案'", effects: { attributes: { intelligence: 1, luck: 1, physique: -1} } , resultText: "孩子歪着头想了想，似懂非懂地跑开了。你望着他的背影，想起自己也曾问过同样的问题。如今你终于有了答案——不是用语言，而是用这一生。"},
      { text: "讲一个故事来回答", effects: { attributes: { creativity: 3, intelligence: 1, physique: -1} } },
    ],
  },
  {
    type: "parametric", id: "p_elder_curtain", title: "尘没已逝",
    description: "你感到身体越来越轻。床前围满了熟悉的面孔，有人在哭，有人在轻声唤你的名字。你想说别难过，但已经发不出声音了。舞台的灯光，终于要灭了。",
    minAge: createAge(85), maxAge: createAge(100), weight: 3, eventTags: ["elder", "peace"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "微笑着闭上眼睛", effects: { attributes: { luck: 1, creativity: 2 }, isLethal: true } },
      { text: "留下最后的嘱托", effects: { attributes: { intelligence: 1, appearance: 2 }, isLethal: true } },
    ],
  },
  {
    type: "parametric", id: "p_elder_end", title: "尘梦影逝",
    description: "你感到大限将至。这一生的画面如走马灯般闪过。有人说人在死前会看到一生的闪回。",
    minAge: createAge(85), maxAge: createAge(99), weight: 3, eventTags: ["elder", "memory"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "坦然面对", effects: { attributes: {}, isLethal: false } },
    ],
  },
];

export const ELDER_LETHAL_EVENTS: ParametricEvent[] = [
  // ══ 新增：晚年期即死事件 61-100 ══
  {
    type: "parametric", id: "p_elder_fall", title: "残明已散",
    description: "你在浴室里滑倒了。花洒还开着，水已经漫到了地砖上。后脑勺有点疼，你试着站起来——腿使不上劲。手机在卧室里充电。",
    minAge: createAge(70), maxAge: createAge(90), weight: 2, eventTags: ["elder", "health", "accident"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { physique: 3 },
    choices: [
      { text: "拼命挣扎站起来", effects: { attributes: {}, isLethal: true }, resultText: "我用尽全身力气扶着洗脸台想把自己撑起来——瓷砖太滑了。第二次摔倒的时候头撞到了马桶边缘。水温还是热的，但身体不再动了。家人发现的时候已经是第二天下午。" },
      { text: "大声呼救，等待帮助", effects: { attributes: { physique: -1, luck: 1 } }, resultText: "我没有乱动，用手边的浴巾裹住自己保暖，然后大声喊老伴的名字。她听到叫声跑过来，吓得打 120。救护车来了，脑 CT 没有大碍——只是摔了一下，狼狈了些。但这之后我在浴室里铺了防滑垫。" },
    ],
  },
  {
    type: "parametric", id: "p_elder_scam", title: "沉没一瞬",
    description: "电话那头的'公安局'说你的银行卡涉嫌洗钱，需要把钱转到'安全账户'。对方准确地报出了你的身份证号和住址，语气严厉。你的手已经开始抖了。",
    minAge: createAge(68), maxAge: createAge(85), weight: 2, eventTags: ["elder", "wealth", "danger"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 3 },
    choices: [
      { text: "按对方说的转钱", effects: { attributes: { wealth: -15, luck: -2 }, isLethal: false }, resultText: "我颤抖着手把一辈子的积蓄转了过去。挂掉电话后忽然觉得不对——拨回去，空号。我瘫在沙发上一整天没动，觉得自己像一个被时代抛弃的傻瓜。这笔钱再也没追回来。" },
      { text: "挂掉电话，找儿女核实", effects: { attributes: { intelligence: 1, luck: 1, wealth: -1} }, resultText: "我挂掉电话后心跳还是很快。给女儿打了个电话——她说：'爸，你差点就被骗了！公安局不会打这种电话！'我擦了把汗，连说知道了。骗子挂了三次电话，第四次我直接开了免提让女儿跟他们聊。" },
    ],
  },
  {
    type: "parametric", id: "p_elder_flu", title: "残命叶逝",
    description: "一场小感冒拖了两周不见好。咳嗽越来越厉害，夜里开始发低烧。老伴劝你去医院，但你觉得小题大做——不过是感冒而已。",
    minAge: createAge(72), maxAge: createAge(92), weight: 2, eventTags: ["elder", "health", "illness"], maxTriggers: 1, cooldownYears: 999,
    statRequirements: { physique: 3 },
    choices: [
      { text: "继续扛着，在家养养就好", effects: { attributes: {}, isLethal: true }, resultText: "一周后发展成重症肺炎。在 ICU 里住了一天，然后呼吸机也维持不住了。医生说老年人的免疫系统不比年轻人——一场感冒就可能是最后一根稻草。走的时候老伴还在说：我让他去医院，他就是不去。" },
      { text: "老老实实去医院", effects: { attributes: { physique: 1, luck: 1, wealth: -1 } }, resultText: "挂了呼吸科，拍了个胸片——轻微肺炎。医生开了一周的药，嘱咐多喝水、多休息。出院时老伴唠叨了一路，说'你看看，差点出大事'。我乖乖听着，知道她说得对。人老了，身体不会跟你商量，只会直接罢工。" },
    ],
  },
];

