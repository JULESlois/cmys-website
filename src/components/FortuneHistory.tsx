import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { FORTUNES, Fortune } from "../constants/fortunes";

const HISTORY_KEY = "esu_fortune_history";
const MAX_HISTORY = 30;

export interface HistoryEntry {
  fortuneId: string;
  uniqueId: string;
  drawnAt: string;
}

function getHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

export function addToHistory(fortuneId: string, uniqueId: string): void {
  const history = getHistory();
  const entry: HistoryEntry = {
    fortuneId,
    uniqueId,
    drawnAt: new Date().toISOString(),
  };
  history.unshift(entry);
  if (history.length > MAX_HISTORY) {
    history.pop();
  }
  saveHistory(history);
}

interface FortuneHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FortuneHistory({ isOpen, onClose }: FortuneHistoryProps) {
  const history = getHistory();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-8"
        >
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(40px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-canvas/60"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-secondary">
                Fortune History
              </h2>
              <button
                onClick={onClose}
                className="font-mono text-xs tracking-[0.2em] uppercase text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 -mr-2">
              {history.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {history.map((entry, index) => (
                    <HistoryCard key={entry.uniqueId + index} entry={entry} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="font-mono text-xs tracking-widest text-secondary uppercase mb-4">
        No Records Yet
      </div>
      <p className="font-mono text-[10px] text-secondary/60 leading-relaxed max-w-xs">
        还没有抽卡记录，快去抽取今日运势吧
      </p>
    </div>
  );
}

function HistoryCard({ entry }: { entry: HistoryEntry; key?: string }) {
  const fortune = FORTUNES.find((f) => f.id === entry.fortuneId);
  if (!fortune) return null;

  const date = new Date(entry.drawnAt);
  const dateStr = new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative bg-[#121212] overflow-hidden cursor-pointer",
        "aspect-[3/4.5] flex flex-col justify-between p-4",
        "transition-shadow duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
      )}
      style={{
        clipPath: "polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)",
      }}
    >
      {/* Decorative corner line */}
      <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-primary/20 -translate-y-2 translate-x-2" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-primary/20 translate-y-2 -translate-x-2" />

      {/* Fortune Field (1px lines) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-x-0 top-1/4 h-[1px] bg-white" />
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white" />
        <div className="absolute inset-x-0 top-3/4 h-[1px] bg-white" />
        <div className="absolute left-1/4 inset-y-0 w-[1px] bg-white" />
        <div className="absolute left-1/2 inset-y-0 w-[1px] bg-white" />
        <div className="absolute left-3/4 inset-y-0 w-[1px] bg-white" />
      </div>

      <div className="relative z-10 flex flex-col h-full text-[#F0F0F0]">
        <div className="flex justify-between items-start">
          <span className="font-mono text-[8px] tracking-[0.3em] text-white/40 uppercase">
            {fortune.fortune.split("，")[0]}
          </span>
          <span className="font-mono text-[8px] text-white/20">
            {dateStr}
          </span>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <h3 className="font-serif text-xl tracking-tighter leading-none text-center">
            {fortune.name}
          </h3>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-primary opacity-40" />
            ))}
          </div>
          <span className="font-mono text-[8px] text-primary uppercase tracking-widest">
            {entry.uniqueId}
          </span>
        </div>
      </div>
    </motion.div>
  );
}