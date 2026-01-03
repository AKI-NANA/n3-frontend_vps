// app/tools/operations-n3/page.tsx
/**
 * Operations N3 - 統合オペレーション管理ページ
 * 受注・出荷・問い合わせを一元管理
 *
 * N3デザインシステム準拠
 * - 3層アーキテクチャ: Presentational / Container / Layout
 * - パフォーマンス最適化: React.memo, useMemo, useCallback
 * - マルチマーケットプレイス対応
 */

import { Suspense } from 'react';
import { OperationsN3PageLayout } from './layouts';
import { N3Loading } from '@/components/n3/container';
import { N3Flex } from '@/components/n3/container/n3-section';


// ローディングコンポーネント（N3Loading使用）
function OperationsLoading() {
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

export default function OperationsN3Page() {
  return (
    <N3Flex
      data-theme="dark"
      direction="column"
      gap="none"
      style={{ height: 'calc(100vh - 60px)', overflow: 'hidden' }}
    >
      <Suspense fallback={<OperationsLoading />}>
        <OperationsN3PageLayout />
      </Suspense>
    </N3Flex>
  );
}
