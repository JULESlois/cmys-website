import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function DecorativeScrollbar() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const [percent, setPercent] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const pointerTop = useTransform(
    shouldReduceMotion ? scrollYProgress : smoothProgress,
    [0, 1],
    ["0%", "100%"],
  );

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setPercent(Math.round(latest * 100));

      if (shouldReduceMotion) return;

      setIsScrolling(true);
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => {
        setIsScrolling(false);
        idleTimerRef.current = null;
      }, 700);
    });
  }, [scrollYProgress, shouldReduceMotion]);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: shouldReduceMotion || isScrolling ? 0.72 : 0.16 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
      className="fixed right-4 top-1/2 z-[100] hidden h-[56vh] w-8 -translate-y-1/2 pointer-events-none flex-col items-center justify-between sm:flex"
      aria-hidden="true"
    >
      <div className="rotate-90 font-mono text-[9px] tracking-tighter text-secondary">
        {percent.toString().padStart(3, "0")}%
      </div>

      <div className="relative my-8 w-[1px] flex-grow bg-primary/10">
        <motion.div
          className="absolute left-0 top-0 w-full origin-top bg-primary"
          style={{ scaleY: scrollYProgress }}
        />

        <motion.div
          className="absolute left-1/2 h-[1px] w-3 -translate-x-1/2 bg-primary"
          style={{ top: pointerTop }}
        >
          <div className="absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap font-mono text-[8px] text-primary opacity-40">
            LOC
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
