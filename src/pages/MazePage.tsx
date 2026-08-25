import { useMemo, useState } from "react";

type Direction = "north" | "east" | "south" | "west";

type Room = {
  text: string;
  exits: Partial<Record<Direction, string>>;
};

const ROOMS: Record<string, Room> = {
  gate: {
    text: "风从没有门的走廊里吹来。墙上只有一句：草木一生。",
    exits: { north: "well", east: "glass" },
  },
  well: {
    text: "井口很浅，却听不见落石触底。西侧有持续的电流声。",
    exits: { south: "gate", west: "static" },
  },
  glass: {
    text: "四面都是旧玻璃。你能看见自己的倒影，但每一面都慢半拍。",
    exits: { west: "gate", north: "archive" },
  },
  static: {
    text: "噪声贴着墙移动。靠近时，它像一句没说完的话：沉默一生。",
    exits: { east: "well", north: "archive" },
  },
  archive: {
    text: "纸张没有日期。只有一页反复写着：Certain Memories Yield Slowly.",
    exits: { south: "glass", west: "static", north: "exit" },
  },
  exit: {
    text: "光从缝隙里进来。你没有找到地图，只找到了出口。",
    exits: {},
  },
};

const DIRECTIONS: { key: Direction; label: string; glyph: string }[] = [
  { key: "north", label: "北", glyph: "↑" },
  { key: "east", label: "东", glyph: "→" },
  { key: "south", label: "南", glyph: "↓" },
  { key: "west", label: "西", glyph: "←" },
];

export function MazePage() {
  const [roomId, setRoomId] = useState("gate");
  const [steps, setSteps] = useState(0);
  const [visited, setVisited] = useState<string[]>(["gate"]);

  const room = ROOMS[roomId];
  const won = roomId === "exit";
  const available = useMemo(
    () => DIRECTIONS.filter((direction) => room.exits[direction.key]),
    [room]
  );

  const move = (direction: Direction) => {
    const next = room.exits[direction];
    if (!next) return;
    setRoomId(next);
    setSteps((value) => value + 1);
    setVisited((value) => (value.includes(next) ? value : [...value, next]));
  };

  const reset = () => {
    setRoomId("gate");
    setSteps(0);
    setVisited(["gate"]);
  };

  return (
    <section className="min-h-screen bg-[#0a0a0a] px-6 py-32 text-white md:px-12">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col justify-between">
        <div>
          <p className="mb-8 font-mono text-xs tracking-[0.28em] text-white/50">CMYS / MAZE</p>
          <h1 className="font-serif text-5xl tracking-tight sm:text-6xl">迷径</h1>
        </div>

        <div className="my-16">
          <p className="max-w-2xl font-serif text-2xl leading-relaxed sm:text-3xl">{room.text}</p>

          {!won ? (
            <div className="mt-12 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {DIRECTIONS.map((direction) => {
                const enabled = Boolean(room.exits[direction.key]);
                return (
                  <button
                    key={direction.key}
                    type="button"
                    disabled={!enabled}
                    onClick={() => move(direction.key)}
                    className="border border-white/20 px-4 py-5 text-left font-mono text-sm transition-colors enabled:hover:bg-white enabled:hover:text-black disabled:cursor-not-allowed disabled:opacity-15"
                  >
                    <span className="mr-3">{direction.glyph}</span>{direction.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              type="button"
              onClick={reset}
              className="mt-12 border-b border-white pb-1 font-mono text-sm tracking-[0.18em]"
            >
              重走一次
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-6 font-mono text-xs text-white/50">
          <span>{steps} steps</span>
          <span>{visited.length} rooms remembered</span>
          {!won && <span>{available.length} ways remain</span>}
        </div>
      </div>
    </section>
  );
}
