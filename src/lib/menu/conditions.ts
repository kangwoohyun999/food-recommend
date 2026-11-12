/**
 * 조건과 선택지 (기획서 4.1).
 * 값(id)은 DB 태그와 URL에 쓰고, label은 화면에 보여 준다.
 * 적힌 순서가 질문 단계의 순서다.
 */
export const CONDITIONS = {
  condition: {
    label: "컨디션",
    question: "지금 컨디션은 어때요?",
    options: {
      hangover: "숙취",
      tired: "피곤함",
      stressed: "스트레스",
      sick: "몸이 안 좋음",
    },
  },
  mealTime: {
    label: "시간대",
    question: "언제 먹어요?",
    options: {
      breakfast: "아침",
      lunch: "점심",
      dinner: "저녁",
      lateNight: "야식",
    },
  },
  situation: {
    label: "인원·상황",
    question: "누구랑 먹어요?",
    options: {
      solo: "혼밥",
      date: "데이트",
      company: "회식",
      friends: "친구 모임",
    },
  },
  weather: {
    label: "날씨",
    question: "오늘 날씨는 어때요?",
    options: {
      rainy: "비 오는 날",
      cold: "추운 날",
      hot: "더운 날",
    },
  },
  cuisine: {
    label: "종류",
    question: "끌리는 종류가 있어요?",
    options: {
      korean: "한식",
      chinese: "중식",
      japanese: "일식",
      western: "양식",
    },
  },
  taste: {
    label: "맛",
    question: "어떤 맛이 당겨요?",
    options: {
      spicy: "매운 맛",
      mild: "담백한 맛",
    },
  },
  price: {
    label: "가격대",
    question: "1인 예산은 어느 정도예요?",
    options: {
      under10k: "1만원 이하",
      from10kTo20k: "1~2만원",
      over20k: "2만원 이상",
    },
  },
} as const;

export type ConditionKey = keyof typeof CONDITIONS;

export type OptionOf<K extends ConditionKey> =
  keyof (typeof CONDITIONS)[K]["options"];

export const CONDITION_KEYS = Object.keys(CONDITIONS) as ConditionKey[];

/** 사용자가 고른 조건. 고르지 않은 조건은 비워 두거나 빈 배열이면 거르지 않는다. */
export type Selection = { [K in ConditionKey]?: readonly OptionOf<K>[] };

/** 메뉴에 붙은 태그. 조건마다 해당하는 선택지 목록. */
export type MenuTags = { [K in ConditionKey]: readonly OptionOf<K>[] };

export type Menu = {
  id: string;
  name: string;
  tags: MenuTags;
};
