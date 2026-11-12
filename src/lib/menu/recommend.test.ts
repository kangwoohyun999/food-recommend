import { describe, expect, it } from "vitest";
import type { Menu, MenuTags } from "./conditions";
import { filterMenus, recommend } from "./recommend";

const EMPTY_TAGS: MenuTags = {
  condition: [],
  weather: [],
  mealTime: [],
  situation: [],
  taste: [],
  cuisine: [],
  price: [],
};

function menu(name: string, tags: Partial<MenuTags>): Menu {
  return { id: name, name, tags: { ...EMPTY_TAGS, ...tags } };
}

const MENUS: Menu[] = [
  menu("김치찌개", {
    cuisine: ["korean"],
    taste: ["spicy"],
    price: ["under10k"],
    condition: ["hangover", "tired"],
    weather: ["rainy", "cold"],
    mealTime: ["lunch", "dinner"],
    situation: ["solo"],
  }),
  menu("콩나물국밥", {
    cuisine: ["korean"],
    taste: ["mild"],
    price: ["under10k"],
    condition: ["hangover", "sick"],
    mealTime: ["breakfast", "lunch"],
    situation: ["solo"],
  }),
  menu("짬뽕", {
    cuisine: ["chinese"],
    taste: ["spicy"],
    price: ["under10k"],
    condition: ["hangover", "stressed"],
    weather: ["rainy"],
    mealTime: ["lunch", "dinner"],
  }),
  menu("초밥", {
    cuisine: ["japanese"],
    taste: ["mild"],
    price: ["over20k"],
    mealTime: ["dinner"],
    situation: ["date"],
  }),
  menu("파스타", {
    cuisine: ["western"],
    price: ["from10kTo20k"],
    mealTime: ["lunch", "dinner"],
    situation: ["date", "friends"],
  }),
  menu("치킨", {
    cuisine: ["korean"],
    price: ["from10kTo20k"],
    condition: ["stressed"],
    mealTime: ["lateNight"],
    situation: ["friends", "company"],
  }),
];

const names = (menus: Menu[]) => menus.map((m) => m.name).sort();

/** 항상 같은 순서를 내는 난수: 0, 0.5, 0.99, 0, 0.5, ... */
function fixedRandom() {
  const values = [0, 0.5, 0.99];
  let i = 0;
  return () => values[i++ % values.length];
}

describe("filterMenus", () => {
  it("조건을 하나도 안 고르면 전체 메뉴가 남는다", () => {
    expect(filterMenus(MENUS, {})).toHaveLength(MENUS.length);
  });

  it("빈 배열로 고른 조건은 거르지 않는다", () => {
    expect(filterMenus(MENUS, { cuisine: [], price: [] })).toHaveLength(MENUS.length);
  });

  it("조건 1개: 그 태그가 있는 메뉴만 남는다", () => {
    expect(names(filterMenus(MENUS, { condition: ["hangover"] }))).toEqual([
      "김치찌개",
      "짬뽕",
      "콩나물국밥",
    ]);
  });

  it("같은 조건에서 여러 개를 고르면 하나라도 맞으면 통과한다 (OR)", () => {
    expect(names(filterMenus(MENUS, { cuisine: ["japanese", "western"] }))).toEqual([
      "초밥",
      "파스타",
    ]);
  });

  it("서로 다른 조건끼리는 모두 맞아야 통과한다 (AND)", () => {
    expect(
      names(filterMenus(MENUS, { condition: ["hangover"], taste: ["spicy"] })),
    ).toEqual(["김치찌개", "짬뽕"]);
  });

  it("OR와 AND를 함께 쓴다", () => {
    // (한식 또는 중식) 이면서 1만원 이하 이면서 비 오는 날
    expect(
      names(
        filterMenus(MENUS, {
          cuisine: ["korean", "chinese"],
          price: ["under10k"],
          weather: ["rainy"],
        }),
      ),
    ).toEqual(["김치찌개", "짬뽕"]);
  });

  it("태그가 비어 있는 메뉴는 그 조건을 고르면 빠진다", () => {
    // 파스타는 컨디션 태그가 없다
    expect(names(filterMenus(MENUS, { condition: ["tired", "stressed", "sick", "hangover"] })))
      .not.toContain("파스타");
  });
});

describe("recommend", () => {
  it("조건이 없으면 전체 메뉴에서 3개를 고른다", () => {
    const result = recommend(MENUS, {});
    expect(result).toHaveLength(3);
    for (const m of result) expect(MENUS).toContain(m);
  });

  it("남은 메뉴가 3개 이상이면 3개를 고르고, 조건에 모두 맞는다", () => {
    const result = recommend(MENUS, { mealTime: ["lunch", "dinner"] });
    expect(result).toHaveLength(3);
    for (const m of result) {
      expect(m.tags.mealTime.some((t) => t === "lunch" || t === "dinner")).toBe(true);
    }
  });

  it("후보끼리 겹치지 않는다", () => {
    for (let i = 0; i < 50; i++) {
      const result = recommend(MENUS, {});
      expect(new Set(result.map((m) => m.id)).size).toBe(result.length);
    }
  });

  it("남은 메뉴가 1~2개면 있는 만큼만 돌려준다", () => {
    expect(names(recommend(MENUS, { situation: ["date"] }))).toEqual(["초밥", "파스타"]);
    expect(names(recommend(MENUS, { mealTime: ["lateNight"] }))).toEqual(["치킨"]);
  });

  it("남은 메뉴가 0개면 빈 배열을 돌려준다", () => {
    expect(recommend(MENUS, { cuisine: ["japanese"], taste: ["spicy"] })).toEqual([]);
  });

  it("전체 메뉴가 0개여도 빈 배열을 돌려준다", () => {
    expect(recommend([], {})).toEqual([]);
  });

  it("같은 난수가 들어가면 같은 결과가 나온다", () => {
    const a = recommend(MENUS, {}, fixedRandom());
    const b = recommend(MENUS, {}, fixedRandom());
    expect(a).toEqual(b);
  });

  it("랜덤으로 고르기 때문에 여러 번 돌리면 모든 메뉴가 한 번은 후보에 오른다", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      for (const m of recommend(MENUS, {})) seen.add(m.id);
    }
    expect(seen.size).toBe(MENUS.length);
  });

  it("원래 메뉴 배열을 바꾸지 않는다", () => {
    const before = MENUS.map((m) => m.id);
    recommend(MENUS, {});
    expect(MENUS.map((m) => m.id)).toEqual(before);
  });
});
