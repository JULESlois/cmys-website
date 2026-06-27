# CMYS 人生模拟器 — 项目进度

## 版本历史

### v2.0 — 成就支撑事件 + 交互优化 (2026-06-27)

**新增 25 个成就支撑事件**
- 8 个知己关系事件（esu狗子，戏剧冲突向，好感 ±15~30）
- 6 个财富大波动事件（weath ±25~35，赌博/命运混合）
- 4 个运势极端事件（先涨→暴跌→续跌→翻盘，luck ±20~40）
- 2 个爱情事件（暗恋+重逢）
- 2 个少年体质惩罚事件
- 3 个职业里程碑事件

**交互优化**
- 键盘按键拖拽动画：按住方向键卡片滑过去，松手结算，可切换方向
- 任意键触发"继续"：aging/effect_resolving 阶段按任意键推进
- 婴幼期新增"跳过"按钮

**结局优化**
- 结局画面显示完整死因叙事（引用格式）
- 死亡类别标签：（属性衰竭致死）/（事件致死）/（意外身亡）/（寿终正寝）

**引擎扩展**
- `relationshipEffect` 处理——知己好感实时变化
- `careerLevelDelta`——事件可推进/降低职业等级
- `nearDeathCount`——追踪即死遭遇次数，驱动不死鸟成就

### v1.1 — 难度系统 + Reigns 交互 + 三层评分 (2026-06-27)

**难度系统**
- 分层致死网络：少年温和（2~3 即死）→ 壮年绞肉机（8~12 即死）→ 晚年脆弱（5~7 即死）
- 分龄致死阈值：少年/青年归零才死，壮年/晚年 ≤10 即死
- 随机意外死亡：青年 1%/年，壮年 2%/年，晚年 3%/年
- 新增 28 个即死事件（22 参数化 + 6 锚点）
- 初始属性基底从 2~5 提高到 3~5

**Reigns 式交互**
- 鼠标拖拽甩卡选择
- 键盘 ← → 选择
- 底部选项始终可见 + 点击选择
- 浅色玻璃风格卡片，融入页面设计系统

**评分系统重构**
- 三层架构：基础 35% + 成就 40% + 叙事 25%
- 16 个隐藏成就，总分 0~1000
- 结局画面展示成就列表（已解锁/未解锁）
- 死因叙事化：即死选项显示完整叙事，属性归零/意外死因为文学性描述

**事件系统完善**
- 全量补齐 `maxTriggers` + `cooldownYears`
- 事件池从 90 扩至 118+
- `triggeredEventIds` 从 `Set<string>` 改为 `Record<string, number>`

### v1.0 — 核心引擎 + 基础内容 (2026-06-26)

- 引擎层：types / reducer / events / death / talent / career / relationship / ending / autosave
- 游戏状态机：save_choice → talent_selection ×3 → playing → dying → result
- 婴幼期自动叙事（6 段锚点）、少年/青年/壮年/晚年 5 个阶段组件
- 90 个事件（22 锚点 + 68 参数化），全部 CMYS 四字首字母合规
- 天赋系统（3 轮 × 3 选 1，含互斥机制）
- 六维属性 + 存档系统（检查点 6/18/31/61）

---

## 当前数据统计

| 类别 | 数量 |
|------|------|
| 锚点事件 | ~28 |
| 参数化事件 | ~135 |
| **事件总计** | **~163** |
| 即死事件 | ~28 |
| 天赋 | 12 |
| 成就 | 16 |
| 知己角色 | 1（esu狗子） |

## 技术统计

| 指标 | 值 |
|------|-----|
| TypeScript 编译 | 零错误 |
| CMYS 标题合规 | 163/163 |
| 引擎层文件 | 9 |
| 组件文件 | 12（含 1 个弃用） |
| 数据文件 | 4 |
| 总提交数 | 33（v1.1 + v2.0） |

## 引擎 API

```typescript
// 游戏初始化
createInitialState(talents?) → GameState
gameReducer(state, action) → GameState

// 死亡系统
checkDeath(state) → DeathCheck
checkRandomDeath(age) → DeathCheck
getLethalThreshold(age) → number
applyNaturalDecay(age) → Partial<Record<AttributeName, number>>

// 事件系统
getEligibleEvents(state) → GameEvent[]
selectEvent(state) → GameEvent | null
shouldTriggerEvent(age) → boolean

// 成就系统
checkAchievements(state) → AchievementId[]
getAchievementScore(ids) → number

// 评分系统
computeResult(state) → GameResult

// 职业/关系
determineCareerPath(state) → CareerPath
checkCareerAdvancement(state) → Career | null
generateConfidant() → Relationship
updateAffinity(rel, change) → Relationship

// 存档
saveGame(state) → void
loadGame() → GameState | null
hasSave() → boolean
```
