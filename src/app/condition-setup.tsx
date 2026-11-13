import { OptionChips } from "@/components/option-chips";
import { CONDITION_KEYS, CONDITIONS, type Selection } from "@/lib/menu/conditions";
import { chosenKeys, questionKeys, toggleOption } from "@/lib/menu/selection";

type Props = {
  preset: Selection;
  onChange: (next: Selection) => void;
  onStart: () => void;
  onRoulette: () => void;
};

/** 메인 화면: [시작] 버튼 위에서 조건을 미리 고른다 (기획서 4.1). 전부 선택 사항이다. */
export function ConditionSetup({ preset, onChange, onStart, onRoulette }: Props) {
  const chosenCount = chosenKeys(preset).length;
  const remaining = questionKeys(preset).length;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 text-center">
        <p className="text-5xl" aria-hidden>
          🍚
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">오늘 뭐 먹지?</h1>
        <p className="text-muted">
          먹고 싶은 게 없는 날, 몇 가지만 고르면
          <br />
          오늘의 메뉴를 정해 드릴게요.
        </p>
        <button
          type="button"
          onClick={onRoulette}
          className="mt-2 self-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-bold hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          🎰 조건 없이 랜덤으로 뽑기
        </button>
      </header>

      <section
        aria-labelledby="preset-title"
        className="flex flex-col gap-5 rounded-3xl border border-border bg-surface p-5 sm:p-6"
      >
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="preset-title" className="font-bold">
            미리 정해 둔 게 있나요?
          </h2>
          {chosenCount > 0 ? (
            <button
              type="button"
              onClick={() => onChange({})}
              className="text-sm text-muted underline-offset-2 hover:underline"
            >
              모두 지우기
            </button>
          ) : (
            <span className="text-sm text-muted">선택</span>
          )}
        </div>

        {CONDITION_KEYS.map((key) => (
          <div key={key} className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-muted">{CONDITIONS[key].label}</h3>
            <OptionChips
              conditionKey={key}
              selected={preset[key] ?? []}
              onToggle={(option) => onChange(toggleOption(preset, key, option))}
            />
          </div>
        ))}
      </section>

      <div className="sticky bottom-4 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onStart}
          className="h-14 w-full rounded-2xl bg-accent text-lg font-bold text-accent-foreground shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          시작
        </button>
        <p className="rounded-full bg-background/80 px-3 text-sm text-muted backdrop-blur">
          {remaining === 0
            ? "모든 조건을 골랐어요. 바로 추천해 드릴게요."
            : chosenCount === 0
              ? "고르지 않아도 괜찮아요. 하나씩 물어볼게요."
              : `${chosenCount}개 골랐어요. 나머지 ${remaining}개는 하나씩 물어볼게요.`}
        </p>
      </div>
    </div>
  );
}
