# `/life` 运势/智力满值终局修复计划



## 生命周期模拟工具（2026-07-02）

已新增可重复的生命周期模拟脚本：

```bash
./node_modules/.bin/tsx src/dev/life-sim.ts --runs=200 --seed=20260702
```

支持参数：

```text
--runs=200              每种策略模拟局数
--seed=20260702         随机种子
--strategy=all          all / random / safe / risky
--json=true             输出机器可读 JSON
--maxSteps=4000         单局最大推进步数
```

当前内置三种策略：

```text
random：随机选天赋、随机选项。
safe：偏向体质、家境、智力，稳定避开 isLethal / forceLethal。
risky：偏向高财富、高运势、高才脉、特殊篇章和高风险选项。
```

200 局基线结果显示：

```text
random：200/200 死亡，平均死亡年龄 8.37，主要死于 p_kid_well、p_kid_well_dream。
safe：200/200 属性终局，平均年龄 20.15，196/200 为体质满值终局。
risky：199/200 死亡，平均死亡年龄 8.95，主要死于 p_kid_well、p_kid_well_dream、p_kid_ice、p_kid_roof。
```

关键诊断：

```text
1. 井相关入口在随机/激进策略下造成过高早死率。
2. safe 策略在 20 岁前触发大量同龄非增龄事件，导致体质快速堆到 100。
3. 梗事件在 safe 策略下平均触发 12.86 次，说明同龄事件密度过高，会把低权重单次事件几乎刷完。
4. 当前主要问题不再是单个属性数值，而是 ageDelta 默认 0 后带来的事件密度失控。
```

下一轮平衡应优先处理事件密度：

```text
1. 给普通非特殊事件增加“同龄事件软上限”或“每岁最多事件数”。
2. 或者为部分主线/梗事件添加 ageDelta: 1，让每岁不会刷完整个事件池。
3. 井入口随机死亡率过高，应降低权重或强化特殊天赋门槛提示。
4. 梗事件应增加更强的触发条件或降低权重，避免 safe 策略中集中刷出。
```

---

## 当前平衡基线（2026-07-01）

在 `32fd134 fix: rebalance life event attributes` 后，属性事件总量已经重新校准。本文件早期主要关注“运势/智力满值终局”，但当前更重要的是保持六维整体曲线稳定。

### 最新静态统计

```text
体质 physique        -54
家境 wealth          -20
运势 luck            +23
颜值 appearance      +50
智力 intelligence    +87
才脉 creativity      +148
```

对比上一轮失衡状态：

```text
体质：-142 -> -54
家境：-41  -> -20
智力：+159 -> +87
才脉：+211 -> +148
运势：+66  -> +23
```

### 当前判断

```text
体质仍是主要压力属性，但不再过度导向早死。
家境仍保留财富波动，但 ±30/±35 类极端值已压缩。
智力已从过快成长降到可控区间。
才脉仍偏强，作为创作路线优势保留，但后续不宜继续大量加才脉事件。
运势已从堆叠型优势降到轻正向。
```

### 梗事件平衡

新增 14 个中文互联网 / 二次元梗事件后，梗事件自身总属性影响为：

```text
颜值 appearance      -1
智力 intelligence    +10
体质 physique         0
家境 wealth          -14
才脉 creativity       +8
运势 luck             +7
```

这些事件以趣味为主，数值代价主要集中在家境，符合抽卡、谷子、周边消费主题。体质净值为 0，不会回滚上一轮体质修复。

### 后续平衡红线

```text
新增创作、二次元、梗事件时，不应继续无代价增加 creativity。
新增学习、职场、解谜事件时，不应继续无代价增加 intelligence。
财富单项变化建议通常控制在 -10~+15；重大财富事件可到 -25~+25。
体质单项负值通常控制在 -1~-4；重大疾病/事故可到 -6~-8。
梗事件应低权重、单次触发，不应成为主线事件池主体。
```

---

## 一、本轮修复范围

本轮不削弱体质和家境死亡。体质、家境提供失败型挑战，保留它们的压力更符合人生模拟的风险感。

本轮只处理“成功型死亡”：

```text
运势满值过多
智力满值过多
```

这两个属性的问题不是死亡惩罚，而是获取过快，导致会玩玩家、保守玩家、补短板玩家频繁提前进入满值结局。

## 二、修复原则

1. 保留运势和智力的正向价值，不把它们改成负担。
2. 降低爆发式大额收益，尤其是 `luck: 15/25/40` 这类会被缩放到 +20 的收益。
3. 将大部分 `intelligence: 3` 降为 `2`，将 `4~5` 降一档，减缓长期堆叠。
4. 不改体质、家境高危事件，暂时保留挑战性。
5. 修改后通过模拟验证满值终局是否下降。
6. 第二轮追加统一运势降档：事件文件内正向 `luck: 6 -> 4`、`luck: 4 -> 3`、`luck: 3 -> 2`，以处理大量中小额运势累计导致的满值。

## 三、已处理事件

### 运势

```text
p_luck_rise       luck 15/25 -> 3/2
p_luck_reborn     luck 40/15 -> 3/3
a_elder_twilight  luck 5 -> 2
p_elder_peace     luck 5 -> 2
p_rel_elder_help  luck 5 -> 2
p_mid_help        luck 4 -> 2
a_mid_harvest     luck 4 -> 2
```

### 智力

```text
a_gaokao
a_elder_last_stand
a_graduate
p_young_upstream
a_primary
a_mid_school
a_high_school
a_university
a_mid_harvest
a_young_fraud
p_kid_art
p_kid_persist
p_kid_rebel
p_young_night_rain
p_young_reforge
p_mid_mentor
p_elder_legacy
p_elder_great
p_mid_debt
p_mid_betrayal
p_wealth_scam
p_wealth_fail
p_wealth_mentor
p_luck_reborn
p_love_reunion
p_career_fired
p_career_project
```

## 四、预期效果

```text
随机玩家：仍主要死于体质/家境，保持挑战。
会玩玩家：运势/智力满值仍可能出现，但不应成为过半终局。
补短板玩家：不应大量死于运势满值。
```

## 五、后续观察

若运势/智力降档后，模拟结果显示体质或家境死亡重新垄断全部终局，再单独开下一轮失败型死亡平衡。
