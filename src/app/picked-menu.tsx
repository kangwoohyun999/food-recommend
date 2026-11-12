import type { Menu } from "@/lib/menu/conditions";

type Props = {
  menu: Menu;
  onBack: () => void;
  onRestart: () => void;
};

/** 고른 메뉴 */
export function PickedMenu({ menu, onBack, onRestart }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-10 text-center">
      <div className="flex flex-col gap-3">
        <p className="text-6xl" aria-hidden>
          🎉
        </p>
        <p className="text-muted">오늘의 메뉴는</p>
        <h1 className="text-4xl font-bold sm:text-5xl">{menu.name}</h1>
      </div>
      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="h-14 w-full rounded-2xl bg-accent text-lg font-bold text-accent-foreground"
        >
          처음부터 다시 하기
        </button>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted underline-offset-2 hover:underline"
        >
          후보로 돌아가기
        </button>
      </div>
    </div>
  );
}
