import { motion, useReducedMotion } from "motion/react";

const fragments = [
  {
    index: "001",
    text: "聪明一世",
    note: "Clever Minds, Years Scatter",
  },
  {
    index: "002",
    text: "沉默一生",
    note: "Certain Memories Yield Slowly",
  },
  {
    index: "003",
    text: "草木一生",
    note: "Clouds Move, Years Stay",
  },
  {
    index: "004",
    text: "揣摩运势",
    note: "Chance Makes You Stare",
  },
  {
    index: "005",
    text: "Chasing Moonlight YeSterday",
    note: "CMYS / AFTERIMAGE",
  },
  {
    index: "006",
    text: "Cities Melt, Youth Stays",
    note: "CMYS / REMNANT",
  },
] as const;

export function FragmentsPage() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen overflow-hidden bg-canvas px-6 pb-24 pt-40 text-primary md:px-12 md:pt-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent calc(50% - 0.5px), var(--color-primary) calc(50% - 0.5px), var(--color-primary) calc(50% + 0.5px), transparent calc(50% + 0.5px))",
        }}
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-5xl"
      >
        <header className="mb-20 border-b border-primary/15 pb-8 md:mb-28 md:flex md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.32em] text-secondary">
              CMYS / FRAGMENTS
            </p>
            <h1 className="font-serif text-5xl tracking-tighter sm:text-6xl md:text-7xl">
              FRAGMENTS
            </h1>
          </div>
          <p className="mt-8 max-w-sm font-mono text-[10px] uppercase leading-5 tracking-[0.2em] text-secondary md:mt-0 md:text-right">
            Certain Memories Yield Slowly
          </p>
        </header>

        <div className="border-y border-primary/15">
          {fragments.map((fragment, index) => (
            <motion.article
              key={fragment.index}
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: reduceMotion ? 0 : 0.7,
                delay: reduceMotion ? 0 : index * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid gap-5 border-b border-primary/15 py-10 last:border-b-0 md:grid-cols-[72px_1fr_auto] md:items-baseline md:gap-8 md:px-4 md:py-12"
            >
              <span className="font-mono text-[9px] tracking-[0.28em] text-secondary/70">
                {fragment.index}
              </span>
              <p className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
                {fragment.text}
              </p>
              <span className="max-w-xs font-mono text-[9px] uppercase leading-5 tracking-[0.2em] text-secondary md:text-right">
                {fragment.note}
              </span>
            </motion.article>
          ))}
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.22em] text-secondary/60">
          <span>Six traces retained</span>
          <span>CMYS repeats, never explains</span>
        </footer>
      </motion.div>
    </section>
  );
}
