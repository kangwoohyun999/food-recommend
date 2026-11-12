import type { SupabaseClient } from "@supabase/supabase-js";
import type { Menu, MenuTags } from "./conditions";

/** public.menus 테이블의 한 행 (supabase/migrations 참고) */
export type MenuRow = {
  id: string;
  name: string;
  cuisine: MenuTags["cuisine"][number];
  price: MenuTags["price"][number];
  taste: MenuTags["taste"];
  condition: MenuTags["condition"];
  weather: MenuTags["weather"];
  meal_time: MenuTags["mealTime"];
  situation: MenuTags["situation"];
};

/** DB에 넣을 때 쓰는 모양. id는 DB가 만든다. */
export type MenuInsert = Omit<MenuRow, "id">;

export type MenuSeed = Omit<Menu, "id">;

export function toMenu(row: MenuRow): Menu {
  return {
    id: row.id,
    name: row.name,
    tags: {
      cuisine: [row.cuisine],
      price: [row.price],
      taste: row.taste,
      condition: row.condition,
      weather: row.weather,
      mealTime: row.meal_time,
      situation: row.situation,
    },
  };
}

export function toInsert(menu: MenuSeed): MenuInsert {
  const { cuisine, price } = menu.tags;
  if (cuisine.length !== 1 || price.length !== 1) {
    throw new Error(`${menu.name}: 종류와 가격대는 하나씩이어야 합니다`);
  }
  return {
    name: menu.name,
    cuisine: cuisine[0],
    price: price[0],
    taste: menu.tags.taste,
    condition: menu.tags.condition,
    weather: menu.tags.weather,
    meal_time: menu.tags.mealTime,
    situation: menu.tags.situation,
  };
}

const MENU_COLUMNS = "id, name, cuisine, price, taste, condition, weather, meal_time, situation";

/** 전체 메뉴를 읽는다. 추천 규칙(recommend)에 그대로 넘기면 된다. */
export async function fetchMenus(supabase: SupabaseClient): Promise<Menu[]> {
  const { data, error } = await supabase.from("menus").select(MENU_COLUMNS).order("name");
  if (error) throw new Error(`메뉴를 불러오지 못했습니다: ${error.message}`);
  return (data as MenuRow[]).map(toMenu);
}
