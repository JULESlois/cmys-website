// src/components/LifeResultBackground.tsx
import { motion } from "motion/react";
import type { EventResultPresentation } from "../engine/types";

interface LifeResultBackgroundProps {
  presentation: EventResultPresentation;
}

const TONE_BACKGROUNDS: Record<NonNullable<EventResultPresentation["tone"]>, string> = {
  neutral: "linear-gradient(180deg, rgba(240,240,240,0.92), rgba(240,240,240,0.72))",
  memory: "linear-gradient(135deg, rgba(245,245,245,0.95), rgba(210,210,210,0.68))",
  well: "linear-gradient(180deg, rgba(8,13,18,0.96), rgba(0,0,0,0.98))",
  yomi: "linear-gradient(180deg, rgba(8,0,0,0.97), rgba(0,0,0,0.98))",
  death: "linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,1))",
  illness: "linear-gradient(180deg, rgba(24,24,24,0.96), rgba(3,3,3,0.98))",
  danger: "linear-gradient(180deg, rgba(18,18,18,0.96), rgba(0,0,0,0.99))",
};

export function LifeResultBackground({ presentation }: LifeResultBackgroundProps) {
  const tone = presentation.tone ?? "neutral";

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed inset-0 z-[35] pointer-events-none overflow-hidden"
      style={{ background: TONE_BACKGROUNDS[tone] }}
    >
      {presentation.cgSrc && (
        <img
          src={presentation.cgSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-screen"
        />
      )}
    </motion.div>
  );
}
