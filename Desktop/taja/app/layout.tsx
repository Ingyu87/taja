import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://taja.vercel.app'),
  title: "타자왕국 - 초등학생 한글 타자 연습",
  description: "AI와 함께하는 재미있는 한글 타자 연습! 게임, 스토리로 즐겁게 배워요.",
  keywords: ["한글", "타자", "연습", "초등학생", "타자게임", "AI", "타자왕국"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://taja.vercel.app",
    title: "타자왕국 👑",
    description: "AI와 함께하는 초등학생 한글 타자 연습",
    siteName: "타자왕국",
  },
  twitter: {
    card: "summary_large_image",
    title: "타자왕국 👑",
    description: "AI와 함께하는 초등학생 한글 타자 연습",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} antialiased`} suppressHydrationWarning>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
