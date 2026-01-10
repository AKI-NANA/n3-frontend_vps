// components/n3/core.ts
/**
 * N3 Core Components - 最小限の必須コンポーネント
 * 
 * 全ページで使用する基本コンポーネントのみ
 * これ以外は必要なファイルから直接インポートすること
 */

// ============================================================
// Presentational (基本UI)
// ============================================================
export { N3Button } from './presentational/n3-button';
export { N3Input } from './presentational/n3-input';
export { N3Select } from './presentational/n3-select';
export { N3Checkbox } from './presentational/n3-checkbox';
export { N3Badge } from './presentational/n3-badge';
export { N3TextArea, N3TextArea as N3Textarea } from './presentational/n3-text-area';
export { N3Loading } from './presentational/n3-loading';
export { N3Skeleton, N3SkeletonText } from './presentational/n3-skeleton';

// ============================================================
// Container (基本レイアウト)
// ============================================================
export { N3Modal, N3ConfirmModal } from './container/n3-modal';
export { N3Pagination } from './container/n3-pagination';
export { N3Tabs, N3TabsRoot, N3TabsList, N3TabsTrigger, N3TabsContent } from './container/n3-tabs';
export { N3ToastContainer, useToast } from './container/n3-toast';

// ============================================================
// Layout (ページ構成)
// ============================================================
export { N3PageLayout } from './layout/n3-page-layout';
export { N3Footer } from './layout/n3-footer';
