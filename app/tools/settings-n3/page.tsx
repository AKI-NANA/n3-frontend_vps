// app/tools/settings-n3/page.tsx
/**
 * Settings N3 - 設定管理統合ページ
 */

import { Suspense } from 'react';
import { SettingsN3PageLayout } from './layouts';
import { N3Loading } from '@/components/n3/container';
import { N3Flex } from '@/components/n3/container/n3-section';


function SettingsLoading() {
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

export default function SettingsN3Page() {
  return (
    <N3Flex
      data-theme="dark"
      direction="column"
      gap="none"
      style={{ height: 'calc(100vh - 60px)', overflow: 'hidden' }}
    >
      <Suspense fallback={<SettingsLoading />}>
        <SettingsN3PageLayout />
      </Suspense>
    </N3Flex>
  );
}
