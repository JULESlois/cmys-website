import { useEffect } from "react";
import { useLife } from "./LifeContext";

interface LifeAutoAdvanceProps {
  delta?: number;
}

export function LifeAutoAdvance({ delta }: LifeAutoAdvanceProps) {
  const { state, dispatch } = useLife();

  useEffect(() => {
    if (state.phase.type !== "playing" || state.phase.step !== "aging") return;
    if (state.currentEvent || state.pendingChoices || state.lastResult) return;
    if (state.age >= 100) return;

    const id = window.setTimeout(() => {
      dispatch({ type: "ADVANCE_AGE", delta });
    }, 0);

    return () => window.clearTimeout(id);
  }, [state.phase, state.age, state.currentEvent, state.pendingChoices, state.lastResult, delta, dispatch]);

  return null;
}
