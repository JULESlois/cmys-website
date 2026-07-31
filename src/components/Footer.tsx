import { motion, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import { cn } from "../lib/utils";
import React, { useRef, useEffect, useState } from "react";
import { AsciiEarth } from "./AsciiEarth";
import { FooterChaosShell } from "./FooterChaosShell";

function FooterArt({ isCenter }: { isCenter: boolean }) {
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative aspect-square w-full max-w-[300px] flex items-center justify-center"
    >
      {/* 3D Wireframe Plane / Grid */}
      <div className="absolute inset-0 border border-white/5 opacity-50" />
      <motion.div 
        animate={{ rotateX: 60, rotateZ: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-full h-full border border-white/20 grid grid-cols-8 grid-rows-8"
        style={{ transformStyle: "preserve-3d" }}
      >
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-white/10" />
        ))}
      </motion.div>
      
      {/* Central Core */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-4 h-4 bg-white/40 blur-sm rounded-full"
      />
      
      {/* Scanning Line */}
      <motion.div
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10"
      />
    </motion.div>
  );
}

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cstTime, setCstTime] = useState<string>("");
  const [isChaosShellOpen, setIsChaosShellOpen] = useState(false);
  
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const updateTime = () => {
      setCstTime(new Date().toLocaleTimeString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative bg-dark text-[#F0F0F0] noise-bg snap-always snap-start min-h-[100svh] flex flex-col justify-between overflow-hidden">
      {/* Ticker at top of footer */}
      <div className="w-full border-y border-white/10 py-3 bg-dark/50 backdrop-blur-sm z-20">
        <div className="animate-ticker">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 whitespace-nowrap">
              <span className="font-mono text-[10px] tracking-widest text-[#888888]">CURRENT STATUS: DESIGNING FUTURE</span>
              <span className="font-mono text-[10px] tracking-widest text-white/40">●</span>
              <span className="font-mono text-[10px] tracking-widest text-[#888888]">CST TIME: {cstTime}</span>
              <span className="font-mono text-[10px] tracking-widest text-white/40">●</span>
              <span className="font-mono text-[10px] tracking-widest text-[#888888]">2026 REVISION CMYS.TOP</span>
              <span className="font-mono text-[10px] tracking-widest text-white/40">●</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Body - Modified for the 3-column interaction */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-0 w-full px-8 md:px-16 items-stretch">
         {/* Left 1/3: Text Section */}
         <div className="flex flex-col gap-8 justify-center items-center md:items-start py-20 z-10 origin-left">
            <h2 className="font-serif text-8xl md:text-9xl tracking-tighter mix-blend-difference leading-none">CMYS.TOP</h2>
            <p className="font-mono text-[12px] text-white/30 max-w-sm leading-relaxed text-center md:text-left">
              我昨天沉默有诗炒了一盘纯棉睡衣，吃的时候踩没雨水，结果长眠夜湿了。
            </p>
         </div>

         {/* Middle 1/3: Spacer */}
         <div className="hidden md:flex items-center justify-center relative" />

         {/* Right 1/3: Animation location */}
         <div className="flex items-center justify-center relative">
            <div className="w-full max-w-[300px] aspect-square">
              <AsciiEarth />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-32 opacity-40">
              <span className="font-mono text-[8px] tracking-[0.4em] text-white/40 uppercase">
                SYSTEM_STABLE
              </span>
            </div>
         </div>
      </div>

      {/* Bottom Legal / Meta */}
      <div className="border-t border-white/5 px-8 md:px-16 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
         <span className="font-mono text-[10px] text-white/30 tracking-widest">
            © {currentYear} CMYS.TOP / ALL RIGHTS RESERVED
         </span>
         <div className="flex flex-wrap items-center justify-center gap-8">
            <span className="font-mono text-[10px] text-white/20">35°18' N, 113°54' E</span>
            <span className="font-mono text-[10px] text-white/20">V. 2026.04</span>
            <button
              onClick={() => setIsChaosShellOpen(true)}
              className="font-mono text-[10px] tracking-widest text-white/15 hover:text-white/65 transition-colors uppercase"
              aria-label="Open chaos node shell"
            >
              CHAOS_NODE
            </button>
         </div>
      </div>

      <FooterChaosShell
        isOpen={isChaosShellOpen}
        onClose={() => setIsChaosShellOpen(false)}
      />

      {/* 1px decorative wireframe lines */}
      <div className="absolute inset-0 pointer-events-none border-x border-white/5" />
    </footer>
  );
}
