// app/tools/editing/page.tsx
/**
 * Editing Page - エントリーポイント
 * 
 * このファイルは、アプリケーションのエントリーポイントとして機能します。
 * 全てのロジックとUIは EditingPageLayout に委譲されています。
 * 
 * 構造:
 * - page.tsx → EditingPageLayout.tsx → 各コンポーネント・フック
 * 
 * 使用フック:
 * - useProductData (データCRUD)
 * - useBatchProcess (一括処理)
 * - useBasicEdit (基本操作ハンドラー)
 * - useMirrorSelectionStore (選択状態 - 外部store)
 * - useHeaderPanel (ヘッダーパネル - 外部context)
 * 
 * 使用コンポーネント:
 * - ToolPanel (ツールバー)
 * - BasicEditTab (基本編集タブ)
 * - ProductModal, PasteModal, CSVUploadModal 等
 * - AIDataEnrichmentModal, AIMarketResearchModal, GeminiBatchModal
 * - HTMLPublishPanel, PricingStrategyPanel
 * - MarketplaceSelector
 */

'use client';

import { EditingPageLayout } from './components/layouts/editing-page-layout';

export default function EditingPage() {
  return <EditingPageLayout />;
}
