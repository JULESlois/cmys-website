import { useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Link } from "react-router-dom";

type Star = {
  id: number;
  x: number;
  y: number;
};

type Edge = {
  from: number;
  to: number;
};

const names = [
  "辰芒映宿",
  "Certain Moments Yield Stars",
  "Clouds Make Yonder Shine",
  "Connect Memories, Yield Shapes",
] as const;

function constellationName(stars: Star[], edges: Edge[]) {
  if (stars.length < 3) return "尚未命名";

  const spread = stars.reduce(
    (acc, star) => ({
      minX: Math.min(acc.minX, star.x),
      maxX: Math.max(acc.maxX, star.x),
      minY: Math.min(acc.minY, star.y),
      maxY: Math.max(acc.maxY, star.y),
    }),
    { minX: 100, maxX: 0, minY: 100, maxY: 0 },
  );

  const width = spread.maxX - spread.minX;
  const height = spread.maxY - spread.minY;
  const signature = Math.round(width * 3 + height * 5 + edges.length * 7 + stars.length * 11);
  return names[Math.abs(signature) % names.length];
}

export function ConstellationPage() {
  const fieldRef = useRef<SVGSVGElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const name = useMemo(() => constellationName(stars, edges), [stars, edges]);

  const addStar = (event: PointerEvent<SVGSVGElement>) => {
    if (!fieldRef.current || stars.length >= 24) return;

    const bounds = fieldRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    const next: Star = { id: stars.length, x, y };

    if (stars.length > 0) {
      const nearest = stars.reduce((best, star) => {
        const distance = (star.x - x) ** 2 + (star.y - y) ** 2;
        return distance < best.distance ? { id: star.id, distance } : best;
      }, { id: stars[0].id, distance: Number.POSITIVE_INFINITY });

      setEdges((current) => [...current, { from: nearest.id, to: next.id }]);
    }

    setStars((current) => [...current, next]);
  };

  const undo = () => {
    if (stars.length === 0) return;
    const removedId = stars[stars.length - 1].id;
    setStars((current) => current.slice(0, -1));
    setEdges((current) => current.filter((edge) => edge.from !== removedId && edge.to !== removedId));
  };

  const clear = () => {
    setStars([]);
    setEdges([]);
  };

  return (
    <section className="min-h-screen bg-canvas px-5 pb-10 pt-28 text-primary sm:px-8 sm:pt-32">
      <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl flex-col">
        <header className="flex flex-wrap items-end justify-between gap-6 pb-8">
          <div>
            <h1 className="font-serif text-4xl tracking-tight sm:text-6xl">辰芒映宿</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 sm:text-base">
              在空白处落下星点。每颗新星会寻找离自己最近的旧星，慢慢长成只属于这一刻的图形。
            </p>
          </div>
          <Link to="/lab" className="text-sm underline decoration-1 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            返回实验室
          </Link>
        </header>

        <div className="relative flex-1 min-h-[58vh] border-y border-primary">
          <svg
            ref={fieldRef}
            role="img"
            aria-label={`星图绘制区域，当前有 ${stars.length} 颗星`}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            onPointerDown={addStar}
            className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
          >
            {edges.map((edge) => {
              const from = stars.find((star) => star.id === edge.from);
              const to = stars.find((star) => star.id === edge.to);
              if (!from || !to) return null;
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-primary"
                  strokeWidth="1"
                />
              );
            })}

            {stars.map((star) => (
              <circle
                key={star.id}
                cx={star.x}
                cy={star.y}
                r="0.65"
                vectorEffect="non-scaling-stroke"
                className="fill-primary"
              />
            ))}
          </svg>

          {stars.length === 0 && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center px-8 text-center text-lg sm:text-2xl">
              点击任意位置，留下第一颗星。
            </div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-6 pt-7">
          <div>
            <p className="font-serif text-2xl sm:text-3xl">{name}</p>
            <p className="mt-1 text-sm">{stars.length} / 24</p>
          </div>
          <div className="flex gap-5 text-sm">
            <button type="button" onClick={undo} disabled={stars.length === 0} className="underline decoration-1 underline-offset-4 disabled:opacity-30">
              撤回一颗
            </button>
            <button type="button" onClick={clear} disabled={stars.length === 0} className="underline decoration-1 underline-offset-4 disabled:opacity-30">
              清空星图
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
