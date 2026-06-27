# CMYS 人生模拟器 — 成就支撑事件设计规格

> 第三轮优化：新增事件撑起 16 个隐藏成就

---

## 一、概述

前两轮已完成核心引擎（90 事件）、难度系统、Reigns 交互、三层评分和 16 个成就。但多个成就因缺乏对应事件而无法达成。本轮新增 25 个事件 + 1 个 tracking 机制修复，确保全部 16 个成就均可触发。

---

## 二、知己关系事件（8 个）— 戏剧冲突向

知己名固定为 "esu狗子"，通过 `relationshipEffect` 字段改变好感。正面和负面各半。

### 事件列表

| id | 年龄段 | 标题 | 好感变化 | 叙事方向 |
|----|--------|------|---------|---------|
| p_rel_kid_friend | 少年 8-14 | 赤没影深 | +20 | 狗子帮你打掩护逃课，建立最初的友谊 |
| p_rel_kid_fight | 少年 10-16 | 沉默雨散 | -15 | 为小事大吵一架，冷战了整个夏天 |
| p_rel_young_drunk | 青年 18-25 | 赤没夜深 | +25 | 深夜醉酒后狗子背你回家，说了很多掏心的话 |
| p_rel_young_debt | 青年 20-28 | 沉没应逝 | -20 | 你借了狗子的钱没还，电话不接——他找上门 |
| p_rel_mid_brother | 壮年 32-48 | 赤明永生 | +20 | 你出事时狗子二话不说请假来陪你 |
| p_rel_mid_betray | 壮年 35-50 | 沉默欲碎 | -25 | 利益冲突——共同的朋友在你们之间选了边 |
| p_rel_elder_reunion | 晚年 62-78 | 沉暮永生 | +25 | 老友重聚：狗子说你是他一辈子最重要的朋友 |
| p_rel_elder_help | 晚年 65-82 | 赤没永逝 | -30 | 狗子病重需要帮助，你的选择定义了这段关系 |

### 事件结构

所有关系事件在 `EventChoice.effects.relationshipEffect` 中携带 `{ targetId: "confidant", change: ±N }`。`RESOLVE_EVENT` 在 reducer 中调用 `updateAffinity` 更新知己好感。

---

## 三、财富大波动事件（6 个）— 赌博/命运混合

### 事件列表

| id | 年龄段 | 标题 | 波动 | 叙事 |
|----|--------|------|------|------|
| p_wealth_scam | 22-28 | 沉没银山 | -25 | 被骗进传销，积蓄打了水漂 |
| p_wealth_invest | 24-30 | 赤明银生 | +30 | 早期投资风口，押对了 |
| p_wealth_fail | 32-45 | 沉没银碎 | -30 | 创业失败，合伙人卷款跑路 |
| p_wealth_house | 35-50 | 仓满银实 | +35 | 家里拆迁/遗产继承 |
| p_wealth_illness | 40-55 | 残明银逝 | -35 | 大病一场，积蓄花光 |
| p_wealth_mentor | 38-52 | 赤明银升 | +30 | 贵人提携，事业起飞 |

### 风险控制

- 每个事件含 2 个选项，一个触发大波动，一个相对保守（±5~10）
- 即死选项不设在财富事件中（财富归零可能导致死亡，但那是玩家连续选择的结果）

---

## 四、运势极端事件（4 个）— 先涨后跌再翻盘

### 事件列表

| id | 年龄段 | 标题 | 运势变化 | 叙事 |
|----|--------|------|---------|------|
| p_luck_rise | 10-15 | 春明运升 | +25 | 连续走大运——押题全中、捡钱、被夸 |
| p_luck_crash | 18-25 | 残明运碎 | -35 | 盛极而衰——打击接踵而至 |
| p_luck_deep | 22-30 | 沉默运逝 | -20 | 谷底挣扎——做什么都不顺 |
| p_luck_reborn | 30-45 | 迟明运生 | +40 | 否极泰来——关键抉择让命运反转 |

### 设计要点

四个事件按年龄段顺序触发，形成 "涨 → 暴跌 → 续跌 → 翻盘" 的弧线。选项设计允许玩家加速或减缓运势变化。`maxTriggers: 1` + `cooldownYears: 999` 确保一生一次。

---

## 五、爱情事件（2 个）

| id | 年龄段 | 标题 | 叙事 |
|----|--------|------|------|
| p_love_unrequited | 19-24 | 春梦雨散 | 暗恋的人有了别人，你站在远处看着 |
| p_love_reunion | 28-38 | 迟梦永生 | 多年后重逢，那个人已经离了婚 |

与现有爱情事件 `a_love_first`、`p_mid_family`、`p_young_moon_toast` 一起，`ladykiller` 成就需触发全部 5 个。

---

## 六、少年体质惩罚（2 个）

| id | 年龄段 | 标题 | 体质变化 | 叙事 |
|----|--------|------|---------|------|
| p_phys_picky | 6-10 | 赤没影生 | -8 | 挑食+从不运动，身体孱弱 |
| p_phys_gaming | 10-16 | 沉明夜深 | -10 | 沉迷游戏每天熬夜，身体被掏空 |

选项设计：一个选承认问题并改变（体质+3），另一个继续放纵（体质大幅惩罚）。

---

## 七、职业里程碑（3 个）

| id | 年龄段 | 标题 | 叙事 |
|----|--------|------|------|
| p_career_fired | 20-26 | 沉默一瞬 | 第一份工作被开除——但学到了什么 |
| p_career_project | 32-45 | 驰明永生 | 关键项目——成功则职业跃升，失败则降级 |
| p_career_poach | 40-55 | 迟明永升 | 猎头找你——走还是留？ |

职业事件在 `EventChoice.effects` 中新增 `careerLevelDelta?: number`，reducer 在 `RESOLVE_EVENT` 中应用职业等级变化。

---

## 八、不死鸟 tracking 修复

### 问题

`phoenix` 成就硬编码了 2 个事件 ID，且只检查 `length >= 1`，无法准确判断是否 "逃过 3 次即死选项"。

### 修复

1. `types.ts` — `GameState` 新增 `nearDeathCount: number`
2. `reducer.ts` — `createInitialState` 设为 0
3. `reducer.ts` — `ADVANCE_AGE` 或 `RESOLVE_EVENT` 中，当事件含 `isLethal: true` 的选项时 `nearDeathCount + 1`
4. `achievements.ts` — `phoenix.check` 改为 `s.nearDeathCount >= 3 && s.deathRecord === null`

---

## 九、事件结构要求

### EventChoice 新增类型

```typescript
// types.ts — EventChoice.effects 新增:
interface EventChoiceEffects {
  attributes?: Partial<Record<AttributeName, number>>;
  grantTalents?: string[];
  removeTalents?: string[];
  triggerEventId?: string;
  relationshipEffect?: { targetId: string; change: number };
  careerLevelDelta?: number;   // 新增：职业等级变化
  isLethal?: boolean;
}
```

### Reducer 集成

`RESOLVE_EVENT` 中：
- 若 `choice.effects.relationshipEffect` 存在，调用 `updateAffinity` 更新对应知己的好感
- 若 `choice.effects.careerLevelDelta` 存在，调整 `state.career.level`（clamp [1, 10]）

---

## 十、CMYS 标题合规

所有 25 个新事件标题需通过 pypinyin 验证 `initials == 'cmys'`。当前设计的标题均为 CMYS 合规：

- 赤没影深 (c-m-y-s)、沉默雨散 (c-m-y-s)、赤没夜深 (c-m-y-s)
- 沉没应逝 (c-m-y-s)、赤明永生 (c-m-y-s)、沉默欲碎 (c-m-y-s)
- 沉暮永生 (c-m-y-s)、赤没永逝 (c-m-y-s)
- 沉没银山 (c-m-y-s)、赤明银生 (c-m-y-s)、沉没银碎 (c-m-y-s)
- 仓满银实 (c-m-y-s)、残明银逝 (c-m-y-s)、赤明银升 (c-m-y-s)
- 春明运升 (c-m-y-s)、残明运碎 (c-m-y-s)、沉默运逝 (c-m-y-s)
- 迟明运生 (c-m-y-s)
- 春梦雨散 (c-m-y-s)、迟梦永生 (c-m-y-s)
- 赤没影生 (c-m-y-s)、沉明夜深 (c-m-y-s)
- 沉默一瞬 (c-m-y-s)、驰明永生 (c-m-y-s)、迟明永升 (c-m-y-s)

---

## 十一、自检清单

- [ ] 25 个事件全部写入 `events-parametric.ts`
- [ ] 所有标题 CMYS 合规
- [ ] `relationshipEffect` 在 reducer 中正确处理
- [ ] `careerLevelDelta` 在 reducer 中正确处理
- [ ] `nearDeathCount` 正确追踪
- [ ] `phoenix` 成就改用 `nearDeathCount`
- [ ] `ladykiller` 成就的 `loveEventIds` 更新为 5 个
- [ ] `npx tsc --noEmit` 零错误
- [ ] 存档序列化兼容 `nearDeathCount` 和 `careerLevelDelta`
