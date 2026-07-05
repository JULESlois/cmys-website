// src/components/LifeCreditsRoll.tsx
import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { useLife } from "./LifeContext";
import { computeResult } from "../engine/ending";
import type { AttributeName, DeathType } from "../engine/types";

const ROLL_DURATION_MS = 18000;

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

export function LifeCreditsRoll() {
  const { state, dispatch } = useLife();
  const result = useMemo(() => computeResult(state), [state]);
  const deathRecord = state.deathRecord;
  const recentEvents = state.eventLog.slice(-5);
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

      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent z-[75] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-[75] pointer-events-none" />

      <div className="absolute left-1/2 top-1/2 w-[min(720px,82vw)] -translate-x-1/2 -translate-y-1/2">
        <div className="h-[1px] w-full bg-white/20" />
      </div>

      <div className="cinematic-roll absolute left-1/2 w-[min(720px,82vw)] -translate-x-1/2 text-center">
        <p className="font-mono text-[10px] tracking-[0.45em] uppercase text-white/35 mb-8">
          CMYS LIFE SIMULATION
        </p>

        <h2 className="text-4xl sm:text-5xl tracking-[0.18em] text-white/90 mb-10">
          沉默一生
        </h2>

        <div className="h-[1px] w-20 bg-white/35 mx-auto mb-12" />

        <section className="space-y-3 mb-14">
          <p className="text-sm tracking-[0.28em] text-white/40">终止年龄</p>
          <p className="text-3xl tracking-[0.12em] text-white/85">{state.age} 岁</p>
        </section>

        {deathRecord && (
          <section className="space-y-5 mb-14">
            <p className="text-sm tracking-[0.28em] text-white/40">
              {DEATH_TYPE_LABELS[deathRecord.deathType]}
            </p>
            <p className="text-xl leading-loose text-white/78 italic">
              “{deathRecord.cause}”
            </p>
          </section>
        )}

        <section className="space-y-4 mb-14">
          <p className="text-sm tracking-[0.28em] text-white/40">最后经过的片段</p>
          {recentEvents.length > 0 ? recentEvents.map((event) => (
            <p key={`${event.age}-${event.eventId}-${event.choiceText}`} className="text-base leading-relaxed text-white/66">
              {event.age}岁　{event.title}　—　{event.choiceText}
            </p>
          )) : (
            <p className="text-base text-white/60">没有留下可被记录的片段。</p>
          )}
        </section>

        <section className="space-y-4 mb-14">
          <p className="text-sm tracking-[0.28em] text-white/40">余下的痕迹</p>
          <p className="text-lg text-white/72">最高属性：{dominantAttribute}</p>
          <p className="text-lg text-white/72">结局称号：{result.title}</p>
          <p className="text-lg text-white/72">最终评分：{result.totalScore}</p>
        </section>

        <div className="h-[1px] w-20 bg-white/25 mx-auto mb-12" />

        <p className="text-xl leading-loose text-white/70">
          那些没有被选择的路，仍在黑暗里向后滚动。
        </p>
        <p className="mt-10 font-mono text-[10px] tracking-[0.5em] uppercase text-white/30">
          END OF RECORD
        </p>
      </div>
    </motion.div>
  );
}
