/**
 * N3LanguageSwitch - Presentational Component
 * 
 * 言語切替ボタン
 */

'use client';

import { memo } from 'react';
import { Globe } from 'lucide-react';

export type Language = 'ja' | 'en';

export interface N3LanguageSwitchProps {
  language: Language;
  onToggle?: () => void;
  className?: string;
}

export const N3LanguageSwitch = memo(function N3LanguageSwitch({
  language,
  onToggle,
  className = '',
}: N3LanguageSwitchProps) {
  const displayText = language === 'ja' ? 'EN' : 'JA';
  const title = language === 'ja' ? 'Switch to English' : '日本語に切り替え';

  return (
    <button
      onClick={onToggle}
      className={`n3-lang-switch ${className}`}
      title={title}
    >
      <Globe />
      <span>{displayText}</span>
    </button>
  );
});

N3LanguageSwitch.displayName = 'N3LanguageSwitch';
