/** 서비스 로고 (src/app/icon.svg와 같은 그림) */
export function AppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="14" fill="#ea580c" />
      <path
        d="M25 6c-2.5 3 2.5 5 0 8M39 6c-2.5 3 2.5 5 0 8"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".8"
      />
      <path d="M15 31a17 13 0 0 1 34 0z" fill="#fff7ed" />
      <path d="M10 31h44a22 20 0 0 1-44 0z" fill="#fff" />
      <rect x="24" y="49" width="16" height="5" rx="2" fill="#fff" />
    </svg>
  );
}
