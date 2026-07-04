# `/life` 篇章树系统设计

> 目标：为 `/life` 增加类似 galgame 剧情树的“篇章树”能力，使关键事件、隐藏触发器、异常剧情和特殊结局可以被系统化组织。篇章树不是替代现实人生主线，而是在现实主线下增加隐藏分歧。


## 当前落地状态（2026-07-01）

篇章树已从设计稿进入可运行状态。当前实现重点如下：

```text
主线篇章：src/data/life/story-arcs.ts
隐藏篇章：src/data/life/chapters.ts
井下事件：src/data/life/events-chapters.ts
黄泉债事件：src/data/life/events-yomi.ts
篇章状态：GameState.chapter
篇章入口页：LifeChapterIntro
篇章结算页：LifeStoryArcSummary
```

当前已落地隐藏篇章：

```text
well_otherworld / 沉没异生篇
yomi_debt       / 沉命余赊篇
```

当前事件调度优先级与早期设计略有差异：

```text
1. 当前年龄锚点事件优先。
2. 当前 activeChapterId 下的特殊篇章事件优先。
3. 满足条件的参数化事件按权重抽取。
4. 事件默认不推进年龄；只有显式 ageDelta 才消耗年龄。
5. 同一事件同一年龄不重复触发。
6. 无事件年份不再显示普通继续页，而是自动推进。
7. 主线篇章切换显示一次简化结算页。
8. 特殊篇章入口拥有独立 chapter_intro，因此跳过主线结算页并直接切换音乐。
```

本设计文档后续可继续用于扩展新篇章，但实现细节应以 `docs/life-event-registry.md` 的当前状态为准。

---

## 1. 设计定位

当前 `/life` 是现实人生模拟器，但其标题、文本、事件命名已经带有明显的诗性、怪诞和象征色彩。篇章树系统建议将游戏定位升级为：

```text
现实人生主线 + 隐藏异常篇章树
```

玩家表面上在经历普通人生：上学、考试、工作、爱情、健康、财富、衰老。

但在某些关键节点，现实会出现裂缝：废井、薄冰、雷击、海潮、病院、梦境、过劳、知己、死亡边缘。这些节点不再只是“答错即死”，而可以成为进入隐藏篇章的触发器。

核心体验应从：

```text
你要躲避死亡。
```

转为：

```text
你在死亡边缘发现另一条人生。
```

## 2. 为什么需要篇章树

当前 `/life` 存在一类问题：很多即死事件是明显安全常识题。

例如：

```text
吃陌生药丸 / 扔掉药丸
冲进浓烟 / 堵门缝等救援
拖延咳血 / 住院检查
跳进急流 / 找绳索救人
```

这种设计的短期效果是刺激，但长期会削弱可玩性。玩家学会避开明显危险后，事件就失去策略价值；如果玩家点错，则直接死亡，探索也中断。

篇章树可以把部分即死事件改造成：

```text
危险选择 -> 死亡 / 重伤 / 隐藏篇章入口
```

这样危险事件不再只有惩罚功能，也承担“打开新剧情”的功能。

## 3. 核心概念

### 3.1 篇章 Chapter

篇章是一组特殊事件、触发条件、状态 flag 和结局的集合。

示例：

```text
《沉没异生篇》
《梦蚀篇》
《海渊篇》
《犬鸣永生篇》
```

每个篇章可以有：

```text
入口事件
篇章内事件
篇章 flag
篇章阶段
退出条件
完成条件
特殊结局
与现实主线的回响事件
```

### 3.2 触发器 Trigger

触发器是进入篇章的条件。触发器不一定暴露给玩家。

建议分三类：

```text
明触发：玩家能看出异常。
暗触发：玩家以为只是普通事件，但满足条件后进入篇章。
累积触发：多个选择累计 flag，达到阈值后进入篇章。
```

### 3.3 篇章 flag

篇章 flag 用于记录隐藏状态。

示例：

```ts
chapterFlags: {
  abyss_gaze: 1,
  dream_corruption: 3,
  dog_memory: 2,
  well_stair_seen: true,
  sea_called_name: true
}
```

flag 可以影响：

```text
事件是否出现
事件选项是否变化
死亡是否转化为篇章入口
结局是否解锁
NPC 是否记得某些事
```

## 4. 数据结构建议

### 4.1 GameState 扩展

在 `GameState` 中增加：

```ts
interface ChapterState {
  activeChapterId: string | null;
  unlockedChapterIds: string[];
  completedChapterIds: string[];
  chapterFlags: Record<string, boolean | number | string>;
  chapterDepth: number;
}

interface GameState {
  chapter: ChapterState;
}
```

字段说明：

```text
activeChapterId：当前正在经历的篇章。null 表示现实主线。
unlockedChapterIds：已解锁过的篇章，用于结算页和重玩提示。
completedChapterIds：已完成的篇章。
chapterFlags：篇章内部和跨篇章隐藏状态。
chapterDepth：异常程度或篇章深入程度，可影响文本、UI、结局。
```

### 4.2 Chapter 定义

新增：`src/data/life/chapters.ts`

```ts
export interface ChapterDefinition {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  tone: "fantasy" | "cthulhu" | "isekai" | "urban_legend" | "dream" | "reincarnation";
  entryEventIds: string[];
  exitEventIds?: string[];
  endingEventIds?: string[];
}
```

示例：

```ts
export const CHAPTERS: ChapterDefinition[] = [
  {
    id: "well_otherworld",
    name: "沉没异生篇",
    subtitle: "井底没有水，只有向下的楼梯。",
    description: "童年废井之后，现实开始出现通往旧乡的裂缝。",
    tone: "isekai",
    entryEventIds: ["p_kid_well"],
  },
];
```

### 4.3 事件字段扩展

在 `EventBase` 上增加：

```ts
interface EventBase {
  chapterId?: string;
  requiredChapter?: string;
  excludedChapter?: string;
  triggerChapter?: string;
  chapterFlagsRequired?: Record<string, boolean | number | string>;
  chapterPriority?: number;
}
```

在 `EventChoice.effects` 上增加：

```ts
effects: {
  triggerChapterId?: string;
  setChapterFlags?: Record<string, boolean | number | string>;
  exitChapter?: boolean;
  completeChapterId?: string;
}
```

## 5. 事件选择规则

篇章树加入后，事件选择优先级建议为：

```text
1. 当前年龄的锚点事件
2. 当前 activeChapterId 下的篇章事件
3. 满足触发条件的篇章入口事件
4. 普通参数化事件
5. 无事件则进入 aging 状态，由 LifeAutoAdvance 自动推进
```

如果当前处于篇章内：

```text
1. 优先选篇章事件
2. 篇章无可用事件时，允许现实事件穿插
3. 到达退出条件后触发篇章退出或特殊结局
```

这样可以避免篇章刚进入就被普通随机事件冲散。

## 6. 首批推荐篇章

### 6.1 《沉没异生篇》

**触发源**

```text
p_kid_well 沉没影深
```

**原事件问题**

当前“掀开井盖”是直接即死选项。它很适合改为神隐/异世界入口。

**改造方向**

```text
掀开井盖
  -> 普通失败：坠井重伤 / 死亡
  -> 运势高：被救起，但听见井底有人喊你的名字
  -> 满足 hidden flag：井底没有水，只有一条向下的楼梯，进入《沉没异生篇》
```

**篇章主题**

```text
童年神隐
井下旧乡
与现实相似但每个人都没有影子的小镇
回到现实后，某些记忆被替换
```

**后续回响**

```text
青年期：你在陌生城市看到井下旧乡的路牌。
壮年期：一个客户长得像井下遇见的人。
晚年期：你终于想起自己当年不是一个人掉下去的。
```

### 6.2 《梦蚀篇》

**触发源**

```text
p_young_create 沉眠欲深
p_mid_overwork 沉眠永世
高 creativity + 低 luck + 多次熬夜选择
```

**篇章主题**

```text
梦境污染
写下的文字开始反向观看作者
凌晨三点固定醒来
现实中出现梦里的句子
```

**机制建议**

增加 flag：

```text
dream_corruption
forbidden_sentence_seen
third_hour_awake
```

当 `dream_corruption >= 3` 时进入篇章。

**结局方向**

```text
醒来：摆脱污染，才脉大幅提升但失去部分记忆。
沉眠：进入梦中世界，现实人生停止。
著书：把污染写成作品，获得高分特殊结局。
```

### 6.3 《海渊篇》

**触发源**

```text
a_young_lost 沉没永逝
p_young_tide 潮没影深
溺水边缘 / 海边旅行 / 低 luck
```

**篇章主题**

```text
深海克苏鲁
潮汐不是自然现象，而是某种古老存在的呼吸
你被海记住了名字
```

**机制建议**

```text
abyss_gaze
sea_called_name
tide_debt
```

海渊篇不应每次都直接死亡。它可以让玩家获得强运或灵感，但逐步增加晚年被召回的风险。

### 6.4 《犬鸣永生篇》

**触发源**

```text
esu狗子关系线
confidant affinity >= 80
玩家濒死次数 >= 2
某些结局后重开
```

**篇章主题**

```text
知己不是普通 NPC，而是轮回锚点。
狗子可能记得上一局。
每一世他都试图把你从某个结局里拉回来。
```

**机制建议**

```text
dog_memory
dog_promise
dog_betrayal
dog_saved_you
```

**特殊价值**

这条篇章可以把关系系统变成 `/life` 的记忆核心。玩家会更在意与狗子的关系，而不是只把它看成好感度数值。

## 7. 即死事件改造原则

不是所有即死事件都要改成篇章入口。建议分三类处理：

### 7.1 保留直接死亡

适合非常明确、没有叙事潜力的高危行为。

```text
毒品
严重医疗拖延
地下赌场极端失败
```

但数量应减少，并避免过多集中在左侧选项。

### 7.2 改成累计风险

适合现实主义长期问题。

```text
过劳
酗酒
债务
高血压
家庭关系破裂
```

不要一次选错就死，而是积累风险。风险达到阈值后再触发危机。

### 7.3 改成篇章触发器

适合有象征意味、空间感、怪异感的事件。

```text
废井
薄冰
雷击
海潮
森林迷路
病院阴影
梦境创作
知己濒死
```

这类事件应优先进入篇章树。

## 8. UI 表现建议

篇章进入时不需要大规模新 UI，先做轻量提示即可。

### 8.1 篇章进入 Banner

新增 `LifeChapterBanner.tsx`：

```text
沉没异生篇
井底没有水，只有向下的楼梯。
```

风格建议：

```text
黑底
细线网格扭曲
标题四字或六字竖排
短暂 glitch / blur
```

### 8.2 状态展示

不建议一开始把所有篇章 flag 暴露给玩家。可以只展示：

```text
现实出现裂缝
梦境正在加深
海在记住你
狗子似乎想起了什么
```

保持神秘感。

### 8.3 结算页展示

`LifeDeathScreen` 中增加：

```text
解锁篇章：沉没异生篇、梦蚀篇
完成篇章：海渊篇
隐藏标记：被海记住的人
```

## 9. 最小可用版本 MVP

不要一开始做完整篇章树。建议 MVP 只实现《沉没异生篇》。

### MVP 范围

```text
1. GameState 增加 chapter 字段。
2. 事件支持 triggerChapterId / requiredChapter。
3. p_kid_well 的危险选择不再固定即死，而是有条件进入 well_otherworld。
4. 新增 3~5 个井下篇事件。
5. 篇章可以退出回现实，或导向特殊死亡/特殊成就。
6. 存档能保存 chapter 状态。
```

### MVP 验收

```text
普通玩家可以正常走现实主线。
触发 p_kid_well 后，有概率或条件进入《沉没异生篇》。
进入篇章后，接下来数个事件优先来自井下篇。
篇章结束后可以回到现实人生，且留下一个 flag。
结算页能显示解锁过《沉没异生篇》。
```

## 10. 与现有修复计划的关系

篇章树应放入修复计划的 P1-0，但它依赖两个 P0：

```text
P0-1 年龄推进与事件触发错位
P0-2 锚点事件优先
```

如果这两个没修，篇章事件也会被年龄调度和随机选择冲掉。

因此推荐顺序：

```text
1. 修年龄推进。
2. 修锚点优先。
3. 修主线 resultText 错位。
4. 实现篇章树 MVP。
5. 再重调大规模数值和即死事件。
```

## 11. 风格边界

篇章可以奇幻、克苏鲁、异世界，但不建议完全脱离 CMYS 的原有气质。

推荐风格：

```text
克制、诗性、含混、象征、慢性污染、现实裂缝。
```

不推荐：

```text
直接变成热血战斗升级。
大量技能数值和装备系统。
过度解释世界观。
一开始就告诉玩家“这是异世界”。
```

篇章的重点不是设定堆叠，而是让玩家觉得：

```text
这条人生本来可以平凡地结束，直到某个晚上，现实向我露出了背面。
```
