import { useState } from "react";
import { AsciiEarth } from "./AsciiEarth";
import { FooterChaosShell } from "./FooterChaosShell";

export function Footer() {
  const [isChaosShellOpen, setIsChaosShellOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="noise-bg relative flex min-h-[100svh] snap-always snap-start flex-col overflow-hidden border-t border-white/10 bg-dark text-[#F0F0F0]">
      <div className="relative z-20 flex min-h-14 items-center justify-end border-b border-white/10 px-6 py-4 sm:px-8 md:px-16">
        <div className="flex flex-wrap items-center justify-end gap-x-8 gap-y-2">
          <span className="font-mono text-[10px] text-white/25">35°18' N, 113°54' E</span>
          <span className="font-mono text-[10px] text-white/25">V. 2026.04</span>
          <button
            onClick={() => setIsChaosShellOpen(true)}
            className="font-mono text-[10px] uppercase text-white/25 transition-colors hover:text-white/70 focus-visible:text-white/70 focus-visible:outline-none"
            aria-label="Open chaos node shell"
          >
            CHAOS_NODE
          </button>
        </div>
      </div>

      <div className="relative z-10 grid w-full flex-1 auto-rows-max content-center grid-cols-1 items-center gap-8 px-6 py-10 sm:px-8 md:px-16 md:py-12 lg:auto-rows-auto lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] lg:content-stretch">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <h2 className="font-serif text-6xl leading-none sm:text-7xl lg:text-8xl xl:text-9xl">
            CMYS.TOP
          </h2>
          <p className="max-w-sm font-mono text-xs leading-relaxed text-white/45">
            我昨天沉默有诗炒了一盘纯棉睡衣，吃的时候踩没雨水，结果长眠夜湿了。
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="aspect-square w-full max-w-[260px] sm:max-w-[300px] md:max-w-[320px] xl:max-w-[360px]">
            <AsciiEarth />
          </div>
          <span className="mt-3 font-mono text-[9px] uppercase text-white/40">
            SYSTEM_STABLE
          </span>
        </div>
      </div>

      <div className="relative z-20 flex min-h-16 items-center justify-center border-t border-white/10 px-6 py-6 sm:px-8 md:justify-start md:px-16 md:py-7">
        <span className="font-mono text-[10px] text-white/35">
          © {currentYear} CMYS.TOP / ALL RIGHTS RESERVED
        </span>
      </div>

      <FooterChaosShell
        isOpen={isChaosShellOpen}
        onClose={() => setIsChaosShellOpen(false)}
      />

      <div className="absolute inset-0 pointer-events-none border-x border-white/5" />
    </footer>
  );
}
