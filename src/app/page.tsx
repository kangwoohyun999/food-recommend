export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight">오늘 뭐 먹지?</h1>
      <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        먹고 싶은 게 없는 날, 몇 가지만 고르면 오늘의 메뉴를 정해 드려요.
      </p>
      <button
        type="button"
        disabled
        className="h-12 rounded-full bg-foreground px-8 font-medium text-background opacity-50"
      >
        시작 (준비 중)
      </button>
    </main>
  );
}
