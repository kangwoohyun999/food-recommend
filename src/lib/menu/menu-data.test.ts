import { describe, expect, it } from "vitest";
import { CONDITION_KEYS, CONDITIONS, type ConditionKey } from "./conditions";
import { toInsert, toMenu } from "./db";
import { MENU_DATA } from "./menu-data";
import { filterMenus } from "./recommend";

/** 조건 하나만 골랐을 때 최소한 남아야 하는 메뉴 수 */
const MIN_PER_OPTION = 5;

describe("메뉴 데이터", () => {
  it("200개 이상이다", () => {
    expect(MENU_DATA.length).toBeGreaterThanOrEqual(200);
  });

  it("이름이 겹치지 않는다", () => {
    const names = MENU_DATA.map((m) => m.name);
    const duplicates = names.filter((name, i) => names.indexOf(name) !== i);
    expect(duplicates).toEqual([]);
  });

  it("종류와 가격대는 메뉴마다 하나씩이다", () => {
    for (const menu of MENU_DATA) {
      expect(() => toInsert(menu)).not.toThrow();
    }
  });

  it("한 메뉴 안에서 같은 태그가 두 번 나오지 않는다", () => {
    for (const menu of MENU_DATA) {
      for (const key of CONDITION_KEYS) {
        const tags = menu.tags[key];
        expect(new Set(tags).size, `${menu.name}.${key}`).toBe(tags.length);
      }
    }
  });

  describe("태그끼리 모순되지 않는다", () => {
    const has = (tags: readonly string[], value: string) => tags.includes(value);
    const conflicts: [string, (t: (typeof MENU_DATA)[number]["tags"]) => boolean][] = [
      ["몸이 안 좋음(순함)인데 매운 맛", (t) => has(t.condition, "sick") && has(t.taste, "spicy")],
      ["스트레스(자극적)인데 담백한 맛", (t) => has(t.condition, "stressed") && has(t.taste, "mild")],
      ["매운 맛과 담백한 맛을 함께", (t) => has(t.taste, "spicy") && has(t.taste, "mild")],
      [
        "더운 날과 추운·비 오는 날을 함께",
        (t) => has(t.weather, "hot") && (has(t.weather, "cold") || has(t.weather, "rainy")),
      ],
      ["혼밥인데 2만원 이상", (t) => has(t.situation, "solo") && has(t.price, "over20k")],
    ];
    for (const [rule, isConflict] of conflicts) {
      it(rule, () => {
        expect(MENU_DATA.filter((m) => isConflict(m.tags)).map((m) => m.name)).toEqual([]);
      });
    }
  });

  it("시간대와 인원·상황은 하나 이상 있다", () => {
    const missing = MENU_DATA.filter(
      (m) => m.tags.mealTime.length === 0 || m.tags.situation.length === 0,
    ).map((m) => m.name);
    expect(missing).toEqual([]);
  });

  const menusWithId = MENU_DATA.map((m) => ({ ...m, id: m.name }));

  for (const key of CONDITION_KEYS) {
    const options = Object.keys(CONDITIONS[key].options) as string[];
    it(`${CONDITIONS[key].label}: 선택지마다 메뉴가 ${MIN_PER_OPTION}개 이상 있다`, () => {
      for (const option of options) {
        const selection = { [key]: [option] } as Partial<Record<ConditionKey, string[]>>;
        const count = filterMenus(menusWithId, selection as never).length;
        expect(count, `${key}=${option}`).toBeGreaterThanOrEqual(MIN_PER_OPTION);
      }
    });
  }
});

describe("DB 변환", () => {
  it("toInsert 후 toMenu를 하면 태그가 그대로다", () => {
    for (const seed of MENU_DATA) {
      const row = { id: "x", ...toInsert(seed) };
      expect(toMenu(row)).toEqual({ id: "x", ...seed });
    }
  });

  it("종류가 두 개면 toInsert가 막는다", () => {
    const bad = { ...MENU_DATA[0], tags: { ...MENU_DATA[0].tags, cuisine: ["korean", "chinese"] as const } };
    expect(() => toInsert(bad)).toThrow(/하나씩/);
  });
});
