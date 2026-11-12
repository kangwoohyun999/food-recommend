@AGENTS.md

## 프로젝트

"오늘 뭐 먹지" — 조건(컨디션·날씨·시간대·인원·상황·맛·종류·가격대)을 고르면 메뉴 후보 3개를 보여 주고 룰렛으로 정해 주는 웹 서비스.

- 기획: `음식메뉴추천_상세기획.md` (용어는 2장을 따른다: 메뉴, 조건, 컨디션, 태그, 후보, 룰렛)
- 기술: Next.js (App Router, `src/`) + Supabase + Vercel
- 추천 규칙은 하나의 함수에 모으고 Vitest로 검증한다 (기획 5장, 7.1)

## 작업 흐름 (Git)

- `main`에 직접 커밋하지 않는다. 작업마다 브랜치를 만든다 (예: `feat/03-recommend-rule`).
- 작업이 끝나고 typecheck·lint·test가 통과하면 **묻지 말고** 끝까지 진행한다:
  커밋 → push → `gh pr create` → CI 통과 확인(`gh pr checks --watch`) → `gh pr merge --merge --delete-branch` → 로컬 `main` 최신화.
- CI가 실패하면 머지하지 않고 원인을 고쳐서 다시 올린다.
- PR 본문에는 무엇을 했는지, 어떻게 확인했는지, 관련 티켓 번호(기획 8장)를 적는다.

## 명령어

- `npm run dev` — 개발 서버
- `npm run typecheck` / `npm run lint` / `npm test` — CI와 같은 검사
