/** 룰렛이 멈출 때까지 화면에 보여 줄 칸 수 */
export const ROULETTE_TICKS = 28;

/**
 * 룰렛 한 번에 보여 줄 순서를 만든다 (기획서 4.3).
 * 마지막 칸이 뽑힌 결과다. 같은 항목이 연달아 나오지 않게 해서 멈춘 것처럼 보이지 않게 한다.
 *
 * @param random 0 이상 1 미만의 수를 돌려주는 함수. 테스트에서 고정값을 넣는다.
 */
export function buildSpin<T>(
  items: readonly T[],
  random: () => number = Math.random,
  ticks: number = ROULETTE_TICKS,
): T[] {
  if (items.length === 0) return [];
  if (items.length === 1) return [items[0]];

  const sequence: T[] = [];
  for (let i = 0; i < ticks; i++) {
    let next = items[Math.floor(random() * items.length)];
    if (next === sequence[i - 1]) {
      next = items[(items.indexOf(next) + 1) % items.length];
    }
    sequence.push(next);
  }
  return sequence;
}

/**
 * i번째 칸에서 다음 칸으로 넘어가기까지 기다릴 시간(ms).
 * 처음엔 빠르고 끝으로 갈수록 느려진다. 전체 약 3초.
 */
export function tickDelay(index: number, ticks: number = ROULETTE_TICKS): number {
  const progress = index / Math.max(ticks - 1, 1);
  return Math.round(30 + 300 * progress ** 3);
}
