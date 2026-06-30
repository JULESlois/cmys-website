export interface Fortune {
  id: string;
  name: string;
  fortune: string;
  explanation: string;
  description: string;
}

export const FORTUNES: Fortune[] = [
  {
    id: "0",
    name: "陈孟钰爽",
    fortune: "姬吉",
    explanation: "无",
    description: "无",
  },
  {
    id: "1",
    name: "沉默有诗",
    fortune: "中等吉，文运",
    explanation: "沉默中蕴含着诗意与灵感。",
    description: "近期宜静不宜动，独处或冥思将带来创作突破，适合写作、艺术或策划工作。",
  },
  {
    id: "2",
    name: "春苗雨苏",
    fortune: "大吉，生机",
    explanation: "春天的幼苗得到雨水滋润而苏醒。",
    description: "困境即将过去，新的机会如雨后春笋般出现，事业或学习将迎来明显起色。",
  },
  {
    id: "3",
    name: "藏猫引蛇",
    fortune: "小凶，慎防小人",
    explanation: "本意玩耍躲藏，却意外引出蛇来。",
    description: "无心之举可能招惹是非，注意身边口舌之人，重要事宜低调进行。",
  },
  {
    id: "4",
    name: "纯美意识",
    fortune: "上吉，心性",
    explanation: "纯粹美好的内心觉知。",
    description: "心态决定境遇，保持善意与专注，近期会在人际关系或精神层面获得意外收获。",
  },
  {
    id: "5",
    name: "辞母远涉",
    fortune: "中等凶，离别",
    explanation: "告别母亲，远行跋涉。",
    description: "或将面临分离、变动或长途旅行，虽有小波折，但长远来看是成长的必经之路。",
  },
  {
    id: "6",
    name: "长眠月食",
    fortune: "大凶，阴滞",
    explanation: "长久沉睡于月食之刻，象征晦暗不明。",
    description: "运势低迷，易感疲惫或陷入迷茫，不宜做重大决策，建议休养与观察。",
  },
  {
    id: "7",
    name: "催马欲速",
    fortune: "小吉，官运/行动",
    explanation: "鞭策马匹加快速度。",
    description: "工作上需主动推进，上级或客户会催促，但正是表现良机，宜果断执行。",
  },
  {
    id: "8",
    name: "春眠夜宿",
    fortune: "中等吉，安稳",
    explanation: "春天安睡，夜中栖息。",
    description: "近期生活节奏放缓，适合休整与家庭团聚，财运平稳，健康运上升。",
  },
  {
    id: "9",
    name: "吃面饮水",
    fortune: "小吉，日常",
    explanation: "吃面条、喝清水，简朴生活。",
    description: "平淡是真，近期不宜追求奢华，脚踏实地反而能积累小福气，肠胃健康佳。",
  },
  {
    id: "10",
    name: "吹灭烟水",
    fortune: "凶中藏吉，虚像",
    explanation: "吹散烟雾与水汽，看似消散却易复来。",
    description: "当前困扰多为表象，不必过度焦虑，等待迷雾散去后再行动，可转危为安。",
  },
  {
    id: "11",
    name: "仓满盈实",
    fortune: "大吉，财运",
    explanation: "粮仓充实，衣食无忧。",
    description: "正财旺盛，投资或储蓄有稳定回报，适合购置实物资产或储备物资。",
  },
  {
    id: "12",
    name: "揣猫一身",
    fortune: "小凶，招惹",
    explanation: "把猫揣在怀里，弄了一身（毛或抓痕）。",
    description: "好心可能带来小麻烦，帮助他人时需留意分寸，避免被反噬或抱怨。",
  },
  {
    "id": "13",
    "name": "采蜜养鼠",
    "fortune": "小吉，勤劳致富",
    "explanation": "采集花蜜，养育老鼠，寓意辛勤经营。",
    "description": "付出必有回报，近期适合深耕主业或养殖类、手工业，财源缓慢但稳定增长。"
  },
  {
    "id": "14",
    "name": "垂目言事",
    "fortune": "中等吉，谨言",
    "explanation": "垂下眼睛说话，谨慎低调地陈述事情。",
    "description": "会议上或谈判中保持谦虚态度反而容易成功，注意言辞分寸，可得贵人暗中相助。"
  },
  {
    "id": "15",
    "name": "愁眠雨声",
    "fortune": "小凶，情绪",
    "explanation": "因忧愁难眠，只听得窗外雨声。",
    "description": "近期易多思多虑，影响睡眠与决策，建议白天适当运动，夜间冥想化解焦虑。"
  },
  {
    "id": "16",
    "name": "持帽迎送",
    "fortune": "中平，礼仪",
    "explanation": "手持帽子迎接与送别，象征礼节周到。",
    "description": "社交场合将发挥重要作用，适合担任接待、协调角色，不会有大起大落但人缘提升。"
  },
  {
    "id": "17",
    "name": "纯棉衣睡",
    "fortune": "大吉，舒适",
    "explanation": "纯棉材质的睡衣，柔软亲肤。",
    "description": "生活质量提升，家庭氛围和谐，适合添置家居用品，睡眠质量改善，小病自愈。"
  },
  {
    "id": "18",
    "name": "出没野兽",
    "fortune": "凶，危险",
    "explanation": "有野兽出没，环境险恶。",
    "description": "近期避免夜间独自前往陌生之地，投资或合作中可能有隐藏风险，需提前排查。"
  },
  {
    "id": "19",
    "name": "垂暮一生",
    "fortune": "大凶，孤寂",
    "explanation": "晚年时光度过一生，象征迟暮与终结。",
    "description": "注意长辈健康，自身或感疲乏无力，不宜开启全新项目，宜总结、整理、休养。"
  },
  {
    "id": "20",
    "name": "错买饮食",
    "fortune": "小凶，破财",
    "explanation": "买错了食物或饮品。",
    "description": "消费易出错，网购或点餐前仔细核对，也暗示近期肠胃敏感，注意饮食卫生。"
  },
  {
    "id": "21",
    "name": "草木一生",
    "fortune": "中平，轮回",
    "explanation": "像草木一样度过一生，平凡而自然。",
    "description": "运势平淡无波，适合脚踏实地工作，感情稳定，无需强求突破，静待时机即可。"
  },
  {
    "id": "22",
    "name": "吹灭雨水",
    "fortune": "凶中藏小吉，虚妄",
    "explanation": "想吹灭雨水，徒劳无功。",
    "description": "试图改变无法改变的事只会消耗自己，建议接受现实，反而会发现新的出路。"
  },
  {
    "id": "23",
    "name": "出门右随",
    "fortune": "小吉，方向",
    "explanation": "出门后向右跟随，简单的动作。",
    "description": "近期选择往往比想象中简单，顺着直觉走右侧或“右”象征的方向（如南方、领导意见）可避开麻烦。"
  },
  {
    "id": "24",
    "name": "沉默预说",
    "fortune": "中等吉，谋略",
    "explanation": "沉默中预先谋划再说出。",
    "description": "不宜抢先发言，先观察后表达，在职场或辩论中将占上风，签约前多思考一刻。"
  },
  {
    "id": "25",
    "name": "长眠夜湿",
    "fortune": "凶，阴邪",
    "explanation": "长夜沉睡中身体受潮。",
    "description": "注意居住环境通风除湿，易患风湿或感冒，感情上容易陷入冷战，需主动破冰。"
  },
  {
    "id": "26",
    "name": "裁毛衣时",
    "fortune": "小吉，手工",
    "explanation": "正在裁剪毛衣的时候。",
    "description": "手工、DIY、修理类事情容易成功，适合改旧物为新用，财运来自变废为宝。"
  },
  {
    "id": "27",
    "name": "揣测运势",
    "fortune": "中平，玄学",
    "explanation": "猜测自己的运气。",
    "description": "近期易迷信或过度推算，其实运势中等，不妨放下焦虑，实际行动比占卜更重要。"
  },
  {
    "id": "28",
    "name": "春梦有失",
    "fortune": "小凶，感情",
    "explanation": "美好的春梦里有所缺失。",
    "description": "感情中可能出现小失望或期望落空，单身者不宜急于表白，已婚者多沟通。"
  },
  {
    "id": "29",
    "name": "纯美月色",
    "fortune": "大吉，浪漫",
    "explanation": "清澈无杂质的月光。",
    "description": "桃花运上升，适合约会、表白或修复关系，夜晚灵感强，艺术工作者易出佳作。"
  },
  {
    "id": "30",
    "name": "垂眸演说",
    "fortune": "中等吉，说服力",
    "explanation": "垂下眼眸娓娓道来。",
    "description": "演讲或汇报时采用沉稳风格更具感染力，易打动听众，求职或答辩顺利。"
  },
  {
    "id": "31",
    "name": "苍茫夜色",
    "fortune": "小凶，迷茫",
    "explanation": "广阔而昏暗的夜色。",
    "description": "前路看不清，容易迷失方向，近期不宜独自远行或做重大投资，需结伴或请教他人。"
  },
  {
    "id": "32",
    "name": "擦抹药水",
    "fortune": "大吉，康复",
    "explanation": "用棉签擦抹药水治疗伤口。",
    "description": "健康运回升，旧疾可愈，也象征及时弥补错误，职场中主动道歉或修正可得谅解。"
  },
  {
    "id": "33",
    "name": "仓满雨水",
    "fortune": "凶，水灾",
    "explanation": "粮仓里灌进了雨水。",
    "description": "财务上要防漏水式损失（意外开支、盗窃、合同漏洞），房屋防水需检查。"
  },
  {
    "id": "34",
    "name": "陈米养生",
    "fortune": "中平，节俭",
    "explanation": "用陈放的大米来养生。",
    "description": "近期适合节约开支，不追求新鲜奢华反而有益健康，但注意食材保质期。"
  },
  {
    "id": "35",
    "name": "馋猫咽食",
    "fortune": "小吉，口福",
    "explanation": "馋嘴的猫大口吞食物。",
    "description": "美食运佳，可能收到请客或礼物，但小心暴饮暴食伤胃，财运小有进账。"
  },
  {
    "id": "36",
    "name": "草茂雨水",
    "fortune": "大吉，生长",
    "explanation": "草木茂盛，雨水充沛。",
    "description": "事业或学业进入快速成长期，贵人如雨露般出现，适合扩展人脉与合作。"
  },
  {
    "id": "37",
    "name": "草没雨湿",
    "fortune": "小凶，阴滞",
    "explanation": "草丛被雨水淹没而湿透。",
    "description": "脚下易打滑，近期出行注意安全，工作中有小阻碍，但不会伤及根本。"
  },
  {
    "id": "38",
    "name": "仓木已疏",
    "fortune": "中平，空虚",
    "explanation": "仓库的木材已经稀疏。",
    "description": "资源略有不足，需盘点库存或资金，不宜借贷，适合精简开支。"
  },
  {
    "id": "39",
    "name": "晨牧遇舍",
    "fortune": "小吉，归宿",
    "explanation": "清晨放牧时遇到一间屋舍。",
    "description": "外出办事会有意外落脚点，求职或出差易遇临时庇护，贵人主动提供帮助。"
  },
  {
    "id": "40",
    "name": "初梅欲衰",
    "fortune": "中等凶，衰败",
    "explanation": "初春的梅花将要凋谢。",
    "description": "美好之事接近尾声，恋爱中热情减退，项目收尾阶段需防疏忽。"
  },
  {
    "id": "41",
    "name": "残梦月蚀",
    "fortune": "大凶，幻灭",
    "explanation": "残破的梦境遇上月蚀。",
    "description": "幻想破灭，投资易被套牢，感情上旧事重提造成伤害，宜放下执念。"
  },
  {
    "id": "42",
    "name": "船没于水",
    "fortune": "大凶，覆灭",
    "explanation": "船只沉没在水中。",
    "description": "重大失败风险，创业或考试需加倍努力，避免高风险博弈，健康防溺水。"
  },
  {
    "id": "43",
    "name": "藏谜于水",
    "fortune": "中平，隐晦",
    "explanation": "把谜团藏在水里。",
    "description": "真相难寻，八卦消息不可信，重要证据或被淹没，耐心等水退。"
  },
  {
    "id": "44",
    "name": "沉默咽石",
    "fortune": "大凶，自伤",
    "explanation": "沉默中吞下石头。",
    "description": "隐忍过度反伤身，胃痛或积郁成疾，建议找人倾诉或摔打枕头。"
  },
  {
    "id": "45",
    "name": "春眠叶湿",
    "fortune": "小吉，润泽",
    "explanation": "春天睡眠中叶子沾湿。",
    "description": "晨起皮肤好，适合做面膜或水疗，恋爱中泪水化解矛盾。"
  },
  {
    "id": "46",
    "name": "出马应试",
    "fortune": "大吉，功名",
    "explanation": "骑马出阵参加考试。",
    "description": "考试运极佳，面试、考证、竞赛易超常发挥，适合展示真才实学。"
  },
  {
    "id": "47",
    "name": "猜谜用诗",
    "fortune": "大吉，文采",
    "explanation": "用诗歌来猜谜。",
    "description": "才思敏捷，互动游戏易赢，表白可用藏头诗，成功率奇高。"
  },
  {
    "id":"48",
    "name": "尘梦影逝",
    "fortune": "中平，虚幻",
    "explanation": "尘世之梦如影消逝。",
    "description": "过往执念逐渐淡去，适合断舍离与心灵净化，旧照片整理后有释然感。"
  },
  {
    "id": "49",
    "name": "垂暮一世",
    "fortune": "大凶，终结",
    "explanation": "暮色垂落了一辈子。",
    "description": "退休或完结感强，宜处理遗产、写遗嘱，勿开启新恋情。"
  },
  {
    "id": "50",
    "name": "炒米用砂",
    "fortune": "小凶，硌牙",
    "explanation": "炒米时用了沙子。",
    "description": "吃饭咬到石子，投资遇虚假平台，口舌之福暗藏风险。"
  },
  {
    "id": "51",
    "name": "残梦印刷",
    "fortune": "大吉，留痕",
    "explanation": "把残破的梦印刷出来。",
    "description": "梦境变成作品，艺术家出绘本，程序员写灵异代码成功。"
  },
   {
    "id": "52",
    "name": "炒墨鱼丝",
    "fortune": "小吉，口福",
    "explanation": "爆炒墨鱼切成细丝，鲜美脆嫩。",
    "description": "近期适合品尝海鲜，聚会中有惊喜菜肴，财运小进，但注意过敏。"
  },
  {
    "id": "53",
    "name": "吃魔芋爽",
    "fortune": "中平，解馋",
    "explanation": "吃魔芋制成的辣味零食。",
    "description": "小确幸时刻，适合放松心情，但不宜过量，注意肠胃刺激。"
  },
  {
    "id": "54",
    "name": "传媒艺术",
    "fortune": "中平，传播",
    "explanation": "媒体与艺术的结合。",
    "description": "作品或观点易走红，适合短视频、广告、设计行业，流量与口碑双收。"
  },
  {
    "id": "55",
    "name": "春梦永世",
    "fortune": "中等吉，长情",
    "explanation": "春日美梦延续到永远。",
    "description": "感情深厚持久，暗恋可能修成正果，已婚者重温热恋。"
  }
];
