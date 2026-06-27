// src/components/LifeDeathScreen.tsx
import { motion } from "motion/react";
import { useLife } from "./LifeContext";
import { computeResult } from "../engine/ending";
import { ENDING_FLAVOR_TEXTS } from "../data/life/endings";
import { ALL_ACHIEVEMENTS } from "../data/life/achievements";
import type { DeathType } from "../engine/types";

const DEATH_TYPE_LABELS: Record<DeathType, string> = {
  attribute: "（属性衰竭致死）",
  lethal_choice: "（事件致死）",
  accident: "（意外身亡）",
  natural: "（寿终正寝）",
};

export function LifeDeathScreen() {
  const { state, dispatch } = useLife();
  const result = computeResult(state);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 1.2 }}
      className="flex flex-col items-center gap-10 max-w-2xl w-full text-white"
    >
      {/* 星级 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="flex gap-3"
      >
        {[1, 2, 3, 4, 5].map((star, i) => (
          <motion.span
            key={star}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: star <= result.starRating ? 1 : 0.3, scale: 1 }}
            transition={{ delay: 1.5 + i * 0.15, type: "spring", stiffness: 200 }}
            className="text-4xl"
          >
            ★
          </motion.span>
        ))}
      </motion.div>

      {/* 称号 */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="font-serif text-5xl sm:text-6xl tracking-tighter text-center"
      >
        {result.title}
      </motion.h2>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="h-[1px] w-24 bg-white/30"
      />

      {/* 死因 */}
      {state.deathRecord && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0, duration: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <p className="font-serif text-lg text-white/70 text-center italic leading-relaxed max-w-md">
            "{state.deathRecord.cause}"
          </p>
          <p className="font-mono text-xs text-white/40">
            {DEATH_TYPE_LABELS[state.deathRecord.deathType]}
          </p>
        </motion.div>
      )}

      {/* 描述 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 0.8 }}
        className="font-mono text-base text-white/80"
      >
        {result.description}
      </motion.p>

      {/* 风味文本 */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.6, duration: 1 }}
        className="font-serif text-2xl text-white/85 text-center leading-relaxed italic"
      >
        {ENDING_FLAVOR_TEXTS[result.starRating]}
      </motion.p>

      {/* 高亮 */}
      {result.highlights.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.2, duration: 0.8 }}
          className="flex flex-col gap-3 w-full"
        >
          {result.highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 4.4 + i * 0.2 }}
              className="p-4 border border-white/20 font-mono text-sm text-white/80 text-center"
            >
              {h}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 成就 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.0, duration: 0.8 }}
        className="w-full border-t border-white/15 pt-8"
      >
        <p className="font-mono text-sm text-white/60 tracking-widest uppercase mb-4 text-center">
          成就 ({result.achievements.length}/{result.allAchievements.length})
        </p>
        <div className="grid grid-cols-2 gap-2">
          {result.allAchievements.map((id, i) => {
            const achievement = ALL_ACHIEVEMENTS.find((a) => a.id === id);
            if (!achievement) return null;
            const unlocked = result.achievements.includes(id);
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.2 + i * 0.05 }}
                className={`p-3 border text-left font-mono ${
                  unlocked
                    ? "border-white/25 text-white/90"
                    : "border-white/8 text-white/25"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm ${unlocked ? "" : "line-through"}`}>
                    {achievement.name}
                  </span>
                  {unlocked && (
                    <span className="text-xs text-white/50">
                      +{achievement.score}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 text-white/50 leading-relaxed">
                  {achievement.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 人生回顾 */}
      {state.eventLog.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.2, duration: 1 }}
          className="w-full border-t border-white/15 pt-8"
        >
          <p className="font-mono text-sm text-white/60 tracking-widest uppercase mb-6 text-center">
            人生回顾
          </p>
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {state.eventLog.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.4 + i * 0.03 }}
                className="flex gap-4 font-mono text-xs text-white/50 hover:text-white/80 transition-colors"
              >
                <span className="w-8 text-right shrink-0">{e.age}岁</span>
                <span className="shrink-0">{e.title}</span>
                <span className="truncate">— {e.choiceText}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 重新开始 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6.5, duration: 0.8 }}
      >
        <button
          onClick={() => dispatch({ type: "RESTART" })}
          className="px-8 py-3 border border-white/40 font-mono text-sm tracking-[0.3em] uppercase text-white/80 hover:bg-white hover:text-black transition-colors"
        >
          再来一局
        </button>
      </motion.div>
    </motion.div>
  );
}
