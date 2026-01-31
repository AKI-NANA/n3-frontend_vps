/**
 * N3 i18n Context & Hook
 * 
 * React ContextとHookを使った多言語対応システム
 * - グローバルな言語状態管理
 * - 型安全な翻訳取得
 * - localStorage永続化
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import type { Language, TranslationKeys } from './types';
import { ja } from './translations/ja';
import { en } from './translations/en';

// ============================================================
// 定数
// ============================================================

const STORAGE_KEY = 'n3-language';
const DEFAULT_LANGUAGE: Language = 'ja';

// 翻訳辞書
const translations: Record<Language, TranslationKeys> = {
  ja,
  en,
};

// ============================================================
// Context型定義
// ============================================================

interface I18nContextValue {
  /** 現在の言語 */
  language: Language;
  /** 言語を設定 */
  setLanguage: (lang: Language) => void;
  /** 言語をトグル（ja ⇔ en） */
  toggleLanguage: () => void;
  /** 翻訳を取得 */
  t: TranslationKeys;
  /** キーを指定して翻訳を取得（ネスト対応） */
  translate: (key: string, fallback?: string) => string;
  /** 言語が日本語かどうか */
  isJapanese: boolean;
  /** 言語が英語かどうか */
  isEnglish: boolean;
}

// ============================================================
// Context
// ============================================================

const I18nContext = createContext<I18nContextValue | null>(null);

// ============================================================
// Provider
// ============================================================

export interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function I18nProvider({ children, defaultLanguage = DEFAULT_LANGUAGE }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  // クライアントサイドでのみlocalStorageから読み込み
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && (stored === 'ja' || stored === 'en')) {
      setLanguageState(stored);
    }
    setMounted(true);
  }, []);

  // 言語を設定
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    // HTML lang属性も更新
    document.documentElement.lang = lang;
  }, []);

  // 言語をトグル
  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'ja' ? 'en' : 'ja');
  }, [language, setLanguage]);

  // 翻訳オブジェクト
  const t = useMemo(() => translations[language], [language]);

  // ネストしたキーで翻訳を取得
  const translate = useCallback((key: string, fallback?: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return fallback || key;
      }
    }
    
    return typeof result === 'string' ? result : (fallback || key);
  }, [language]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    toggleLanguage,
    t,
    translate,
    isJapanese: language === 'ja',
    isEnglish: language === 'en',
  }), [language, setLanguage, toggleLanguage, t, translate]);

  // SSRでのハイドレーションエラーを防ぐ
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

/**
 * i18n Hookを使用
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, language, toggleLanguage } = useI18n();
 *   return (
 *     <button onClick={toggleLanguage}>
 *       {t.common.save} ({language})
 *     </button>
 *   );
 * }
 * ```
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

/**
 * 現在の言語のみを取得する軽量Hook
 */
export function useLanguage(): Language {
  const context = useContext(I18nContext);
  return context?.language || DEFAULT_LANGUAGE;
}

/**
 * 翻訳オブジェクトのみを取得する軽量Hook
 */
export function useTranslation(): TranslationKeys {
  const context = useContext(I18nContext);
  return context?.t || translations[DEFAULT_LANGUAGE];
}

// ============================================================
// Utility Functions
// ============================================================

/**
 * 言語に応じた値を返すユーティリティ
 */
export function localizedValue<T>(ja: T, en: T, language: Language): T {
  return language === 'ja' ? ja : en;
}

/**
 * 日付をローカライズ
 */
export function localizedDate(date: Date | string, language: Language): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * 数値をローカライズ（通貨）
 */
export function localizedCurrency(value: number, currency: 'JPY' | 'USD', language: Language): string {
  return new Intl.NumberFormat(language === 'ja' ? 'ja-JP' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(value);
}

/**
 * 数値をローカライズ（パーセント）
 */
export function localizedPercent(value: number, language: Language): string {
  return new Intl.NumberFormat(language === 'ja' ? 'ja-JP' : 'en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
  }).format(value / 100);
}
