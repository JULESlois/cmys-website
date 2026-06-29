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


## 数值平衡规则

属性数值平衡应在事件数据中手动完成，不在结算层自动追加机会成本。主线互动选择如果存在纯正面收益，需要直接修改对应事件的 `attributes`，让选择在文本与数值上同时体现代价、取舍或风险。当前主线互动选择已完成一轮显式代价补充；初始属性区间为 10~20，事件使用适配低初始值的温和缩放表；正收益推动长期成长，负收益保留取舍但避免轻微代价在早期直接致死。特殊篇章仍默认不强制修改六维属性，优先通过 `chapterFlags`、关系变化、篇章进入/退出和结局状态表达代价。

## 六维满值结局触发

六维属性达到 100 且尚未锁定满值结局时，会锁定对应满值结局，并进入 `ending_prelude` 前置结算页。该页使用与死亡前置页一致的“标题 + 触发文本 + 查看结局”节奏，而不是复用普通事件结果页。玩家点击查看结局后进入最终结算页。触发检查已收敛到 reducer 层统一出口，覆盖普通事件选择、自动事件、`LOAD_SAVE`、天赋选择和婴幼期自动成长等路径。结算页优先使用已锁定的 `attributeEndingId`，并显示满值结局专属描述、风味文本和人生亮点。
