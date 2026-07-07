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

  const text = `${result.text} ${result.chapterTransition ?? ""}`;
  const physiqueDrop = result.attributeChanges.physique ?? 0;
  const luckDrop = result.attributeChanges.luck ?? 0;

  if (/井|沉没|异生|井下|水声|回声/.test(text)) {
    return { tone: "well", enter: "sink", text: "subtitle", durationMs: 1400 };
  }
  if (/黄泉|赊|延期|账|债/.test(text)) {
    return { tone: "yomi", enter: "sink", text: "subtitle", durationMs: 1400 };
  }
  if (/事故|危险|坠|撞|火|溺|终局/.test(text) || luckDrop <= -6) {
    return { tone: "danger", enter: "flash", text: "subtitle", durationMs: 950 };
  }
  if (/病|痛|医院|体检|咳|药|衰|昏|烧/.test(text) || physiqueDrop <= -5) {
    return { tone: "illness", enter: "blur", text: "subtitle", durationMs: 1500 };
  }
  if (largestDrop(result) <= -7) {
    return { tone: "death", enter: "fade", text: "subtitle", durationMs: 1200 };
  }
  if (largestSwing(result) >= 8) {
    return { tone: "memory", enter: "fade", text: "fade-up", durationMs: 1000 };
  }

  return null;
}

export function LifeEventResult({ result, onDismiss }: Props) {
  const changes = Object.entries(result.attributeChanges) as [AttributeName, number][];
  const hasChanges = changes.length > 0;
  const talentEffects = result.talentEffects ?? [];
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
          transition={{ delay: hasScene ? 0.35 : 0.1, duration: hasScene ? 0.9 : 0.45 }}
          className={`font-serif text-lg leading-relaxed text-center ${hasScene ? "text-white/82 drop-shadow-[0_2px_18px_rgba(0,0,0,0.75)]" : "text-primary/80"}`}
        >
          {result.text}
        </motion.p>

        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: hasScene ? 0.95 : 0.2, duration: 0.45 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {changes.map(([key, val]) => (
              <span
                key={key}
                className={`font-mono text-sm tabular-nums ${hasScene ? "text-white/58" : val > 0 ? "text-green-700" : val < 0 ? "text-red-700" : "text-secondary"}`}
              >
                {LABELS[key]} {val > 0 ? "+" : ""}{val}
              </span>
            ))}
          </motion.div>
        )}

        {talentEffects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: hasScene ? 1.15 : 0.3, duration: 0.45 }}
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
            transition={{ delay: hasScene ? 1.3 : 0.35, duration: 0.45 }}
            className={`font-mono text-[10px] tracking-[0.22em] uppercase ${hasScene ? "text-white/45" : "text-secondary/70"}`}
          >
            {result.chapterTransition}
          </motion.p>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: hasScene ? 1.55 : 0.6 }}
          onClick={onDismiss}
          className={hasScene ? "life-text-action life-text-action-light" : "life-text-action"}
        >
          继续
        </motion.button>
      </motion.div>
    </>
  );
}
