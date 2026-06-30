// src/components/LifeTalentPicker.tsx
import { useMemo } from "react";
import { useLife } from "./LifeContext";
import type { Talent, AttributeName } from "../engine/types";
import { TALENT_POOL } from "../data/life/talents";
import { selectTalentsForDraw } from "../engine/talent";
import { motion } from "motion/react";
import { scaleAttributeDelta } from "../engine/balance";

const ATTR_LABEL: Record<AttributeName, string> = {
  appearance: "颜值",
  intelligence: "智力",
  physique: "体质",
  wealth: "家境",
  creativity: "才脉",
  luck: "运势",
};

export function LifeTalentPicker() {
  const { state, dispatch } = useLife();
  const selectedTalentIds = useMemo(() => state.talents.map((t) => t.id), [state.talents]);
  const selectedTalentKey = selectedTalentIds.join("|");

  const candidates = useMemo(
    () => selectTalentsForDraw(TALENT_POOL, selectedTalentIds),
    [selectedTalentKey],
  );

  const handleSelect = (talent: Talent) => {
    dispatch({ type: "SELECT_TALENT", talentId: talent.id });
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-3xl tracking-tighter"
      >
        选择你的天赋
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {candidates.map((talent, i) => (
          <motion.button
            key={talent.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleSelect(talent)}
            className="group relative p-6 border border-primary/20 text-left hover:border-primary/60 transition-colors glass-panel"
          >
            <h3 className="font-mono text-sm tracking-wider mb-2">{talent.name}</h3>
            <p className="font-mono text-[10px] text-secondary leading-relaxed mb-3">
              {talent.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {(Object.entries(talent.positive) as [AttributeName, number][]).map(([k, v]) => (
                <span key={k} className="text-[10px] font-mono text-green-700 px-1">
                  {ATTR_LABEL[k]}+{scaleAttributeDelta(v)}
                </span>
              ))}
              {(Object.entries(talent.negative) as [AttributeName, number][]).map(([k, v]) => (
                <span key={k} className="text-[10px] font-mono text-red-700 px-1">
                  {ATTR_LABEL[k]}{scaleAttributeDelta(v)}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
