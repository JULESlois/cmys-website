// src/components/LifeEventResult.tsx
import { motion } from "motion/react";
import type { EventResult, AttributeName, EventResultPresentation } from "../engine/types";
import { LifeResultBackground } from "./LifeResultBackground";

const LABELS: Record<AttributeName, string> = {
  appearance: "颜值",
  intelligence: "智力",
  physique: "体质",
  wealth: "家境",
  creativity: "才脉",
  luck: "运势",
};

interface Props {
  result: EventResult;
  onDismiss: () => void;
}

function largestDrop(result: EventResult): number {
  return Math.min(0, ...Object.values(result.attributeChanges).map((value) => value ?? 0));
}

function largestSwing(result: EventResult): number {
  return Math.max(0, ...Object.values(result.attributeChanges).map((value) => Math.abs(value ?? 0)));
}

function inferPresentation(result: EventResult): EventResultPresentation | null {
  if (result.presentation) return result.presentation;

  // 特殊演出优先由事件显式配置，黄泉债作为系统级事件保留兜底。
  if (result.chapterTransition?.includes("黄泉债")) {
    return { tone: "yomi", enter: "fade", text: "subtitle", durationMs: 700 };
  }

  return null;
}

export function LifeEventResult({ result, onDismiss }: Props) {
  const changes = Object.entries(result.attributeChanges) as [AttributeName, number][];
  const hasChanges = changes.length > 0;
  const talentEffects = result.talentEffects ?? [];
  const systemEffects = result.systemEffects ?? [];
  const presentation = inferPresentation(result);
  const hasScene = Boolean(presentation && presentation.tone !== "neutral");
  const textAnimation = presentation?.text ?? "fade-up";

  return (
    <>
      {presentation && <LifeResultBackground presentation={presentation} />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-[45] flex flex-col items-center gap-6 max-w-lg w-full"
      >
        <motion.p
          initial={{ opacity: 0, y: textAnimation === "subtitle" ? 8 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: hasScene ? 0.2 : 0.05, duration: 0.4 }}
          className={`font-serif text-lg leading-relaxed text-center ${hasScene ? "text-white/82 drop-shadow-[0_2px_18px_rgba(0,0,0,0.75)]" : "text-primary/80"}`}
        >
          {result.text}
        </motion.p>

        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: hasScene ? 0.45 : 0.15, duration: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {changes.map(([key, val]) => (
              <span
                key={key}
                className={`font-mono text-sm tabular-nums ${hasScene ? "text-white/58" : val > 0 ? "text-green-700" : val < 0 ? "text-red-700" : "text-secondary"}`}
              >
                {LABELS[key]} {val > 0 ? "+" : ""}{val}
                {result.attributeValues?.[key] !== undefined ? ` · 现为 ${result.attributeValues[key]}` : ""}
              </span>
            ))}
          </motion.div>
        )}

        {systemEffects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: hasScene ? 0.55 : 0.2, duration: 0.3 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            {systemEffects.map((effect, index) => (
              <span key={`${effect}-${index}`} className={`font-mono text-[10px] ${hasScene ? "text-white/52" : "text-primary/60"}`}>
                {effect}
              </span>
            ))}
          </motion.div>
        )}

        {talentEffects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: hasScene ? 0.55 : 0.2, duration: 0.3 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            {talentEffects.map((effect, index) => (
              <span key={`${effect}-${index}`} className={`font-mono text-[10px] ${hasScene ? "text-white/38" : "text-primary/50"}`}>
                {effect}
              </span>
            ))}
          </motion.div>
        )}

        {result.chapterTransition && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: hasScene ? 0.65 : 0.25, duration: 0.3 }}
            className={`font-mono text-[10px] tracking-[0.22em] uppercase ${hasScene ? "text-white/45" : "text-secondary/70"}`}
          >
            {result.chapterTransition}
          </motion.p>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: hasScene ? 0.85 : 0.35 }}
          onClick={onDismiss}
          className={hasScene ? "font-mono text-xs tracking-[0.2em] text-white/60" : "font-mono text-xs tracking-[0.2em] text-primary/70"}
        >
          继续
        </motion.button>
      </motion.div>
    </>
  );
}
