# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
npm run dev          # 开发服务器 → http://localhost:3000
npm run build        # 生产构建
npx tsc --noEmit     # TypeScript 类型检查（零错误要求）
npm run deploy       # 构建 + 部署到 Cloudflare
```

游戏入口路由：`/life`。主页路由：`/`。

## 技术栈

React 19 + TypeScript 5.8 + Vite 6 + TailwindCSS 4 + Motion (Framer Motion) + React Router 7。引擎层全部为纯函数，不依赖 React。状态管理用 `useReducer` + Context。

## 项目架构

```
src/
  engine/               # 纯函数引擎，不依赖 React
    types.ts            # 所有类型：GameState, GameAction, GameEvent, Achievement 等
    reducer.ts          # gameReducer 状态机 + advanceYears 循环推进
    events.ts           # shouldTriggerEvent / selectEvent / getEligibleEvents
    death.ts            # checkDeath / checkRandomDeath / getLethalThreshold / applyNaturalDecay
    talent.ts           # 天赋选择逻辑
    career.ts           # 职业路径 + 等级变化
    relationship.ts     # 知己系统（固定名 "esu狗子"）
    ending.ts           # computeResult 三层评分架构
    achievements.ts     # 成就判定引擎（16 个隐藏成就）
    autosave.ts         # localStorage 存档（检查点：6/18/31/61）
  components/           # React 组件
    LifeGame.tsx         # 主容器，useReducer + phase switch + 全局键盘映射
    LifeContext.tsx      # Context 定义
    LifeIntro.tsx        # 片头动画
    LifeTalentPicker.tsx       # 天赋选择（3轮×3选1）
    LifeInfancyStage.tsx       # 婴幼期 0-5（自动叙事 + 跳过按钮）
    LifeYouthStage.tsx         # 少年/青年期 6-30
    LifeMidlifeStage.tsx       # 壮年期 31-60
    LifeElderStage.tsx         # 晚年期 61-100
    ReignsCard.tsx             # Reigns 式事件卡片（拖拽 + 键盘动画）
    LifeEventResult.tsx        # 选择后叙事结果 + 属性变化
    LifeDeathScreen.tsx        # 结局结算（星级 + 称号 + 成就 + 死因 + 人生回顾）
    LifeStatsBars.tsx          # 六维属性状态条
    LifeEventCard.tsx          # 旧版事件卡片（已弃用，保留备用）
  data/life/
    events-anchors.ts          # 锚点事件（~28 个，固定年龄触发）
    events-parametric.ts       # 参数化事件（~135 个）
    talents.ts                 # 天赋池（12 个）
    achievements.ts            # 16 个成就定义 + 判定条件
    endings.ts                 # 结局风味文本 + 成就风味文本
  pages/
    LifePage.tsx               # 路由入口，挂载 LifeGame
    HomePage.tsx               # 主页
```

## 游戏状态机

```
save_choice → talent_selection(×3轮) → playing → dying → result
```

`playing` 阶段子状态：`aging` → (有事件时) `event_presenting` → (选择后) `effect_resolving` → `aging`...

**阶段路由：**
- `age 0-5` → LifeInfancyStage（婴幼期自动叙事，可跳过）
- `age 6-30` → LifeYouthStage（少年/青年期，每年事件）
- `age 31-60` → LifeMidlifeStage（壮年期，每3年事件，按钮+3岁）
- `age 61-100` → LifeElderStage（晚年期，梯度间隔事件）

## CMYS 命名规范（核心约束）

**所有事件标题必须是 C-M-Y-S 四字拼音首字母。** C/Ch → C，M → M，Y → Y，S/Sh → S。

验证脚本：
```python
from pypinyin import pinyin, Style
def check(title):
    initials = [p[0][0].lower()[0] for p in pinyin(title, style=Style.INITIALS, strict=False) if p[0]]
    return ''.join(initials) == 'cmys'
```

禁止：非四字、非 CMYS 首字母、与已有事件/天赋重名。

## 事件系统

### 事件分类

| 类型 | 数量 | 说明 |
|------|------|------|
| 锚点事件 | ~28 | 固定年龄触发，含即死选项 |
| 参数化事件 | ~135 | 属性/天赋条件触发，含 maxTriggers + cooldownYears |

### 触发频率

| 年龄段 | 频率 | 说明 |
|--------|------|------|
| 婴幼期 0-5 | 自动叙事 | 6 段锚点，每段 2.5 秒 |
| 少年/青年 6-30 | 每年 1 次 | 每岁触发事件 |
| 壮年期 31-60 | 每 3 年 1 次 | `(age-31)%3===0` |
| 晚年期 61-100 | 梯度间隔 | 61-70每3年、71-85每5年、86-100每7年 |

### 去重机制

- `maxTriggers`: 1（一生一次）/ 2（可复现）/ 3（filler）
- `cooldownYears`: 8~20 年冷却期
- `triggeredEventIds`: `Record<string, number>` — 事件ID → 最后触发年龄

### 事件字段

每个选项含：
- `resultText` — 第一人称叙事结果
- `relationshipEffect` — 知己好感变化（`{ targetId, change }`）
- `careerLevelDelta` — 职业等级变化
- `isLethal` — 是否致命选项

## 死亡机制

### 三层致死网络

| 层级 | 机制 | 说明 |
|------|------|------|
| 即死选项 | 事件中 `isLethal: true` 的选项 | 约 28 个即死事件覆盖全年龄段 |
| 属性陷阱 | 扣除大量致命属性的选项 | 隐蔽但非即死 |
| 随机意外 | `checkRandomDeath` 按概率触发 | 青年 1%/壮年 2%/晚年 3% |

### 分龄致死阈值

- 少年/青年期（≤30 岁）：致命属性归零才死
- 壮年/晚年期（>30 岁）：致命属性 ≤10 即死
- 婴幼期（≤5 岁）：禁止所有死亡判定
- 100 岁：自然老死

### 死亡类型（deathType）

| 类型 | 标签 | 说明 |
|------|------|------|
| `attribute` | 属性衰竭致死 | 颜值/智力/体质/家境 归零 |
| `lethal_choice` | 事件致死 | 选择了即死选项 |
| `accident` | 意外身亡 | 随机意外触发 |
| `natural` | 寿终正寝 | 100 岁老死 |

## 评分系统（三层架构）

总分 0~1000：
- **基础分（35%）** — 六维属性加和 / 600 × 350
- **成就分（40%）** — 16 个隐藏成就，每个 20~50 分
- **叙事分（25%）** — 事件多样性 + 关系深度 + 职业巅峰 + 隐藏加成

评星阈值：150 / 350 / 550 / 750

## 属性系统

六维：颜值、智力、体质、家境、才脉、运势。初始 D6(3~5) + 玩家分配 5 点 + 天赋修正。branded type `AttributeValue` 保证 [0,100] 范围。

体质自然衰减：30 岁起每 5 年 -1，仅整 5 年节点触发，至多 -14。

## 知己系统

固定知己 "esu狗子"，初始好感 -20~+20。通过事件的 `relationshipEffect` 改变好感。
- 伯牙子期：好感 ≥ 100
- 杀手本能：好感 ≤ -80

## 交互系统

### ReignsCard

- 鼠标拖拽：拖到阈值（屏幕宽度 30%）松手确认
- 键盘：按住 ←/→ 卡片滑过去，松手确认；可切换方向
- 点击：底部按钮直接选择
- 任意键：aging/effect_resolving 阶段按任意键推进

### 婴幼期

- 自动叙事，每段 2.5 秒
- "跳过" 按钮直接跳到 6 岁
- 叙事期间不触发死亡判定

## 存档系统

- localStorage key: `cmys_life_autosave`
- 检查点：6/18/31/61 岁
- 单自动档覆盖写
- `triggeredEventIds` 序列化为 JSON 原生 `Record<string, number>`
- 兼容旧格式（Set 序列化的数组）

## 技术细节

- `nearDeathCount` 追踪遭遇即死选项的次数，用于"不死鸟"成就
- `LOAD_SAVE` 向后兼容：`nearDeathCount ?? 0`
- 全局 scroll-snap-type 在 LifeGame 挂载时强制禁用
- 结局阶段：黑底 overlay + LifeDeathScreen 白字交错浮现
- 片头：LifeIntro 全黑 + 网格脉冲 + "沉默一生"逐字浮现
- 设计令牌：`--color-canvas:#F0F0F0`、`--color-primary:#1A1A1A`、`--color-secondary:#888`
- 字体：Inter / JetBrains Mono / DM Serif Display / Noto Serif SC
