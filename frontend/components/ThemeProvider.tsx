'use client';

// ============================================================================
// TrendCraft: 테마 상태 관리 프로바이더 (Dark / Light Mode Theme Provider)
// File: frontend/components/ThemeProvider.tsx
// Description:
//   - 사용자 선호 테마('light' | 'dark')를 localStorage에 안전하게 보관 및 동기화
//   - document.documentElement에 .dark / .light 클래스를 즉시 반영
//   - 부드러운 전환과 hydration mismatch 방지
// ============================================================================

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isMounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
  isMounted: false,
});

const THEME_STORAGE_KEY = 'trendcraft_theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // 클라이언트 마운트 시 저장된 테마 또는 시스템 선호도 적용
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
        applyThemeClass(savedTheme);
      } else {
        // 기본값: 다크 모드 (TrendCraft 정체성)
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme: ThemeMode = prefersDark ? 'dark' : 'dark';
        setThemeState(initialTheme);
        applyThemeClass(initialTheme);
      }
    } catch {
      // localStorage 접근 불가 환경 대비 fallback
      setThemeState('dark');
      applyThemeClass('dark');
    }
  }, []);

  const applyThemeClass = (targetTheme: ThemeMode) => {
    const root = document.documentElement;
    if (targetTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyThemeClass(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
      isMounted,
    }),
    [theme, isMounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
