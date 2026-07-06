// src/components/LifeEventResult.tsx
import { motion } from "motion/react";
import type { EventResult, AttributeName } from "../engine/types";

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

export function LifeEventResult({ result, onDismiss }: Props) {
  const changes = Object.entries(result.attributeChanges) as [AttributeName, number][];
  const hasChanges = changes.length > 0;
  const talentEffects = result.talentEffects ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-6 max-w-lg w-full"
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-serif text-lg leading-relaxed text-center text-primary/80"
      >
        {result.text}
      </motion.p>

      {hasChanges && (
        <div className="flex flex-wrap justify-center gap-3">
          {changes.map(([key, val]) => (
            <span
              key={key}
              className={`font-mono text-sm tabular-nums ${val > 0 ? "text-green-700" : val < 0 ? "text-red-700" : "text-secondary"}`}
            >
              {LABELS[key]} {val > 0 ? "+" : ""}{val}
            </span>
          ))}
        </div>
      )}

      {talentEffects.length > 0 && (
        <div className="flex flex-col items-center gap-1 text-center">
          {talentEffects.map((effect, index) => (
            <span key={`${effect}-${index}`} className="font-mono text-[10px] text-primary/50">
              {effect}
            </span>
          ))}
        </div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onDismiss}
        className="life-text-action"
      >
        继续
      </motion.button>
    </motion.div>
  );
}
