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
  const isLeadership = event.category === "Leadership";
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
      {/* 1px Solid Borders line-art style edges */}
      <div className="absolute inset-0 border border-primary/20 group-hover:border-primary/50 transition-colors duration-500 z-0 pointer-events-none" />
      
      {/* Decorative corner markers */}
      <div className="absolute top-0 left-0 w-2 h-[1px] bg-primary z-0" />
      <div className="absolute top-0 left-0 w-[1px] h-2 bg-primary z-0" />
      <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-primary z-0" />
      <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-primary z-0" />

      {/* Background wireframe pattern that shows on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none z-[-1]"
        style={{
          backgroundImage: 'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      
      <div className="relative z-10 flex flex-col gap-2 md:gap-3">
        <div className="flex items-start justify-between gap-4">
          <span className={cn(
            "text-xs font-mono px-2 py-0.5 border border-primary/30",
            isLeadership ? "bg-primary text-canvas" : "bg-transparent text-secondary"
          )}>
            {event.yearRange}
          </span>
          <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">{event.category}</span>
        </div>
        
        <h3 className={cn(
          "font-semibold leading-tight tracking-tight text-primary whitespace-pre-wrap",
          isNarrative 
            ? (compact ? "text-base sm:text-lg font-serif italic" : "text-xl sm:text-2xl font-serif italic")
            : (compact ? "text-sm sm:text-base font-sans" : "text-lg sm:text-xl font-sans")
        )}>
          {event.title}
        </h3>
        
        {event.description && (
          <p className={cn("text-secondary mt-1 leading-relaxed", compact ? "text-xs" : "text-sm")}>
            {event.description}
          </p>
        )}
      </div>

      {/* Subtle hover effect */}
      <div className="absolute -inset-2 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl z-[-2]" />
    </motion.div>
  );
}
