import type { ParametricEvent } from "../../../engine/types";
import { createAge } from "../../../engine/types";

export const MEME_PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ══ 中文互联网与二次元梗事件 ══
  {
    type: "parametric", id: "p_meme_muyu", title: "锤木云声",
    description: "你在深夜刷到一个电子木鱼小程序，屏幕上每敲一下就弹出一次功德。室友说这是赛博安慰剂，你却觉得那声“咚”比很多鸡汤都诚恳。",
    minAge: createAge(16), maxAge: createAge(40), weight: 1, eventTags: ["meme", "comfort", "pressure", "luck"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "连敲一千下，给明天攒功德", effects: { attributes: { luck: 1, physique: -1 } }, resultText: "你敲到手指发麻，屏幕上的功德像廉价股票一样缓慢上涨。第二天事情没有变好，但你至少拥有了一种错觉：宇宙欠你一张小票。" },
      { text: "关掉它，真正睡觉", effects: { attributes: { physique: 2, luck: -1 } }, resultText: "你放下手机，黑暗里只剩空调声。没有功德到账，也没有神明显灵，但第二天醒来时，你发现充足睡眠比赛博佛祖更像外挂。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_guzi", title: "橱满银碎",
    description: "你路过商场中庭，那里正在办二次元周边快闪。徽章、立牌、拍立得、小卡整整齐齐排在灯下，像一场温柔但明码标价的抢劫。",
    minAge: createAge(14), maxAge: createAge(35), weight: 1, eventTags: ["meme", "otaku", "wealth", "comfort"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "买到痛包都合不上", effects: { attributes: { creativity: 1, wealth: -4, luck: 1 } }, resultText: "你提着一袋谷子回家，钱包薄得像剧情里的纸片人。痛包合不上，心却暂时合上了——这就是成年人用塑料片给自己打的补丁。" },
      { text: "只拍照，假装拥有过", effects: { attributes: { intelligence: 1, creativity: 1, luck: -1 } }, resultText: "你对着展柜拍了十几张照片，然后潇洒离开。回家后相册里全是反光和自己的脸，像一场贫穷但体面的盗梦。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_gacha", title: "池没愿碎",
    description: "限定卡池最后一天，你看着还差二十抽的大保底，耳边仿佛响起了纸片人的低语：来都来了。理智在门口敲门，钱包在屋里装死。",
    minAge: createAge(16), maxAge: createAge(45), weight: 1, eventTags: ["meme", "otaku", "wealth", "luck", "risk"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "氪到出金为止", effects: { attributes: { luck: 2, wealth: -4, physique: -1 } }, resultText: "金光亮起的那一刻你像被世界原谅。三分钟后账单短信亮起，你又像被世界精准报复。快乐是真的，贫穷也是真的。" },
      { text: "截图许愿，等复刻", effects: { attributes: { intelligence: 1, luck: -1 } }, resultText: "你把角色立绘截图设成壁纸，告诉自己这叫长期主义。屏幕里的她微笑着看你，仿佛也知道你只是没钱。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_fafeng", title: "痴鸣语散",
    description: "工作群里有人又把锅推给你。你盯着输入框，脑内已经写完三千字发疯文学：阴暗爬行、尖叫、扭曲、然后准时交付。",
    minAge: createAge(18), maxAge: createAge(55), weight: 1, eventTags: ["meme", "pressure", "social", "career"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "发一段文明版发疯文学", effects: { attributes: { creativity: 2, appearance: -1, luck: -1 } }, resultText: "你删掉脏话，保留阴阳怪气，把怒火包装成职场修辞发了出去。群里沉默了三分钟，然后对方说：'收到，我来补。'你第一次发现，疯也可以有格式。" },
      { text: "保存草稿，明天再战", effects: { attributes: { intelligence: 1, physique: 1, creativity: -1 } }, resultText: "你把那段文字存在备忘录，标题叫《遗书级会议纪要》。第二天醒来，你发现自己没有毁灭职场关系，只毁灭了一点点睡意。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_daodun", title: "错鸣音生",
    description: "你刷到一只表情极其迷惑的猫，配音空耳听起来像一句毫无意义的咒语。评论区全在复读，你看了十秒，忽然也想问：这猫到底在干什么？",
    minAge: createAge(12), maxAge: createAge(40), weight: 1, eventTags: ["meme", "abstract", "social", "luck"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "转发给所有朋友", effects: { attributes: { luck: 1, appearance: -1 } }, resultText: "你把那只猫发进三个群。有人回哈哈，有人回问号，还有人把你移出了学习群。猫没有解释，猫只是完成了它的社会实验。" },
      { text: "研究它为什么好笑", effects: { attributes: { intelligence: 1, creativity: 1, physique: -1 } }, resultText: "你越分析越不明白，越不明白越想笑。最后你得出结论：抽象不是没有意义，而是意义先下班了。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_aierchuang", title: "超模异生",
    description: "有人把你喜欢的角色丢进 AI 二创模型，生成了三百张图：九根手指、两只左脚、眼神像刚看完期末成绩。评论区却说这叫新皮肤。",
    minAge: createAge(15), maxAge: createAge(45), weight: 1, eventTags: ["meme", "otaku", "creation", "technology"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "加入二创，修到能看", effects: { attributes: { creativity: 2, intelligence: 1, physique: -1 } }, resultText: "你修图修到凌晨，终于把第九根手指送回异世界。成品不算完美，但至少角色看起来不像被命运退款。" },
      { text: "举报怪图，守护老婆", effects: { attributes: { luck: 1, creativity: -1 } }, resultText: "你认真点下举报，理由写得像辩论文。平台没有立刻回应，但你心里很安详——至少今晚你替纸片人站了一岗。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_cosplay", title: "裁梦衣生",
    description: "漫展前夜，你的 cos 服还差一条腰带、两个扣子和三分之一的灵魂。快递显示正在派送，但它的位置像隐藏副本一样不可预测。",
    minAge: createAge(14), maxAge: createAge(32), weight: 1, eventTags: ["meme", "otaku", "appearance", "creation"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "通宵手搓道具", effects: { attributes: { appearance: 2, creativity: 2, physique: -2, wealth: -1 } }, resultText: "你用热熔胶、纸板和一点点信仰撑到了天亮。走进会场时道具边缘还在掉渣，但有人喊出角色名的瞬间，你觉得自己短暂赢过了现实。" },
      { text: "穿常服去当摄影路人", effects: { attributes: { intelligence: 1, luck: 1, appearance: -1 } }, resultText: "你背着相机混进人群，拍到了很多神图，也拍到了自己的怂。晚上修片时你想：下次一定。这个句子已经陪你活了很多年。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_danmaku", title: "词满荧碎",
    description: "你看一部老番补到名场面，弹幕忽然密得像暴风雪。有人认真分析，有人玩烂梗，还有人在关键台词处刷起完全无关的外卖优惠。",
    minAge: createAge(10), maxAge: createAge(45), weight: 1, eventTags: ["meme", "otaku", "social", "memory"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "打开弹幕，一起下雪", effects: { attributes: { luck: 1, creativity: 1, intelligence: -1 } }, resultText: "你被弹幕淹没，剧情看丢了三次，却笑出了声。很多年后你记不清那集讲了什么，只记得那一屏人类同时发癫的雪。" },
      { text: "关掉弹幕，尊重原作", effects: { attributes: { intelligence: 1, creativity: -1 } }, resultText: "屏幕清净了，台词终于完整落进耳朵。你突然理解了角色的痛苦——然后下一秒想起刚才那条外卖弹幕，庄严感当场工伤。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_helljoke", title: "垂目阴声",
    description: "饭局上有人讲了一个很黑的地狱笑话。空气先是安静，然后有人笑了一声，又立刻假装咳嗽。你意识到真正可怕的不是笑话，而是大家都在判断谁先笑。",
    minAge: createAge(18), maxAge: createAge(60), weight: 1, eventTags: ["meme", "dark_humor", "social", "pressure"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "笑完补一句：我先下地狱", effects: { attributes: { creativity: 1, appearance: -1, luck: -1 } }, resultText: "你笑得很短，像把火柴划亮又立刻吹灭。大家松了口气，话题很快转到天气。你发现黑色幽默最像薄冰：踩上去之前，最好知道下面是什么水。" },
      { text: "把话题拉回菜单", effects: { attributes: { appearance: 1, intelligence: 1, creativity: -1 } }, resultText: "你指着菜单说这家的鱼不错。所有人立刻抓住这条鱼逃生。那晚没有人再讲笑话，但你获得了一个新身份：餐桌消防员。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_rotten_tail", title: "沉没业深",
    description: "毕业季，群里有人自嘲自己成了烂尾娃：项目没交付，人生先停工。你看着简历文件夹里十七个版本，感觉自己也像一栋等待验收的毛坯楼。",
    minAge: createAge(20), maxAge: createAge(28), weight: 1, eventTags: ["meme", "career", "pressure", "youth"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "继续投简历，先把地基打完", effects: { attributes: { intelligence: 1, wealth: 1, physique: -1 } }, resultText: "你把简历改到第二十一版，终于收到一个面试。它不光鲜，甚至有点寒酸，但至少工地重新开工了。" },
      { text: "承认烂尾，回家修整", effects: { attributes: { physique: 2, wealth: -2, luck: 1 } }, resultText: "你回家睡了三天。父母没有问太多，只在饭桌上多放了一双筷子。人生暂停施工不等于废弃，有时候只是需要补一张许可证。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_laoji", title: "慈目已生",
    description: "你刷到一句很土但很温柔的话：爱你老己。你本来想划走，却发现自己已经很久没有用这种语气跟自己说过话了。",
    minAge: createAge(18), maxAge: createAge(70), weight: 1, eventTags: ["meme", "comfort", "peace", "health"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "给自己买一顿像样的饭", effects: { attributes: { physique: 2, wealth: -1, luck: 1 } }, resultText: "你点了一份热汤和一份正经主食，没有凑单，没有省钱省到胃疼。吃完时你忽然觉得，照顾自己这种事不高级，但很救命。" },
      { text: "转发并假装只是玩梗", effects: { attributes: { appearance: 1, luck: 1, creativity: -1 } }, resultText: "你配了一个夸张表情包发出去，评论区都在笑。没人知道你是真的被那句话撞了一下——也好，温柔有时需要伪装成烂梗才能过审。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_abstract_group", title: "丑猫一闪",
    description: "朋友把你拉进一个抽象群，群名每天变三次，头像是一只像被生活殴打过的猫。你刚进群，三十张表情包同时砸来，像一场低清度雪崩。",
    minAge: createAge(14), maxAge: createAge(40), weight: 1, eventTags: ["meme", "abstract", "social", "comfort"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "融入群聊，成为低清猫", effects: { attributes: { creativity: 2, luck: 1, intelligence: -1 } }, resultText: "三天后你已经能熟练使用十七种猫图回答人生问题。你的表达能力退化了，但精神状态诡异地稳定了。" },
      { text: "退出群聊，保全理智", effects: { attributes: { intelligence: 1, physique: 1, luck: -1 } }, resultText: "你退出群聊的那一刻，手机安静得像刚做完手术。世界恢复了逻辑，但也少了一点毫无必要的快乐。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_waifu_tax", title: "橱梦余税",
    description: "你整理房间时发现，纸片人周边已经占满一整面墙。你忽然意识到自己并不是在收藏，而是在给另一个次元交房租。",
    minAge: createAge(18), maxAge: createAge(45), weight: 1, eventTags: ["meme", "otaku", "wealth", "memory"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "继续扩建神龛", effects: { attributes: { creativity: 1, wealth: -3, luck: 1 } }, resultText: "你又订了一个展示柜。快递到家时，你对着空出来的格子陷入沉思：原来欲望最可怕的地方，是它永远懂得预留空间。" },
      { text: "卖掉一半，留下本命", effects: { attributes: { wealth: 2, intelligence: 1, creativity: -1 } }, resultText: "你把重复的、冲动买的、已经忘记是谁的周边挂上二手平台。打包时有点心疼，但房间终于像房间，不再像小型祭坛。" },
    ],
  },
  {
    type: "parametric", id: "p_meme_barrage_trial", title: "裁民语审",
    description: "你随手发了一条吐槽，被转发进陌生圈子。评论区开始审判你的标点、头像、关注列表和三年前的一句玩笑，像一群赛博考古学家发现了新坟。",
    minAge: createAge(16), maxAge: createAge(55), weight: 1, eventTags: ["meme", "social", "pressure", "danger"], maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "逐条解释，试图讲道理", effects: { attributes: { intelligence: 1, physique: -2, luck: -1 } }, resultText: "你解释到凌晨两点，发现对方并不需要答案，只需要你继续提供燃料。你关掉评论区时，像从一口沸腾的锅里捞出了自己的脑子。" },
      { text: "删帖睡觉，明天继续做人", effects: { attributes: { physique: 1, luck: 1, appearance: -1 } }, resultText: "你删掉动态，把手机倒扣在桌上。第二天世界没有毁灭，只有一个陌生小号还在私信里骂你。你把它拉黑，感觉像给灵魂洗了个冷水脸。" },
    ],
  },
];

