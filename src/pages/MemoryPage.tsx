import { useCallback, useEffect, useMemo, useState } from "react";

type Phase = "intro" | "observe" | "recall" | "result";

type Question = {
  text: string;
  seen: boolean;
};

const OBSERVE_SECONDS = 8;
const MEMORY_SIZE = 9;
const QUESTION_COUNT = 8;

const fragments = [
  "草木一生",
  "沉默一生",
  "聪明一世",
  "揣摩运势",
  "残梦余声",
  "穿迷夜巷",
  "驰梦一瞬",
  "采鸣音隙",
  "旧雨衣",
  "玻璃月",
  "北站台",
  "未寄信",
  "松针",
  "白噪声",
  "凌晨三点",
  "空教室",
  "蓝色门牌",
  "潮湿纸箱",
  "最后一班车",
  "半杯冷水",
  "坏掉的钟",
  "银色钥匙",
  "南面的窗",
  "没有署名",
  "旧显示器",
  "雨后的灯",
  "第二个月亮",
  "忘记保存",
] as const;

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildRound() {
  const memory = shuffle(fragments).slice(0, MEMORY_SIZE);
  const unseen = fragments.filter((item) => !memory.includes(item));
  const seenCount = QUESTION_COUNT / 2;
  const questions = shuffle<Question>([
    ...shuffle(memory).slice(0, seenCount).map((text) => ({ text, seen: true })),
    ...shuffle(unseen).slice(0, QUESTION_COUNT - seenCount).map((text) => ({ text, seen: false })),
  ]);
  return { memory, questions };
}

export function MemoryPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [memory, setMemory] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [seconds, setSeconds] = useState(OBSERVE_SECONDS);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [falseMemories, setFalseMemories] = useState<string[]>([]);

  const start = useCallback(() => {
    const round = buildRound();
    setMemory(round.memory);
    setQuestions(round.questions);
    setSeconds(OBSERVE_SECONDS);
    setQuestionIndex(0);
    setCorrect(0);
    setFalseMemories([]);
    setPhase("observe");
  }, []);

  useEffect(() => {
    if (phase !== "observe") return;
    if (seconds === 0) {
      setPhase("recall");
      return;
    }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [phase, seconds]);

  const answer = useCallback((claimSeen: boolean) => {
    if (phase !== "recall") return;
    const question = questions[questionIndex];
    if (!question) return;

    if (claimSeen === question.seen) setCorrect((value) => value + 1);
    if (claimSeen && !question.seen) {
      setFalseMemories((current) => [...current, question.text]);
    }

    if (questionIndex >= questions.length - 1) setPhase("result");
    else setQuestionIndex((value) => value + 1);
  }, [phase, questionIndex, questions]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (phase !== "recall") return;
      if (event.key === "1" || event.key.toLowerCase() === "y") answer(true);
      if (event.key === "2" || event.key.toLowerCase() === "n") answer(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [answer, phase]);

  const verdict = useMemo(() => {
    if (correct === QUESTION_COUNT) return "聪明一世";
    if (falseMemories.length >= 2) return "错梦已生";
    if (correct >= 6) return "残梦余声";
    return "沉默一生";
  }, [correct, falseMemories.length]);

  const current = questions[questionIndex];

  return (
    <section className="min-h-screen bg-[#f4f2ed] text-black selection:bg-black selection:text-[#f4f2ed]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 pb-12 pt-28 md:px-12 md:pt-32">
        {phase === "intro" && (
          <div className="flex flex-1 flex-col items-start justify-center py-20">
            <h1 className="max-w-4xl font-serif text-6xl leading-[0.94] tracking-[-0.055em] sm:text-7xl md:text-8xl">
              你确定你记得吗？
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8">
              八秒钟，记住九个片段。随后判断哪些真的出现过。错误不会被纠正，它们会成为你的伪记忆。
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-12 border-b border-black pb-1 text-base transition-opacity hover:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-black"
            >
              开始记忆
            </button>
          </div>
        )}

        {phase === "observe" && (
          <div className="flex flex-1 flex-col justify-center py-16">
            <div className="mb-12 flex items-end justify-between border-b border-black/20 pb-4">
              <p className="font-serif text-3xl">记住这些</p>
              <span className="font-mono text-4xl tabular-nums">{seconds}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
              {memory.map((item, index) => (
                <div key={item} className="border-t border-black/20 pt-4">
                  <span className="mr-3 font-mono text-xs opacity-35">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-2xl sm:text-3xl">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "recall" && current && (
          <div className="flex flex-1 flex-col justify-center py-16">
            <div className="mb-10 h-px w-full bg-black/15">
              <div
                className="h-full bg-black transition-[width] duration-300"
                style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-base">这个片段刚才出现过吗？</p>
            <div key={current.text} className="mt-12 font-serif text-[clamp(3.5rem,11vw,8rem)] leading-none tracking-[-0.06em]">
              {current.text}
            </div>
            <div className="mt-16 grid max-w-2xl gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => answer(true)}
                className="border border-black px-6 py-5 text-left text-lg transition-colors hover:bg-black hover:text-[#f4f2ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                <span className="mr-4 font-mono text-xs opacity-45">1</span>
                见过
              </button>
              <button
                type="button"
                onClick={() => answer(false)}
                className="border border-black px-6 py-5 text-left text-lg transition-colors hover:bg-black hover:text-[#f4f2ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                <span className="mr-4 font-mono text-xs opacity-45">2</span>
                没见过
              </button>
            </div>
          </div>
        )}

        {phase === "result" && (
          <div className="flex flex-1 flex-col items-start justify-center py-20">
            <p className="font-serif text-2xl">{verdict}</p>
            <h1 className="mt-5 font-serif text-6xl tracking-[-0.055em] sm:text-7xl md:text-8xl">
              {correct} / {QUESTION_COUNT}
            </h1>
            {falseMemories.length > 0 ? (
              <p className="mt-8 max-w-2xl text-lg leading-8">
                你确信自己见过 {falseMemories.join("、")}。它们从未出现，但现在已经进入了这局记忆。
              </p>
            ) : (
              <p className="mt-8 max-w-2xl text-lg leading-8">
                这一次，没有陌生片段成功混进你的记忆。
              </p>
            )}
            <button
              type="button"
              onClick={start}
              className="mt-12 border-b border-black pb-1 text-base transition-opacity hover:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-black"
            >
              再记一次
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
