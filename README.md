# food-recommend — 오늘 뭐 먹지

뭘 먹고 싶은지 모르는 날, 컨디션·날씨·상황을 하나씩 고르면 조건에 맞는 메뉴 후보 3개를 보여 주고 룰렛으로 정해 주는 웹 서비스.

상세 기획은 [음식메뉴추천_상세기획.md](음식메뉴추천_상세기획.md)를 본다.

## 기술

Next.js 16 (App Router) · Tailwind CSS 4 · Supabase · Vercel · Vitest

## 로컬 실행

Node.js 24 이상이 필요하다.

```bash
npm install
cp .env.example .env.local   # Supabase 값 채우기
npm run dev                  # http://localhost:3000
```

## 검사

```bash
npm run typecheck
npm run lint
npm test
```
