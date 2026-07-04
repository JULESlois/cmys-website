import { motion } from "motion/react";
import { useLife } from "./LifeContext";
import { LifeStatsBars } from "./LifeStatsBars";
import { getStoryArcByAge, getStoryArcById } from "../data/life/story-arcs";
import { getStoryArcNarrativeSummary } from "../engine/story-summary";

export function LifeStoryArcSummary() {
  const { state, dispatch } = useLife();
  const phase = state.phase;
  if (phase.type !== "story_arc_summary") return null;

  const arc = getStoryArcById(phase.arcId) ?? getStoryArcByAge(state.age);
  const narrative = getStoryArcNarrativeSummary(state, phase.arcId);

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

      <div className="glass-panel border border-primary/10 px-5 py-5 text-left w-full space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-secondary/70">
            {narrative.heading}
          </p>
          {narrative.motifs.map((motif) => (
            <span
              key={motif}
              className="font-mono text-[10px] text-primary/50 border border-primary/10 px-2 py-0.5"
            >
              {motif}
            </span>
          ))}
        </div>
        <div className="space-y-3">
          {narrative.paragraphs.map((paragraph, index) => (
            <p key={index} className="font-serif text-sm leading-relaxed text-primary/75">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <LifeStatsBars attributes={state.attributes} />

      <button
        onClick={() => dispatch({ type: "DISMISS_STORY_ARC_SUMMARY" })}
        className="px-6 py-2 border border-primary font-mono text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-canvas transition-colors"
      >
        继续
      </button>
    </motion.div>
  );
}
