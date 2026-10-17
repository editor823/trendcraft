'use client';

// ============================================================================
// TrendCraft: 테마 토글 버튼 컴포넌트 (Theme Toggle Button)
// File: frontend/components/ThemeToggle.tsx
// Description:
//   - Sun / Moon 아이콘 부드러운 회전 & 스케일 애니메이션
//   - Dark Mode ↔ Light Mode 원클릭 전환
//   - 접근성(ARIA) 및 툴팁 제공
// ============================================================================

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme, isMounted } = useTheme();

  // SSR 및 마운트 전 깜빡임 방지용 자리표시자
  if (!isMounted) {
    return (
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 ${className}`}
        aria-hidden="true"
      >
        <div className="h-4 w-4 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? '라이트 모드로 전환 (Light Mode)' : '다크 모드로 전환 (Dark Mode)'}
      title={isDark ? '☀️ 라이트 모드로 전환' : '🌙 다크 모드로 전환'}
      className={`group relative flex items-center gap-2 rounded-xl border p-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
        isDark
          ? 'border-slate-800 bg-slate-900/90 text-amber-400 hover:border-amber-500/50 hover:bg-slate-850 hover:shadow-lg hover:shadow-amber-500/10'
          : 'border-slate-200 bg-white text-indigo-600 hover:border-indigo-400 hover:bg-slate-50 hover:shadow-md'
      } ${className}`}
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        {/* 달 아이콘 (다크 모드 상태에서 회전 전환) */}
        <Moon
          className={`h-4 w-4 transition-all duration-300 transform ${
            isDark
              ? 'scale-0 -rotate-90 opacity-0 absolute'
              : 'scale-100 rotate-0 opacity-100 text-indigo-600'
          }`}
        />
        {/* 해 아이콘 (라이트 모드 상태에서 회전 전환) */}
        <Sun
          className={`h-4 w-4 transition-all duration-300 transform ${
            isDark
              ? 'scale-100 rotate-0 opacity-100 text-amber-400'
              : 'scale-0 rotate-90 opacity-0 absolute'
          }`}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-bold transition-colors">
          {isDark ? '라이트 모드' : '다크 모드'}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
