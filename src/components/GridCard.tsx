import { motion, useReducedMotion } from "motion/react";
import { TimelineEvent } from "../data";
import { cn } from "../lib/utils";

interface GridCardProps {
  event: TimelineEvent;
  index: number;
  compact?: boolean;
  key?: string | number;
}

export function GridCard({ event, index, compact = false }: GridCardProps) {
  const isNarrative = event.category === "Narrative";
  const shouldReduceMotion = useReducedMotion();
  const fallbackSpan = 6 + (index % 3) * 2;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{
        duration: 0.9,
        delay: shouldReduceMotion ? 0 : index * 0.08,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{
        gridColumn: `span ${event.colSpan || fallbackSpan}`,
      }}
      className={cn(
        "group relative cursor-crosshair transition-colors duration-500",
        "glass-panel border-primary hover:bg-white/20",
        "overflow-hidden isolate min-w-[200px]",
        compact ? "p-4" : "p-6"
      )}
    >
      <div className="absolute inset-0 border border-primary/20 group-hover:border-primary/50 transition-colors duration-500 z-0 pointer-events-none" />

      <div className="absolute top-0 left-0 w-2 h-[1px] bg-primary z-0" />
      <div className="absolute top-0 left-0 w-[1px] h-2 bg-primary z-0" />
      <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-primary z-0" />
      <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-primary z-0" />

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none z-[-1]"
        style={{
          backgroundImage: 'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 flex flex-col gap-2 md:gap-3 text-primary">
        <p className="text-xs sm:text-sm leading-none tracking-wide">
          {event.yearRange}
        </p>

        <h3 className={cn(
          "font-semibold leading-tight tracking-tight whitespace-pre-wrap",
          isNarrative
            ? (compact ? "text-base sm:text-lg font-serif italic" : "text-xl sm:text-2xl font-serif italic")
            : (compact ? "text-sm sm:text-base font-sans" : "text-lg sm:text-xl font-sans")
        )}>
          {event.title}
        </h3>

        {event.description && (
          <p className={cn("mt-1 leading-relaxed", compact ? "text-xs" : "text-sm")}>
            {event.description}
          </p>
        )}
      </div>

      <div className="absolute -inset-2 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl z-[-2]" />
    </motion.div>
  );
}
