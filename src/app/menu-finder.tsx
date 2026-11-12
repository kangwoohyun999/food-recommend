"use client";

import { useState } from "react";
import type { ConditionKey, Selection } from "@/lib/menu/conditions";
import { chosenKeys, describeCondition, questionKeys, toggleOption } from "@/lib/menu/selection";
import { ConditionSetup } from "./condition-setup";
import { QuestionStep } from "./question-step";

type State =
  | { step: "setup" }
  | { step: "questions"; keys: ConditionKey[]; index: number }
  | { step: "result" };

/** 조건 설정 → 질문 → 후보 흐름을 관리한다 (기획서 4.1). */
export function MenuFinder() {
  const [state, setState] = useState<State>({ step: "setup" });
  /** 메인 화면에서 미리 고른 조건과 질문에서 고른 조건을 모두 담는다 */
  const [selection, setSelection] = useState<Selection>({});

  function start() {
    const keys = questionKeys(selection);
    setState(keys.length === 0 ? { step: "result" } : { step: "questions", keys, index: 0 });
  }

  function restart() {
    setSelection({});
    setState({ step: "setup" });
  }

  if (state.step === "setup") {
    return <ConditionSetup preset={selection} onChange={setSelection} onStart={start} />;
  }

  if (state.step === "questions") {
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
          setState(index + 1 < keys.length ? { ...state, index: index + 1 } : { step: "result" })
        }
        onBack={() => setState(index === 0 ? { step: "setup" } : { ...state, index: index - 1 })}
        onFinish={() => setState({ step: "result" })}
      />
    );
  }

  // 티켓 06에서 후보 3개 화면으로 바꾼다
  const chosen = chosenKeys(selection);
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="font-bold">고른 조건</p>
      <ul className="text-muted">
        {chosen.length === 0 ? <li>조건 없음</li> : chosen.map((k) => <li key={k}>{describeCondition(selection, k)}</li>)}
      </ul>
      <p className="text-muted">후보 화면은 준비 중이에요.</p>
      <button type="button" onClick={restart} className="text-accent underline">
        처음으로
      </button>
    </div>
  );
}
