import type { ParametricEvent } from "../../../engine/types";
import { createAge } from "../../../engine/types";

export const INFANT_PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ── 婴幼期过渡事件 4-7 ──
  {
    type: "parametric", id: "p_kid_firefly", title: "草没萤闪",
    description: "夏夜的院子里，萤火虫提着灯笼飞舞，忽明忽暗。你拿着玻璃瓶追逐那些流动的光点，笑声在夜色中清脆地回荡。",
    minAge: createAge(4), maxAge: createAge(7), weight: 1, eventTags: ["childhood", "creation", "growth"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "捉几只装进瓶子", effects: { attributes: { creativity: 1, physique: -1} } , resultText: "我举着玻璃瓶满院子追逐，萤火虫在瓶底一闪一闪，像装了一瓶星光。我把瓶子举到眼前，那些小生命的光照亮了我的瞳孔——真美啊，我舍不得合上盖子。"},
      { text: "静静看它们飞舞", effects: { attributes: { luck: 1, wealth: -1} } , resultText: "我搬来小板凳坐在院子中央，托着腮看萤火虫在夜幕上画出一道道流线。有一只停在膝盖上，一闪一闪，像是在跟我打招呼。那个夏夜，安静得让人想永远留在里面。"},
    ],
  },
];

export const CHILDHOOD_PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ── 少年期 6-17 ──
  {
    type: "parametric", id: "p_kid_study", title: "窗梦月时",
    description: "你在课堂上写出了一首诗，语文老师惊讶地看着你。",
    minAge: createAge(8), maxAge: createAge(14),
    statRequirements: { creativity: 5 }, weight: 2, eventTags: ["study", "creation", "exam"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "继续写作", effects: { attributes: { creativity: 2, wealth: -1} } , resultText: "我趁热打铁又写了两首，把本子递给老师看。老师的批注比我的诗还长，句句都戳在心上。从那天起我开始相信——也许我真的能写点什么。"},
      { text: "觉得没什么大不了", effects: { attributes: {} } , resultText: "我把本子塞进抽屉，没再多想。不过是一时灵感罢了，谁还没有过呢。但语文老师的目光里分明有些遗憾——她大概觉得我辜负了什么。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_sport", title: "驰鸣羽势",
    description: "学校运动会。你站在百米起跑线上，风在耳边呼啸。",
    minAge: createAge(10), maxAge: createAge(16),
    statRequirements: { physique: 3 }, weight: 2, eventTags: ["sport", "physique", "growth"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "全力冲刺", effects: { attributes: { physique: 3, appearance: 1, luck: -1} } , resultText: "发令枪响的瞬间我冲了出去，耳边全是风声和呐喊。我第一个冲过终点线，弯着腰大口喘气，汗水滴在跑道上砸出小小的湿痕。阳光下，有人为我鼓掌。"},
      { text: "享受比赛", effects: { attributes: { physique: 1, luck: 1, wealth: -1} } , resultText: "我按照自己的节奏跑，不去管别人领先了多少。风拂过脸颊时我觉得很舒坦——名次不重要，重要的是我在跑。冲线时意外地发现，我竟然跑进了前三。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_friend", title: "藏猫引蛇",
    description: "你和朋友在巷子里捉迷藏，不小心踩翻了一个蜂窝。",
    minAge: createAge(8), maxAge: createAge(12), weight: 1, eventTags: ["social", "danger", "childhood"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "带朋友逃跑", effects: { attributes: { physique: 2, luck: -1 } } , resultText: "我一把拽起朋友就跑，身后嗡嗡声越来越近。我们跑得上气不接下气，翻过一个矮墙时膝盖磕破了皮。回头看时蜂窝还在远处——安全了，但我俩都挂了彩。"},
      { text: "用衣服驱赶蜜蜂", effects: { attributes: { physique: -1, intelligence: 1 } } , resultText: "我脱下外套朝蜂群挥舞，想让它们飞走。结果被蜇了两下，手臂肿起红包，疼得直吸冷气。但这次之后我倒是记住了——马蜂和蜜蜂是不一样的，这个知识来得有点疼。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_art", title: "船梦远驶",
    description: "学校举办了汉字大赛。你站在台上，目光低垂，心中自有丘壑。",
    minAge: createAge(10), maxAge: createAge(14),
    statRequirements: { intelligence: 5 }, weight: 2, eventTags: ["study", "exam", "competition"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "稳定发挥", effects: { attributes: { intelligence: 1, appearance: 1, physique: -1} } , resultText: "我深吸一口气，一笔一划写得工工整整。那些练过无数遍的字从笔尖流出，稳稳地落在纸上。公布结果时我的名字赫然在列——稳扎稳打，从不会让人失望。"},
      { text: "冒险用生僻字", effects: { attributes: { intelligence: 1, luck: -1 } } , resultText: "我赌了一把，写了一个刚学会的生僻字。笔划繁复，写到一半差点忘了怎么写，额头渗出冷汗。最后勉强写完，但那一笔明显有些犹豫。评委皱了皱眉——勇气可嘉，但赌注的代价也不小。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_climb", title: "策马越山",
    description: "村口的老槐树上，最高处的枝丫仿佛能碰到云。小伙伴们都不敢爬，只有你仰着头，跃跃欲试。",
    minAge: createAge(7), maxAge: createAge(11),
    statRequirements: { physique: 3 }, weight: 2, eventTags: ["adventure", "danger", "physique"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "勇敢地爬上去", effects: { attributes: { physique: 3, creativity: 1, intelligence: -1} } , resultText: "我手脚并用，粗糙的树皮硌得手心生疼。爬到高处时整个村子都在脚下，风吹过来，我忽然觉得自己像一只鸟。坐在树杈上往下看，小伙伴们的脸上写满了羡慕。"},
      { text: "在树下帮大家望风", effects: { attributes: { intelligence: 1, luck: 1, physique: -1} } , resultText: "我站在树下负责望风，盯着远处大人的身影。偶尔喊一句「有人来了」，树上的伙伴们便屏息凝神。虽然没爬上最高处，但这份默契让我觉得——我也是团队里重要的一环。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_ants", title: "虫脉蚁生",
    description: "你蹲在墙角，看蚂蚁们排着长队搬运食物。它们井然有序，像一支训练有素的军队。你用一根小树枝轻轻拦住它们的去路，想看看它们会怎么办。",
    minAge: createAge(7), maxAge: createAge(10), weight: 1, eventTags: ["study", "creation", "curiosity"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "仔细观察它们如何绕路", effects: { attributes: { intelligence: 1, physique: -1} } , resultText: "我蹲得腿都麻了，看着蚂蚁队伍在我的树枝前停顿、试探，然后从侧面绕出一条新路。它们井然有序的样子像一支训练有素的军队。我忽然觉得，这些小东西的身体里藏着一个我看不见的世界。"},
      { text: "找来更多树枝搭一座桥", effects: { attributes: { creativity: 1, physique: -1} } , resultText: "我四处搜集树枝和叶片，搭了一座歪歪扭扭的小桥架在蚂蚁队伍上方。第一只蚂蚁试探着爬上桥，接着第二只、第三只——成功了！我激动得差点跳起来。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_kite", title: "彩梦云上",
    description: "春风正好的下午，你拉着自制的风筝在田野上奔跑。风筝摇摇晃晃地升起来，越飞越高，线在手中绷得紧紧的，仿佛牵着一片云。",
    minAge: createAge(7), maxAge: createAge(12), weight: 2, eventTags: ["creation", "childhood", "adventure"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "放长线让风筝飞得更高", effects: { attributes: { creativity: 2, luck: 1, physique: -1} } , resultText: "我一点一点放出手中的线，风筝摇摇晃晃地往云里钻去。线在手中绷得紧紧的，像是牵着一头看不见的猛兽。风筝越飞越高，最后变成一个小黑点——我的心也跟着飞上了天。"},
      { text: "紧紧抓住线怕它飞走", effects: { attributes: { intelligence: 1, physique: 1, creativity: -1} } , resultText: "我攥紧线轴不敢松手，生怕风筝挣脱飞去。风筝在天上挣扎着要往上蹿，我的胳膊被拉得生疼。最终它没能飞得太高——但至少，它还在我手里。我松了一口气。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_rain", title: "初沐雨时",
    description: "夏天的暴雨来得突然。你没有带伞，索性脱了鞋子，在积水的巷子里奔跑跳跃。雨点打在脸上凉丝丝的，脚丫踩起的水花在路灯下闪闪发光。",
    minAge: createAge(8), maxAge: createAge(13), weight: 2, eventTags: ["physique", "health", "childhood"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "尽情享受雨中的自由", effects: { attributes: { physique: 2, creativity: 1, wealth: -1} } , resultText: "我踢掉凉鞋赤脚踏进积水里，雨水顺着发梢往下淌。我用力踩出一个大水花，又踩出一个——巷子里全是我的笑声。雨打在脸上凉丝丝的，我的心里却是热的。"},
      { text: "还是找个屋檐躲雨", effects: { attributes: { intelligence: 1, luck: 1, physique: -1} } , resultText: "我抱着书包躲进路边的屋檐下，看着雨幕发愣。有人也跑进来躲雨，是个和我差不多大的孩子——我们聊了起来。等雨停的时候，我多了一个朋友。这场雨，也不算白下。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_snow", title: "窗梦云生",
    description: "老师在讲台上讲着方程式，你的目光却飘向了窗外。雪花正纷纷扬扬地落下，把操场染成一片洁白。你想象着在雪地里奔跑、打雪仗的样子，嘴角微微上扬。",
    minAge: createAge(8), maxAge: createAge(13), weight: 2, eventTags: ["study", "creation", "childhood"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "收回心思认真听课", effects: { attributes: { intelligence: 1, physique: -1} } , resultText: "我使劲掐了一下大腿，把目光从窗外拽回黑板。老师讲的内容我听得七七八八，下课后借同桌的笔记补上了走神时漏掉的部分。窗外下它的雪，我学我的习，两不相欠。"},
      { text: "在课本角落里画下雪景", effects: { attributes: { creativity: 2, intelligence: -1 } } , resultText: "我用铅笔在课本空白处画了一个雪人、一棵光秃秃的树和漫天飞舞的雪花。画到一半老师叫我回答问题——我支支吾吾答不上来，课本上的雪人暴露了秘密。老师没收了我的铅笔。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_sorrow", title: "愁眠夜色",
    description: "你第一次因为某件事整夜翻来覆去睡不着。说不清是生气、委屈还是难过，只知道胸口堵得慌。你把脸埋进枕头里，觉得长大好像是一件很累的事情。",
    minAge: createAge(10), maxAge: createAge(15),
    statRequirements: { creativity: 3 }, weight: 2, eventTags: ["lonely", "creation", "growth"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "写在日记里倾诉", effects: { attributes: { creativity: 2, intelligence: 1, wealth: -1} } , resultText: "我翻开带锁的日记本，把压在胸口的话一句一句写下来。笔尖游走间，那些委屈和愤怒好像被抽离了身体，转移到了纸上。写完最后一个字，我长长地呼出一口气——心里轻了一些。"},
      { text: "出去跑几圈发泄", effects: { attributes: { physique: 2, luck: -1 } } , resultText: "我冲出家门沿着巷子疯跑，跑得肺像要烧起来一样。跑到村口的老槐树下我停下来，弯着腰大口喘气，眼泪不知道什么时候已经流了一脸。夜风吹干泪痕，有些东西永远留在了风里。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_persist", title: "持墨砚石",
    description: "一道怎么也解不开的数学题摆在面前。草稿纸用了一张又一张，笔尖都快把纸戳破了。身边的同学都放弃了，只有你还咬着笔杆不肯认输。",
    minAge: createAge(10), maxAge: createAge(15),
    statRequirements: { intelligence: 2 }, weight: 2, eventTags: ["study", "exam", "pressure"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "死磕到底直到解出来", effects: { attributes: { intelligence: 1, physique: -1 } } , resultText: "我盯着那道题看了整整一个下午，草稿纸揉了一团又一团。写到第八张纸的时候，答案忽然自己跳了出来——那么简单，我居然绕了这么远的路。我瘫在椅背上头晕眼花，但心里比吃了蜜还甜。"},
      { text: "去请教老师或同学", effects: { attributes: { intelligence: 1, appearance: 1, physique: -1} } , resultText: "我拿着题去找班长，她三言两语就点通了关键。我恍然大悟的同时也有点脸红——这么简单我竟然卡了这么久。不过下次遇到类似的题，我大概不会再错了。学会了就是自己的。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_night", title: "初明夜时",
    description: "夜深了，家人都睡了。你偷偷打开台灯，翻开那本被禁止的小说。每一页都像是在冒险，你一边竖着耳朵听门外的动静，一边沉浸在另一个世界里。",
    minAge: createAge(12), maxAge: createAge(16), weight: 3, eventTags: ["lonely", "fear", "childhood"], maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "熬夜一口气读完", effects: { attributes: { creativity: 2, physique: -1 } } , resultText: "我缩在被窝里，借着台灯的光一页一页翻下去。情节越来越精彩，我的眼皮却越来越沉。凌晨两点终于翻完最后一页，我合上书，脑袋里全是故事里的画面。第二天早课我差点在桌上睡着。"},
      { text: "克制住，明天再看", effects: { attributes: { intelligence: 1, physique: -1} } , resultText: "我狠狠心合上书，把它塞到枕头底下。躺在床上翻来覆去，满脑子都是主角接下来会怎样。我强迫自己数羊，数到五百只才迷迷糊糊睡去。第二天一早，我做的第一件事就是翻开书——章节的末尾，等着我的是更大的悬念。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_green", title: "春萌影涩",
    description: "你发现镜子里的那张脸有些陌生。身体在悄悄变化，心里冒出一些从未有过的情绪——莫名其妙地烦躁，又莫名其妙地欢喜。你好像正在变成另一个人。",
    minAge: createAge(12), maxAge: createAge(16),
    statRequirements: { appearance: 2 }, weight: 2, eventTags: ["growth", "nature", "childhood"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "坦然接受成长的变化", effects: { attributes: { appearance: 2, luck: 1, intelligence: -1} } , resultText: "我对着镜子仔细端详自己——好像确实有些不一样了。下巴尖了一些，肩膀宽了一些。我学着大人的样子挺了挺胸，虽然有点别扭，但也不全是坏事。变成另一个人，也许没那么可怕。"},
      { text: "有些不安，躲进自己的世界", effects: { attributes: { creativity: 2, appearance: -1 } } , resultText: "我把帽檐压得低低的，不想让人注意到我的变化。一个人躲在房间里画画、看书，和那些不会变化的纸张待在一起才安心。外面的世界变得太快了——我只想在自己的壳里多待一会儿。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_rebel", title: "持明夜手",
    description: "老师在全班面前严厉批评了你。你攥紧拳头，一股从未有过的愤怒涌上心头。你想反驳，想摔门而去，想告诉所有人——你不是他们想象中的那个样子。",
    minAge: createAge(14), maxAge: createAge(17), weight: 3, eventTags: ["pressure", "family", "youth"], maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "站起来据理力争", effects: { attributes: { appearance: 3, intelligence: -1 } } , resultText: "我腾地站起来，声音比预想中大得多。教室里安静了一瞬，所有人都在看我。我把想说的话一口气说完，心脏砰砰跳得像要蹦出胸腔。老师愣住了，我也愣住了——有些话说出来就收不回去了。"},
      { text: "忍下来，用成绩证明自己", effects: { attributes: { intelligence: 1, luck: -1 } } , resultText: "我死死咬着嘴唇，把涌到喉咙的话咽了回去。指甲掐进掌心留下几道月牙印。回到座位上我翻开课本，一个字也看不进去——但我知道，愤怒解决不了问题，分数才是最好的反击。"},
    ],
  },
];

export const CHILDHOOD_LETHAL_EVENTS: ParametricEvent[] = [
  // ══ 新增：少年期即死事件 6-17 ══
  {
    type: "parametric", id: "p_kid_ice", title: "踩没银霜",
    description: "冬天湖面结了一层薄冰。伙伴们在冰面上嬉戏打闹，喊着你的名字让你也下来。冰面发出咯吱咯吱的声响。",
    minAge: createAge(8), maxAge: createAge(13), weight: 2, eventTags: ["danger", "accident", "childhood"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "跑到冰面上加入他们", effects: { attributes: { physique: -4, luck: -3, creativity: -1 } }, resultText: "冰面在我脚下裂开，刺骨的湖水瞬间吞没了我。大人们把我拖上岸时，我的嘴唇已经冻得发紫。后来每到冬天，我都会想起冰面碎开的声音——像一张白纸被命运撕开。" },
      { text: "在岸边看着就好", effects: { attributes: { intelligence: 1, physique: 1, creativity: -1} }, resultText: "我在岸边找了块石头坐下，看着他们在冰面上追逐打闹。冰面确实在响——我皱了皱眉。后来听说安全员来把人赶走了，还好没出事。" },
    ],
  },
  {
    type: "parametric", id: "p_kid_well", title: "沉没影深",
    description: "村口有一口荒废多年的枯井，井口被木板盖着。你和小伙伴打赌谁能把井盖掀开。大家都看着你，等着你动手。木板下方没有水声，只有一种像楼梯间回音的安静。",
    minAge: createAge(7), maxAge: createAge(13), weight: 5, eventTags: ["well", "hidden", "danger"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      {
        text: "用力掀开井盖",
        effects: { attributes: { physique: -1, luck: -1 }, isLethal: true, forceLethal: true },
        resultText: "你用力掀开井盖。木板碎裂的声音太轻，轻得像谁在井下替你把最后一口气收好。你还没看清井底，就已经听见自己的名字从很深的地方传回来。",
        conditionalEffects: [
          {
            requiredTalents: ["t_jingtingyusheng"],
            effects: { attributes: { physique: -1, creativity: 2, luck: -1 }, triggerChapterId: "well_otherworld", setChapterFlags: { well_opened: true } },
            resultText: "木板腐朽得厉害，你一使劲就碎了。脚下一空时，你以为自己会落进井水里。可井底没有水，只有一截干净得不合常理的石阶，向黑暗深处延伸。",
          },
        ],
      },
      { text: "算了，太危险了", effects: { attributes: { intelligence: 1, luck: 1 }, setChapterFlags: { well_refused_first: true } }, resultText: "我蹲在井边听了听——什么声音也没有。但我总觉得这井不该碰。我站起身拍拍裤子：'别玩了，我妈叫我回家吃饭。'那天夜里，我梦见井盖自己打开了。" },
    ],
  },
  {
    type: "parametric", id: "p_kid_well_dream", title: "沉梦又深",
    description: "自从那天离开废井后，你开始反复做同一个梦。梦里没有村口，只有学校楼梯间尽头一扇写着负一层的铁门。门缝里吹出潮湿的风，有人用粉笔在门背后写你的名字。",
    minAge: createAge(8), maxAge: createAge(17), weight: 6, eventTags: ["well", "hidden", "dream"], maxTriggers: 1, cooldownYears: 999,
    chapterFlagsRequired: { well_refused_first: true },
    choices: [
      {
        text: "推开梦里的铁门",
        effects: { attributes: { creativity: 1, luck: -2 }, isLethal: true, forceLethal: true },
        resultText: "你推开梦里的铁门。门后没有楼梯，也没有地下室，只有一个正在等你回答的空洞。醒来时，枕边一片潮湿，你却已经不在床上。",
        conditionalEffects: [
          {
            requiredTalents: ["t_jingtingyusheng"],
            effects: { attributes: { creativity: 2, luck: -2 }, triggerChapterId: "well_otherworld", setChapterFlags: { well_dream_entered: true, well_opened: true } },
            resultText: "铁门没有声音。门后不是地下室，而是一截干净的石阶。你认出那股潮湿的味道——那口井从来没有被你甩在身后，它只是换了一种方式等你。",
          },
        ],
      },
      { text: "醒来后把梦写下来", effects: { attributes: { creativity: 2, intelligence: 1 }, setChapterFlags: { well_dream_written: true } }, resultText: "你在作业本最后一页写下梦里的门。写到一半，铅笔芯忽然断了。断口处的石墨粉落在纸上，像一口很小很小的井。" },
    ],
  },
  {
    type: "parametric", id: "p_kid_roof", title: "策没云深",
    description: "你想爬上邻居家的房顶放风筝。瓦片被晒得滚烫，你赤着脚踩上去，有一种说不出的兴奋。更高处的风景，总是让人着迷。",
    minAge: createAge(10), maxAge: createAge(14), weight: 2, eventTags: ["danger", "adventure", "physique"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "踮脚够更高的屋檐", effects: { attributes: { physique: -4, luck: -2, intelligence: -1 } }, resultText: "我踮起脚尖去够更高的屋檐，指尖刚碰到檐角，瓦片就松了。身体向后仰去，天空在旋转。醒来时我躺在医院，腿上打着厚厚的石膏。风筝没有飞起来，倒是我从此知道了屋顶不是云。" },
      { text: "坐下来慢慢放风筝", effects: { attributes: { creativity: 2, luck: 1, physique: -1} }, resultText: "我坐在屋脊上，风吹着风筝越飞越高。这角度真好——整个村子都在脚下，远山在夕阳里像一幅水墨画。我觉得自己像一个坐在世界屋顶上的国王。" },
    ],
  },
];

export const CHILDHOOD_PHYSIQUE_EVENTS: ParametricEvent[] = [
  // ══ 少年体质惩罚事件 ══
  {
    type: "parametric", id: "p_phys_picky", title: "赤没影生",
    description: "你挑食得厉害——青菜不吃、鱼不吃、鸡蛋只吃蛋白。妈妈每天跟在你后面追着喂饭。体育课上跑两百米就喘不过气，同学们在终点等了你好久。",
    minAge: createAge(6), maxAge: createAge(10), weight: 2, eventTags: ["health", "comfort"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "照旧挑食，偏不吃", effects: { attributes: { physique: -4, intelligence: 1 } }, resultText: "我把青菜拨到盘子边上，假装吃过了。体育课上的成绩一直在倒数——但我安慰自己：反正我又不打算当运动员。直到体检那天医生推了推眼镜看着我说：'孩子，你有点营养不良。'那个词好重——我回家第一次默默把青菜吃完了。" },
      { text: "听妈妈的话试着每样吃一点", effects: { attributes: { physique: 3, luck: 1, intelligence: -1} }, resultText: "我鼓起勇气吃了一筷子菠菜——好像也没那么难吃。慢慢地我开始尝试更多东西，饭量大了，人也精神了。后来的体育课上我不但追上了队伍，还超过了几个老对手。妈妈笑着说：'看吧，不挑食就是不一样。'" },
    ],
  },
  {
    type: "parametric", id: "p_phys_gaming", title: "沉明夜深",
    description: "新出的那款游戏太好玩了。你每天放学就把自己关在房间里打游戏，凌晨三点还在组队刷副本。早饭经常只喝一杯牛奶就走，白天上课眼皮打架。你觉得自己还年轻——身体这种资本，耗不尽的。",
    minAge: createAge(10), maxAge: createAge(16), weight: 2, eventTags: ["comfort", "health"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "继续肝，游戏才是信仰", effects: { attributes: { physique: -4, creativity: 1, intelligence: -1 } }, resultText: "我把整个暑假埋在游戏里。开学体检的时候近视加深了两百度，体重掉到了历史最低。班主任在家长会上说了一句'这孩子最近不行了'——我回来看到妈妈红着的眼眶，忽然觉得游戏里的所有成就都变成了一个笑话。" },
      { text: "设个闹钟，每天只玩两小时", effects: { attributes: { physique: 2, intelligence: 1, luck: 1, wealth: -1} }, resultText: "我用手机设了闹钟——到点就拔掉网线。头几天浑身难受，手指不自觉地想摸键盘。但慢慢习惯了——开始出去打篮球、去图书馆看书。后来游戏里那帮队友散了，但现实里的身体还在。有些东西是游戏给不了的——比如能跑能跳的自己。" },
    ],
  },
];

