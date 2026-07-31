// src/components/LifeGame.tsx
import { useReducer, useEffect, useState } from "react";
import type { GameAction } from "../engine/types";
import { createInitialState, gameReducer } from "../engine/reducer";
import { saveGame, hasSave, loadGame, clearSave, getSaveMetadata } from "../engine/autosave";
import { LifeContext, type LifeContextValue } from "./LifeContext";
import { LifeTalentPicker } from "./LifeTalentPicker";
import { LifeInfancyStage } from "./LifeInfancyStage";
import { LifeYouthStage } from "./LifeYouthStage";
import { LifeMidlifeStage } from "./LifeMidlifeStage";
import { LifeDeathScreen } from "./LifeDeathScreen";
import { LifeElderStage } from "./LifeElderStage";
import { LifeIntro } from "./LifeIntro";
import { LifeChapterIntro } from "./LifeChapterIntro";
import { LifeMusicPlayer } from "./LifeMusicPlayer";
import { LifeStoryArcSummary } from "./LifeStoryArcSummary";
import { LifeCreditsRoll } from "./LifeCreditsRoll";
import { getChapterById } from "../data/life/chapters";
import { getAttributeEndingByAttribute } from "../data/life/attribute-endings";
import { getStoryArcById } from "../data/life/story-arcs";
import { AnimatePresence, motion } from "motion/react";

function formatSaveTimestamp(timestamp: number | null): string {
  if (!timestamp) return "旧版记录";
  return new Date(timestamp).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

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
  const [saveMetadata] = useState(() => getSaveMetadata());

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

  // 在年龄检查点、事件展示/结算、篇章切换与终局自动保存。
  useEffect(() => {
    const phase = state.phase;
    const force =
      (phase.type === "playing" && (
        phase.step === "event_presenting" ||
        phase.step === "effect_resolving" ||
        (state.age === 0 && state.talents.length > 0)
      )) ||
      phase.type === "story_arc_summary" ||
      phase.type === "chapter_intro" ||
      phase.type === "dying" ||
      phase.type === "life_credits_roll" ||
      phase.type === "ending_prelude" ||
      phase.type === "result";

    saveGame(state, force);
  }, [state]);

  // 开始全新人生时清除上一段人生的自动存档。
  useEffect(() => {
    if (state.phase.type === "talent_selection" && state.age === 0 && state.eventLog.length === 0) {
      clearSave();
    }
  }, [state.phase.type, state.age, state.eventLog.length]);

  // 任意键触发"继续"
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // 不拦截 ReignsCard 的事件选择阶段、死亡/结局/选天赋/存档选择阶段
      const phase = state.phase;
      // 忽略输入框内的按键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (phase.type === "story_arc_summary") {
        dispatch({ type: "DISMISS_STORY_ARC_SUMMARY" });
        return;
      }

      if (phase.type !== "playing") return;
      if (phase.step === "event_presenting") return; // ReignsCard 自己处理
      if (state.age <= 5) return; // 婴幼期自动叙事

      if (phase.step === "effect_resolving") {
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
            {saveMetadata && (
              <div className="flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-secondary/65">
                <p>
                  {saveMetadata.age} 岁 · {saveMetadata.activeChapterId
                    ? getChapterById(saveMetadata.activeChapterId)?.name ?? saveMetadata.activeChapterId
                    : getStoryArcById(saveMetadata.storyArcId)?.name ?? saveMetadata.storyArcId}
                </p>
                <p>保存于 {formatSaveTimestamp(saveMetadata.timestamp)}</p>
              </div>
            )}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  const saved = loadGame();
                  if (saved) dispatch({ type: "LOAD_SAVE", state: saved });
                }}
                className="font-mono text-xs tracking-[0.2em] text-primary/70"
              >
                继续上次旅程
              </button>
              <button
                onClick={() => {
                  clearSave();
                  dispatch({ type: "RESTART" });
                }}
                className="font-mono text-xs tracking-[0.2em] text-secondary/60"
              >
                重新开始
              </button>
            </div>
          </div>
        );

      case "talent_selection":
        return <LifeTalentPicker />;

      case "story_arc_summary":
        return <LifeStoryArcSummary />;

      case "chapter_intro": {
        const chapter = getChapterById(phase.chapterId);
        if (!chapter?.entryAnimation?.enabled) {
          dispatch({ type: "DISMISS_CHAPTER_INTRO" });
          return null;
        }
        return (
          <LifeChapterIntro
            chapter={chapter}
            animation={chapter.entryAnimation}
            onDone={() => dispatch({ type: "DISMISS_CHAPTER_INTRO" })}
          />
        );
      }

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

      case "ending_prelude": {
        const ending = getAttributeEndingByAttribute(phase.endingId);
        if (!ending) {
          dispatch({ type: "SHOW_RESULT" });
          return null;
        }
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-8 max-w-lg text-center text-white"
          >
            <p className="font-mono text-xs tracking-[0.35em] uppercase text-white/35">
              属性抵达极值
            </p>
            <h2 className="font-serif text-5xl tracking-tighter text-white/85">
              {ending.title}
            </h2>
            <p className="font-serif text-xl leading-relaxed text-white/70 italic">
              "{ending.triggerText}"
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <button
                onClick={() => dispatch({ type: "SHOW_RESULT" })}
                className="font-mono text-xs tracking-[0.2em] text-white/60"
              >
                查看结局
              </button>
            </motion.div>
          </motion.div>
        );
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
                onClick={() => dispatch({ type: "SHOW_CREDITS_ROLL" })}
                className="font-mono text-xs tracking-[0.2em] text-white/60"
              >
                查看结局
              </button>
            </motion.div>
          </motion.div>
        );

      case "life_credits_roll":
        return <LifeCreditsRoll />;

      case "result":
        return <LifeDeathScreen />;

      default:
        return null;
    }
  };

  const isEnding = state.phase.type === "dying" || state.phase.type === "life_credits_roll" || state.phase.type === "ending_prelude" || state.phase.type === "result";

  return (
    <LifeContext.Provider value={ctx}>
      <LifeMusicPlayer />
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
              animate={{ opacity: state.phase.type === "result" || state.phase.type === "life_credits_roll" ? 1 : 0.85 }}
              transition={{ duration: state.phase.type === "result" || state.phase.type === "life_credits_roll" ? 1.2 : 0.8 }}
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
