import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_SONGS, type MusicTrack } from "./BackgroundMusic";
import { getLifeMusicPlaylist } from "../data/life/music";

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
  "help / about / lab / life / fortune / gacha / music / ls / cd / pwd / echo / well / yomi / clear / exit",
  "music: music list / music 1 / music play 3 / music life_menu / music next / music prev / music pause / music resume",
  "filesystem: ls / ls lab / cd music / cd .. / pwd / echo <text>",
];

interface ChaosMusicEntry {
  commandId: string;
  source: "home" | "life";
  track: MusicTrack;
}

const LIFE_COMMAND_TRACKS: ChaosMusicEntry[] = getLifeMusicPlaylist().map((track) => ({
  commandId: track.id,
  source: "life",
  track: {
    id: `life:${track.id}`,
    title: track.title,
    artist: track.artist,
    path: track.path,
    volume: track.volume,
    loop: track.loop,
  },
}));

const CHAOS_MUSIC_LIBRARY: ChaosMusicEntry[] = [
  ...DEFAULT_SONGS.map((track) => ({ commandId: track.id, source: "home" as const, track })),
  ...LIFE_COMMAND_TRACKS,
];

function normalizeMusicQuery(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function findChaosMusicEntry(value: string | undefined): ChaosMusicEntry | undefined {
  const query = normalizeMusicQuery(value);
  if (!query) return undefined;
  const byNumber = Number(query);
  if (Number.isInteger(byNumber) && byNumber >= 1 && byNumber <= CHAOS_MUSIC_LIBRARY.length) {
    return CHAOS_MUSIC_LIBRARY[byNumber - 1];
  }
  return CHAOS_MUSIC_LIBRARY.find(({ commandId, track }) => {
    const title = track.title.toLowerCase();
    const artist = track.artist?.toLowerCase() ?? "";
    return commandId.toLowerCase() === query || track.id.toLowerCase() === query || title === query || artist === query;
  });
}

const VIRTUAL_FS: Record<string, string[]> = {
  "/": ["about.txt", "lab", "life", "fortune", "music", "well", "yomi", "logs", "void"],
  "/lab": ["gacha.experiment", "life.simulation"],
  "/life": ["mortality.sim", "save.record", "death.log"],
  "/fortune": ["daily.oracle", "probability.txt"],
  "/music": ["shuttle.device", "playlist.cache", "volume.lock"],
  "/well": ["echo_0001", "rope.broken", "waterline"],
  "/yomi": ["debt.record", "receipt.null", "delay.form"],
  "/logs": ["boot.log", "dream.log", "noise.log"],
  "/void": [],
};

function splitCommand(value: string): string[] {
  return value.trim().split(/\s+/).filter(Boolean);
}

function resolvePath(currentPath: string, target = "."): string {
  if (!target || target === ".") return currentPath;
  const parts = target.startsWith("/") ? [] : currentPath.split("/").filter(Boolean);

  for (const segment of target.split("/")) {
    if (!segment || segment === ".") continue;
    if (segment === "..") {
      parts.pop();
      continue;
    }
    parts.push(segment);
  }

  return `/${parts.join("/")}`.replace(/\/$/, "") || "/";
}

function formatPath(path: string): string {
  return path === "/" ? "~" : `~${path}`;
}

function dispatchMusicCommand(detail: { action: "next" | "prev" | "set" | "pause" | "resume"; trackId?: string; track?: MusicTrack }) {
  window.dispatchEvent(new CustomEvent("cmys:home-music", { detail }));
}

export function FooterChaosShell({ isOpen, onClose }: FooterChaosShellProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<ShellLine[]>(INITIAL_LINES);
  const [lineId, setLineId] = useState(INITIAL_LINES.length + 1);
  const [cwd, setCwd] = useState("/");

  const prompt = useMemo(() => `cmys@chaos:${formatPath(cwd)}$`, [cwd]);

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
    const trimmed = rawCommand.trim();
    const args = splitCommand(rawCommand);
    const root = args[0]?.toLowerCase();
    if (!root) return;

    if (root === "clear") {
      setLines(INITIAL_LINES);
      setLineId(INITIAL_LINES.length + 1);
      return;
    }

    if (root === "exit") {
      appendLines([
        { kind: "input", text: `${prompt} ${rawCommand}` },
        { kind: "system", text: "closing chaos node..." },
      ]);
      window.setTimeout(onClose, 180);
      return;
    }

    const output: Array<Omit<ShellLine, "id">> = [{ kind: "input", text: `${prompt} ${rawCommand}` }];

    switch (root) {
      case "help":
        output.push(...HELP_LINES.map((text) => ({ kind: "output" as const, text })));
        break;
      case "about":
        output.push(
          { kind: "output", text: "CMYS.TOP is not a portfolio." },
          { kind: "output", text: "It is a quiet machine pretending to be one." },
        );
        break;
      case "pwd":
        output.push({ kind: "output", text: cwd });
        break;
      case "ls": {
        const targetPath = resolvePath(cwd, args[1] ?? ".");
        const entries = VIRTUAL_FS[targetPath];
        if (!entries) {
          output.push({ kind: "error", text: `ls: cannot access '${args[1] ?? targetPath}': no such node` });
          break;
        }
        output.push({ kind: "output", text: entries.length > 0 ? entries.join("    ") : "<empty>" });
        break;
      }
      case "cd": {
        const targetPath = resolvePath(cwd, args[1] ?? "/");
        if (!Object.prototype.hasOwnProperty.call(VIRTUAL_FS, targetPath)) {
          output.push({ kind: "error", text: `cd: ${args[1] ?? ""}: no such node` });
          break;
        }
        setCwd(targetPath);
        output.push({ kind: "system", text: `cwd changed to ${targetPath}` });
        break;
      }
      case "echo":
        output.push({ kind: "output", text: trimmed.replace(/^echo\s*/i, "") || "" });
        break;
      case "lab":
        output.push(
          { kind: "output", text: "route: /lab" },
          { kind: "output", text: "Curiosity Makes You Stray." },
          { kind: "system", text: "opening experiment directory..." },
        );
        appendLines(output);
        window.setTimeout(() => navigate("/lab"), 260);
        return;
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
      case "gacha":
        output.push(
          { kind: "output", text: "route: /gacha" },
          { kind: "output", text: "probability is not faith, but it behaves similarly." },
          { kind: "system", text: "navigating..." },
        );
        appendLines(output);
        window.setTimeout(() => navigate("/gacha"), 260);
        return;
      case "music": {
        const sub = args[1]?.toLowerCase();
        const value = args[2]?.toLowerCase();

        if (!sub) {
          output.push(
            { kind: "output", text: "music commands: list / 1..N / play <id> / next / prev / pause / resume" },
            { kind: "output", text: "example: music list" },
            { kind: "output", text: "example: music play life_menu" },
          );
          break;
        }

        if (sub === "list") {
          output.push(...CHAOS_MUSIC_LIBRARY.map((entry, index) => ({
            kind: "output" as const,
            text: `${index + 1}. [${entry.source}] ${entry.track.title}${entry.track.artist ? ` / ${entry.track.artist}` : ""} (${entry.commandId})`,
          })));
          break;
        }

        if (sub === "next" || sub === "prev" || sub === "pause" || sub === "resume") {
          dispatchMusicCommand({ action: sub });
          output.push({ kind: "system", text: `music ${sub} signal sent.` });
          break;
        }

        const requestedTrack = sub === "play" || sub === "set" ? value : sub;
        const entry = findChaosMusicEntry(requestedTrack);

        if (!entry) {
          output.push({ kind: "error", text: `music: track '${requestedTrack ?? ""}' not found` });
          output.push({ kind: "system", text: "try: music list" });
          break;
        }

        if (entry.source === "home") {
          dispatchMusicCommand({ action: "set", trackId: entry.track.id });
        } else {
          dispatchMusicCommand({ action: "set", track: entry.track });
        }
        output.push({ kind: "system", text: `now routing audio to: [${entry.source}] ${entry.track.title}` });
        break;
      }
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
        output.push({ kind: "error", text: `unknown command: ${root}` });
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
