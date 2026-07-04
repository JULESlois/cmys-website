// src/components/LifeMidlifeStage.tsx
import { useLife } from "./LifeContext";
import { ReignsCard } from "./ReignsCard";
import { LifeStatsBars } from "./LifeStatsBars";
import { LifeEventResult } from "./LifeEventResult";
import { LifeAutoAdvance } from "./LifeAutoAdvance";

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

  return <LifeAutoAdvance delta={3} />;
}
