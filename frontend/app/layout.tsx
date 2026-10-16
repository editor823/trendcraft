import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrendCraft - AI 트렌드 클러스터링 & 메이커 대시보드',
  description: 'AI 트렌드 클러스터링 & 메이커 실행 아이디어 보드',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">{children}</body>
    </html>
  );
}
