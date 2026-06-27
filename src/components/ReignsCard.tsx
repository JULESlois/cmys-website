import { useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import type { GameEvent, EventChoice } from "../engine/types";

interface Props {
  event: GameEvent;
  choices: EventChoice[];
  age: number;
  onChoose: (index: number) => void;
  stageLabel?: string;
}

export function ReignsCard({ event, choices, age, onChoose, stageLabel }: Props) {
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-300, 0, 300], [-8, 0, 8]);
  const bgTint = useTransform(
    dragX,
    [-300, 0, 300],
    ["rgba(59,130,246,0.06)", "rgba(0,0,0,0)", "rgba(245,158,11,0.06)"]
  );

  const threshold = window.innerWidth * 0.3;
  const pullDistance = threshold + 40; // 动画目标：超过阈值一点
  const pressed = useRef({ left: false, right: false });
  const commit = useRef(onChoose);
  commit.current = onChoose;

  const animateTo = useCallback((target: number) => {
    animate(dragX, target, { type: "spring", stiffness: 400, damping: 35 });
  }, [dragX]);

  const tryCommit = useCallback((direction: "left" | "right") => {
    const x = dragX.get();
    if (direction === "left" && x <= -threshold) {
      commit.current(0);
    } else if (direction === "right" && x >= threshold) {
      commit.current(choices.length > 1 ? 1 : 0);
    } else {
      // 没过阈值，弹回
      animateTo(0);
    }
  }, [dragX, threshold, choices.length, animateTo]);

  const handleDragEnd = useCallback(
    (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
      const offset = info.offset.x;
      const velocity = info.velocity.x;

      if (offset < -threshold || velocity < -500) {
        onChoose(0);
      } else if (offset > threshold || velocity > 500) {
        onChoose(choices.length > 1 ? 1 : 0);
      }
    },
    [onChoose, choices.length, threshold]
  );

  // 键盘：按键动画拖拽，松手结算
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && !e.repeat) {
        e.preventDefault();
        pressed.current.left = true;
        animateTo(-pullDistance);
      } else if (e.key === "ArrowRight" && !e.repeat) {
        e.preventDefault();
        pressed.current.right = true;
        animateTo(pullDistance);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        pressed.current.left = false;
        if (pressed.current.right) {
          // 右还按着 → 切到右边
          animateTo(pullDistance);
        } else {
          tryCommit("left");
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        pressed.current.right = false;
        if (pressed.current.left) {
          animateTo(-pullDistance);
        } else {
          tryCommit("right");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [animateTo, tryCommit, pullDistance]);

  const leftChoice = choices[0];
  const rightChoice = choices.length > 1 ? choices[1] : null;

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      <motion.div
        className="absolute inset-0 -inset-x-24 rounded-lg pointer-events-none"
        style={{ backgroundColor: bgTint }}
      />

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        style={{ x: dragX, rotate }}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        className="relative bg-white border border-primary/10 cursor-grab active:cursor-grabbing shadow-sm"
      >
        <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-5">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] tracking-[0.3em] text-secondary/60 uppercase">
              {stageLabel ?? `${age} 岁`}
            </span>
            {event.type === "anchor" && (
              <span className="font-mono text-[10px] text-secondary/30">锚点</span>
            )}
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl tracking-tighter leading-tight text-primary">
            {event.title}
          </h2>
          <div className="h-[1px] bg-primary/10 w-16" />

          <p className="font-mono text-sm text-secondary leading-relaxed">
            {event.description}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => onChoose(0)}
              className="flex items-center gap-2 p-3 border border-primary/15 text-left hover:border-blue-400/50 hover:bg-blue-50/30 transition-colors cursor-pointer"
            >
              <span className="font-mono text-[10px] text-blue-400/60 shrink-0">←</span>
              <span className="font-mono text-xs text-primary/70 leading-tight">
                {leftChoice?.text ?? "—"}
              </span>
            </button>

            {rightChoice ? (
              <button
                onClick={() => onChoose(1)}
                className="flex items-center gap-2 p-3 border border-primary/15 text-right hover:border-amber-400/50 hover:bg-amber-50/30 transition-colors cursor-pointer"
              >
                <span className="font-mono text-xs text-primary/70 leading-tight flex-1">
                  {rightChoice.text}
                </span>
                <span className="font-mono text-[10px] text-amber-400/60 shrink-0">→</span>
              </button>
            ) : (
              <div />
            )}
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-primary/5">
            <span className="font-mono text-[9px] text-secondary/30 uppercase tracking-widest">
              ← 按住选择，松手确认 →
            </span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-primary/15" />
              <div className="w-1 h-1 bg-primary/15" />
              <div className="w-1 h-1 bg-primary/15" />
            </div>
          </div>
        </div>
      </motion.div>

      <p className="text-center mt-5 font-mono text-[10px] text-secondary/25 tracking-widest">
        按住 ← → 选择，松手确认
      </p>
    </div>
  );
}
