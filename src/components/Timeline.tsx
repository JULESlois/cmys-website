import { motion, useReducedMotion, useScroll } from "motion/react";
import { useRef } from "react";
import { timelineData } from "../data";
import { GridCard } from "./GridCard";
import { cn } from "../lib/utils";

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathLength = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  }).scrollYProgress;

  // Split data by level
  const futureEvents = timelineData.filter(e => e.level === "Future");
  const growthEvents = timelineData.filter(e => e.level === "Growth");
  const rootsEvents = timelineData.filter(e => e.level === "Roots");

  return (
    <section ref={containerRef} className="relative w-full max-w-[1400px] mx-auto bg-canvas">
      
      {/* Background Grid Lines (1px solid borders) */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      />
      
      {/* Center Narrative Line SVG drawn on scroll */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] pointer-events-none z-0 hidden md:block">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 2 1000">
           <motion.line
             x1="1" y1="0" x2="1" y2="1000"
             stroke="var(--color-primary)"
             strokeWidth="2"
             style={{ pathLength }}
             className="opacity-30"
           />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col w-full">
        
        {/* Layer 1: Roots */}
        <div id="roots" className="relative min-h-[100svh] snap-always snap-start w-full px-6 py-12 max-h-[100svh] md:py-24 flex flex-col justify-center items-stretch overflow-hidden">
          <SectionHeader title="纯墨韵声" period="2015-2020" />
          <div className="grid grid-cols-1 md:grid-cols-24 gap-3 md:gap-4 mt-8 md:mt-12 items-end h-full">
            <div className="hidden md:block col-span-4" />
            <GridCard event={rootsEvents[0]} index={0} compact />
            <GridCard event={rootsEvents[1]} index={1} compact />
            
            <GridCard event={rootsEvents[2]} index={2} compact />
            <div className="hidden md:block col-span-2" />
            <GridCard event={rootsEvents[3]} index={3} compact />

            <div className="hidden md:block col-span-12" />
            <GridCard event={rootsEvents[4]} index={4} compact />
          </div>
        </div>

        {/* Layer 2: Growth */}
        <div id="growth" className="relative min-h-[100svh] snap-always snap-start w-full px-6 py-12 max-h-[100svh] md:py-24 flex flex-col justify-center items-stretch overflow-hidden">
          <SectionHeader title="驰鸣羽势" period="2021-2024" align="right" />
          <div className="grid grid-cols-1 md:grid-cols-24 gap-3 md:gap-4 mt-8 md:mt-12 auto-rows-max items-center h-full">
            {/* Introduce some empty spacer divs for the broken grid effect in md+ */}
            <div className="hidden md:block col-span-3" />
            <GridCard event={growthEvents[0]} index={0} compact />
            <div className="hidden md:block col-span-4" />
            
            <div className="hidden md:block col-span-2" />
            <GridCard event={growthEvents[1]} index={1} compact />
            <GridCard event={growthEvents[2]} index={2} compact />
            <div className="hidden md:block col-span-2" />

            <GridCard event={growthEvents[3]} index={3} compact />
            <div className="hidden md:block col-span-10" />
            <GridCard event={growthEvents[4]} index={4} compact />

            <div className="hidden md:block col-span-8" />
            <GridCard event={growthEvents[5]} index={5} compact />
          </div>
        </div>

        {/* Layer 3: Future / Recent */}
        <div id="now" className="relative min-h-[100svh] snap-always snap-start w-full px-6 py-12 max-h-[100svh] md:py-24 flex flex-col justify-center items-stretch overflow-hidden">
          <SectionHeader title="诚盟远溯" period="2025-2026" />
          <div className="grid grid-cols-1 md:grid-cols-24 gap-4 md:gap-6 mt-8 md:mt-16 items-start">
            {futureEvents.map((event, i) => (
              <GridCard key={event.id} event={event} index={i} compact />
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}

function SectionHeader({ title, period, align = "left" }: { title: string, period: string, align?: "left" | "right" }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-20%" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex flex-col gap-2 relative z-10",
        align === "right" ? "items-end text-right" : "items-start text-left"
      )}
    >
      <span className="font-mono text-sm tracking-widest text-secondary uppercase py-1 border-b border-primary/20">
        {period}
      </span>
      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary mt-2">
        {title}
      </h2>
    </motion.div>
  );
}
