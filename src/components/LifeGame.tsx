// src/components/LifeGame.tsx
import { useReducer, useEffect, useState } from "react";
import type { GameAction } from "../engine/types";
import { createInitialState, gameReducer } from "../engine/reducer";
import { saveGame, hasSave, loadGame, clearSave } from "../engine/autosave";
import { LifeContext, type LifeContextValue } from "./LifeContext";
import { LifeTalentPicker } from "./LifeTalentPicker";
import { LifeInfancyStage } from "./LifeInfancyStage";
import { LifeYouthStage } from "./LifeYouthStage";
import { LifeMidlifeStage } from "./LifeMidlifeStage";
import { LifeDeathScreen } from "./LifeDeathScreen";
import { LifeElderStage } from "./LifeElderStage";
import { LifeIntro } from "./LifeIntro";
import { AnimatePresence, motion } from "motion/react";

export function LifeGame() {
  const [state, dispatch] = useReducer(
    gameReducer,
    null,
    () => {
      if (hasSave()) {
        return { ...createInitialState(), phase: { type: "save_choice" } };
      }
      return createInitialState();
    },
  );

  const [intro, setIntro] = useState<"show" | "fade" | "hide">("show");

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const origSnap = html.style.scrollSnapType;
    const origOverflow = body.style.overflow;
    const origScroll = html.style.scrollBehavior;
    html.style.scrollSnapType = "none";
    html.style.scrollBehavior = "auto";
    body.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    requestAnimationFrame(() => {
      body.style.overflow = origOverflow;
      html.style.scrollBehavior = origScroll;
    });
    return () => {
      html.style.scrollSnapType = origSnap;
    };
  }, []);

  // 年龄段切换时自动保存
  useEffect(() => {
    saveGame(state);
  }, [state.age]);

  // 任意键触发"继续"
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // 不拦截 ReignsCard 的事件选择阶段、死亡/结局/选天赋/存档选择阶段
      const phase = state.phase;
      if (phase.type !== "playing") return;
      if (phase.step === "event_presenting") return; // ReignsCard 自己处理
      if (state.age <= 5) return; // 婴幼期自动叙事
      // 忽略输入框内的按键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (phase.step === "aging") {
        dispatch({ type: "ADVANCE_AGE" });
      } else if (phase.step === "effect_resolving") {
        dispatch({ type: "DISMISS_RESULT" });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [state.phase, state.age, dispatch]);

  const ctx: LifeContextValue = { state, dispatch };

  const renderPhase = () => {
    const phase = state.phase;

    switch (phase.type) {
      case "save_choice":
        return (
          <div className="flex flex-col items-center gap-8">
            <h2 className="font-serif text-3xl tracking-tighter">沉默一生</h2>
            <p className="font-mono text-xs text-secondary">发现上次的旅程记录</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  const saved = loadGame();
                  if (saved) dispatch({ type: "LOAD_SAVE", state: saved });
                }}
                className="px-6 py-2 border border-primary font-mono text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-canvas transition-colors"
              >
                继续上次旅程
              </button>
              <button
                onClick={() => {
                  clearSave();
                  dispatch({ type: "RESTART" });
                }}
                className="px-6 py-2 border border-primary/30 font-mono text-xs tracking-[0.2em] uppercase text-secondary hover:border-primary/60 hover:text-primary transition-colors"
              >
                重新开始
              </button>
            </div>
          </div>
        );

      case "talent_selection":
        return <LifeTalentPicker />;

      case "playing": {
        const { age } = state;
        const { currentEvent, pendingChoices } = state;

        // 按年龄段路由到不同组件
        if (age <= 5) return <LifeInfancyStage />;
        if (age <= 30) {
          if (currentEvent && pendingChoices) {
            return (
              <LifeYouthStage />
            );
          }
          return <LifeYouthStage />;
        }
        if (age <= 60) return <LifeMidlifeStage />;
        return <LifeElderStage />;
      }

      case "dying":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-8 max-w-lg text-center"
          >
            <p className="font-serif text-2xl tracking-tighter text-white/40">
              享年 {state.age} 岁
            </p>
            <p className="font-serif text-xl leading-relaxed text-white/70 italic">
              "{phase.cause}"
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <button
                onClick={() => dispatch({ type: "SHOW_RESULT" })}
                className="px-6 py-2 border border-white/20 font-mono text-xs tracking-[0.2em] uppercase text-white/50 hover:border-white/50 hover:text-white/80 transition-colors"
              >
                查看结局
              </button>
            </motion.div>
          </motion.div>
        );

      case "result":
        return <LifeDeathScreen />;

      default:
        return null;
    }
  };

  const isEnding = state.phase.type === "dying" || state.phase.type === "result";

  return (
    <LifeContext.Provider value={ctx}>
      <div className="relative min-h-screen bg-canvas text-primary font-sans">
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />

        <AnimatePresence>
          {intro === "show" && (
            <LifeIntro onDone={() => setIntro("fade")} />
          )}
        </AnimatePresence>

        {(intro === "show" || intro === "fade") && (
          <motion.div
            className="fixed inset-0 z-40 bg-black pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: intro === "fade" ? 0 : 1 }}
            transition={{ duration: 0.6 }}
            onAnimationComplete={() => { if (intro === "fade") setIntro("hide"); }}
          />
        )}

        <AnimatePresence>
          {isEnding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: state.phase.type === "result" ? 1 : 0.85 }}
              transition={{ duration: state.phase.type === "result" ? 1.2 : 0.8 }}
              className="absolute inset-0 z-20 bg-black pointer-events-none"
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: intro === "hide" ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className={`relative z-30 min-h-screen flex items-center justify-center p-8 ${isEnding ? "text-white" : ""}`}
        >
          {renderPhase()}
        </motion.div>
      </div>
    </LifeContext.Provider>
  );
}
