import { cacheLife } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public-client";
import { fetchMenus } from "./db";

/**
 * 서버에서 전체 메뉴를 읽는다. 메뉴는 `npm run db:seed`로만 바뀌므로 몇 시간 캐시한다.
 * seed 후 바로 반영하려면 Vercel에서 다시 배포한다.
 */
export async function getMenus() {
  "use cache";
  cacheLife("hours");
  return fetchMenus(createPublicClient());
}
