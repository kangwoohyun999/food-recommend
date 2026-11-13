import { OptionChips } from "@/components/option-chips";
import { CONDITIONS, type ConditionKey } from "@/lib/menu/conditions";

type Props = {
  conditionKey: ConditionKey;
  /** 0부터 시작 */
  index: number;
  total: number;
  selected: readonly string[];
  onToggle: (option: string) => void;
  onNext: () => void;
  onBack: () => void;
  onFinish: () => void;
};

/** 질문 하나 (기획서 4.1). 고르지 않고 넘어가면 그 조건은 "상관없음"이다. */
export function QuestionStep({
  conditionKey,
  index,
  total,
  selected,
  onToggle,
  onNext,
  onBack,
  onFinish,
}: Props) {
  const isLast = index === total - 1;
  const hasAnswer = selected.length > 0;
  const primaryLabel = isLast
    ? hasAnswer
      ? "추천 받기"
      : "이 질문 건너뛰고 추천 받기"
    : hasAnswer
      ? "다음"
      : "이 질문 건너뛰기";

  return (
    <div className="flex flex-1 flex-col gap-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          aria-label={index === 0 ? "첫 화면으로" : "이전 질문"}
          className="-ml-2 rounded-full px-2 py-1 text-xl text-muted hover:text-foreground"
        >
          ←
        </button>
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
          aria-label="질문 진행"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <span className="text-sm tabular-nums text-muted">
          {index + 1} / {total}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-accent">{CONDITIONS[conditionKey].label}</p>
          <h1 className="text-2xl font-bold sm:text-3xl">{CONDITIONS[conditionKey].question}</h1>
          <p className="text-sm text-muted">여러 개 골라도 돼요.</p>
        </div>
        <OptionChips
          conditionKey={conditionKey}
          selected={selected}
          onToggle={onToggle}
          size="lg"
        />
      </div>

      <div className="mt-auto flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onNext}
          className={`h-14 w-full rounded-2xl text-lg font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            hasAnswer
              ? "bg-accent text-accent-foreground"
              : "border border-border bg-surface text-foreground hover:border-accent"
          }`}
        >
          {primaryLabel}
        </button>
        {!isLast && (
          <button
            type="button"
            onClick={onFinish}
            className="h-14 w-full rounded-2xl bg-accent-soft text-lg font-bold text-accent-soft-foreground hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            남은 질문 건너뛰고 바로 추천 받기
          </button>
        )}
      </div>
    </div>
  );
}
