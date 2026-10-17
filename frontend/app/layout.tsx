import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

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
    <html lang="ko" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedTheme = localStorage.getItem('trendcraft_theme_mode');
                if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased min-h-screen transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

