// src/data/life/events-yomi.ts
import type { ParametricEvent } from "../../engine/types";
import { createAge } from "../../engine/types";

export const YOMI_EVENTS: ParametricEvent[] = [
  {
    type: "parametric",
    id: "p_yomi_receipt",
    title: "沉命余赊",
    description: "你开始反复梦见一张湿透的收据。收据抬头写着你的名字，金额栏却不是数字，而是几次本该发生的死亡。",
    minAge: createAge(18), maxAge: createAge(99), weight: 12, maxTriggers: 1, cooldownYears: 999,
    chapterFlagsRequired: { yomi_debt: 2 },
    choices: [
      { text: "按下手印，查看欠账", effects: { attributes: {}, triggerChapterId: "yomi_debt", setChapterFlags: { yomi_receipt_seen: true } }, resultText: "红印落下，收据背面浮出一串日期。每一个日期旁边，都写着：已延期。" },
      { text: "把收据撕掉", effects: { attributes: {}, setChapterFlags: { yomi_receipt_torn: true, yomi_debt: 3 } }, resultText: "纸被撕开的瞬间，梦里的水声停了。第二天醒来，你发现掌心有一条红色折痕。" },
    ],
  },
  {
    type: "parametric",
    id: "c_yomi_counter",
    title: "持命验赊",
    description: "一间没有门牌的窗口排着队。窗口后的人说：你不是来还钱的，你是来确认谁替你付过。",
    minAge: createAge(18), maxAge: createAge(99), requiredChapter: "yomi_debt", chapterId: "yomi_debt",
    chapterFlagsRequired: { yomi_receipt_seen: true }, weight: 10, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "查看第一笔延期", effects: { attributes: {}, setChapterFlags: { yomi_first_debt_seen: true } }, resultText: "第一笔延期来自一次意外。备注栏写着：从未来的你那里扣除。" },
      { text: "询问能否一次结清", effects: { attributes: {}, setChapterFlags: { yomi_clear_requested: true } }, resultText: "窗口后的人笑了：能，但你不会喜欢结清后的自己。" },
    ],
  },
  {
    type: "parametric",
    id: "c_yomi_three_records",
    title: "沉门映册",
    description: "桌上摆着三份档案：你的、狗子的、空白的。空白档案封面干净得像从未有人活过。",
    minAge: createAge(18), maxAge: createAge(99), requiredChapter: "yomi_debt", chapterId: "yomi_debt",
    chapterFlagsRequired: { yomi_first_debt_seen: true }, weight: 10, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "翻开自己的档案", effects: { attributes: {}, setChapterFlags: { yomi_self_record_seen: true } }, resultText: "档案里有几页被水泡烂了。那些页数对应你逃过的死亡。" },
      { text: "翻开空白档案", effects: { attributes: {}, setChapterFlags: { yomi_blank_record_seen: true } }, resultText: "空白页上慢慢浮出你的笔迹：如果没人记得，就不算活过。" },
    ],
  },
  {
    type: "parametric",
    id: "c_yomi_memory_tax",
    title: "偿梦遗失",
    description: "柜台递来一枚小剪刀。对方说：还债不一定用寿命，也可以用一段你舍不得的记忆。",
    minAge: createAge(19), maxAge: createAge(99), requiredChapter: "yomi_debt", chapterId: "yomi_debt",
    chapterFlagsRequired: { yomi_self_record_seen: true }, weight: 8, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "剪掉一段童年记忆", effects: { attributes: {}, setChapterFlags: { yomi_memory_paid: true, yomi_debt: 1 } }, resultText: "剪刀合上后，你知道自己曾经很快乐，但想不起是因为什么。" },
      { text: "拒绝交出记忆", effects: { attributes: {}, setChapterFlags: { yomi_memory_refused: true } }, resultText: "柜台把剪刀收回去，盖章：转入下一期。" },
    ],
  },
  {
    type: "parametric",
    id: "c_yomi_relationship_tax",
    title: "持梦约损",
    description: "第二种偿还方式是关系。不是让某个人消失，而是让一句本该说出口的话永远变轻。",
    minAge: createAge(19), maxAge: createAge(99), requiredChapter: "yomi_debt", chapterId: "yomi_debt",
    chapterFlagsRequired: { yomi_blank_record_seen: true }, weight: 8, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "用一段关系抵债", effects: { attributes: {}, relationshipEffect: { targetId: "confidant", change: -12 }, setChapterFlags: { yomi_relationship_paid: true, yomi_debt: 1 } }, resultText: "你没有失去那个人，只是从此很难把真正想说的话说完整。" },
      { text: "把空白档案推回去", effects: { attributes: {}, setChapterFlags: { yomi_relationship_refused: true } }, resultText: "档案合上时，你听见里面有人轻轻叹气。" },
    ],
  },
  {
    type: "parametric",
    id: "c_yomi_return",
    title: "出命又生",
    description: "窗口后的灯逐盏熄灭。对方说：你可以回去，但下一次延期不会这么便宜。",
    minAge: createAge(20), maxAge: createAge(99), requiredChapter: "yomi_debt", chapterId: "yomi_debt",
    chapterFlagsRequired: { yomi_first_debt_seen: true }, weight: 6, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "带着欠条回到现实", effects: { attributes: {}, setChapterFlags: { yomi_returned: true }, exitChapter: true, completeChapterId: "yomi_debt" }, resultText: "你醒来时，床头有一张不存在的收据。上面只剩一行字：下次见。" },
      { text: "要求看最后一笔债", effects: { attributes: {}, setChapterFlags: { yomi_last_debt_requested: true } }, resultText: "窗口后的人沉默了。最后一笔债的名字，不在你名下。" },
    ],
  },
  {
    type: "parametric",
    id: "c_yomi_substitute",
    title: "沉名易身",
    description: "最后一笔债写着一个熟悉的人。你终于明白，所谓延期，有时只是把死亡从你身上挪到别人身边。",
    minAge: createAge(20), maxAge: createAge(99), requiredChapter: "yomi_debt", chapterId: "yomi_debt",
    chapterFlagsRequired: { yomi_last_debt_requested: true }, weight: 8, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "把债转回自己名下", effects: { attributes: { physique: -4 }, setChapterFlags: { yomi_debt_self_taken: true, yomi_debt: 0 }, exitChapter: true, completeChapterId: "yomi_debt" }, resultText: "章盖下去的时候，你感到身体突然重了很多。但窗外的某个人，似乎终于能继续活下去。" },
      { text: "假装没有看清名字", effects: { attributes: {}, setChapterFlags: { yomi_debt_denied: true }, exitChapter: true, completeChapterId: "yomi_debt" }, resultText: "你回到现实。那天以后，你总觉得有人在梦里替你翻动一页空白档案。" },
    ],
  }
];
