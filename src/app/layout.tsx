import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "700"],
  // 한글 글꼴 파일이 커서 미리 불러오지 않는다
  preload: false,
});

export const metadata: Metadata = {
  title: "오늘 뭐 먹지",
  description: "컨디션·날씨·상황을 고르면 오늘의 메뉴를 추천해 주는 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
