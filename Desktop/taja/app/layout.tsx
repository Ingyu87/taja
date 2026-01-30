import type { Metadata } from "next";
import { Gowun_Dodum } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";

const gowunDodum = Gowun_Dodum({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gowun-dodum",
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
      <body className={`${gowunDodum.variable} antialiased`} suppressHydrationWarning>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
