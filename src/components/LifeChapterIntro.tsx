// src/components/LifeChapterIntro.tsx
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { ChapterDefinition, ChapterEntryAnimation } from "../engine/types";

interface Props {
  chapter: ChapterDefinition;
  animation: ChapterEntryAnimation;
  onDone: () => void;
}

function defaultTitle(chapter: ChapterDefinition): string {
  return chapter.name.replace(/篇$/, "");
}

export function LifeChapterIntro({ chapter, animation, onDone }: Props) {
  const [stage, setStage] = useState<"enter" | "hold" | "exit">("enter");
  const duration = animation.durationMs ?? 3200;
  const fadeInMs = 700;
  const fadeOutMs = 800;
  const title = animation.chars?.length ? animation.chars.join("") : defaultTitle(chapter);
  const subtitle = animation.subtitle ?? chapter.subtitle ?? chapter.description;

  useEffect(() => {
    const holdTimer = setTimeout(() => setStage("hold"), fadeInMs);
    const exitTimer = setTimeout(() => setStage("exit"), Math.max(fadeInMs, duration - fadeOutMs));
    const doneTimer = setTimeout(onDone, duration);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "exit" ? 0 : 1 }}
      transition={{ duration: stage === "exit" ? fadeOutMs / 1000 : 0.2, ease: "easeInOut" }}
    >
      <motion.div
        className="flex flex-col items-center gap-6 px-8 text-center"
        initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
        animate={stage === "enter"
          ? { opacity: 0, filter: "blur(6px)", y: 12 }
          : stage === "exit"
            ? { opacity: 0, filter: "blur(4px)", y: -8 }
            : { opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: stage === "exit" ? 0.55 : 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-serif text-5xl tracking-[0.18em] text-white">
          {title}
        </p>
        {subtitle && (
          <p className="max-w-xl font-mono text-xs leading-relaxed tracking-[0.24em] text-white/55">
            {subtitle}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
