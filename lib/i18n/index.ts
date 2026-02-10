/**
 * N3 i18n - 多言語対応システム
 * 
 * USAローンチに向けた国際化基盤
 * 
 * @example
 * ```tsx
 * // Providerで囲む（layout.tsx）
 * import { I18nProvider } from '@/lib/i18n';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <I18nProvider>
 *       {children}
 *     </I18nProvider>
 *   );
 * }
 * 
 * // コンポーネントで使用
 * import { useI18n, useTranslation } from '@/lib/i18n';
 * 
 * function MyComponent() {
 *   const { t, language, toggleLanguage } = useI18n();
 *   // または軽量版
 *   const t = useTranslation();
 *   
 *   return (
 *     <button onClick={toggleLanguage}>
 *       {t.common.save}
 *     </button>
 *   );
 * }
 * ```
 */

// Context & Hooks
export { 
  I18nProvider, 
  useI18n, 
  useLanguage, 
  useTranslation,
  localizedValue,
  localizedDate,
  localizedCurrency,
  localizedPercent,
} from './context';
export type { I18nProviderProps } from './context';

// Types
export type { Language, TranslationKeys, TranslationKey, FlattenKeys } from './types';

// Translations (直接アクセス用)
export { ja } from './translations/ja';
export { en } from './translations/en';
