import { useEffect, useState } from "react";
import type { Menu } from "@/lib/menu/conditions";
import { buildSpin, tickDelay } from "@/lib/menu/roulette";

type Spin = { sequence: Menu[]; index: number };

function newSpin(menus: readonly Menu[]): Spin {
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sequence = buildSpin(menus);
  // 움직임 줄이기를 켠 사용자에게는 결과만 보여 준다
  return { sequence: reduceMotion ? sequence.slice(-1) : sequence, index: 0 };
}

type Props = {
  /** 룰렛에 올릴 메뉴. 조건 없이 돌리면 전체, 후보 화면에서 돌리면 조건에 맞는 메뉴 */
  menus: readonly Menu[];
  /** 룰렛 위에 보여 줄 설명 (예: "조건에 맞는 메뉴 25개 중에서") */
  caption?: string;
  exitLabel: string;
  onExit: () => void;
};

/** 메뉴 중 하나를 랜덤으로 정하는 룰렛 (기획서 4.3) */
export function Roulette({ menus, caption, exitLabel, onExit }: Props) {
  const [spin, setSpin] = useState<Spin>(() => newSpin(menus));
  const { sequence, index } = spin;
  const done = index >= sequence.length - 1;
  const current = sequence[index];

  useEffect(() => {
    if (done) return;
    const timer = setTimeout(
      () => setSpin((s) => ({ ...s, index: s.index + 1 })),
      tickDelay(index, sequence.length),
    );
    return () => clearTimeout(timer);
  }, [done, index, sequence.length]);

  if (!current) {
    return <p className="py-16 text-center text-muted">메뉴가 없어요. 메뉴 데이터를 확인해 주세요.</p>;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 py-10 text-center">
      <div className="flex flex-col gap-1">
        {caption && <p className="text-sm text-muted">{caption}</p>}
        <p className="font-medium text-muted" aria-hidden={!done}>
          {done ? "오늘의 메뉴는" : "두구두구두구…"}
        </p>
      </div>

      <div
        className={`flex h-40 w-full items-center justify-center overflow-hidden rounded-3xl border-2 bg-surface transition-colors duration-300 ${
          done ? "border-accent shadow-xl" : "border-border"
        }`}
      >
        <p
          key={index}
          className={`px-4 font-bold ${done ? "animate-[pop_400ms_ease-out] text-4xl sm:text-5xl" : "animate-[reel_90ms_linear] text-3xl text-muted"}`}
        >
          {current.name}
        </p>
      </div>

      {/* 스크린 리더에는 멈춘 결과만 읽어 준다 */}
      <p className="sr-only" aria-live="polite">
        {done ? `오늘의 메뉴는 ${current.name}` : ""}
      </p>

      <div className={`flex w-full flex-col gap-3 transition-opacity ${done ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <button
          type="button"
          onClick={() => setSpin(newSpin(menus))}
          disabled={!done}
          className="h-14 w-full rounded-2xl bg-accent text-lg font-bold text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          다시 돌리기
        </button>
        <button
          type="button"
          onClick={onExit}
          disabled={!done}
          className="h-12 w-full rounded-2xl border border-border bg-surface font-bold hover:border-accent"
        >
          {exitLabel}
        </button>
      </div>
    </div>
  );
}
