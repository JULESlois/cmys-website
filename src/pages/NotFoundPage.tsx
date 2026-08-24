import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-canvas px-6 text-primary">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          maskImage: "radial-gradient(circle at center, black 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 72%)",
        }}
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-w-2xl flex-col items-center text-center"
      >
        <p className="font-mono text-[10px] tracking-[0.35em] text-secondary">404 / NOT FOUND</p>
        <h1 className="mt-8 font-cinematic-serif text-[clamp(3rem,10vw,7rem)] font-normal leading-none tracking-[-0.045em]">
          此门已失
        </h1>
        <p className="mt-7 max-w-md font-cinematic-serif text-base leading-relaxed text-secondary md:text-lg">
          你抵达了一段没有被写下的路径。
        </p>
        <Link
          to="/"
          className="group relative mt-12 font-mono text-[11px] tracking-[0.28em] text-primary/60 transition-colors duration-500 hover:text-primary focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-6"
        >
          重觅原始
          <span
            aria-hidden="true"
            className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-primary/40 transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100"
          />
        </Link>
      </motion.div>
    </section>
  );
}
