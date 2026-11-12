/**
 * src/lib/menu/menu-data.ts의 메뉴를 Supabase menus 테이블에 넣는다.
 * 이름이 같은 메뉴는 태그를 덮어쓴다 (여러 번 돌려도 안전).
 *
 *   npm run db:seed
 *
 * .env.local에 NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SECRET_KEY가 있어야 한다.
 */
import { createClient } from "@supabase/supabase-js";
import { toInsert } from "../src/lib/menu/db";
import { MENU_DATA } from "../src/lib/menu/menu-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY를 .env.local에 넣어 주세요.");
  process.exit(1);
}

const supabase = createClient(url, secretKey, { auth: { persistSession: false } });

const rows = MENU_DATA.map((menu) => ({ ...toInsert(menu), updated_at: new Date().toISOString() }));

const { error } = await supabase.from("menus").upsert(rows, { onConflict: "name" });
if (error) {
  console.error("메뉴 입력 실패:", error.message);
  process.exit(1);
}

const { count, error: countError } = await supabase
  .from("menus")
  .select("*", { count: "exact", head: true });
if (countError) {
  console.error("개수 확인 실패:", countError.message);
  process.exit(1);
}

console.log(`메뉴 ${rows.length}개를 넣었습니다. 지금 DB의 메뉴: ${count}개`);
if (count !== rows.length) {
  console.log("DB에 파일에 없는 메뉴가 있습니다. 필요 없으면 Supabase 대시보드에서 지우세요.");
}
