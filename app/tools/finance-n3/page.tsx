// app/tools/finance-n3/page.tsx
/**
 * Finance N3 - 会計管理統合ページ
 */

import { Suspense } from 'react';
import { FinanceN3PageLayout } from './layouts';
import { N3Loading } from '@/components/n3/container';
import { N3Flex } from '@/components/n3/container/n3-section';


function FinanceLoading() {
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

export default function FinanceN3Page() {
  return (
    <N3Flex
      data-theme="dark"
      direction="column"
      gap="none"
      style={{ height: 'calc(100vh - 60px)', overflow: 'hidden' }}
    >
      <Suspense fallback={<FinanceLoading />}>
        <FinanceN3PageLayout />
      </Suspense>
    </N3Flex>
  );
}
