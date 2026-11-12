import { describe, expect, it } from "vitest";
import {
  chosenKeys,
  describeCondition,
  questionKeys,
  removeCondition,
  toggleOption,
} from "./selection";

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

describe("questionKeys", () => {
  it("아무것도 안 골랐으면 7개 조건을 질문 순서대로 모두 묻는다", () => {
    expect(questionKeys({})).toEqual([
      "condition",
      "mealTime",
      "situation",
      "weather",
      "cuisine",
      "taste",
      "price",
    ]);
  });

  it("미리 고른 조건은 건너뛴다", () => {
    expect(questionKeys({ condition: ["hangover"], price: ["under10k"] })).toEqual([
      "mealTime",
      "situation",
      "weather",
      "cuisine",
      "taste",
    ]);
  });

  it("빈 배열은 고르지 않은 것으로 본다", () => {
    expect(questionKeys({ condition: [] })).toContain("condition");
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
