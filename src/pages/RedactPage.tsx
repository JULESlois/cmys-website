import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { Link } from "react-router-dom";
import type { Cut } from "../lib/redact";
import { PUZZLES, buildVisible, isSolved, mergeCuts, selectionToCut } from "../lib/redact";

const STORAGE_KEY = "cmys_redact_progress";
const SCAR_MS = 420;

type Progress = Record<string, { solved: boolean; bestCuts: number }>;

function visibleOffsetOf(root: HTMLElement, node: Node, offset: number) {
  const range = document.createRange();
  range.selectNodeContents(root);
  try {
    range.setEnd(node, offset);
  } catch {
    return -1;
  }
  return range.toString().length;
}

function locateVisibleOffset(root: HTMLElement, target: number) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let consumed = 0;
  let last: Text | null = null;
  let node = walker.nextNode() as Text | null;
  while (node) {
    const length = node.data.length;
    if (target <= consumed + length) return { node, offset: target - consumed };
    consumed += length;
    last = node;
    node = walker.nextNode() as Text | null;
  }
  if (last) return { node: last, offset: last.data.length };
  return null;
}

function readProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

export function RedactPage() {
  const passageRef = useRef<HTMLParagraphElement>(null);
  const scarTimer = useRef<number | null>(null);
  const recorded = useRef<string | null>(null);

  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<Cut[][]>([[]]);
  const [pending, setPending] = useState<Cut | null>(null);
  const [scar, setScar] = useState<Cut | null>(null);
  const [caret, setCaret] = useState<{ anchor: number; focus: number } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>({});

  const puzzle = PUZZLES[index];
  const cuts = history[history.length - 1];

  const { text, map, merged } = useMemo(
    () => buildVisible(puzzle.source, cuts),
    [puzzle.source, cuts],
  );

  const cutCount = merged.length;
  const solved = useMemo(() => isSolved(puzzle, text), [puzzle, text]);

  useEffect(() => setProgress(readProgress()), []);

  // Reset everything when the puzzle changes.
  useEffect(() => {
    // A scar timer from the previous puzzle would otherwise commit its cut into this one.
    if (scarTimer.current !== null) {
      window.clearTimeout(scarTimer.current);
      scarTimer.current = null;
    }
    setHistory([[]]);
    setPending(null);
    setScar(null);
    setCaret(null);
    setNotice(null);
    recorded.current = null;
    document.getSelection()?.removeAllRanges();
  }, [index]);

  useEffect(() => {
    return () => {
      if (scarTimer.current !== null) window.clearTimeout(scarTimer.current);
    };
  }, []);

  /** Convert the live native Selection into stable source-local offsets. */
  const readSelection = useCallback((): Cut | null => {
    const root = passageRef.current;
    if (!root) return null;
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;

    const range = selection.getRangeAt(0);
    if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null;

    const rawStart = visibleOffsetOf(root, range.startContainer, range.startOffset);
    const rawEnd = visibleOffsetOf(root, range.endContainer, range.endOffset);
    if (rawStart < 0 || rawEnd < 0) return null;

    return selectionToCut(map, Math.min(rawStart, rawEnd), Math.max(rawStart, rawEnd));
  }, [map]);

  useEffect(() => {
    const onSelectionChange = () => {
      if (scar || solved) return;
      setPending(readSelection());
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, [readSelection, scar, solved]);

  // Drive the real native selection from keyboard caret state.
  useEffect(() => {
    if (!caret) return;
    const root = passageRef.current;
    if (!root) return;
    const anchor = locateVisibleOffset(root, caret.anchor);
    const focus = locateVisibleOffset(root, caret.focus);
    const selection = document.getSelection();
    if (!anchor || !focus || !selection) return;
    selection.setBaseAndExtent(anchor.node, anchor.offset, focus.node, focus.offset);
  }, [caret, text]);

  useEffect(() => {
    if (!solved) return;
    const stamp = `${puzzle.id}:${cutCount}`;
    if (recorded.current === stamp) return;
    recorded.current = stamp;
    setProgress((current) => {
      const previous = current[puzzle.id];
      const bestCuts = previous ? Math.min(previous.bestCuts, cutCount) : cutCount;
      const next = { ...current, [puzzle.id]: { solved: true, bestCuts } };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — progress stays in-memory */
      }
      return next;
    });
  }, [solved, puzzle.id, cutCount]);

  const commit = useCallback(() => {
    if (!pending || solved || scar) return;

    const next = mergeCuts([...cuts, pending]);
    if (next.length > puzzle.maxCuts) {
      setNotice(`最多只能裁 ${puzzle.maxCuts} 处`);
      return;
    }

    setNotice(null);
    setScar(pending);
    setPending(null);
    setCaret(null);
    document.getSelection()?.removeAllRanges();

    scarTimer.current = window.setTimeout(() => {
      setHistory((current) => [...current, next]);
      setScar(null);
    }, SCAR_MS);
  }, [pending, solved, scar, cuts, puzzle.maxCuts]);

  const undo = useCallback(() => {
    if (history.length <= 1 || scar) return;
    setHistory((current) => current.slice(0, -1));
    setNotice(null);
    recorded.current = null;
  }, [history.length, scar]);

  const restart = useCallback(() => {
    if (scar) return;
    setHistory([[]]);
    setPending(null);
    setCaret(null);
    setNotice(null);
    recorded.current = null;
    document.getSelection()?.removeAllRanges();
  }, [scar]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLParagraphElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
      return;
    }
    if (event.key === "Escape") {
      setCaret(null);
      document.getSelection()?.removeAllRanges();
      return;
    }
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    if (solved || scar) return;

    event.preventDefault();
    const current = caret ?? { anchor: 0, focus: 0 };
    let focus = current.focus;
    if (event.key === "ArrowLeft") focus = Math.max(0, focus - 1);
    if (event.key === "ArrowRight") focus = Math.min(text.length, focus + 1);
    if (event.key === "Home") focus = 0;
    if (event.key === "End") focus = text.length;
    setCaret({ anchor: event.shiftKey ? current.anchor : focus, focus });
  };

  // Locate the scar inside the currently visible text so it can be blacked out before collapsing.
  const scarSpan = useMemo(() => {
    if (!scar) return null;
    let start = -1;
    let end = -1;
    for (let i = 0; i < map.length; i += 1) {
      if (map[i] >= scar.start && map[i] < scar.end) {
        if (start === -1) start = i;
        end = i + 1;
      }
    }
    return start === -1 ? null : { start, end };
  }, [scar, map]);

  const solvedCount = PUZZLES.filter((item) => progress[item.id]?.solved).length;
  const best = progress[puzzle.id]?.bestCuts;

  return (
    <section className="min-h-screen bg-canvas px-5 pb-16 pt-28 text-primary sm:px-8 sm:pt-32">
      <div className="mx-auto flex min-h-[calc(100vh-11rem)] w-full max-w-3xl flex-col">
        <header className="flex flex-wrap items-end justify-between gap-6 pb-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-secondary">
              REDACT / {String(index + 1).padStart(2, "0")} — {String(PUZZLES.length).padStart(2, "0")}
            </p>
            <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">裁墨隐书</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-secondary">{puzzle.brief}</p>
          </div>
          <Link
            to="/lab"
            className="text-sm underline decoration-1 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            返回实验室
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center border-y border-primary/15 py-14">
          <p
            ref={passageRef}
            tabIndex={0}
            role="textbox"
            aria-readonly="true"
            aria-label="可裁剪的段落，用选中的方式删去字句"
            onKeyDown={onKeyDown}
            className="select-text font-cinematic-serif text-[clamp(1.6rem,5.2vw,2.6rem)] leading-[2] tracking-wide outline-none focus-visible:ring-1 focus-visible:ring-primary/25"
            style={{ WebkitUserSelect: "text", userSelect: "text" }}
          >
            {scarSpan ? (
              <>
                {text.slice(0, scarSpan.start)}
                <span
                  aria-hidden="true"
                  className="rounded-[1px] bg-primary text-primary"
                  style={{ animation: `redact-scar ${SCAR_MS}ms ease-out forwards` }}
                >
                  {text.slice(scarSpan.start, scarSpan.end)}
                </span>
                {text.slice(scarSpan.end)}
              </>
            ) : (
              text
            )}
          </p>

          <p aria-live="polite" className="sr-only">
            {solved ? "已还原" : `剩余 ${text.length} 字，已裁 ${cutCount} 处`}
          </p>

          {solved && (
            <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
              还原 · 用了 {cutCount} 处裁切
              {best !== undefined && best < cutCount ? ` · 最好 ${best}` : ""}
            </p>
          )}

          {!solved && notice && (
            <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
              {notice}
            </p>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-6 pt-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-secondary">
            <span>
              裁切 {cutCount} / {puzzle.maxCuts}
            </span>
            <span className="ml-5">已解 {solvedCount} / {PUZZLES.length}</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <button
              type="button"
              onClick={commit}
              disabled={!pending || solved || Boolean(scar)}
              className="underline decoration-1 underline-offset-4 disabled:opacity-30"
            >
              裁去选中
            </button>
            <button
              type="button"
              onClick={undo}
              disabled={history.length <= 1 || Boolean(scar)}
              className="underline decoration-1 underline-offset-4 disabled:opacity-30"
            >
              撤回一刀
            </button>
            <button
              type="button"
              onClick={restart}
              disabled={history.length <= 1 || Boolean(scar)}
              className="underline decoration-1 underline-offset-4 disabled:opacity-30"
            >
              复原
            </button>
            <button
              type="button"
              onClick={() => setIndex((current) => (current + 1) % PUZZLES.length)}
              className="underline decoration-1 underline-offset-4"
            >
              下一段
            </button>
          </div>
        </footer>

        <p className="pt-6 font-mono text-[9px] uppercase leading-5 tracking-[0.22em] text-secondary/70">
          用鼠标或长按选中一段文字，按 Enter 或「裁去选中」删掉它 · 键盘可用 ←/→ 与 Shift 选择
        </p>
      </div>
    </section>
  );
}
