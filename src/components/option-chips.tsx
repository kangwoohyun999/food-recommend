import { CONDITIONS, type ConditionKey } from "@/lib/menu/conditions";

type Props = {
  conditionKey: ConditionKey;
  selected: readonly string[];
  onToggle: (option: string) => void;
  size?: "sm" | "lg";
};

/** 조건 하나의 선택지를 칩으로 보여 준다. 여러 개를 고를 수 있다. */
export function OptionChips({ conditionKey, selected, onToggle, size = "sm" }: Props) {
  const options: Record<string, string> = CONDITIONS[conditionKey].options;
  const sizeClass = size === "lg" ? "px-5 py-3 text-base" : "px-3.5 py-1.5 text-sm";

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={CONDITIONS[conditionKey].label}>
      {Object.entries(options).map(([id, label]) => {
        const on = selected.includes(id);
        return (
          <button
            key={id}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(id)}
            className={`rounded-full border font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${sizeClass} ${
              on
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-surface text-foreground hover:border-accent hover:bg-accent-soft"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
