import { OptionChips } from "@/components/option-chips";
import { CONDITION_KEYS, CONDITIONS, type Selection } from "@/lib/menu/conditions";
import { chosenKeys, questionKeys, toggleOption } from "@/lib/menu/selection";

type Props = {
  preset: Selection;
  onChange: (next: Selection) => void;
  onNext: () => void;
  onBack: () => void;
};

/** [시작] 다음 화면: 조건을 미리 고른다 (기획서 4.1). 전부 선택 사항이고, 고른 조건은 질문에서 건너뛴다. */
export function ConditionSetup({ preset, onChange, onNext, onBack }: Props) {
  const chosenCount = chosenKeys(preset).length;
  const remaining = questionKeys(preset).length;

  const nextLabel = remaining === 0 ? "추천 받기" : chosenCount === 0 ? "없어요, 질문으로 넘어가기" : "다음";

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="첫 화면으로"
          className="-ml-2 rounded-full px-2 py-1 text-xl text-muted hover:text-foreground"
        >
          ←
        </button>
        {chosenCount > 0 && (
          <button
            type="button"
            onClick={() => onChange({})}
            className="text-sm text-muted underline-offset-2 hover:underline"
          >
            모두 지우기
          </button>
        )}
      </div>

      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold sm:text-3xl">미리 정해 둔 게 있나요?</h1>
        <p className="text-sm text-muted">
          고른 조건은 질문에서 건너뛰어요. 안 골라도 괜찮아요.
        </p>
      </header>

      <section
        aria-label="조건 미리 고르기"
        className="flex flex-col gap-5 rounded-3xl border border-border bg-surface p-5 sm:p-6"
      >
        {CONDITION_KEYS.map((key) => (
          <div key={key} className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-muted">{CONDITIONS[key].label}</h2>
            <OptionChips
              conditionKey={key}
              selected={preset[key] ?? []}
              onToggle={(option) => onChange(toggleOption(preset, key, option))}
            />
          </div>
        ))}
      </section>

      <div className="sticky bottom-4 mt-auto flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onNext}
          className="h-14 w-full rounded-2xl bg-accent text-lg font-bold text-accent-foreground shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {nextLabel}
        </button>
        <p className="rounded-full bg-background/80 px-3 text-sm text-muted backdrop-blur">
          {remaining === 0
            ? "모든 조건을 골랐어요. 바로 추천해 드릴게요."
            : chosenCount === 0
              ? `${remaining}가지를 하나씩 물어볼게요.`
              : `${chosenCount}개 골랐어요. 나머지 ${remaining}개는 하나씩 물어볼게요.`}
        </p>
      </div>
    </div>
  );
}
