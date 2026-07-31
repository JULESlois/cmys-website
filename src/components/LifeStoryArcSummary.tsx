import { motion } from "motion/react";
import { useLife } from "./LifeContext";
import { LifeStatsBars } from "./LifeStatsBars";
import { getStoryArcByAge, getStoryArcById } from "../data/life/story-arcs";

export function LifeStoryArcSummary() {
  const { state, dispatch } = useLife();
  const phase = state.phase;
  if (phase.type !== "story_arc_summary") return null;

  const arc = getStoryArcById(phase.arcId) ?? getStoryArcByAge(state.age);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="flex flex-col items-center justify-center gap-8 w-full max-w-xl text-center"
    >
      <div className="flex flex-col items-center gap-3">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-secondary/60">
          {arc.name} · 终章
        </p>
        <div className="text-center">
          <p className="font-serif text-8xl tracking-tighter">{state.age}</p>
          <p className="font-mono text-xs text-secondary mt-2">岁</p>
        </div>
      </div>


      <LifeStatsBars attributes={state.attributes} />

      <button
        onClick={() => dispatch({ type: "DISMISS_STORY_ARC_SUMMARY" })}
        className="font-mono text-xs tracking-[0.2em] text-primary/70"
      >
        继续
      </button>
    </motion.div>
  );
}
