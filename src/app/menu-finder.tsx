"use client";

import { useState } from "react";
import type { ConditionKey, Menu, Selection } from "@/lib/menu/conditions";
import { filterMenus, recommend } from "@/lib/menu/recommend";
import { questionKeys, removeCondition, toggleOption } from "@/lib/menu/selection";
import { CandidateList } from "./candidate-list";
import { ConditionSetup } from "./condition-setup";
import { PickedMenu } from "./picked-menu";
import { QuestionStep } from "./question-step";
import { Roulette } from "./roulette";

type State =
  | { step: "setup" }
  | { step: "roulette" }
  | { step: "questions"; keys: ConditionKey[]; index: number }
  | { step: "result"; candidates: Menu[] }
  | { step: "picked"; candidates: Menu[]; menu: Menu };

/** 조건 설정 → 질문 → 후보 흐름을 관리한다 (기획서 4.1). */
export function MenuFinder({ menus }: { menus: Menu[] }) {
  const [state, setState] = useState<State>({ step: "setup" });
  /** 메인 화면에서 미리 고른 조건과 질문에서 고른 조건을 모두 담는다 */
  const [selection, setSelection] = useState<Selection>({});

  function showResult(next: Selection = selection) {
    setState({ step: "result", candidates: recommend(menus, next) });
  }

  function start() {
    const keys = questionKeys(selection);
    if (keys.length === 0) showResult();
    else setState({ step: "questions", keys, index: 0 });
  }

  function restart() {
    setSelection({});
    setState({ step: "setup" });
  }

  switch (state.step) {
    case "setup":
      return (
        <ConditionSetup
          preset={selection}
          onChange={setSelection}
          onStart={start}
          onRoulette={() => setState({ step: "roulette" })}
        />
      );

    case "roulette":
      return <Roulette menus={menus} onExit={restart} />;

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
          onBack={() => setState(index === 0 ? { step: "setup" } : { ...state, index: index - 1 })}
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
          onRemoveCondition={(key) => {
            const next = removeCondition(selection, key);
            setSelection(next);
            showResult(next);
          }}
          onRestart={restart}
        />
      );

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
