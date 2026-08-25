import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ROUND_SECONDS = 60;
const STEP_SECONDS = 5;

type Stats = {
  heart: number;
  mind: number;
  spark: number;
};

type Choice = {
  text: string;
  delta: Partial<Stats>;
};

type Moment = {
  age: number;
  prompt: string;
  choices: [Choice, Choice];
};

const moments: Moment[] = [
  { age: 7, prompt: "雨停了，操场上只剩一滩很亮的水。", choices: [
    { text: "踩进去", delta: { spark: 9, heart: 3 } },
    { text: "绕过去", delta: { mind: 7, spark: -2 } },
  ] },
  { age: 13, prompt: "你发现一本没人认领的旧笔记本。", choices: [
    { text: "翻到最后一页", delta: { spark: 8, mind: 4 } },
    { text: "放回原处", delta: { heart: 5, mind: 3 } },
  ] },
  { age: 18, prompt: "凌晨两点，有人发来一句：出去走走吗？", choices: [
    { text: "穿鞋下楼", delta: { heart: 9, spark: 5 } },
    { text: "明天再说", delta: { mind: 7, heart: -3 } },
  ] },
  { age: 24, prompt: "一份稳定的工作，和一个说不清结果的机会。", choices: [
    { text: "留下", delta: { mind: 8, spark: -4 } },
    { text: "去看看", delta: { spark: 10, mind: -3 } },
  ] },
  { age: 31, prompt: "你突然意识到，已经很久没给某个人打电话。", choices: [
    { text: "现在打", delta: { heart: 10, mind: -1 } },
    { text: "写进备忘录", delta: { mind: 5, heart: -4 } },
  ] },
  { age: 39, prompt: "窗外的城市停电了十分钟。", choices: [
    { text: "点蜡烛", delta: { heart: 4, spark: 7 } },
    { text: "等它恢复", delta: { mind: 6, spark: -2 } },
  ] },
  { age: 47, prompt: "你收到一张没有署名的旧照片。", choices: [
    { text: "试着找出是谁", delta: { mind: 6, heart: 5 } },
    { text: "夹进书里", delta: { spark: 6, heart: 2 } },
  ] },
  { age: 56, prompt: "有人问：这些年你最舍不得什么？", choices: [
    { text: "一个人", delta: { heart: 9, mind: -2 } },
    { text: "一种可能", delta: { spark: 9, heart: -1 } },
  ] },
  { age: 65, prompt: "你有一整天空白，没有任何安排。", choices: [
    { text: "去很远的地方", delta: { spark: 8, heart: 4 } },
    { text: "什么也不做", delta: { mind: 8, heart: 2 } },
  ] },
  { age: 74, prompt: "傍晚的光落在桌面上，你忽然想写点什么。", choices: [
    { text: "写给后来的人", delta: { heart: 6, mind: 5 } },
    { text: "只写给自己", delta: { spark: 7, heart: 3 } },
  ] },
  { age: 82, prompt: "有人说，人生最后记住的往往是很小的事。", choices: [
    { text: "试着回想", delta: { heart: 5, mind: 4 } },
    { text: "让它自己来", delta: { spark: 6, mind: 2 } },
  ] },
  { age: 91, prompt: "夜很安静。你还能听见窗外有风。", choices: [
    { text: "闭上眼睛", delta: { heart: 4, mind: 4 } },
    { text: "再看一会儿", delta: { spark: 7, heart: 2 } },
  ] },
];

const clamp = (value: number) => Math.max(0, Math.min(100, value));

function endingFor(stats: Stats, choicesMade: number) {
  if (choicesMade === 0) return { title: "沉默一生", text: "你没有选择，但时间仍然替你完成了一生。" };

  const ranked = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  const [first, second] = ranked;
  const close = first[1] - second[1] < 8;

  if (close) return { title: "草木一生", text: "没有一种力量完全压过另一种。你只是慢慢长成了自己。" };
  if (first[0] === "heart") return { title: "长梦余生", text: "你把很多时间留给了人，也因此被许多人记住。" };
  if (first[0] === "mind") return { title: "聪明一世", text: "你总能看见事情的结构，只是偶尔错过了它的温度。" };
  return { title: "驰梦远涉", text: "你一直在追逐还没发生的事，直到很远的地方。" };
}

export function MinutePage() {
  const [seconds, setSeconds] = useState(ROUND_SECONDS);
  const [stats, setStats] = useState<Stats>({ heart: 50, mind: 50, spark: 50 });
  const [choicesMade, setChoicesMade] = useState(0);
  const [running, setRunning] = useState(false);
  const answeredStep = useRef(-1);

  const step = Math.min(moments.length - 1, Math.floor((ROUND_SECONDS - seconds) / STEP_SECONDS));
  const moment = moments[step];
  const finished = seconds === 0;
  const ending = useMemo(() => endingFor(stats, choicesMade), [stats, choicesMade]);

  const reset = useCallback(() => {
    setSeconds(ROUND_SECONDS);
    setStats({ heart: 50, mind: 50, spark: 50 });
    setChoicesMade(0);
    setRunning(true);
    answeredStep.current = -1;
  }, []);

  const choose = useCallback((choice: Choice) => {
    if (!running || finished || answeredStep.current === step) return;
    answeredStep.current = step;
    setStats((current) => ({
      heart: clamp(current.heart + (choice.delta.heart ?? 0)),
      mind: clamp(current.mind + (choice.delta.mind ?? 0)),
      spark: clamp(current.spark + (choice.delta.spark ?? 0)),
    }));
    setChoicesMade((count) => count + 1);
  }, [finished, running, step]);

  useEffect(() => {
    if (!running || finished) return;
    const timer = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [finished, running]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!running || finished) return;
      if (event.key === "1") choose(moment.choices[0]);
      if (event.key === "2") choose(moment.choices[1]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [choose, finished, moment, running]);

  useEffect(() => {
    if (finished) setRunning(false);
  }, [finished]);

  const progress = ((ROUND_SECONDS - seconds) / ROUND_SECONDS) * 100;

  return (
    <section className="min-h-screen bg-[#f2f0ea] text-black selection:bg-black selection:text-[#f2f0ea]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-10 pt-28 md:px-12 md:pt-32">
        <div className="h-px w-full bg-black/15">
          <div className="h-full bg-black transition-[width] duration-1000 ease-linear" style={{ width: `${progress}%` }} />
        </div>

        {!running && !finished ? (
          <div className="flex flex-1 flex-col items-start justify-center py-20">
            <h1 className="max-w-4xl font-serif text-6xl leading-[0.92] tracking-[-0.055em] sm:text-7xl md:text-8xl">
              一分钟，一生。
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8">
              每五秒，人生向前跳一次。你只有两个选择，也没有时间把一切想清楚。
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-12 border-b border-black pb-1 text-base transition-opacity hover:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-black"
            >
              开始这一生
            </button>
          </div>
        ) : finished ? (
          <div className="flex flex-1 flex-col items-start justify-center py-20">
            <p className="font-serif text-2xl">{ending.title}</p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight tracking-[-0.045em] sm:text-6xl md:text-7xl">
              {ending.text}
            </h1>
            <p className="mt-10 text-base">你做了 {choicesMade} 次选择。</p>
            <button
              type="button"
              onClick={reset}
              className="mt-10 border-b border-black pb-1 text-base transition-opacity hover:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-black"
            >
              再活一次
            </button>
          </div>
        ) : (
          <div className="grid flex-1 gap-10 py-12 md:grid-cols-[1fr_2fr] md:items-center md:gap-16">
            <div>
              <div className="font-serif text-[clamp(5rem,14vw,10rem)] leading-none tracking-[-0.07em] tabular-nums">
                {seconds}
              </div>
              <div className="mt-4 text-lg">{moment.age} 岁</div>

              <div className="mt-10 space-y-3 text-sm">
                <Meter name="心" value={stats.heart} />
                <Meter name="智" value={stats.mind} />
                <Meter name="梦" value={stats.spark} />
              </div>
            </div>

            <div key={step} className="animate-[fade-in_350ms_ease-out]">
              <p className="max-w-3xl font-serif text-3xl leading-snug tracking-tight sm:text-4xl md:text-5xl">
                {moment.prompt}
              </p>
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {moment.choices.map((choice, index) => {
                  const answered = answeredStep.current === step;
                  return (
                    <button
                      key={choice.text}
                      type="button"
                      disabled={answered}
                      onClick={() => choose(choice)}
                      className="group min-h-28 border border-black/30 px-5 py-6 text-left text-lg transition-colors hover:bg-black hover:text-[#f2f0ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-black"
                    >
                      <span className="mr-4 font-mono text-xs opacity-45">{index + 1}</span>
                      {choice.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Meter({ name, value }: { name: string; value: number }) {
  return (
    <div className="grid grid-cols-[1.5rem_1fr_2.5rem] items-center gap-3">
      <span>{name}</span>
      <div className="h-px bg-black/20">
        <div className="h-full bg-black transition-[width] duration-500" style={{ width: `${value}%` }} />
      </div>
      <span className="text-right font-mono text-xs tabular-nums">{value}</span>
    </div>
  );
}
