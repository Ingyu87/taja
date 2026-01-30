import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "타자왕국 - 초등학생 한글 타자 연습",
  description: "AI와 함께하는 재미있는 한글 타자 연습! 동화, 시, 게임으로 즐겁게 배워요.",
  keywords: ["한글", "타자", "연습", "초등학생", "타자게임", "AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
