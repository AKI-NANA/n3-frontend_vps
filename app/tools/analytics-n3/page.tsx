// app/tools/analytics-n3/page.tsx
/**
 * Analytics N3 - 分析ダッシュボード統合ページ
 * 売上・利益・AI品質管理を一元表示
 */

import { Suspense } from 'react';
import { AnalyticsN3PageLayout } from './layouts';
import { N3Loading } from '@/components/n3/container';
import { N3Flex } from '@/components/n3/container/n3-section';


function AnalyticsLoading() {
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

export default function AnalyticsN3Page() {
  return (
    <N3Flex
      data-theme="dark"
      direction="column"
      gap="none"
      style={{ height: 'calc(100vh - 60px)', overflow: 'hidden' }}
    >
      <Suspense fallback={<AnalyticsLoading />}>
        <AnalyticsN3PageLayout />
      </Suspense>
    </N3Flex>
  );
}
