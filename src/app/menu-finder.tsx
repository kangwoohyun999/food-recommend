"use client";

import { useState } from "react";
import { CONDITION_KEYS, type ConditionKey, type Menu, type Selection } from "@/lib/menu/conditions";
import { filterMenus, recommend } from "@/lib/menu/recommend";
import { removeCondition, toggleOption } from "@/lib/menu/selection";
import { CandidateList } from "./candidate-list";
import { Intro } from "./intro";
import { PickedMenu } from "./picked-menu";
import { QuestionStep } from "./question-step";
import { Roulette } from "./roulette";

type State =
  | { step: "intro" }
  /** 조건 없이 전체 메뉴로 돌리는 룰렛 */
  | { step: "roulette" }
  | { step: "questions"; keys: ConditionKey[]; index: number }
  | { step: "result"; candidates: Menu[] }
  /** 후보 화면에서 조건에 맞는 메뉴로 돌리는 룰렛 */
  | { step: "matchRoulette"; candidates: Menu[] }
  | { step: "picked"; candidates: Menu[]; menu: Menu };

/** 첫 화면 → 질문 → 후보 흐름을 관리한다 (기획서 4.1). */
export function MenuFinder({ menus }: { menus: Menu[] }) {
  const [state, setState] = useState<State>({ step: "intro" });
  /** 질문에서 고른 조건 */
  const [selection, setSelection] = useState<Selection>({});

  function showResult(next: Selection = selection) {
    setState({ step: "result", candidates: recommend(menus, next) });
  }

  function restart() {
    setSelection({});
    setState({ step: "intro" });
  }

  switch (state.step) {
    case "intro":
      return (
        <Intro
          onStart={() => setState({ step: "questions", keys: CONDITION_KEYS, index: 0 })}
          onRoulette={() => setState({ step: "roulette" })}
        />
      );

    case "roulette":
      return <Roulette menus={menus} exitLabel="처음으로" onExit={restart} />;

    case "questions": {
      const { keys, index } = state;
      const key = keys[index];
      return (
        <QuestionStep
          key={key}
          conditionKey={key}
          index={index}
          total={keys.length}
          selected={selection[key] ?? []}
          onToggle={(option) => setSelection((s) => toggleOption(s, key, option))}
          onNext={() =>
            index + 1 < keys.length ? setState({ ...state, index: index + 1 }) : showResult()
          }
          onBack={() => (index === 0 ? restart() : setState({ ...state, index: index - 1 }))}
          onFinish={() => showResult()}
        />
      );
    }

    case "result":
      return (
        <CandidateList
          selection={selection}
          candidates={state.candidates}
          matchCount={filterMenus(menus, selection).length}
          onPick={(menu) => setState({ step: "picked", candidates: state.candidates, menu })}
          onReroll={() => showResult()}
          onRoulette={() => setState({ step: "matchRoulette", candidates: state.candidates })}
          onRemoveCondition={(key) => {
            const next = removeCondition(selection, key);
            setSelection(next);
            showResult(next);
          }}
          onRestart={restart}
        />
      );

    case "matchRoulette": {
      const matches = filterMenus(menus, selection);
      return (
        <Roulette
          menus={matches}
          caption={`조건에 맞는 메뉴 ${matches.length}개 중에서`}
          exitLabel="후보로 돌아가기"
          onExit={() => setState({ step: "result", candidates: state.candidates })}
        />
      );
    }

    case "picked":
      return (
        <PickedMenu
          menu={state.menu}
          onBack={() => setState({ step: "result", candidates: state.candidates })}
          onRestart={restart}
        />
      );
  }
}
