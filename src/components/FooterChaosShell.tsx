import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FooterChaosShellProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShellLine {
  id: number;
  kind: "system" | "input" | "output" | "error";
  text: string;
}

const INITIAL_LINES: ShellLine[] = [
  { id: 1, kind: "system", text: "CMYS SHELL READY" },
  { id: 2, kind: "system", text: "type \"help\" to list commands" },
];

const HELP_LINES = [
  "available commands:",
  "help / about / life / fortune / music / well / yomi / clear / exit",
];

function normalizeCommand(value: string): string {
  return value.trim().toLowerCase();
}

export function FooterChaosShell({ isOpen, onClose }: FooterChaosShellProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<ShellLine[]>(INITIAL_LINES);
  const [lineId, setLineId] = useState(INITIAL_LINES.length + 1);

  const prompt = useMemo(() => "cmys@chaos:~$", []);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, isOpen]);

  const appendLines = (nextLines: Array<Omit<ShellLine, "id">>) => {
    setLines((current) => [
      ...current,
      ...nextLines.map((line, index) => ({ ...line, id: lineId + index })),
    ]);
    setLineId((id) => id + nextLines.length);
  };

  const runCommand = (rawCommand: string) => {
    const command = normalizeCommand(rawCommand);
    if (!command) return;

    if (command === "clear") {
      setLines(INITIAL_LINES);
      setLineId(INITIAL_LINES.length + 1);
      return;
    }

    if (command === "exit") {
      appendLines([
        { kind: "input", text: `${prompt} ${rawCommand}` },
        { kind: "system", text: "closing chaos node..." },
      ]);
      window.setTimeout(onClose, 180);
      return;
    }

    const output: Array<Omit<ShellLine, "id">> = [{ kind: "input", text: `${prompt} ${rawCommand}` }];

    switch (command) {
      case "help":
        output.push(...HELP_LINES.map((text) => ({ kind: "output" as const, text })));
        break;
      case "about":
        output.push(
          { kind: "output", text: "CMYS.TOP is not a portfolio." },
          { kind: "output", text: "It is a quiet machine pretending to be one." },
        );
        break;
      case "life":
        output.push(
          { kind: "output", text: "route: /life" },
          { kind: "output", text: "mortality simulation available." },
          { kind: "system", text: "navigating..." },
        );
        appendLines(output);
        window.setTimeout(() => navigate("/life"), 260);
        return;
      case "fortune":
        output.push(
          { kind: "output", text: "route: /gacha" },
          { kind: "output", text: "probability is not faith, but it behaves similarly." },
          { kind: "system", text: "navigating..." },
        );
        appendLines(output);
        window.setTimeout(() => navigate("/gacha"), 260);
        return;
      case "music":
        output.push(
          { kind: "output", text: "audio shuttle online." },
          { kind: "output", text: "current track memory unstable." },
        );
        break;
      case "well":
        output.push(
          { kind: "output", text: "井下没有回声。" },
          { kind: "output", text: "或者说，回声已经先于你抵达。" },
        );
        break;
      case "yomi":
        output.push(
          { kind: "output", text: "debt record found." },
          { kind: "output", text: "death has been delayed, not canceled." },
        );
        break;
      default:
        output.push({ kind: "error", text: `unknown command: ${command}` });
        output.push({ kind: "system", text: "type \"help\" to list commands" });
        break;
    }

    appendLines(output);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const command = input;
    setInput("");
    runCommand(command);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 32, clipPath: "inset(100% 0 0 0)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
          exit={{ opacity: 0, y: 24, clipPath: "inset(100% 0 0 0)" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-x-4 bottom-24 z-40 border-y border-white/15 bg-black text-white md:inset-x-16"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="font-mono text-[10px] tracking-[0.35em] text-white/45 uppercase">
              CMYS SHELL / CHAOS NODE
            </p>
            <button
              onClick={onClose}
              className="font-mono text-[10px] tracking-[0.28em] text-white/35 hover:text-white/80 transition-colors uppercase"
            >
              close
            </button>
          </div>

          <div
            ref={scrollRef}
            className="h-[280px] overflow-y-auto px-4 py-4 font-mono text-[11px] leading-relaxed text-white/70"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line) => (
              <p
                key={line.id}
                className={
                  line.kind === "input"
                    ? "text-white/85"
                    : line.kind === "error"
                      ? "text-white/40 line-through"
                      : line.kind === "system"
                        ? "text-white/35"
                        : "text-white/68"
                }
              >
                {line.text}
              </p>
            ))}

            <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2 text-white/85">
              <span className="shrink-0 text-white/35">{prompt}</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-white/85 outline-none placeholder:text-white/20"
                placeholder="type here"
                autoComplete="off"
                spellCheck={false}
              />
              <span className="animate-pulse text-white/45">_</span>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
