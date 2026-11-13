import { describe, expect, it } from "vitest";
import { CONDITION_KEYS } from "./conditions";
import { chosenKeys, describeCondition, removeCondition, toggleOption } from "./selection";

describe("toggleOption", () => {
  it("선택지를 켜고 다시 누르면 끈다", () => {
    const on = toggleOption({}, "cuisine", "korean");
    expect(on).toEqual({ cuisine: ["korean"] });
    expect(toggleOption(on, "cuisine", "korean")).toEqual({});
  });

  it("같은 조건에서 여러 개를 고를 수 있다", () => {
    const s = toggleOption(toggleOption({}, "cuisine", "korean"), "cuisine", "chinese");
    expect(s).toEqual({ cuisine: ["korean", "chinese"] });
  });

  it("원래 객체를 바꾸지 않는다", () => {
    const before = { cuisine: ["korean"] as const };
    toggleOption(before, "cuisine", "chinese");
    expect(before).toEqual({ cuisine: ["korean"] });
  });
});

describe("질문 순서", () => {
  it("7개 조건을 정해진 순서대로 묻는다", () => {
    expect(CONDITION_KEYS).toEqual([
      "condition",
      "mealTime",
      "situation",
      "weather",
      "cuisine",
      "taste",
      "price",
    ]);
  });
});

describe("removeCondition / chosenKeys / describeCondition", () => {
  const s = { cuisine: ["korean", "chinese"], taste: ["spicy"] } as const;

  it("고른 조건을 질문 순서대로 돌려준다", () => {
    expect(chosenKeys(s)).toEqual(["cuisine", "taste"]);
  });

  it("조건 하나를 통째로 뺀다", () => {
    expect(removeCondition(s, "cuisine")).toEqual({ taste: ["spicy"] });
  });

  it("화면용 문구를 만든다", () => {
    expect(describeCondition(s, "cuisine")).toBe("종류: 한식, 중식");
  });
});
