# `/life` 事件注册表与剧情树维护说明

本文记录当前 `/life` 事件、篇章、音乐、天赋与流程状态。更新时间：2026-07-01。

## 当前入口文件

统一事件注册表：

```text
src/data/life/events-registry.ts
```

注册表聚合：

```text
src/data/life/events-anchors.ts
src/data/life/events-parametric.ts
src/data/life/events-chapters.ts
src/data/life/events-yomi.ts
```

其中 `events-parametric.ts` 现在只是参数化事件聚合入口，具体事件已拆到：

```text
src/data/life/parametric-events/childhood.ts
src/data/life/parametric-events/youth.ts
src/data/life/parametric-events/midlife.ts
src/data/life/parametric-events/elder.ts
src/data/life/parametric-events/relationships.ts
src/data/life/parametric-events/wealth.ts
src/data/life/parametric-events/luck.ts
src/data/life/parametric-events/career.ts
src/data/life/parametric-events/meme.ts
```

事件引擎入口：

```text
src/engine/events.ts
src/engine/reducer.ts
```

核心读取函数：

```ts
getAllLifeEvents()
getAnchorLifeEvents()
getEventsByStoryArc(storyArcId)
getEventsByHiddenChapter(chapterId)
getEventPackById(id)
getEventRegistrySummary()
```

## 当前主线篇章

主线篇章定义在：

```text
src/data/life/story-arcs.ts
```

当前划分：

```text
初梦幼生篇 / 婴幼篇        0~5
春苗幼生篇 / 萌娃篇 · 小学 6~11
沉默应试篇 / esu篇 · 中学  12~17
出门远涉篇 / 大学篇        18~22
城暮游生篇 / 青年篇        23~30
承命应世篇 / 壮年篇        31~60
迟暮影深篇 / 晚年篇        61~100
```

主线篇章现在不只是维护结构：篇章结尾会显示一次简化结算页，内容仅保留当前篇章名、年龄、属性和继续按钮。普通无事件年份不会显示“旅程仍在继续”页，而是由 `LifeAutoAdvance` 自动推进。

## 当前隐藏篇章

隐藏篇章定义在：

```text
src/data/life/chapters.ts
```

隐藏篇章事件定义在：

```text
src/data/life/events-chapters.ts
src/data/life/events-yomi.ts
```

当前已有：

```text
沉没异生篇 / well_otherworld
沉命余赊篇 / yomi_debt
```

特殊篇章有独立入口页。进入特殊篇章时不显示主线篇章结算页，音乐也直接切换到特殊篇章曲目。

## 当前事件统计

按当前 `getEventRegistrySummary()` 统计：

```text
初梦幼生篇：7 个事件
春苗幼生篇：24 个事件
沉默应试篇：14 个事件
出门远涉篇：43 个事件
城暮游生篇：6 个事件
承命应世篇：40 个事件
迟暮影深篇：25 个事件
沉没异生篇：33 个相关事件（含入口）
沉命余赊篇：15 个相关事件（含入口）
```

总计：

```text
204 个事件
```

其中近期新增：

```text
14 个中文互联网 / 二次元梗事件
28 个梗事件选项
```

梗事件统一使用 `meme` 标签，并以低到中等权重、单次触发为主，避免挤压主线人生事件。

## 当前主要标签覆盖

高频标签包括：

```text
social: 31
danger: 28
pressure: 23
elder: 22
creation: 19
wealth: 18
health: 17
career: 17
hidden: 17
yomi: 15
meme: 14
family: 13
lonely: 12
comfort: 11
travel: 10
```

天赋权重系统依赖 `eventTags`。新增事件时应优先补充准确标签，而不是只依赖年龄范围。

## 当前事件选择规则

事件系统当前行为：

```text
1. 当前年龄锚点事件优先。
2. 如果处于 activeChapterId，优先抽取当前特殊篇章事件。
3. 普通参数化事件按权重抽取。
4. 同一事件在同一年龄不会重复触发。
5. 每个年龄点最多触发 1 个普通参数化事件。
6. 锚点、triggerEventId 强制事件和特殊篇章事件不受普通事件上限限制。
7. 无事件或达到普通事件上限时进入 aging 状态，由 LifeAutoAdvance 自动推进。
```

事件现在支持：

```ts
eventTags?: string[]
ageDelta?: number
cooldownYears?: number
chapterId?: string
requiredChapter?: string
excludedChapter?: string
triggerChapter?: string
chapterFlagsRequired?: Record<string, boolean | number | string>
chapterPriority?: number
```

`ageDelta` 是事件级年龄推进属性。默认值为 `0`，即事件本身不会直接消耗年龄。为了避免同一年龄刷空事件池，事件系统另有普通事件软上限：每个年龄点最多 1 个普通参数化事件；达到上限后自动推进年龄。只有显式写入 `ageDelta: 1`、`ageDelta: 3` 等时，关闭结果页后才立即推进指定年龄数。




## 当前随机选项语义审查工具

已新增随机抽样语义审查脚本：

```bash
./node_modules/.bin/tsx src/dev/life-random-choice-review.ts --seed=20260703 --samples=80 --onlyReview=true
```

可输出 JSON：

```bash
./node_modules/.bin/tsx src/dev/life-random-choice-review.ts --seed=17 --samples=500 --json=true
```

该脚本会：

```text
1. 按随机种子抽取事件。
2. 随机打乱选项展示顺序。
3. 随机点击一个展示选项。
4. 真实调用 reducer 得到结果页文本。
5. 检查结果页是否包含被点击选项的 resultText。
6. 使用语义标签、致死语义、属性收益/代价词做启发式判断。
```

本轮用该脚本发现 `events-anchors.ts` 中一批锚点事件结果文本串台：婴幼期、小学、围棋、暴雨、高中、高考、大学、初恋、毕业、壮年等事件的结果曾误接到其他年龄段事件。现已集中修复。

当前 500 次随机抽样结果：

```text
seed=17
samples=500
ok=435
review=65
mismatch=0
```

`review` 是启发式提示，主要来自超现实篇章、隐喻文本或语义词典覆盖不足；`mismatch=0` 表示未发现结果页不包含被点击选项原始结果文本的硬错配。

第二轮随机审查继续修复：

```text
p_mid_debt：违法翻盘选项原先写入狱，却标记 isLethal；已改为严重财富、运势、形象损失，不再触发死亡/濒死转化。
a_mid_checkup：将非致死文本中的“真正致命”改为“最沉重的转折”，避免非致死结果误读。
p_luck_crash：补充错过复盘、邀约和补救机会，使 luck 大幅下降更有文本支撑。
p_elder_curtain：临终文本补充“呼吸停了”，使致死结果更明确。
随机审查词典：移除“最后”“走了”“终点”等高误报词；致死选项若结果已明确 death，不再因标签不重合降级。
```

## 当前事件文本审查工具

已新增事件文本审查脚本：

```bash
npm exec tsx -- src/dev/life-event-audit.ts
```

严格模式：

```bash
npm exec tsx -- src/dev/life-event-audit.ts --strict=true
```

当前审查范围：

```text
事件 id / 标题 / 描述是否为空
非自动事件是否有选项
选项文本与 resultText 是否为空
forceLethal 是否与 isLethal 配套
致死选项是否有死亡/终止语义提示
非致死选项是否疑似写成死亡结果
大幅正负属性变化是否有对应收益/代价语义
隐藏篇章允许空标题，用于空白子选项事件
```

当前结果：

```text
events=204
choices=401
error=0
choiceResolution checked=386
choiceResolution mismatches=0
```

warning 属于人工复查提示，不作为构建失败条件。隐藏篇章、黑色幽默和超现实文本可能会触发误报，需要按语境判断。

`choiceResolution` 会强制反转左右选项顺序并调用 reducer，验证结果页文本是否包含玩家实际点击选项的 `resultText`。该项用于防止“点击 A，结果页显示 B”的回归。

## 当前选项展示规则

事件选项进入展示前会随机化左右顺序：

```text
currentEvent.choices        保留事件原始顺序
pendingChoiceOrder          记录展示索引到原始索引的映射
pendingChoices              按 pendingChoiceOrder 生成，用于前端展示
RESOLVE_EVENT.choiceIndex   表示玩家选择的展示索引
```

结算时使用：

```text
currentEvent.choices[pendingChoiceOrder[choiceIndex]]
```

因此点击、滑动、键盘选择看到的是随机左右顺序，但结算仍映射回事件原始选项。旧存档如果没有 `pendingChoiceOrder`，读取时会自动按 `[0, 1, ...]` 兼容。

这样可以避免玩家通过“左边通常危险 / 右边通常安全”之类的方向经验游玩。

## 当前选项效果规则

事件选项支持：

```ts
attributes?: Partial<Record<AttributeName, number>>
grantTalents?: string[]
removeTalents?: string[]
triggerEventId?: string
triggerChapterId?: string
setChapterFlags?: Record<string, boolean | number | string>
exitChapter?: boolean
completeChapterId?: string
holdAge?: boolean
relationshipEffect?: { targetId: string; change: number }
careerLevelDelta?: number
isLethal?: boolean
forceLethal?: boolean
```

`conditionalEffects` 已接入，同一个选项可以根据天赋条件解析为不同后果。井下入口使用该机制区分“有特殊天赋安全入篇章”和“无特殊天赋强制死亡”。

`triggerEventId` 已接入 reducer。选项或天赋死亡改写写入 `triggerEventId` 后，系统会先展示当前结果，关闭后在同一年龄立刻呈现目标事件。

## 当前天赋规则

天赋选择规则：

```text
开局随机展示 3 个候选。
玩家只能选择 1 个。
候选中最多出现 1 个特殊天赋。
特殊天赋不显示“特殊”徽标，描述保持隐晦。
每个天赋展示描述压缩为 1 句话。
```

特殊天赋：

```text
沉鸣余声：提高井相关事件权重，并允许安全进入沉没异生篇。
持命余赊：提高黄泉债相关事件权重，并将第一次 accident 死亡改写为黄泉债入口。
```

普通天赋已功能化：除初始属性外，也通过 `eventWeightTags`、持续结算修饰和死亡改写参与一局游戏。

## 当前死亡改写规则

`TalentDeathConversion` 支持：

```ts
deathType?: DeathType | "any"
attribute?: AttributeName
maxUses?: number
resultText: string
attributes?: Partial<Record<AttributeName, number>>
setChapterFlags?: Record<string, boolean | number | string>
triggerEventId?: string
triggerChapterId?: string
```

即死选项流程：

```text
isLethal 选项
-> 如果不是 forceLethal，先尝试天赋死亡改写
-> 再尝试普通濒死转化
-> 最后直接死亡
```

因此 `持命余赊` 可以拦截带 `accident` 标签的非强制即死选项，并触发黄泉债收据事件。

## 当前音乐系统

`/life` 已接入自适应 BGM：

```text
src/components/LifeMusicPlayer.tsx
src/data/life/music.ts
public/musics/life/README.md
```

当前模式：

```ts
LIFE_MUSIC_MODE = "netease_outer_url"
```

播放选择规则：

```text
选天赋 / 存档选择：life_menu
初梦幼生篇：life_menu（汐）
春苗幼生篇：life_menu（汐）
春苗幼生篇终章结算页：life_menu（汐）
沉默应试篇开始后：按 currentArcId 播放年龄段篇章曲
chapter_intro 或 activeChapterId=well_otherworld：chapter_well
chapter_intro 或 activeChapterId=yomi_debt：chapter_yomi
死亡页：death
结局页：ending
```

普通事件、危险事件、疾病事件不再临时切歌。音乐只在进入游戏、主线篇章切换、特殊篇章进入和游戏结束时切换。当前开局 BGM 延续到春苗幼生篇结束，进入沉默应试篇后才开始主线篇章曲切换。切换使用渐入渐出，曲名显示 2 秒，标题格式为 `原标题 (English)`。

## 新增事件维护规则

新增普通事件不再直接写入 `events-parametric.ts`。应按主题放入：

```text
src/data/life/parametric-events/childhood.ts
src/data/life/parametric-events/youth.ts
src/data/life/parametric-events/midlife.ts
src/data/life/parametric-events/elder.ts
src/data/life/parametric-events/relationships.ts
src/data/life/parametric-events/wealth.ts
src/data/life/parametric-events/luck.ts
src/data/life/parametric-events/career.ts
src/data/life/parametric-events/meme.ts
```

新增文件或新增导出数组后，需要在 `src/data/life/events-parametric.ts` 中聚合导入。

新增隐藏篇章事件优先放入：

```text
src/data/life/events-chapters.ts
src/data/life/events-yomi.ts
```

新增事件建议遵循：

```text
标题尽量是 CMYS 四字结构。
每个事件优先 2 个选项，除非有明确剧情必要。
默认不写 ageDelta。
数值以小幅波动为主，重大人生事件才使用大幅变动。
特殊篇章默认少改六维属性，优先使用 chapterFlags、关系、篇章状态。
梗事件应转化为人生场景，不直接堆网络语录。
```

## 当前拆文件状态

`events-parametric.ts` 已完成物理拆分。当前聚合入口保持不变：

```text
src/data/life/events-parametric.ts
```

具体参数化事件按年龄段和主题维护在：

```text
src/data/life/parametric-events/childhood.ts
src/data/life/parametric-events/youth.ts
src/data/life/parametric-events/midlife.ts
src/data/life/parametric-events/elder.ts
src/data/life/parametric-events/relationships.ts
src/data/life/parametric-events/wealth.ts
src/data/life/parametric-events/luck.ts
src/data/life/parametric-events/career.ts
src/data/life/parametric-events/meme.ts
```

后续如果新增隐藏篇章文件，可继续拆分：

```text
events-hidden-well.ts
events-hidden-yomi.ts
events-hidden-dream.ts
```
