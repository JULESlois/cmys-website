import { motion } from "motion/react";
import { backgroundWords } from "../data";

const BACKGROUND_WORD_COUNT = 42;

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-canvas snap-always snap-start">
      <div className="absolute inset-x-6 inset-y-[14vh] z-0 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 content-center gap-x-6 gap-y-5 opacity-[0.025] select-none text-primary pointer-events-none overflow-hidden sm:inset-x-10 md:inset-x-[8vw]">
        {Array.from({ length: BACKGROUND_WORD_COUNT }).map((_, i) => {
          const word = backgroundWords[i % backgroundWords.length];
          return (
            <motion.span
              key={`${word}-${i}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.4,
                delay: Math.min(i * 0.025, 0.8),
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`whitespace-nowrap font-mono text-sm sm:text-base lg:text-lg ${
                i % 3 === 1 ? "text-center" : i % 3 === 2 ? "text-right" : "text-left"
              }`}
            >
              {word}
            </motion.span>
          );
        })}
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-bold tracking-tighter text-primary" style={{ fontVariantLigatures: "no-common-ligatures" }}>
            <span className="block text-xl sm:text-3xl font-normal tracking-normal mb-4 font-mono text-secondary">你好，我叫</span>
            CMYS
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.3 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="h-[1px] w-32 bg-primary mx-auto mt-8"
          />
        </motion.div>
      </div>
    </section>
  );
}
