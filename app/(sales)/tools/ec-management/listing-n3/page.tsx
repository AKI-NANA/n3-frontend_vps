// app/tools/listing-n3/page.tsx
/**
 * Listing N3 - 出品管理統合ページ
 * SEO最適化・価格戦略・一括出品を一元管理
 *
 * N3デザインシステム準拠
 * - 3層アーキテクチャ: Presentational / Container / Layout
 * - パフォーマンス最適化: React.memo, useMemo, useCallback
 * - マルチマーケットプレイス対応
 */

import { Suspense } from 'react';
import { ListingN3PageLayout } from './layouts';
import { N3Loading } from '@/components/n3/container';
import { N3Flex } from '@/components/n3/container/n3-section';


// ローディングコンポーネント（N3Loading使用）
function ListingLoading() {
  return (
    <N3Flex
      direction="column"
      justify="center"
      align="center"
      style={{ height: '100%', background: 'var(--bg)' }}
    >
      <N3Loading size="lg" text="読み込み中..." centered />
    </N3Flex>
  );
}

export default function ListingN3Page() {
  return (
    <N3Flex
      data-theme="dark"
      direction="column"
      gap="none"
      style={{ height: 'calc(100vh - 60px)', overflow: 'hidden' }}
    >
      <Suspense fallback={<ListingLoading />}>
        <ListingN3PageLayout />
      </Suspense>
    </N3Flex>
  );
}
