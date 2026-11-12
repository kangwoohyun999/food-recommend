import { createClient } from "@supabase/supabase-js";

/**
 * publishable key로 만든 Supabase 클라이언트.
 * 로그인이 없는 MVP에서는 메뉴 읽기만 하므로 이것 하나면 된다.
 * RLS가 읽기만 허용하므로 브라우저와 서버 어디서 써도 안전하다.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY가 없습니다. .env.example을 보고 .env.local을 만드세요.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
