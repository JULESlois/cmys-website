// src/components/LifeMidlifeStage.tsx
import { useLife } from "./LifeContext";
import { ReignsCard } from "./ReignsCard";
import { LifeStatsBars } from "./LifeStatsBars";
import { LifeEventResult } from "./LifeEventResult";
import { motion } from "motion/react";

export function LifeMidlifeStage() {
  const { state, dispatch } = useLife();
  const { currentEvent, pendingChoices, age, phase, lastResult } = state;

  if (phase.type === "playing" && phase.step === "effect_resolving" && lastResult) {
    return (
      <LifeEventResult
        result={lastResult}
        onDismiss={() => dispatch({ type: "DISMISS_RESULT" })}
      />
    );
  }

  if (currentEvent && pendingChoices) {
    return (
      <div className="flex flex-col gap-6 items-center w-full max-w-2xl">
        <ReignsCard
          event={currentEvent}
          choices={pendingChoices}
          age={age}
          onChoose={(i) => dispatch({ type: "RESOLVE_EVENT", choiceIndex: i })}
          stageLabel={`切片事件 · ${age - 2}~${age} 岁`}
        />
        <LifeStatsBars attributes={state.attributes} compact />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <p className="font-serif text-8xl tracking-tighter">{age}</p>
        <p className="font-mono text-xs text-secondary mt-2">岁</p>
        <p className="font-mono text-[10px] text-secondary/50 mt-1">壮年期 · 黄金时代</p>
      </div>
      <LifeStatsBars attributes={state.attributes} />
      {state.career && (
        <div className="text-center">
          <p className="font-mono text-[10px] text-secondary uppercase tracking-widest">职业</p>
          <p className="font-mono text-sm">{state.career.title}</p>
        </div>
      )}
      <button
        onClick={() => dispatch({ type: "ADVANCE_AGE", delta: 3 })}
        className="px-6 py-2 border border-primary font-mono text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-canvas transition-colors"
      >
        继续（+3岁）
      </button>
    </div>
  );
}
