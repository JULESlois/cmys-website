import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";

const experiments = [
  {
    index: "001",
    path: "/gacha",
    title: "揣摩运势",
    label: "GACHA / DAILY FORTUNE",
    note: "把概率包装成一次仪式。",
    status: "ACTIVE",
  },
  {
    index: "002",
    path: "/life",
    title: "沉默一生",
    label: "LIFE / MORTALITY SIMULATION",
    note: "用选择、属性与偶然走完一段人生。",
    status: "ACTIVE",
  },
  {
    index: "003",
    path: "/fragments",
    title: "残梦余声",
    label: "FRAGMENTS / CMYS LANGUAGE STUDY",
    note: "收集那些恰好长成 CMYS 的短句与余响。",
    status: "ACTIVE",
  },
  {
    index: "004",
    path: "/signal",
    title: "采鸣音隙",
    label: "SIGNAL / FREQUENCY TUNER",
    note: "转动频率，在噪声里找回四段短句。",
    status: "ACTIVE",
  },
  {
    index: "005",
    path: "/minute",
    title: "驰梦一瞬",
    label: "MINUTE / 60 SECOND LIFE",
    note: "六十秒走完一生，每五秒只来得及选一次。",
    status: "ACTIVE",
  },
  {
    index: "006",
    path: "/maze",
    title: "穿迷夜巷",
    label: "MAZE / TEXT EXPLORATION",
    note: "没有地图，只靠方向、线索与记忆寻找出口。",
    status: "ACTIVE",
  },
  {
    index: "007",
    path: "/memory",
    title: "错梦已生",
    label: "MEMORY / FALSE RECALL",
    note: "八秒记住九个片段，再分辨哪些记忆从未发生。",
    status: "ACTIVE",
  },
  {
    index: "008",
    path: "/constellation",
    title: "辰芒映宿",
    label: "CONSTELLATION / GENERATIVE DRAWING",
    note: "落下星点，让最近的两颗星自己找到彼此。",
    status: "ACTIVE",
  },
] as const;

export function LabPage() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen overflow-hidden bg-canvas px-6 pb-20 pt-40 text-primary md:px-12 md:pt-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-5xl"
      >
        <header className="mb-16 border-b border-primary/15 pb-8 md:mb-24 md:flex md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.32em] text-secondary">
              CMYS / LAB DIRECTORY
            </p>
            <h1 className="font-serif text-5xl tracking-tighter sm:text-6xl md:text-7xl">
              LAB
            </h1>
          </div>
          <p className="mt-8 max-w-sm font-mono text-[10px] uppercase leading-5 tracking-[0.2em] text-secondary md:mt-0 md:text-right">
            Curiosity Makes You Stray
          </p>
        </header>

        <div className="divide-y divide-primary/15 border-y border-primary/15">
          {experiments.map((experiment, index) => (
            <motion.div
              key={experiment.path}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reduceMotion ? 0 : 0.75,
                delay: reduceMotion ? 0 : 0.12 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                to={experiment.path}
                className="group grid gap-5 py-8 outline-none transition-colors duration-300 hover:bg-primary/[0.025] focus-visible:bg-primary/[0.04] md:grid-cols-[72px_1fr_auto] md:items-center md:gap-8 md:px-4 md:py-10"
              >
                <span className="font-mono text-[10px] tracking-[0.28em] text-secondary">
                  {experiment.index}
                </span>

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                    <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
                      {experiment.title}
                    </h2>
                    <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-secondary">
                      {experiment.label}
                    </span>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-secondary">
                    {experiment.note}
                  </p>
                </div>

                <div className="flex items-center gap-5 md:justify-self-end">
                  <span className="font-mono text-[9px] tracking-[0.26em] text-secondary">
                    {experiment.status}
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block font-mono text-sm text-primary/45 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <footer className="mt-8 flex items-center justify-between gap-6 font-mono text-[9px] uppercase tracking-[0.22em] text-secondary/70">
          <span>{experiments.length} experiments indexed</span>
          <span>More nodes may appear</span>
        </footer>
      </motion.div>
    </section>
  );
}
