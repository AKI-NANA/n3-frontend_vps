// app/tools/editing-n3/stocktake/page.tsx
/**
 * 棚卸しモード専用ページ
 * 
 * 外注さん向けの簡易版editing-n3
 * - マスタータブのみ表示
 * - 編集可能項目: 在庫数、保管場所、画像
 * - 他のタブ・機能は非表示
 * 
 * アクセスURL: /tools/editing-n3/stocktake?worker=担当者名
 */

'use client';

import { Suspense } from 'react';
import { StocktakePageContent } from './stocktake-page-content';

// Suspenseでラップ（useSearchParamsを使うため）
export default function StocktakePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--app-bg)' }}>
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-muted)' }}>読み込み中...</p>
        </div>
      </div>
    }>
      <StocktakePageContent />
    </Suspense>
  );
}
