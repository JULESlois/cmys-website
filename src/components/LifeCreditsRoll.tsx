// src/components/LifeCreditsRoll.tsx
import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { useLife } from "./LifeContext";
import { computeResult } from "../engine/ending";
import type { AttributeName, DeathType, ResolvedEvent } from "../engine/types";

const ROLL_DURATION_MS = 32000;
const MAX_TIMELINE_ITEMS = 24;

const ATTRIBUTE_LABELS: Record<AttributeName, string> = {
  appearance: "颜值",
  intelligence: "智力",
  physique: "体质",
  wealth: "家境",
  creativity: "才脉",
  luck: "运势",
};

const DEATH_TYPE_LABELS: Record<DeathType, string> = {
  attribute: "属性衰竭",
  lethal_choice: "事件终局",
  accident: "意外终局",
  natural: "寿终正寝",
};

function getDominantAttribute(attributes: Record<AttributeName, number>): string {
  const [name, value] = (Object.entries(attributes) as [AttributeName, number][])
    .sort((a, b) => b[1] - a[1])[0];
  return `${ATTRIBUTE_LABELS[name]} ${value}`;
}

function formatAttributeChanges(changes: ResolvedEvent["attributeChanges"]): string {
  const parts = (Object.entries(changes) as [AttributeName, number][])
    .filter(([, value]) => value !== 0)
    .map(([name, value]) => `${ATTRIBUTE_LABELS[name]}${value > 0 ? "+" : ""}${value}`);
  return parts.length > 0 ? parts.join(" / ") : "无属性变化";
}

function buildTimeline(eventLog: ResolvedEvent[]): ResolvedEvent[] {
  if (eventLog.length <= MAX_TIMELINE_ITEMS) return eventLog;

  const important = eventLog.filter((event, index) => {
    const changeTotal = Object.values(event.attributeChanges).reduce((sum, value) => sum + Math.abs(value ?? 0), 0);
    return index === 0 || index === eventLog.length - 1 || changeTotal >= 6 || event.chapterId;
  });

  if (important.length >= MAX_TIMELINE_ITEMS) {
    const step = (important.length - 1) / (MAX_TIMELINE_ITEMS - 1);
    return Array.from({ length: MAX_TIMELINE_ITEMS }, (_, index) => important[Math.round(index * step)]);
  }

  const selected = new Map<string, ResolvedEvent>();
  for (const event of important) {
    selected.set(`${event.age}-${event.eventId}-${event.choiceText}`, event);
  }

  const remainingSlots = MAX_TIMELINE_ITEMS - selected.size;
  if (remainingSlots > 0) {
    const step = Math.max(1, Math.floor(eventLog.length / remainingSlots));
    for (let index = 0; index < eventLog.length && selected.size < MAX_TIMELINE_ITEMS; index += step) {
      const event = eventLog[index];
      selected.set(`${event.age}-${event.eventId}-${event.choiceText}`, event);
    }
  }

  return [...selected.values()].sort((a, b) => Number(a.age) - Number(b.age));
}

export function LifeCreditsRoll() {
  const { state, dispatch } = useLife();
  const result = useMemo(() => computeResult(state), [state]);
  const deathRecord = state.deathRecord;
  const timeline = buildTimeline(state.eventLog);
  const dominantAttribute = getDominantAttribute(state.attributes);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch({ type: "SHOW_RESULT" });
    }, ROLL_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black text-white overflow-hidden font-cinematic-serif"
    >
      <button
        onClick={() => dispatch({ type: "SHOW_RESULT" })}
        className="fixed right-6 top-6 z-[80] font-mono text-[10px] tracking-[0.35em] uppercase text-white/45 hover:text-white/85 transition-colors"
      >
        跳过
      </button>

      <div className="absolute inset-x-0 top-1/2 z-[71] flex justify-center px-8 -translate-y-1/2 pointer-events-none">
        <div className="h-[1px] w-[min(720px,82vw)] bg-white/18" />
      </div>

      <div className="cinematic-roll absolute inset-x-0 top-0 z-[72] flex justify-center px-8 text-center">
        <div className="w-[min(720px,82vw)] mx-auto text-center">
          <p className="font-mono text-[10px] tracking-[0.45em] uppercase text-white/35 mb-8 text-center">
            CMYS LIFE SIMULATION
          </p>

          <h2 className="text-4xl sm:text-5xl tracking-[0.18em] text-white/90 mb-10 text-center">
            沉默一生
          </h2>

          <div className="h-[1px] w-20 bg-white/35 mx-auto mb-12" />

          <section className="space-y-3 mb-16 text-center">
            <p className="text-sm tracking-[0.28em] text-white/40 text-center">终止年龄</p>
            <p className="text-3xl tracking-[0.12em] text-white/85 text-center">{state.age} 岁</p>
          </section>

          {deathRecord && (
            <section className="space-y-5 mb-16 text-center">
              <p className="text-sm tracking-[0.28em] text-white/40 text-center">
                {DEATH_TYPE_LABELS[deathRecord.deathType]}
              </p>
              <p className="text-xl leading-loose text-white/78 italic text-center mx-auto max-w-[620px]">
                “{deathRecord.cause}”
              </p>
            </section>
          )}

          <section className="space-y-7 mb-16 text-center">
            <p className="text-sm tracking-[0.28em] text-white/40 text-center">人生历程</p>
            {timeline.length > 0 ? timeline.map((event, index) => (
              <div key={`${event.age}-${event.eventId}-${index}`} className="text-center mx-auto max-w-[640px] space-y-2">
                <p className="font-mono text-[10px] tracking-[0.25em] text-white/35 text-center">
                  {event.age} 岁
                </p>
                <p className="text-lg leading-relaxed text-white/74 text-center">
                  {event.title}
                </p>
                <p className="text-sm leading-relaxed text-white/56 text-center">
                  选择：{event.choiceText}
                </p>
                <p className="font-mono text-[10px] leading-relaxed text-white/35 text-center">
                  {formatAttributeChanges(event.attributeChanges)}
                </p>
              </div>
            )) : (
              <p className="text-base text-white/60 text-center">没有留下可被记录的片段。</p>
            )}
          </section>

          <section className="space-y-4 mb-16 text-center">
            <p className="text-sm tracking-[0.28em] text-white/40 text-center">余下的痕迹</p>
            <p className="text-lg text-white/72 text-center">最高属性：{dominantAttribute}</p>
            <p className="text-lg text-white/72 text-center">结局称号：{result.title}</p>
            <p className="text-lg text-white/72 text-center">最终评分：{result.totalScore}</p>
            <p className="text-lg text-white/72 text-center">记录事件：{state.eventLog.length} 件</p>
          </section>

          <div className="h-[1px] w-20 bg-white/25 mx-auto mb-12" />

          <p className="text-xl leading-loose text-white/70 text-center mx-auto max-w-[620px]">
            那些没有被选择的路，仍在黑暗里向后滚动。
          </p>
          <p className="mt-10 font-mono text-[10px] tracking-[0.5em] uppercase text-white/30 text-center">
            END OF RECORD
          </p>
        </div>
      </div>
    </motion.div>
  );
}
