import { CONDITION_KEYS, type Menu, type Selection } from "./conditions";

export const MAX_CANDIDATES = 3;

/**
 * 고른 조건에 맞는 메뉴만 남긴다 (기획서 5장).
 * - 같은 조건 안에서 여러 개를 고르면 하나라도 맞으면 통과 (OR)
 * - 서로 다른 조건끼리는 모두 맞아야 통과 (AND)
 * - 고르지 않은 조건(없거나 빈 배열)은 거르지 않는다
 */
export function filterMenus(menus: readonly Menu[], selection: Selection): Menu[] {
  return menus.filter((menu) =>
    CONDITION_KEYS.every((key) => {
      const chosen: readonly string[] = selection[key] ?? [];
      if (chosen.length === 0) return true;
      const tags: readonly string[] = menu.tags[key];
      return chosen.some((option) => tags.includes(option));
    }),
  );
}

/**
 * 조건에 맞는 메뉴 중 랜덤으로 최대 3개를 후보로 고른다.
 * 남은 메뉴가 3개보다 적으면 있는 만큼, 0개면 빈 배열을 돌려준다.
 *
 * @param random 0 이상 1 미만의 수를 돌려주는 함수. 테스트에서 고정값을 넣는다.
 */
export function recommend(
  menus: readonly Menu[],
  selection: Selection,
  random: () => number = Math.random,
): Menu[] {
  return pickRandom(filterMenus(menus, selection), MAX_CANDIDATES, random);
}

/** 겹치지 않게 최대 count개를 고른다 (부분 Fisher–Yates 셔플). */
function pickRandom<T>(items: readonly T[], count: number, random: () => number): T[] {
  const pool = [...items];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}
