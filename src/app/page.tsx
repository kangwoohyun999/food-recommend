import { MenuFinder } from "./menu-finder";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-10 sm:py-16">
      <MenuFinder />
    </main>
  );
}
