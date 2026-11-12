"use client";

import { useState } from "react";
import type { Selection } from "@/lib/menu/conditions";
import { ConditionSetup } from "./condition-setup";

type Step = "setup" | "questions";

/** 조건 설정 → 질문 → 후보 흐름을 관리한다 (기획서 4.1). */
export function MenuFinder() {
  const [step, setStep] = useState<Step>("setup");
  const [preset, setPreset] = useState<Selection>({});

  if (step === "setup") {
    return <ConditionSetup preset={preset} onChange={setPreset} onStart={() => setStep("questions")} />;
  }

  // 티켓 05에서 질문 단계로 바꾼다
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted">질문 단계는 준비 중이에요.</p>
      <button type="button" onClick={() => setStep("setup")} className="text-accent underline">
        처음으로
      </button>
    </div>
  );
}
