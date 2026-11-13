import { AppIcon } from "@/components/app-icon";

type Props = {
  onStart: () => void;
  onRoulette: () => void;
};

/** 첫 화면 */
export function Intro({ onStart, onRoulette }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-12 py-10 text-center">
      <header className="flex flex-col items-center gap-4">
        <AppIcon className="size-20 rounded-[22px] shadow-lg shadow-accent/25" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">오늘 뭐 먹지?</h1>
        <p className="text-lg text-muted">
          먹고 싶은 게 없는 날, 몇 가지만 고르면
          <br />
          오늘의 메뉴를 정해 드릴게요.
        </p>
      </header>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <button
          type="button"
          onClick={onStart}
          className="h-14 w-full rounded-2xl bg-accent text-lg font-bold text-accent-foreground shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          시작
        </button>
        <button
          type="button"
          onClick={onRoulette}
          className="h-12 w-full rounded-2xl border border-border bg-surface font-bold hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          조건 없이 랜덤으로 뽑기
        </button>
      </div>
    </div>
  );
}
