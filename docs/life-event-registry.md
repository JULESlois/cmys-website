# `/life` 事件注册表与剧情树维护说明

当前 `/life` 已接入统一事件注册表：

```text
src/data/life/events-registry.ts
```

注册表聚合：

```text
src/data/life/events-anchors.ts
src/data/life/events-parametric.ts
src/data/life/events-chapters.ts
```

事件引擎入口：

```text
src/engine/events.ts
```

事件引擎现在通过以下函数读取事件：

```ts
getAllLifeEvents()
getAnchorLifeEvents()
```

## 主线篇章树

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

这些主线篇章只作为底层维护结构使用，不改变当前 UI。

## 隐藏篇章树

隐藏篇章定义在：

```text
src/data/life/chapters.ts
```

隐藏篇章事件定义在：

```text
src/data/life/events-chapters.ts
```

当前已有：

```text
沉没异生篇 / well_otherworld
```

## 新增主线事件

新增现实主线事件时，优先放入：

```text
src/data/life/events-parametric.ts
```

事件会按年龄自动归属到主线篇章。跨阶段事件可以手动指定：

```ts
storyArcId: "arc_university"
```

## 新增隐藏篇章事件

新增隐藏篇章事件时，放入：

```text
src/data/life/events-chapters.ts
```

通常需要写明：

```ts
chapterId: "well_otherworld"
requiredChapter: "well_otherworld"
```

## 注册表工具

`events-registry.ts` 提供：

```ts
getAllLifeEvents()
getAnchorLifeEvents()
getEventsByStoryArc(storyArcId)
getEventsByHiddenChapter(chapterId)
getEventPackById(id)
getEventRegistrySummary()
```

## 当前统计

```text
初梦幼生篇：7 个事件
春苗幼生篇：23 个事件
沉默应试篇：6 个事件
出门远涉篇：37 个事件
城暮游生篇：6 个事件
承命应世篇：40 个事件
迟暮影深篇：25 个事件
沉没异生篇：31 个相关事件（含入口）
沉命余赊篇：15 个相关事件（含入口）
```

总计：

```text
172 个事件
```

## 后续拆文件建议

当前只是注册表级归档，尚未物理拆分旧事件文件。后续可以逐步迁移为：

```text
events-infant.ts
events-elementary.ts
events-middle-school.ts
events-university.ts
events-young-adult.ts
events-midlife.ts
events-elder.ts
events-hidden-well.ts
events-hidden-dream.ts
events-hidden-abyss.ts
```

## 命名规则

新增篇章名与事件标题应尽量遵循 CMYS 四字结构。篇章名可以在四字标题后追加“篇”。


## 黄泉债篇

新增 `沉命余赊篇 / 黄泉债篇`，入口事件为 `p_yomi_receipt`。当 `yomi_debt >= 2` 时可触发，进入后消费并推进黄泉债相关事件。


## 特殊篇章属性规则

特殊篇章事件默认不需要修改六维属性。优先使用 `chapterFlags`、`relationshipEffect`、`exitChapter`、`completeChapterId` 和 `triggerChapterId` 表达剧情推进。只有当选择明确产生现实身体代价、长期伤害或外部资源代价时，才写入六维属性变化。

## 篇章入场动画

特殊篇章可以在 `src/data/life/chapters.ts` 中配置 `entryAnimation`：

```ts
entryAnimation: {
  enabled: true,
  chars: ["沉", "没", "异", "生"],
  subtitle: "井底没有水，只有向下的楼梯。",
  durationMs: 3400,
  motif: "well",
}
```

流程为：进入篇章选项结算 -> 展示结果文本 -> 关闭结果页 -> 播放篇章入场动画 -> 渐出 -> 同年龄继续篇章事件。篇章入场动画使用纯黑底白字，不复用 `/life` 初始进入页的逐字动画。未配置或 `enabled: false` 的篇章不会播放动画。


### 特殊天赋与井下门槛

天赋现在区分普通天赋与特殊天赋。特殊天赋是路线门票，不以属性加成为主。当前抽取规则为：三轮天赋选择中只在第 1 轮最多出现 1 个特殊天赋；如果已经选择特殊天赋，后续候选池不再出现特殊天赋。

当前样板特殊天赋为 `t_jingtingyusheng / 井听余声`。该天赋允许玩家安全进入《沉没异生篇》。`p_kid_well / 沉没影深` 与 `p_kid_well_dream / 沉梦又深` 保留原有入口描述和选项文本，但对应危险选项现在使用条件分支：拥有 `井听余声` 时沿用原进入篇章结果；没有该天赋时，同一选择会直接进入强制死亡，不走濒死转化。

事件系统为此新增 `conditionalEffects`：同一个选项可以根据 `requiredTalents` / `excludedTalents` 解析为不同的真实后果。默认分支仍使用原 `effects/resultText`，命中条件分支时使用该分支的 `effects/resultText` 替换默认结果。

`triggerEventId` 现已接入 reducer。选项或天赋死亡改写写入 `triggerEventId` 后，不会跳过当前结果页；系统会先展示当前结果，关闭后在同一年龄立刻呈现目标事件。

事件现在支持 `eventTags`。天赋可以通过 `effects.eventWeightTags` 按标签调整事件权重，例如 `井听余声` 会提高 `well` 标签事件权重，`命赊未清` 会提高 `yomi` 标签事件权重。

新增样板特殊天赋 `t_mingsheweiqing / 命赊未清`。该天赋提供死亡改写：第一次 `accident` 类型死亡不会直接结束，而是写入 `yomi_debt: 2`，显示赊命结果，并通过 `triggerEventId: "p_yomi_receipt"` 跳转到黄泉债收据事件。

### 天赋持续效果

天赋现在不仅在开局选择时影响初始属性，也会在对应年龄段持续修饰事件结算。持续效果只作用于事件已经产生变化的属性：正向天赋会放大对应收益或缓冲对应损失，负向天赋会削弱对应收益或加重对应损失。这样可以让天赋参与事件结算，同时避免每个事件无条件追加属性导致数值爆炸。结果页会通过 `talentEffects` 展示天赋参与，例如“天赋「出马应试」影响智力+1”。

## 数值平衡规则

属性数值平衡应在事件数据中手动完成，不在结算层自动追加机会成本。主线互动选择如果存在纯正面收益，需要直接修改对应事件的 `attributes`，让选择在文本与数值上同时体现代价、取舍或风险。当前主线互动选择已完成一轮显式代价补充；初始属性区间为 10~20，事件使用适配低初始值的温和缩放表；正收益推动长期成长，负收益保留取舍但避免轻微代价在早期直接致死。特殊篇章仍默认不强制修改六维属性，优先通过 `chapterFlags`、关系变化、篇章进入/退出和结局状态表达代价。

## 六维满值结局触发

六维属性达到 100 且尚未锁定满值结局时，会锁定对应满值结局，并进入 `ending_prelude` 前置结算页。该页使用与死亡前置页一致的“标题 + 触发文本 + 查看结局”节奏，而不是复用普通事件结果页。玩家点击查看结局后进入最终结算页。触发检查已收敛到 reducer 层统一出口，覆盖普通事件选择、自动事件、`LOAD_SAVE`、天赋选择和婴幼期自动成长等路径。结算页优先使用已锁定的 `attributeEndingId`，并显示满值结局专属描述、风味文本和人生亮点。
