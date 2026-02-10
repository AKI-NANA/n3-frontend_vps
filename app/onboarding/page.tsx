// app/onboarding/page.tsx
/**
 * 🚀 Onboarding Page
 * 
 * Phase 4D: Self Onboarding
 * 
 * 機能:
 * - 新規ユーザーのセットアップウィザード
 * - 組織作成
 * - プラン選択
 * - 初期設定
 */

import { Metadata } from 'next';
import { OnboardingWizard } from './components/onboarding-wizard';

export const metadata: Metadata = {
  title: 'Welcome to N3 Empire OS',
  description: 'Set up your organization and get started',
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
