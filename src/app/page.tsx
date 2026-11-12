import { getMenus } from "@/lib/menu/get-menus";
import { MenuFinder } from "./menu-finder";

export default async function Home() {
  const menus = await getMenus();
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-10 sm:py-16">
      <MenuFinder menus={menus} />
    </main>
  );
}
