// src/components/LifeResultBackground.tsx
import { motion } from "motion/react";
import type { EventResultPresentation } from "../engine/types";

interface LifeResultBackgroundProps {
  presentation: EventResultPresentation;
}

const TONE_BACKGROUNDS: Record<NonNullable<EventResultPresentation["tone"]>, string> = {
  neutral: "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.18), transparent 28%), linear-gradient(180deg, rgba(240,240,240,0.92), rgba(240,240,240,0.72))",
  memory: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.32), transparent 26%), linear-gradient(135deg, rgba(245,245,245,0.95), rgba(210,210,210,0.68))",
  well: "radial-gradient(circle at 50% 52%, rgba(120,160,180,0.24), transparent 24%), linear-gradient(180deg, rgba(8,13,18,0.96), rgba(0,0,0,0.98))",
  yomi: "radial-gradient(circle at 50% 35%, rgba(130,30,28,0.18), transparent 24%), repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 18px), linear-gradient(180deg, rgba(8,0,0,0.97), rgba(0,0,0,0.98))",
  death: "radial-gradient(circle at 50% 44%, rgba(255,255,255,0.12), transparent 20%), linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,1))",
  illness: "radial-gradient(circle at 50% 45%, rgba(220,220,220,0.18), transparent 30%), linear-gradient(180deg, rgba(24,24,24,0.96), rgba(3,3,3,0.98))",
  danger: "radial-gradient(circle at 50% 48%, rgba(255,255,255,0.24), transparent 18%), linear-gradient(180deg, rgba(18,18,18,0.96), rgba(0,0,0,0.99))",
};

const ENTER_VARIANTS: Record<NonNullable<EventResultPresentation["enter"]>, { initial: object; animate: object }> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  flash: {
    initial: { opacity: 0 },
    animate: { opacity: [0, 1, 0.72, 1] },
  },
  sink: {
    initial: { opacity: 0, y: -24, scale: 1.04 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(20px)", scale: 1.02 },
    animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
  },
};

export function LifeResultBackground({ presentation }: LifeResultBackgroundProps) {
  const tone = presentation.tone ?? "neutral";
  const enter = presentation.enter ?? "fade";
  const variant = ENTER_VARIANTS[enter];

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[35] pointer-events-none overflow-hidden"
      initial={variant.initial}
      animate={variant.animate}
      exit={{ opacity: 0 }}
      transition={{ duration: presentation.durationMs ? presentation.durationMs / 1000 : 1.1, ease: "easeOut" }}
      style={{ background: TONE_BACKGROUNDS[tone] }}
    >
      {presentation.cgSrc && (
        <motion.img
          src={presentation.cgSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-screen"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 0.45, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      )}
      {tone !== "neutral" && (
        <>
          <motion.div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
            animate={{ opacity: [0.04, 0.1, 0.05] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-white/18"
            initial={{ top: "18%" }}
            animate={{ top: ["18%", "82%", "18%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.45)_72%,rgba(0,0,0,0.72)_100%)]" />
        </>
      )}
    </motion.div>
  );
}
