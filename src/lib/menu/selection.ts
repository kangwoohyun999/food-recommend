import { CONDITION_KEYS, CONDITIONS, type ConditionKey, type Selection } from "./conditions";

/** 조건 하나에서 선택지를 켜고 끈다. 선택지가 모두 꺼지면 그 조건은 고르지 않은 것으로 본다. */
export function toggleOption(selection: Selection, key: ConditionKey, option: string): Selection {
  const current: readonly string[] = selection[key] ?? [];
  const next = current.includes(option)
    ? current.filter((o) => o !== option)
    : [...current, option];
  return setCondition(selection, key, next);
}

/** 조건 하나의 선택지를 통째로 바꾼다. 빈 배열이면 조건을 지운다. */
export function setCondition(
  selection: Selection,
  key: ConditionKey,
  options: readonly string[],
): Selection {
  const rest = { ...selection };
  delete rest[key];
  if (options.length === 0) return rest;
  return { ...rest, [key]: options };
}

/** 조건 하나를 뺀다 (0개일 때 [조건 하나 빼기]). */
export function removeCondition(selection: Selection, key: ConditionKey): Selection {
  return setCondition(selection, key, []);
}

export function isChosen(selection: Selection, key: ConditionKey): boolean {
  return (selection[key]?.length ?? 0) > 0;
}

/** 고른 조건 목록 (질문 순서대로) */
export function chosenKeys(selection: Selection): ConditionKey[] {
  return CONDITION_KEYS.filter((key) => isChosen(selection, key));
}

/** "종류: 한식, 중식"처럼 화면에 보여 줄 문구 */
export function describeCondition(selection: Selection, key: ConditionKey): string {
  const labels: Record<string, string> = CONDITIONS[key].options;
  const chosen: readonly string[] = selection[key] ?? [];
  return `${CONDITIONS[key].label}: ${chosen.map((o) => labels[o]).join(", ")}`;
}
