-- 메뉴 테이블 (기획서 4.4)
-- 태그 값은 src/lib/menu/conditions.ts의 선택지 id와 같아야 한다.
-- 선택지를 바꾸면 이 check 제약도 새 마이그레이션으로 함께 바꾼다.

create table public.menus (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,

  -- 메뉴마다 하나
  cuisine text not null
    check (cuisine in ('korean', 'chinese', 'japanese', 'western')),
  price text not null
    check (price in ('under10k', 'from10kTo20k', 'over20k')),

  -- 메뉴마다 0개 이상
  taste text[] not null default '{}'
    check (taste <@ array['spicy', 'mild']),
  condition text[] not null default '{}'
    check (condition <@ array['hangover', 'tired', 'stressed', 'sick']),
  weather text[] not null default '{}'
    check (weather <@ array['rainy', 'cold', 'hot']),
  meal_time text[] not null default '{}'
    check (meal_time <@ array['breakfast', 'lunch', 'dinner', 'lateNight']),
  situation text[] not null default '{}'
    check (situation <@ array['solo', 'date', 'company', 'friends']),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.menus is '추천 대상 메뉴. 비회원도 읽을 수 있고, 쓰기는 운영자(secret key)만 한다.';

-- 누구나 읽기만 할 수 있다. 쓰기 정책이 없으므로 publishable key로는 쓸 수 없다.
alter table public.menus enable row level security;

create policy "누구나 메뉴를 읽을 수 있다"
  on public.menus for select
  to anon, authenticated
  using (true);

grant select on public.menus to anon, authenticated;
grant select, insert, update, delete on public.menus to service_role;
