// src/components/LifeInfancyStage.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLife } from "./LifeContext";
import { ANCHOR_EVENTS } from "../data/life/events-anchors";

export function LifeInfancyStage() {
  const { state, dispatch } = useLife();
  const [narrationIndex, setNarrationIndex] = useState(0);

  const infancyEvents = ANCHOR_EVENTS
    .filter((e) => e.maxAge <= 5)
    .sort((a, b) => (a.triggerAge as number) - (b.triggerAge as number));

  useEffect(() => {
    if (narrationIndex >= infancyEvents.length) {
      // 婴幼期结束，直接跳到 6 岁进入少年期
      const timer = setTimeout(() => {
        // 应用所有婴幼期事件的自动效果到属性
        let newAttrs = { ...state.attributes };
        for (const e of infancyEvents) {
          if (e.choices[0]?.effects?.attributes) {
            for (const [k, v] of Object.entries(e.choices[0].effects.attributes)) {
              newAttrs = {
                ...newAttrs,
                [k]: Math.max(0, Math.min(100, newAttrs[k as keyof typeof newAttrs] + (v as number))),
              };
            }
          }
        }
        dispatch({
          type: "LOAD_SAVE",
          state: {
            ...state,
            age: 6 as import("../engine/types").Age,
            attributes: newAttrs,
            phase: { type: "playing", step: "aging" },
            eventLog: infancyEvents.map((e) => ({
              age: (e.triggerAge as number) as import("../engine/types").Age,
              eventId: e.id,
              title: e.title,
              choiceText: e.choices[0]?.text ?? "",
              attributeChanges: e.choices[0]?.effects?.attributes ?? {},
            })),
            triggeredEventIds: Object.fromEntries(infancyEvents.map((e) => [e.id, 6])),
          },
        });
      }, 800);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setNarrationIndex((i) => i + 1);
    }, 2500);

    return () => clearTimeout(timer);
  }, [narrationIndex]);

  const currentEvent = infancyEvents[narrationIndex];

  if (!currentEvent) {
    return (
      <div className="flex items-center justify-center">
        <p className="font-mono text-xs text-secondary animate-pulse">成长中...</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentEvent.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center gap-6 text-center max-w-lg"
      >
        <p className="font-serif text-5xl tracking-tighter">{currentEvent.title}</p>
        <div className="h-[1px] w-12 bg-primary/20" />
        <p className="font-mono text-sm text-secondary leading-relaxed">
          {currentEvent.description}
        </p>
        <p className="font-mono text-xs text-secondary/50">
          {narrationIndex + 1} / {infancyEvents.length}
        </p>
        <button
          onClick={() => setNarrationIndex(infancyEvents.length)}
          className="mt-2 px-4 py-1 border border-primary/15 font-mono text-[10px] text-secondary/40 hover:text-secondary hover:border-primary/30 transition-colors cursor-pointer"
        >
          跳过
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
