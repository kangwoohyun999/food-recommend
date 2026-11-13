import { describe, expect, it } from "vitest";
import { buildSpin, ROULETTE_TICKS, tickDelay } from "./roulette";

const ITEMS = ["김치찌개", "짜장면", "초밥", "파스타", "치킨"];

describe("buildSpin", () => {
  it("정해진 칸 수만큼 만들고, 모든 칸은 메뉴 목록 안에 있다", () => {
    const spin = buildSpin(ITEMS);
    expect(spin).toHaveLength(ROULETTE_TICKS);
    for (const item of spin) expect(ITEMS).toContain(item);
  });

  it("같은 메뉴가 연달아 나오지 않는다", () => {
    for (let n = 0; n < 50; n++) {
      const spin = buildSpin(ITEMS);
      for (let i = 1; i < spin.length; i++) expect(spin[i]).not.toBe(spin[i - 1]);
    }
  });

  it("난수가 계속 같아도 연달아 같은 메뉴가 나오지 않는다", () => {
    const spin = buildSpin(ITEMS, () => 0, 6);
    for (let i = 1; i < spin.length; i++) expect(spin[i]).not.toBe(spin[i - 1]);
  });

  it("여러 번 돌리면 모든 메뉴가 한 번은 결과(마지막 칸)가 된다", () => {
    const results = new Set<string>();
    for (let n = 0; n < 300; n++) results.add(buildSpin(ITEMS).at(-1)!);
    expect(results.size).toBe(ITEMS.length);
  });

  it("메뉴가 1개면 그것만, 0개면 빈 배열을 돌려준다", () => {
    expect(buildSpin(["라면"])).toEqual(["라면"]);
    expect(buildSpin([])).toEqual([]);
  });
});

describe("tickDelay", () => {
  it("끝으로 갈수록 느려진다", () => {
    for (let i = 1; i < ROULETTE_TICKS; i++) {
      expect(tickDelay(i)).toBeGreaterThanOrEqual(tickDelay(i - 1));
    }
    expect(tickDelay(0)).toBeLessThan(tickDelay(ROULETTE_TICKS - 1));
  });

  it("전체 시간은 2~4초 사이다", () => {
    let total = 0;
    for (let i = 0; i < ROULETTE_TICKS - 1; i++) total += tickDelay(i);
    expect(total).toBeGreaterThan(2000);
    expect(total).toBeLessThan(4000);
  });
});
