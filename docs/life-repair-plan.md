# `/life` 人生模拟器修复计划

> 目标：先修复主循环、数值和玩家反馈，使 `/life` 从“可运行叙事原型”升级为“可稳定游玩的文字人生模拟器”。本计划按重要性排序，优先修影响一局游戏能否成立的问题，暂不继续堆新事件。


## 当前实现状态（2026-07-01）

本文件保留早期修复计划，但当前实现已经完成或改写了多个 P0 目标。后续阅读时应以本节为当前基线。

### 已完成 / 已改写

```text
P0-1 年龄推进与事件触发错位：已改为事件默认不增龄，普通无事件年份自动跳过。
P0-2 锚点事件优先：已在 selectEvent() 中优先选择当前年龄锚点。
P0-3 属性尺度与死亡阈值：已完成多轮属性缩放和平衡修复。
P0-4 即死方向问题：已先修复天赋死亡改写与非 forceLethal 即死拦截；左右随机映射尚未完成。
P0-5 resultText 错位：已做过局部修复，但仍需系统性复查。
篇章树系统：已落地主线 story_arcs、隐藏 chapters、chapterFlags、triggerChapterId、chapter_intro。
特殊篇章：已落地沉没异生篇、沉命余赊篇。
音乐系统：已落地 /life 自适应 BGM、网易云测试模式、曲名展示、渐入渐出。
天赋系统：已改为 3 选 1，普通天赋功能化，特殊天赋隐晦展示。
事件内容：已新增 14 个中文互联网 / 二次元梗事件。
```

### 当前主循环基线

```text
选天赋
-> 婴幼期自动叙事
-> 主线年龄段事件
-> 事件结果
-> 若事件 ageDelta > 0，推进年龄
-> 若事件 ageDelta 默认为 0，则在当前年龄继续找事件
-> 当前年龄无事件时，LifeAutoAdvance 自动推进到下一可处理年龄
-> 主线篇章切换时显示一次简化属性结算页
-> 特殊篇章进入时跳过主线结算页，直接播放 chapter_intro 并切换音乐
```

### 当前仍待处理

```text
1. 青年期高风险事件审查：早期常识题式即死已缓和，下一步应检查青年期高风险事件和 meme 事件密度。
2. 即死选项左右随机映射：当前仍可能通过按钮方向形成经验偏见。
3. resultText 全量一致性审查：尤其是早期锚点和新增梗事件以外的旧事件。
4. 梗事件密度观察：meme 标签事件当前为 14 个，低权重单次触发，仍需实际游玩观察是否破坏主线气质。
5. 隐藏篇章数据拆分：后续可继续拆分井下、黄泉债和未来特殊篇章事件。
6. 特殊篇章后续联动：井、黄泉债与狗子/替身/结局页的回响仍可继续加强。
```

---

## 历史基线（已被当前实现覆盖）

早期 `/life` 已具备完整闭环：开场动画、天赋选择、婴幼期自动叙事、事件选择、死亡、结算、成就、人生回顾。

当时版本存在以下核心问题：

- 年龄推进与事件触发规则错位，部分关键锚点事件不可达或不稳定。
- 锚点事件和参数化事件混合随机，人生主线容易被普通事件挤掉。
- 属性尺度与死亡阈值不匹配，导致玩家过早死亡。
- 即死选项几乎全部位于左侧，玩家会形成“永远选右”的错误策略。
- 很多事件更像安全常识题，而不是人生取舍；其中一部分适合改造为篇章触发器。
- 当前缺少类似 galgame 剧情树的篇章系统，无法把关键事件、隐藏线、异常叙事组织成可探索结构。
- 职业系统、天赋持续效果、成就历史追踪没有完整接入主循环。
- 部分事件 `resultText` 与事件正文错位，破坏叙事可信度。

---

## 历史 P0：早期必须优先修复项

P0 是决定 `/life` 是否能正常游玩的基础问题。建议一次性完成并测试，不要拆太散。

### P0-1 修复年龄推进与事件触发错位

**问题**

早期婴幼期结束后直接跳到 6 岁，但不会立即触发 6 岁锚点事件，导致 `a_primary` 基本被跳过；该问题当前已修复。

壮年期计划触发年龄是 `31, 34, 37, 40, 43, 46, 49, 52, 55, 58`，但实际 UI 在事件结算后 `+1`，再点击按钮 `+3`，会错位成 `32, 35, 38, 41...`。

晚年期部分锚点年龄也与 `shouldTriggerEvent()` 不匹配，例如 68、73、78、82 岁。

**涉及文件**

- `src/engine/reducer.ts`
- `src/engine/events.ts`
- `src/components/LifeInfancyStage.tsx`
- `src/components/LifeMidlifeStage.tsx`
- `src/components/LifeElderStage.tsx`
- `src/components/LifeYouthStage.tsx`

**修复方案**

1. 将“推进年龄”和“触发当前年龄事件”拆成两个清晰步骤。
2. 每次进入一个年龄点时，先检查该年龄是否有事件，而不是先跳过年龄。
3. `DISMISS_RESULT` 不应无条件 `advanceYears(..., 1)`，而应进入等待继续状态，由当前阶段决定下一次推进跨度。
4. 婴幼期结束后应触发 6 岁节点，而不是直接让玩家从 6 岁继续到 7 岁。
5. 统一壮年期推进节奏：事件触发后下一次仍然落在 `+3` 的节奏点上。

**建议实现**

新增或重构函数：

```ts
function enterAge(state: GameState, age: Age): GameState
function getNextAgeDelta(age: number): number
function advanceToNextPlayableAge(state: GameState): GameState
```

推荐主循环：

```text
当前年龄展示
  -> 玩家点击继续
  -> 根据阶段推进到下一个年龄
  -> enterAge()
    -> 优先检查锚点事件
    -> 再检查参数化事件
    -> 无事件则停留在 aging 状态等待继续
```

**验收标准**

- 6 岁一定能触发 `a_primary`。
- 31、34、37、40、43、46、49、52、55、58 岁能按预期进入事件判定。
- 68、73、78、82 岁晚年锚点不会因调度规则而不可达。
- 事件结算后不会额外吞掉一个年龄点。

---

### P0-2 锚点事件必须优先于参数化事件

**问题**

当前 `selectEvent()` 将锚点事件和参数化事件混在一起加权随机。即使当前年龄正好有高考、大学、初恋、毕业、三十岁等人生大事，也可能被普通随机事件挤掉。

**涉及文件**

- `src/engine/events.ts`
- `src/engine/reducer.ts`

**修复方案**

1. 新增 `getAnchorEventsForAge(state)`。
2. 当前年龄存在锚点事件时，锚点事件优先。
3. 如果同一年龄有多个锚点事件，按声明顺序或显式 `priority` 排序。
4. 只有当前年龄没有锚点事件时，才从参数化事件池中随机抽取。

**建议实现**

```ts
export function selectEvent(state: GameState): GameEvent | null {
  const anchors = getEligibleAnchorEvents(state);
  if (anchors.length > 0) return anchors[0];

  const parametric = getEligibleParametricEvents(state);
  return weightedPick(parametric);
}
```

**验收标准**

- 固定年龄锚点事件不会被普通事件挤掉。
- 关键主线事件能稳定形成完整人生骨架。
- 参数化事件仍然能填充非关键年份。

---

### P0-3 重调属性尺度与死亡阈值

**问题**

当前属性名义范围是 `0~100`，但初始属性只有 `3~5`，婴幼期加成后通常仍在个位数到十几之间。

死亡规则中，30 岁后致死属性 `<=10` 即死。结果是许多玩家进入 31 岁后会因为某项属性没有成长到 11 以上直接死亡。

**涉及文件**

- `src/engine/reducer.ts`
- `src/engine/death.ts`
- `src/data/life/talents.ts`
- `src/data/life/events-anchors.ts`
- `src/data/life/events-parametric.ts`
- `src/components/LifeStatsBars.tsx`

**推荐方案**

采用 `0~100` 尺度，初始属性保持低位，主要通过事件和天赋推动成长：

```text
初始属性：10~20
天赋修正：±5~15
普通事件修正：正向约 +2~+12，负向约 -1~-10
重大事件修正：正向最高约 +20，负向最高约 -18
30 岁前死亡阈值：<=0
30 岁后死亡阈值：<=10
```

保留当前 UI 百分比状态条，不改成小数值系统。

**具体任务**

1. `rollD6()` 改为更符合当前低起点成长设计的初始化，例如 `rollInitialAttribute(): 10~20`。
2. 婴幼期事件加成从 `+1/+2` 提升到百分制尺度，例如 `+3~+8`。
3. 天赋加成从 `±1~4` 提升到 `±5~15`。
4. 普通事件的影响按强度分级：轻微、中等、重大。
5. 补一组平衡测试脚本，统计 500 局随机/安全策略下的死亡年龄分布。

**验收标准**

- 随机玩家不应大规模死在 10~20 岁。
- 选择相对稳健策略时，中位死亡年龄应至少进入 60 岁以后。
- 死亡仍然存在，但不应是数值阈值误杀。
- 状态条视觉上能体现属性成长与衰退。

---

### P0-4 平衡即死选项方向

**问题**

当前 26 个即死选项中，25 个位于左侧，1 个位于右侧。玩家很快会学会“选右边更安全”，从而绕过文本判断。

**涉及文件**

- `src/data/life/events-anchors.ts`
- `src/data/life/events-parametric.ts`
- `src/components/ReignsCard.tsx`
- `src/engine/types.ts`，可选

**修复方案**

优先方案：渲染层随机左右映射，而不是手工调整所有事件顺序。

```text
事件数据中保留 choices 原始顺序
进入事件时生成 choiceOrder
ReignsCard 根据 choiceOrder 展示左右
RESOLVE_EVENT 根据 choiceOrder 映射回真实 choiceIndex
```

如不想引入 `choiceOrder`，则需要手工调整事件数据，使左/右危险分布接近 50:50。

**验收标准**

- 玩家不能通过固定方向判断安全选项。
- 即死事件的风险来自文本判断，而不是按钮位置。
- 键盘、拖拽、按钮点击都能正确映射到真实选项。

---

### P0-5 修正明显错位的 `resultText`

**问题**

早期锚点事件中有大量 `resultText` 与事件正文不匹配。玩家选择后看到完全不同场景，会直接破坏沉浸感。

**涉及文件**

- `src/data/life/events-anchors.ts`
- `src/data/life/events-parametric.ts`

**修复方案**

1. 先集中修 `events-anchors.ts`，尤其是 0~22 岁主线事件。
2. 对每个事件执行三项检查：
   - `description` 是否对应当前年龄与事件主题。
   - 每个 `choice.text` 是否对应选择逻辑。
   - `resultText` 是否确实是该选择的结果。
3. 再抽查 `events-parametric.ts` 中的高频事件。

**验收标准**

- 主线锚点事件无明显串台。
- 玩家选择后看到的反馈与选择一致。
- 事件日志回顾时能连成基本通顺的人生线。

---

## P1：核心体验增强

P1 不一定阻止游戏运行，但会影响重玩价值、策略感和长期体验。

### P1-0 新增篇章树与触发器系统

**定位**

将 `/life` 从单线现实人生模拟器升级为：

```text
现实人生主线 + 隐藏异常篇章树
```

篇章树类似 galgame 中的剧情树与触发器：玩家在关键事件中满足特定条件后，不只是死亡或扣属性，而是进入某个“篇”。这些篇章可以偏奇幻、克苏鲁、日式异世界、怪谈、轮回或精神污染。

这不是要取消现实人生主线，而是让现实主线成为表层，让死亡边缘、梦境、病院、深海、废井、雷击、知己关系等事件成为通往隐藏篇章的裂缝。

**要解决的问题**

当前大量即死事件更像安全常识题。玩家点错后直接死亡，体验偏惩罚。篇章树可以把一部分“点错即死”改成“危险选择触发分歧”，让失败变成探索入口。

例如：

```text
废井事件
  原本：掀开井盖 -> 坠井死亡
  改造：掀开井盖 -> 坠落 / 获救 / 进入《沉没异生篇》

雷击事件
  原本：错误躲雨 -> 雷击死亡
  改造：雷击 -> 死亡 / 重伤 / 进入《雷鸣转生篇》

海边事件
  原本：游向深水 -> 溺亡
  改造：溺水边缘 -> 死亡 / 被救 / 进入《海渊篇》
```

**涉及文件**

- `src/engine/types.ts`
- `src/engine/reducer.ts`
- `src/engine/events.ts`
- `src/engine/autosave.ts`
- `src/data/life/events-anchors.ts`
- `src/data/life/events-parametric.ts`
- 新增：`src/data/life/chapters.ts`
- 新增：`src/engine/chapters.ts`
- 新增：`src/components/LifeChapterBanner.tsx`，可选
- 新增：`docs/life-chapter-tree-design.md`

**核心数据结构建议**

在 `GameState` 中加入：

```ts
interface ChapterState {
  activeChapterId: string | null;
  unlockedChapterIds: string[];
  completedChapterIds: string[];
  chapterFlags: Record<string, boolean | number | string>;
  chapterDepth: number;
}
```

事件增加篇章字段：

```ts
interface EventBase {
  chapterId?: string;
  requiredChapter?: string;
  excludedChapter?: string;
  triggerChapter?: string;
  chapterFlagsRequired?: Record<string, boolean | number | string>;
}
```

选择效果增加：

```ts
effects: {
  triggerChapterId?: string;
  setChapterFlags?: Record<string, boolean | number | string>;
  exitChapter?: boolean;
  completeChapterId?: string;
}
```

**推荐首批篇章**

先做 4 个，不要一次铺太大：

```text
1. 《沉没异生篇》
触发源：p_kid_well / 废井 / 童年神隐
风格：异世界、旧乡、井底阶梯、童年失踪。

2. 《梦蚀篇》
触发源：p_young_create / p_mid_overwork / 失眠 / 高才脉低运势
风格：克苏鲁、创作污染、梦境侵入现实。

3. 《海渊篇》
触发源：a_young_lost / p_young_tide / 溺水边缘
风格：深海、古神、潮汐、被海记住的人。

4. 《犬鸣永生篇》
触发源：esu狗子关系线 / 高好感 / 濒死时被记住
风格：轮回、知己锚点、怪谈、上一局记忆。
```

**触发器类型**

建议支持三种触发方式：

```text
明触发：玩家能看出异常，例如“沿井底的楼梯继续往下走”。
暗触发：表面普通选择，满足属性/历史条件后进入篇章。
累积触发：多次积累 dream_corruption / abyss_gaze / dog_memory 等 flag 后进入篇章。
```

**与 P0 的关系**

篇章树不应替代 P0 主循环修复。必须先修：

```text
P0-1 年龄推进与事件触发错位
P0-2 锚点事件优先
```

否则篇章触发也会不稳定。

但 P0-4“即死选项方向平衡”可以部分被篇章树吸收：一部分即死事件不再直接死亡，而是改成篇章入口或风险 flag。


**命名约束**

新增事件标题与篇章显示名应尽量遵循 CMYS 四字结构，即四个汉字拼音首字母依次为 `C-M-Y-S`。篇章名可以在四字标题后追加“篇”。默认不新增非 CMYS 标题。

**验收标准**

- 至少 1 个现有即死事件被改造为篇章入口。
- `GameState` 可以记录当前篇章、已解锁篇章、篇章 flag。
- 事件筛选能优先选择当前篇章内事件。
- 普通人生主线与篇章事件不会互相污染。
- 篇章可以退出、完成或导向特殊结局。
- 存档能正确保存并恢复篇章状态。

---

### P1-1 将安全常识题改成人生取舍题

**问题**

当前许多即死事件是明显正确/错误选择，例如：吃陌生药丸、冲进浓烟、拖延咳血、跳进急流。这类事件像安全教育题，不像人生模拟器。

**涉及文件**

- `src/data/life/events-anchors.ts`
- `src/data/life/events-parametric.ts`
- `src/engine/death.ts`，可选

**修复方案**

减少直接即死，改成累计风险模型；其中叙事潜力较强的即死事件优先改造成篇章触发器，而不是简单删除。

示例：

```text
原设计：
继续熬夜 -> 立即过劳死
回家睡觉 -> 活

改后：
继续熬夜 -> 财富 +8，职业 +1，体质 -12，压力 +1
回家睡觉 -> 体质 +5，财富 -2，职业不变
若压力累计过高且体质过低，后续触发猝死风险事件
```

**验收标准**

- 更多选择是“短期收益 vs 长期代价”。
- 玩家死亡更像长期选择累积的结果，而不是单次点错。
- 即死事件仍可保留，但数量降低，并用于真正高风险场景。

---

### P1-2 接入职业系统

**问题**

`src/engine/career.ts` 已有 `determineCareerPath()` 和 `checkCareerAdvancement()`，但没有接入主循环。`state.career` 初始为 `null`，大多数情况下不会被创建，导致职业展示和职业成就难以成立。

**涉及文件**

- `src/engine/career.ts`
- `src/engine/reducer.ts`
- `src/components/LifeMidlifeStage.tsx`
- `src/components/LifeElderStage.tsx`
- `src/components/LifeDeathScreen.tsx`
- `src/data/life/achievements.ts`

**修复方案**

1. 18 岁或毕业事件后自动创建职业路径。
2. 每次事件结算后调用职业更新逻辑。
3. `careerLevelDelta` 在没有 `career` 时可以先创建职业，再应用等级变化。
4. 结算页展示职业路径、最高等级、关键职业事件。

**验收标准**

- 18 岁后多数玩家会进入某条职业路径。
- 职业事件能实质改变 `career.level`。
- `careerist` 成就可达成。
- 壮年/晚年页面职业展示有实际内容。

---

### P1-3 实现天赋持续效果

**状态：已修复**

天赋系统已从“仅开局一次性属性修正”扩展为“开局修正 + 对应年龄段持续修饰事件结果”。

**已处理文件**

- `src/engine/talent.ts`
- `src/engine/reducer.ts`
- `src/engine/types.ts`
- `src/components/LifeTalentPicker.tsx`
- `src/components/LifeEventResult.tsx`
- `src/components/LifeInfancyStage.tsx`

**实现方式**

1. `LifeTalentPicker` 使用 `useMemo` 固定当前轮候选，避免组件重渲染导致候选天赋重新随机。
2. `getActiveTalents()` 按年龄段启用 childhood / prime / lifelong 天赋。
3. `applyTalentModifiers()` 已接入普通事件、自动事件、篇章自动事件和婴幼期自动成长。
4. 持续效果只修饰事件已经变化的属性，不凭空追加属性，避免每个事件都无条件灌数值。
5. `EventResult.talentEffects` 记录天赋参与结算的描述，并在结果页显示。
6. `grantTalents` 已补全：支持事件授予新天赋，并检查重复与互斥。


**特殊天赋补充**

- `Talent.kind` 已支持 `normal | special`。
- 特殊天赋作为隐藏路线门票。当前开局只随机展示 3 个候选天赋，玩家只能选择 1 个；候选中最多出现 1 个特殊天赋。
- 已新增 `t_jingtingyusheng / 沉鸣余声`，用于安全进入《沉没异生篇》。没有该天赋时，井入口危险选项会强制死亡；拥有该天赋时，保留原有进入篇章文本并进入 `well_otherworld`。
- `EventChoice.conditionalEffects` 已接入 reducer，支持同一个选项根据天赋解析为不同后果。
- `triggerEventId` 已接入 reducer：当前结果页关闭后，同年龄立刻进入目标事件。
- `EventBase.eventTags` 与 `Talent.effects.eventWeightTags` 已接入事件选择权重。
- 已新增 `t_mingsheweiqing / 持命余赊`，作为死亡改写型特殊天赋样板：第一次意外死亡会转为黄泉债收据事件。
- 现有 12 个普通天赋已补充功能性效果：事件标签权重、危险倾向、路线倾向，以及少量一次性死亡/属性死亡改写。不扩展天赋稀有度。
- 主线事件已补充 `eventTags`，让普通天赋能实际影响事件池，而不是只修改属性。
- `TalentDeathConversion` 支持 `attribute` 字段，用于只改写特定属性死亡，例如 `草木有盛` 只改写体质死亡，`仓满盈实` 只改写家境死亡。

**当前限制**

- 天赋暂未影响事件权重；目前影响范围集中在属性结算和事件解锁条件。
- 事件授予天赋只加入天赋列表，不再额外立刻施加一次开局属性修正，避免重复爆发。

**验证结果**

- `npm run lint` 通过。
- `npm run build` 通过。
- 抽样验证确认：童年天赋只在童年生效，壮年天赋成年后生效；天赋只修饰被事件触及的属性。

---

### P1-4 修复 `maxTriggers` 与冷却机制

**问题**

当前 `triggeredEventIds` 只记录最后触发年龄，`maxTriggers` 实际只能判断“是否触发过”。即使事件写了 `maxTriggers: 3`，也只能触发一次。

**涉及文件**

- `src/engine/types.ts`
- `src/engine/events.ts`
- `src/engine/reducer.ts`
- `src/engine/autosave.ts`

**修复方案**

将事件触发记录从：

```ts
Record<string, number>
```

改为：

```ts
Record<string, {
  count: number;
  lastAge: number;
}>
```

保留旧存档兼容转换。

**验收标准**

- `maxTriggers: 2/3` 能真实生效。
- `cooldownYears` 与 `maxTriggers` 可以同时工作。
- 旧存档不会直接损坏。

---

### P1-5 增加历史追踪字段，修复成就判定

**问题**

部分成就描述是“曾经跌破后恢复”，但实际只检查当前属性值。这样会导致成就判定与描述不一致。

**涉及文件**

- `src/engine/types.ts`
- `src/engine/reducer.ts`
- `src/data/life/achievements.ts`
- `src/engine/autosave.ts`
- `src/components/LifeDeathScreen.tsx`

**修复方案**

新增 `historyFlags` 或 `statHistory`：

```ts
interface GameState {
  statExtremes: Record<AttributeName, {
    min: number;
    max: number;
  }>;
  flags: Record<string, boolean | number | string>;
}
```

用于支持：

- 家境曾跌破 10 后恢复到 80。
- 运势曾归零后恢复到 80。
- 30 岁前体质曾跌破 10。
- 智力是否从未跌破 50。
- 是否多次避开即死选项。

**验收标准**

- 成就描述与判定逻辑一致。
- 结算页的成就不再只依赖当前快照。
- 旧存档兼容新增字段。

---

### P1-6 强化事件结果反馈

**问题**

当前结果反馈主要显示属性变化。关系、职业、天赋、风险状态的变化不够清晰。

**涉及文件**

- `src/engine/types.ts`
- `src/engine/reducer.ts`
- `src/components/LifeEventResult.tsx`
- `src/components/LifeStatsBars.tsx`

**修复方案**

扩展 `EventResult`：

```ts
interface EventResult {
  text: string;
  attributeChanges: Partial<Record<AttributeName, number>>;
  relationshipChanges?: Array<{ name: string; change: number }>;
  careerChange?: { title?: string; levelDelta?: number };
  talentEffects?: string[];
  flags?: string[];
}
```

**验收标准**

- 玩家能清楚看到选择造成的长期影响。
- 知己好感、职业等级、天赋加成都能在结果页体现。
- 策略感明显增强。

---

## P2：体验打磨与文档清理

### P2-1 开场动画支持跳过

**问题**

首次体验开场动画很好，但重复游玩时可能拖慢节奏。

**涉及文件**

- `src/components/LifeIntro.tsx`
- `src/components/LifeGame.tsx`

**修复方案**

1. 首次进入完整播放。
2. 二次进入显示“跳过开场”。
3. 可用 localStorage 记录是否看过 intro。

**验收标准**

- 首次仪式感保留。
- 重玩不被强制等待。

---

### P2-2 增加阶段性小结

**问题**

当前一局主要靠事件串联，缺少阶段性总结。玩家进入青年、壮年、晚年时缺少“人生段落感”。

**涉及文件**

- `src/components/LifeYouthStage.tsx`
- `src/components/LifeMidlifeStage.tsx`
- `src/components/LifeElderStage.tsx`
- 新增：`src/components/LifeStageSummary.tsx`

**修复方案**

在 18、31、61 岁展示阶段小结：

```text
你带着这些属性进入青年期：...
过去十几年最重要的三件事：...
当前知己关系：...
职业方向：...
```

**验收标准**

- 玩家能感到人生阶段转换。
- 事件日志不只是结局页才有意义。

---

### P2-3 清理文档，建立当前实现规格

**问题**

当前文档混合了计划、历史规格、当前实现和未完成项，不利于后续开发。

**涉及文件**

- `README.md`
- `PROGRESS.md`
- `docs/superpowers/*`
- 新增：`docs/life-current-spec.md`

**修复方案**

1. `PROGRESS.md` 更新为真实统计与当前状态。
2. 旧 `superpowers` 文档标注为历史文档。
3. 新建 `docs/life-current-spec.md`，作为 `/life` 当前唯一可信规格。
4. README 只保留入口、启动、构建、路由、主要功能说明。

**验收标准**

- 新开发者能从文档判断当前实现，而不是读到过期计划。
- 修复计划、当前规格、历史设计三者边界清晰。

---

## 建议实施顺序

### 第 1 批：先让一局游戏成立

1. P0-1 修年龄推进与事件触发错位。
2. P0-2 锚点事件优先。
3. P0-5 修主线锚点 `resultText` 错位。
4. 添加基础模拟脚本，统计死亡年龄与事件覆盖率。

### 第 2 批：修数值与随机公平性

1. P0-3 重调属性尺度。
2. P0-4 平衡即死选项方向。
3. 重新跑模拟，观察随机玩家、稳健玩家、冒险玩家三种策略的死亡年龄分布。

### 第 3 批：增强策略深度与隐藏线

1. P1-0 新增篇章树与触发器系统，先实现 1 个最小可用篇章。
2. P1-2 接入职业系统。
3. P1-3 实现天赋持续效果。
4. P1-4 修复 `maxTriggers`。
5. P1-5 修复成就历史追踪。
6. P1-6 强化结果反馈。

### 第 4 批：打磨与文档

1. P2-1 开场动画可跳过。
2. P2-2 阶段性小结。
3. P2-3 文档重组。

---

## 测试与验收建议

### 静态检查

```bash
npm run lint
npm run build
```

### 流程测试

至少手动跑通以下路径：

- 正常稳健路线：尽量选择保守选项，确认能活到晚年。
- 高风险路线：多次选择冒险，确认风险逐渐累积。
- 即死路线：选择明确危险项，确认死亡页展示正确。
- 存档路线：到 6、18、31、61 岁后刷新页面，确认可继续。
- 成就路线：验证职业、知己、财富、运势相关成就能触发。

### 模拟测试

建议新增脚本：

```text
scripts/simulate-life.ts
```

输出：

```text
随机策略 500 局：平均寿命、中位寿命、死因分布
保守策略 500 局：平均寿命、中位寿命、死因分布
冒险策略 500 局：平均寿命、中位寿命、死因分布
锚点覆盖率
阶段事件覆盖率
成就可达性粗检
```

目标参考：

```text
随机策略：中位死亡年龄不低于 40
保守策略：中位死亡年龄不低于 70
冒险策略：死亡率更高，但高分上限更高
关键锚点覆盖率：接近 100%
```

---

## 不建议现在做的事

在 P0 修完前，不建议继续新增事件或新增复杂 UI。原因是当前主要问题不是内容量，而是主循环和数值模型。继续增加事件会扩大后续修复成本。

暂不建议：

- 继续扩充 200+ 新事件。
- 增加复杂 NPC 系统。
- 增加多存档系统。
- 增加图表动画或大型结算演出。
- 继续添加新成就。
- 一次性铺开过多篇章；篇章系统应先用 1 个最小可用篇章验证机制。

应先保证：一局能稳定推进，关键人生节点可达，死亡大多来自玩家长期选择而不是系统误杀。
