# Supabase · Vercel 연동

처음 한 번만 하면 된다. 비밀 키(secret key)는 채팅·코드·이슈에 붙이지 않는다.

## 1. Supabase 프로젝트 만들기

1. https://supabase.com 에 로그인 → **New project**
2. 이름(예: `food-recommend`), DB 비밀번호, 지역 **Northeast Asia (Seoul)** 을 고른다
3. 프로젝트가 준비될 때까지 1~2분 기다린다

## 2. 메뉴 테이블 만들기

1. 왼쪽 메뉴 **SQL Editor** → **New query**
2. [`supabase/migrations/20261112000000_create_menus.sql`](../supabase/migrations/20261112000000_create_menus.sql) 내용을 전부 붙여 넣고 **Run**
3. **Table Editor**에 `menus` 테이블이 보이면 성공

> 테이블 구조를 바꿀 때는 기존 파일을 고치지 말고 `supabase/migrations/`에 새 파일을 추가해서 같은 방법으로 실행한다.

## 3. 로컬 환경변수

1. **Project Settings → API Keys** 에서 값을 확인한다
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Publishable key (`sb_publishable_...`) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Secret key (`sb_secret_...`) → `SUPABASE_SECRET_KEY`
2. 레포 루트에서 `.env.example`을 `.env.local`로 복사하고 값을 채운다 (`.env.local`은 git에 올라가지 않는다)

## 4. 메뉴 넣기

```bash
npm run db:seed
```

`메뉴 213개를 넣었습니다. 지금 DB의 메뉴: 213개`가 나오면 성공. Table Editor에서도 확인할 수 있다.

메뉴나 태그를 고치려면 [`src/lib/menu/menu-data.ts`](../src/lib/menu/menu-data.ts)를 수정하고 `npm test`로 확인한 뒤 다시 `npm run db:seed`를 실행한다. 같은 이름의 메뉴는 덮어쓴다. 파일에서 지운 메뉴는 DB에서 자동으로 지워지지 않으니 Table Editor에서 지운다.

## 5. Vercel 배포

1. https://vercel.com 에 GitHub 계정으로 로그인 → **Add New → Project**
2. `food-recommend` 레포를 **Import**
3. **Environment Variables**에 아래 두 개만 넣는다
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. **Deploy**

`SUPABASE_SECRET_KEY`는 메뉴를 넣는 스크립트에만 쓰므로 Vercel에 넣지 않는다. 이후 `main`에 머지할 때마다 자동 배포된다.
