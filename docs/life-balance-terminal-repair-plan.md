# `/life` 运势/智力满值终局修复计划

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
