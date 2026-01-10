'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ============================================
// N3 Theme Provider
// ユーザー設定を管理し、すべてのコンポーネントに適用
// ============================================

// 設定の型定義
export type ThemeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ThemeStyle = 'modern' | 'flat' | 'glass' | 'neumorphism';
export type ThemeColor = 'dawn' | 'light' | 'dark' | 'cyber';
export type ThemeFont = 'system' | 'noto' | 'inter' | 'roboto';

export interface ThemeSettings {
  size: ThemeSize;
  style: ThemeStyle;
  color: ThemeColor;
  font: ThemeFont;
}

// デフォルト設定
const DEFAULT_SETTINGS: ThemeSettings = {
  size: 'md',
  style: 'modern',
  color: 'dawn',
  font: 'system',
};

// Context
interface ThemeContextType {
  settings: ThemeSettings;
  setSize: (size: ThemeSize) => void;
  setStyle: (style: ThemeStyle) => void;
  setColor: (color: ThemeColor) => void;
  setFont: (font: ThemeFont) => void;
  updateSettings: (updates: Partial<ThemeSettings>) => void;
  resetSettings: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// localStorage キー
const STORAGE_KEY = 'n3-theme-settings';

// ============================================
// Provider Component
// ============================================

interface ThemeProviderProps {
  children: ReactNode;
  /** 初期設定（localStorageより優先） */
  defaultSettings?: Partial<ThemeSettings>;
  /** localStorageを使用するか */
  persist?: boolean;
}

export function ThemeProvider({
  children,
  defaultSettings,
  persist = true,
}: ThemeProviderProps) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    // SSR対策: 初期値はデフォルト
    return { ...DEFAULT_SETTINGS, ...defaultSettings };
  });

  const [mounted, setMounted] = useState(false);

  // クライアントサイドでlocalStorageから復元
  useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.warn('[ThemeProvider] Failed to load settings:', e);
      }
    }
    setMounted(true);
  }, [persist]);

  // 設定変更時にlocalStorageに保存
  useEffect(() => {
    if (mounted && persist && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (e) {
        console.warn('[ThemeProvider] Failed to save settings:', e);
      }
    }
  }, [settings, mounted, persist]);

  // 個別の設定変更関数
  const setSize = useCallback((size: ThemeSize) => {
    setSettings(prev => ({ ...prev, size }));
  }, []);

  const setStyle = useCallback((style: ThemeStyle) => {
    setSettings(prev => ({ ...prev, style }));
  }, []);

  const setColor = useCallback((color: ThemeColor) => {
    setSettings(prev => ({ ...prev, color }));
  }, []);

  const setFont = useCallback((font: ThemeFont) => {
    setSettings(prev => ({ ...prev, font }));
  }, []);

  const updateSettings = useCallback((updates: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS, ...defaultSettings });
    if (persist && typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [defaultSettings, persist]);

  const value: ThemeContextType = {
    settings,
    setSize,
    setStyle,
    setColor,
    setFont,
    updateSettings,
    resetSettings,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div
        data-theme={settings.color}
        data-style={settings.style}
        data-size={settings.size}
        data-font={settings.font}
        className="n3-theme-root"
        style={{ minHeight: '100%' }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Optional: 設定のみ取得（変更関数不要な場合）
export function useThemeSettings(): ThemeSettings {
  const { settings } = useTheme();
  return settings;
}

// ============================================
// 設定選択肢（UI用）
// ============================================

export const THEME_OPTIONS = {
  size: [
    { value: 'xs', label: 'XS', description: '極小（視力が良い方向け）' },
    { value: 'sm', label: 'SM', description: '小' },
    { value: 'md', label: 'MD', description: '標準' },
    { value: 'lg', label: 'LG', description: '大' },
    { value: 'xl', label: 'XL', description: '特大（見やすさ重視）' },
  ],
  style: [
    { value: 'modern', label: 'Modern', description: '標準的なモダンスタイル' },
    { value: 'flat', label: 'Flat', description: 'フラットデザイン' },
    { value: 'glass', label: 'Glass', description: 'ガラス風の透明感' },
    { value: 'neumorphism', label: 'Neumorphism', description: '立体的なソフトUI' },
  ],
  color: [
    { value: 'dawn', label: 'Dawn', description: '暖かみのあるグラデーション' },
    { value: 'light', label: 'Light', description: '明るいライトモード' },
    { value: 'dark', label: 'Dark', description: 'ダークモード' },
    { value: 'cyber', label: 'Cyber', description: '黒ベースのサイバー風' },
  ],
  font: [
    { value: 'system', label: 'System', description: 'システムフォント' },
    { value: 'noto', label: 'Noto Sans', description: 'Noto Sans JP' },
    { value: 'inter', label: 'Inter', description: 'Inter（英語向け）' },
    { value: 'roboto', label: 'Roboto', description: 'Roboto' },
  ],
} as const;

export default ThemeProvider;
