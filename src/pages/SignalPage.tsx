import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const MIN_FREQUENCY = 87.5;
const MAX_FREQUENCY = 108;
const STEP = 0.1;

const SIGNALS = [
  { frequency: 91.2, phrase: "草木一生", detail: "一阵很轻的风穿过树冠。" },
  { frequency: 97.6, phrase: "Chasing Moonlight YeSterday", detail: "昨夜的月光还停在载波里。" },
  { frequency: 103.9, phrase: "聪明一世", detail: "有人把答案留在噪声之后。" },
  { frequency: 106.4, phrase: "Certain Memories Yield Slowly", detail: "记忆比信号更晚抵达。" },
] as const;

const clampFrequency = (value: number) =>
  Math.min(MAX_FREQUENCY, Math.max(MIN_FREQUENCY, Math.round(value * 10) / 10));

export function SignalPage() {
  const [frequency, setFrequency] = useState(96.3);
  const [locked, setLocked] = useState<number[]>([]);

  const nearest = useMemo(() => {
    return SIGNALS.reduce((best, signal, index) => {
      const distance = Math.abs(signal.frequency - frequency);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });
  }, [frequency]);

  const strength = Math.max(0, 1 - nearest.distance / 1.8);
  const activeSignal = nearest.distance <= 0.2 ? SIGNALS[nearest.index] : null;

  const bars = useMemo(
    () =>
      Array.from({ length: 72 }, (_, index) => {
        const wave = Math.sin(index * 1.71 + frequency * 0.37) * 0.5 + 0.5;
        const carrier = Math.sin(index * 0.31 + nearest.index * 1.9) * 0.5 + 0.5;
        return 10 + (wave * (1 - strength) + carrier * strength) * 78;
      }),
    [frequency, nearest.index, strength],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      setFrequency((current) =>
        clampFrequency(current + (event.key === "ArrowRight" ? STEP : -STEP)),
      );
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const lockSignal = () => {
    if (!activeSignal) return;
    setLocked((current) =>
      current.includes(nearest.index) ? current : [...current, nearest.index],
    );
  };

  return (
    <section className="min-h-screen bg-[#070707] px-6 pb-16 pt-32 text-white md:px-12 md:pt-36">
      <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl flex-col">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-mono text-2xl tracking-[-0.04em] sm:text-3xl">SIGNAL</h1>
            <p className="mt-2 font-mono text-xs text-white/55">Catch Messages Yielding Slowly.</p>
          </div>
          <Link
            to="/lab"
            className="font-mono text-xs text-white/65 transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            LAB
          </Link>
        </div>

        <div className="mt-16 flex flex-1 flex-col justify-center">
          <div className="relative h-48 overflow-hidden border-y border-white/15 sm:h-56" aria-hidden="true">
            <div className="absolute inset-0 flex items-center gap-[3px] px-1">
              {bars.map((height, index) => (
                <span
                  key={index}
                  className="block flex-1 bg-white/80 transition-[height,opacity] duration-100"
                  style={{ height: `${height}%`, opacity: 0.2 + strength * 0.75 }}
                />
              ))}
            </div>
            <div className="absolute inset-y-0 left-1/2 w-px bg-white" />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-5xl tracking-[-0.08em] sm:text-7xl">
                  {frequency.toFixed(1)}
                </span>
                <span className="font-mono text-sm text-white/45">MHz</span>
              </div>

              <input
                aria-label="Signal frequency"
                className="mt-8 w-full cursor-ew-resize accent-white"
                type="range"
                min={MIN_FREQUENCY}
                max={MAX_FREQUENCY}
                step={STEP}
                value={frequency}
                onChange={(event) => setFrequency(Number(event.target.value))}
              />

              <div className="mt-3 flex justify-between font-mono text-[10px] text-white/35">
                <span>{MIN_FREQUENCY.toFixed(1)}</span>
                <span>{MAX_FREQUENCY.toFixed(1)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={!activeSignal || locked.includes(nearest.index)}
              onClick={lockSignal}
              className="min-w-40 border border-white/40 px-6 py-4 font-mono text-xs transition-colors enabled:hover:bg-white enabled:hover:text-black disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {locked.includes(nearest.index) ? "LOCKED" : activeSignal ? "LOCK SIGNAL" : "NO CARRIER"}
            </button>
          </div>

          <div className="mt-14 min-h-24 border-t border-white/15 pt-8" aria-live="polite">
            {activeSignal ? (
              <div>
                <p className="font-serif text-2xl sm:text-3xl">{activeSignal.phrase}</p>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">{activeSignal.detail}</p>
              </div>
            ) : (
              <p className="font-mono text-xs text-white/30">··· static ···</p>
            )}
          </div>
        </div>

        <div className="mt-10 flex items-end justify-between gap-6 border-t border-white/10 pt-5 font-mono text-[10px] text-white/40">
          <span>{locked.length}/{SIGNALS.length} recovered</span>
          <span>← → fine tune</span>
        </div>
      </div>
    </section>
  );
}
