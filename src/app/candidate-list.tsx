import { CONDITIONS, type ConditionKey, type Menu, type Selection } from "@/lib/menu/conditions";
import { chosenKeys, describeCondition } from "@/lib/menu/selection";
import { useState } from "react";

const CUISINE_EMOJI: Record<string, string> = {
  korean: "🍲",
  chinese: "🥟",
  japanese: "🍣",
  western: "🍝",
};

type Props = {
  selection: Selection;
  candidates: Menu[];
  /** 조건에 맞는 메뉴 전체 개수 */
  matchCount: number;
  onPick: (menu: Menu) => void;
  onReroll: () => void;
  onRemoveCondition: (key: ConditionKey) => void;
  onRestart: () => void;
};

/** 후보 최대 3개를 보여 주고 하나를 고른다 (기획서 4.2, 5장). */
export function CandidateList({
  selection,
  candidates,
  matchCount,
  onPick,
  onReroll,
  onRemoveCondition,
  onRestart,
}: Props) {
  const chosen = chosenKeys(selection);

  return (
    <div className="flex flex-1 flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {candidates.length > 0 ? "이 중에 골라 보세요" : "앗, 메뉴가 없어요"}
        </h1>
        <ChosenSummary selection={selection} keys={chosen} />
      </header>

      {candidates.length > 0 ? (
        <>
          <ul className="flex flex-col gap-3">
            {candidates.map((menu) => (
              <li key={menu.id}>
                <CandidateCard menu={menu} onPick={() => onPick(menu)} />
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center gap-3">
            {matchCount > candidates.length && (
              <button
                type="button"
                onClick={onReroll}
                className="h-12 w-full rounded-2xl border border-border bg-surface font-bold hover:border-accent"
              >
                다른 후보 보기
              </button>
            )}
            <p className="text-sm text-muted">조건에 맞는 메뉴 {matchCount}개 중에서 골랐어요.</p>
          </div>
        </>
      ) : (
        <NoMatch selection={selection} keys={chosen} onRemoveCondition={onRemoveCondition} />
      )}

      {selection.condition && (
        <p className="rounded-2xl bg-accent-soft px-4 py-3 text-sm">
          컨디션에 맞춘 추천은 의학적 조언이 아니라 메뉴 참고용이에요.
        </p>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="mt-auto self-center text-sm text-muted underline-offset-2 hover:underline"
      >
        처음부터 다시 하기
      </button>
    </div>
  );
}

function ChosenSummary({ selection, keys }: { selection: Selection; keys: ConditionKey[] }) {
  if (keys.length === 0) {
    return <p className="text-sm text-muted">조건 없이 전체 메뉴에서 골랐어요.</p>;
  }
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="고른 조건">
      {keys.map((key) => (
        <li key={key} className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium">
          {describeCondition(selection, key)}
        </li>
      ))}
    </ul>
  );
}

function CandidateCard({ menu, onPick }: { menu: Menu; onPick: () => void }) {
  const cuisine = menu.tags.cuisine[0];
  const price = menu.tags.price[0];
  const cuisineLabels: Record<string, string> = CONDITIONS.cuisine.options;
  const priceLabels: Record<string, string> = CONDITIONS.price.options;

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-4 sm:p-5">
      <span
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-3xl"
        aria-hidden
      >
        {CUISINE_EMOJI[cuisine]}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-lg font-bold">{menu.name}</p>
        <p className="text-sm text-muted">
          {cuisineLabels[cuisine]} · {priceLabels[price]}
        </p>
      </div>
      <button
        type="button"
        onClick={onPick}
        className="shrink-0 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        이걸로!
      </button>
    </div>
  );
}

function NoMatch({
  selection,
  keys,
  onRemoveCondition,
}: {
  selection: Selection;
  keys: ConditionKey[];
  onRemoveCondition: (key: ConditionKey) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5 rounded-3xl border border-dashed border-border bg-surface px-5 py-10 text-center">
      <p className="text-4xl" aria-hidden>
        🤔
      </p>
      <p className="font-medium">
        조건에 맞는 메뉴가 없어요.
        <br />
        조건을 하나 빼주세요.
      </p>
      {open ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted">뺄 조건을 누르세요</p>
          <ul className="flex flex-wrap justify-center gap-2">
            {keys.map((key) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onRemoveCondition(key)}
                  className="rounded-full border border-border px-3.5 py-1.5 text-sm hover:border-accent hover:bg-accent-soft"
                >
                  {describeCondition(selection, key)} ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-12 rounded-2xl bg-accent px-6 font-bold text-accent-foreground"
        >
          조건 하나 빼기
        </button>
      )}
    </div>
  );
}
