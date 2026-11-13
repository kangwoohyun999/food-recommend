/**
 * 메뉴 데이터를 한글 표(Markdown)로 출력한다. 태그를 눈으로 검수할 때 쓴다.
 *
 *   npm run menu:table                 # 화면에 출력
 *   npm run menu:table > menus.md      # 파일로 저장 (VS Code에서 미리보기)
 */
import { CONDITION_KEYS, CONDITIONS } from "../src/lib/menu/conditions";
import { MENU_DATA } from "../src/lib/menu/menu-data";

const header = ["메뉴", ...CONDITION_KEYS.map((key) => CONDITIONS[key].label)];
const rows = MENU_DATA.map((menu) => [
  menu.name,
  ...CONDITION_KEYS.map((key) => {
    const labels: Record<string, string> = CONDITIONS[key].options;
    const tags: readonly string[] = menu.tags[key];
    return tags.map((tag) => labels[tag]).join(", ") || "-";
  }),
]);

console.log(`메뉴 ${MENU_DATA.length}개\n`);
console.log(`| ${header.join(" | ")} |`);
console.log(`|${header.map(() => "---").join("|")}|`);
for (const row of rows) console.log(`| ${row.join(" | ")} |`);
