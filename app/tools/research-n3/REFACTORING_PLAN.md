# Research N3 リファクタリング計画書

## 📋 概要

**目的**: editing-n3の完全なレイアウト構造をresearch-n3に移植し、11個のL3フィルタータブと動的ツールパネル切り替えを実装する。

**元ファイル**: `/app/tools/editing-n3/components/layouts/EditingN3PageLayout.tsx` (1600行、97KB)

**ターゲット**: `/app/tools/research-n3/components/layouts/ResearchN3PageLayout.tsx`

---

## 🎯 Phase 1: 名前空間の変換

### 1-1. コンポーネント名の置換

```typescript
// Before
export function EditingN3PageLayout() {
  ...
}

// After
export function ResearchN3PageLayout() {
  ...
}
```

### 1-2. データ型の置換

| editing-n3 | research-n3 | 説明 |
|---|---|---|
| `Product` | `ResearchItem` | メインデータ型 |
| `InventoryProduct` | `ResearchItem` | 棚卸し用データ型も統合 |
| `ListFilterType` | `ResearchFilterType` | フィルター型 |

### 1-3. フックの置換

```typescript
// Before (editing-n3)
import { useInventoryData, useInventorySync, ... } from '../../hooks';

const inventoryData = useInventoryData();

// After (research-n3)
import { useResearchIntegrated } from '../../hooks/useResearchIntegrated';

const { 
  items, stats, isLoading, error, 
  currentPage, pageSize, totalPages, 
  setPage, selectedIds, toggleSelect, ...
} = useResearchIntegrated();
```

---

## 🗂️ Phase 2: L3フィルタータブの拡張

### 2-1. 現在の構成 (editing-n3: 12個)

```typescript
const FILTER_TABS = [
  // メイングループ (5個)
  { id: 'all', label: '全商品', group: 'main' },
  { id: 'draft', label: '下書き', group: 'main' },
  { id: 'data_editing', label: 'データ編集', group: 'main' },
  { id: 'approval_pending', label: '承認待ち', group: 'main' },
  { id: 'active_listings', label: '出品中', group: 'main' },
  
  // 棚卸しグループ (4個)
  { id: 'in_stock', label: '有在庫', group: 'inventory', customToolPanel: true },
  { id: 'variation', label: 'バリエーション', group: 'inventory', customToolPanel: true },
  { id: 'set_products', label: 'セット品', group: 'inventory', customToolPanel: true },
  { id: 'in_stock_master', label: 'マスター', group: 'inventory', customToolPanel: true },
  
  // ステータスグループ (3個)
  { id: 'back_order_only', label: '無在庫', group: 'status' },
  { id: 'out_of_stock', label: '在庫0', group: 'status' },
  { id: 'delisted_only', label: '出品停止中', group: 'status' },
];
```

### 2-2. 新しい構成 (research-n3: 11個)

```typescript
type FilterTabId = 
  | 'all' | 'new' | 'analyzing' | 'approved'  // ステータスグループ (4個)
  | 'watching' | 'alert'                      // 刈り取りグループ (2個)
  | 'yahoo' | 'amazon' | 'rakuten' | 'buyma'  // 仕入元グループ (4個)
  | 'supplier';                               // その他 (1個)

const FILTER_TABS = [
  // ステータスグループ (4個) - 既存
  { id: 'all', label: '全件', group: 'status' },
  { id: 'new', label: '新規', group: 'status' },
  { id: 'analyzing', label: '分析中', group: 'status' },
  { id: 'approved', label: '承認済', group: 'status' },
  
  // 刈り取りグループ (2個) - 既存
  { id: 'watching', label: '刈取監視', group: 'karitori' },
  { id: 'alert', label: 'アラート', group: 'karitori' },
  
  // 仕入元グループ (4個) - 新規
  { id: 'yahoo', label: 'Yahoo', group: 'source' },
  { id: 'amazon', label: 'Amazon', group: 'source' },
  { id: 'rakuten', label: '楽天', group: 'source' },
  { id: 'buyma', label: 'BUYMA', group: 'source' },
  
  // その他 (1個) - 既存
  { id: 'supplier', label: '仕入先', group: 'other' },
];
```

### 2-3. フィルターバーのレンダリング

```typescript
<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
  {/* ステータスグループ */}
  {FILTER_TABS.filter(t => t.group === 'status').map((tab) => (
    <N3FilterTab
      key={tab.id}
      id={tab.id}
      label={tab.label}
      count={getTabCount(tab.id)}
      active={activeFilter === tab.id}
      onClick={() => handleFilterChange(tab.id)}
    />
  ))}
  
  <N3Divider orientation="vertical" style={{ height: 20, margin: '0 8px' }} />
  
  {/* 刈り取りグループ */}
  {FILTER_TABS.filter(t => t.group === 'karitori').map(...)}
  
  <N3Divider orientation="vertical" />
  
  {/* 仕入元グループ */}
  {FILTER_TABS.filter(t => t.group === 'source').map(...)}
  
  <N3Divider orientation="vertical" />
  
  {/* その他 */}
  {FILTER_TABS.filter(t => t.group === 'other').map(...)}
</div>
```

---

## 🔧 Phase 3: ツールパネルの動的切り替え

### 3-1. getPanelContent() ロジック

```typescript
const getPanelContent = (tabId: PanelTabId | null) => {
  if (tabId !== 'tools') return null;
  
  switch (activeFilter) {
    // 既存ツールパネル
    case 'watching':
    case 'alert':
      return <KaritoriToolPanel {...props} />;
      
    case 'supplier':
      return <SupplierToolPanel {...props} />;
      
    case 'approved':
      return <ApprovalToolPanel {...props} />;
      
    // 新規ツールパネル
    case 'amazon':
      return <AmazonResearchToolPanel {...props} />;
      
    case 'rakuten':
      return <RakutenResearchToolPanel {...props} />;
      
    case 'buyma':
      return <BuymaResearchToolPanel {...props} />;
      
    case 'yahoo':
      // Yahoo検索はデフォルトのResearchToolPanelを使用
      return <ResearchToolPanel {...props} />;
      
    default:
      return <ResearchToolPanel {...props} />;
  }
};
```

### 3-2. 新規ツールパネルのインターフェース

#### RakutenResearchToolPanel.tsx

```typescript
export interface RakutenResearchToolPanelProps {
  stats: {
    total: number;
    highMargin: number;       // 高利益率商品数
    lowBSR: number;           // 低BSR商品数
    pointEligible: number;    // ポイント対象商品数
  };
  loading?: boolean;
  selectedCount: number;
  onRefresh: () => void;
  onSearch: () => void;           // 楽天商品検索
  onCheckBSR: () => void;         // BSRチェック
  onCalculateProfit: () => void;  // 利益計算
  onExport: () => void;
}
```

#### BuymaResearchToolPanel.tsx

```typescript
export interface BuymaResearchToolPanelProps {
  stats: {
    total: number;
    drafted: number;          // 下書き
    published: number;        // 公開済み
    avgMargin: number;        // 平均利益率
  };
  loading?: boolean;
  selectedCount: number;
  onRefresh: () => void;
  onSimulate: () => void;         // 利益シミュレーション
  onPublish: () => void;          // BUYMA出品
  onUpdateSupplier: () => void;   // サプライヤー更新
  onExport: () => void;
}
```

#### BatchResearchToolPanel.tsx

```typescript
export interface BatchResearchToolPanelProps {
  stats: {
    totalJobs: number;
    running: number;
    completed: number;
    pending: number;
  };
  loading?: boolean;
  selectedCount: number;
  onCreateJob: () => void;        // 新規ジョブ作成
  onPauseJob: () => void;         // ジョブ一時停止
  onResumeJob: () => void;        // ジョブ再開
  onDeleteJob: () => void;        // ジョブ削除
  onViewResults: () => void;      // 結果表示
}
```

---

## 📊 Phase 4: データフロー調整

### 4-1. 主要なデータフックの変更

| editing-n3 | research-n3 | 対応 |
|---|---|---|
| `useInventoryData()` | `useResearchIntegrated()` | 完全置き換え |
| `useInventorySync()` | 不要（統合済み） | - |
| `useVariationCreation()` | 不要 | - |
| `useSetCreation()` | 不要 | - |
| `useTabCounts()` | `useResearchIntegrated().stats` | 内包 |

### 4-2. useResearchIntegrated() の期待インターフェース

```typescript
export function useResearchIntegrated() {
  return {
    // データ
    items: ResearchItem[],
    stats: {
      total: number,
      new: number,
      analyzing: number,
      approved: number,
      watching: number,
      alert: number,
      yahoo: number,
      amazon: number,
      rakuten: number,
      buyma: number,
      supplier: number,
    },
    
    // 状態
    isLoading: boolean,
    error: string | null,
    
    // ページネーション
    currentPage: number,
    pageSize: number,
    totalPages: number,
    setPage: (page: number) => void,
    
    // 選択
    selectedIds: string[],
    toggleSelect: (id: string) => void,
    selectAll: () => void,
    clearSelection: () => void,
    
    // アクション
    approveItem: (id: string) => Promise<void>,
    rejectItem: (id: string) => Promise<void>,
    refreshData: () => Promise<void>,
    
    // フィルター
    activeFilter: string,
    setActiveFilter: (filter: string) => void,
  };
}
```

### 4-3. モックデータ例

```typescript
// MOCK_AMAZON_ITEMS
const MOCK_AMAZON_ITEMS: ResearchItem[] = [
  {
    id: 'amz-1',
    source: 'Amazon',
    title: 'Sony WH-1000XM5 ヘッドホン',
    englishTitle: 'Sony WH-1000XM5 Headphones',
    current_price: 39800,
    profit_margin: 25,
    bsr: 1250,
    is_prime_eligible: true,
    category: 'Electronics > Headphones',
    status: 'new',
    created_at: '2025-01-10T10:00:00Z',
  },
  // ...
];

// MOCK_RAKUTEN_ITEMS
const MOCK_RAKUTEN_ITEMS: ResearchItem[] = [
  {
    id: 'rak-1',
    source: 'Rakuten',
    title: 'ナイキ エアマックス',
    englishTitle: 'Nike Air Max',
    current_price: 15800,
    profit_margin: 30,
    point_rate: 10,
    category: 'Shoes > Sneakers',
    status: 'analyzing',
    created_at: '2025-01-11T14:30:00Z',
  },
  // ...
];

// MOCK_BUYMA_ITEMS
const MOCK_BUYMA_ITEMS: ResearchItem[] = [
  {
    id: 'buy-1',
    source: 'BUYMA',
    title: 'エルメス バーキン (要在庫確認)',
    englishTitle: 'Hermes Birkin (Stock Check Required)',
    current_price: 980000,
    profit_margin: 15,
    supplier: 'Supplier A',
    category: 'Bags > Luxury',
    status: 'approved',
    created_at: '2025-01-09T09:00:00Z',
  },
  // ...
];
```

---

## 🎨 Phase 5: UIコンポーネントの調整

### 5-1. ResearchItemCard の使用

```typescript
// editing-n3: ProductRow
<ProductRow
  product={product}
  expandProduct={expandProduct}
  ...
/>

// research-n3: ResearchItemCard
<ResearchItemCard
  item={item}
  selected={selectedIds.includes(item.id)}
  onSelect={toggleSelect}
  onDetail={() => handleDetail(item.id)}
/>
```

### 5-2. カードビュー vs リストビュー

```typescript
{viewMode === 'card' ? (
  <N3CardGrid
    items={items.map(item => ({
      id: item.id,
      title: item.englishTitle || item.title,
      imageUrl: item.primary_image_url,
      price: item.current_price,
      profitMargin: item.profit_margin,
      selected: selectedIds.includes(item.id),
      onSelect: toggleSelect,
      onDetail: handleDetail,
    }))}
    columns="auto"
    gap={8}
    minCardWidth={180}
  />
) : (
  <ResearchItemList
    items={items}
    selectedIds={selectedIds}
    onSelect={toggleSelect}
    onDetail={handleDetail}
  />
)}
```

---

## 🚧 Phase 6: 削除・簡略化する要素

editing-n3にあるが、research-n3では不要な要素:

### 6-1. 棚卸し関連 (完全削除)

```typescript
// ❌ 削除対象
import { useInventoryData, useInventorySync, useVariationCreation, useSetCreation } from '../../hooks';
import { InventoryToolPanel, VariationToolPanel, SetProductToolPanel } from '../L3Tabs';
import { N3BulkImageUploadModal, N3InventoryDetailModal, N3NewProductModal } from '../modals';
import { N3GroupingPanel } from '../panels/N3GroupingPanel';

// ❌ 削除対象: 棚卸しタブ判定
const isInventoryTab = (tabId: string) => { ... };

// ❌ 削除対象: 棚卸しデータフック
const inventoryData = useInventoryData();
const inventorySync = useInventorySync();
const variationCreation = useVariationCreation();
const setCreation = useSetCreation();

// ❌ 削除対象: 棚卸し用選択状態
const [inventorySelectedIds, setInventorySelectedIds] = useState<Set<string>>(new Set());

// ❌ 削除対象: 右サイドバー
{isInventoryActive && showGroupingPanel && (
  <N3GroupingPanel ... />
)}
```

### 6-2. L2タブ (簡略化)

```typescript
// editing-n3: 5個のL2タブ
const L2_TABS = [
  { id: 'basic-edit', label: '基本編集', icon: Edit3 },
  { id: 'logistics', label: 'ロジスティクス', icon: Truck },
  { id: 'compliance', label: '関税・法令', icon: Shield },
  { id: 'media', label: 'メディア', icon: ImageIcon },
  { id: 'history', label: '履歴・監査', icon: History },
];

// research-n3: L2タブは削除（L3フィルターで完結）
// → L2タブナビゲーション全体を削除
```

### 6-3. 複雑なモーダル (段階的実装)

初期バージョンではモック実装、後で本格化:

```typescript
// ⚠️ モック実装（後で本格化）
const handleAmazonSearch = () => {
  showToast('🔍 Amazon商品検索...', 'success');
};

const handleRakutenSearch = () => {
  showToast('🔍 楽天商品検索...', 'success');
};

const handleBuymaSimulate = () => {
  showToast('💰 BUYMA利益シミュレーション...', 'success');
};
```

---

## 📝 Phase 7: 実装チェックリスト

### ✅ 必須実装 (Phase 1-3)

- [ ] EditingN3PageLayout.tsx → ResearchN3PageLayout.tsx コピー
- [ ] 名前空間の置換 (Editing → Research)
- [ ] フックの置換 (useInventoryData → useResearchIntegrated)
- [ ] L3フィルタータブ拡張 (12個 → 11個)
- [ ] フィルターバーのグループ区切りレンダリング
- [ ] getPanelContent() の動的切り替えロジック

### 🔄 段階的実装 (Phase 4-5)

- [ ] RakutenResearchToolPanel.tsx 作成
- [ ] BuymaResearchToolPanel.tsx 作成
- [ ] BatchResearchToolPanel.tsx 作成 (既存batch-researchから移植)
- [ ] モックデータ作成 (MOCK_AMAZON_ITEMS, MOCK_RAKUTEN_ITEMS, etc.)
- [ ] useResearchIntegrated.mock.ts 作成

### 🗑️ クリーンアップ (Phase 6)

- [ ] 棚卸し関連コード削除
- [ ] L2タブナビゲーション削除
- [ ] 不要なモーダル削除
- [ ] 未使用のimport削除

---

## 🎯 次回セッション開始手順

### 1. ファイルコピー

```bash
cd /Users/aritahiroaki/n3-frontend_new

# 完全コピー
cp app/tools/editing-n3/components/layouts/EditingN3PageLayout.tsx \
   app/tools/research-n3/components/layouts/ResearchN3PageLayout_BACKUP.tsx

# バックアップを作成してから作業開始
```

### 2. 名前空間の一括置換

```bash
# VSCodeで以下を置換
EditingN3PageLayout → ResearchN3PageLayout
useInventoryData → useResearchIntegrated
InventoryProduct → ResearchItem
Product → ResearchItem
棚卸し → リサーチ
```

### 3. 不要コードの削除

```typescript
// 以下のimportを削除
- useInventorySync
- useVariationCreation
- useSetCreation
- InventoryToolPanel, VariationToolPanel, SetProductToolPanel
- N3BulkImageUploadModal, N3InventoryDetailModal, N3NewProductModal
- N3GroupingPanel

// 以下の変数を削除
- isInventoryActive
- inventoryData
- inventorySync
- variationCreation
- setCreation
- inventorySelectedIds
- showCandidatesOnly
- showSetsOnly
- showGroupingPanel
- showBulkImageUploadModal
- showInventoryDetailModal
- showNewProductModal
```

### 4. L3フィルタータブの書き換え

```typescript
// FILTER_TABS を新しい11個の定義に置き換え
const FILTER_TABS = [
  { id: 'all', label: '全件', group: 'status' },
  { id: 'new', label: '新規', group: 'status' },
  { id: 'analyzing', label: '分析中', group: 'status' },
  { id: 'approved', label: '承認済', group: 'status' },
  { id: 'watching', label: '刈取監視', group: 'karitori' },
  { id: 'alert', label: 'アラート', group: 'karitori' },
  { id: 'yahoo', label: 'Yahoo', group: 'source' },
  { id: 'amazon', label: 'Amazon', group: 'source' },
  { id: 'rakuten', label: '楽天', group: 'source' },
  { id: 'buyma', label: 'BUYMA', group: 'source' },
  { id: 'supplier', label: '仕入先', group: 'other' },
];
```

### 5. 新規ツールパネル作成

```bash
# 3つの新規ツールパネルを作成
touch app/tools/research-n3/components/L3Tabs/RakutenResearchToolPanel.tsx
touch app/tools/research-n3/components/L3Tabs/BuymaResearchToolPanel.tsx
touch app/tools/research-n3/components/L3Tabs/BatchResearchToolPanel.tsx

# index.ts にエクスポート追加
```

### 6. モックフック作成

```bash
touch app/tools/research-n3/hooks/useResearchIntegrated.mock.ts
```

---

## 🔗 参考リンク

- 元ファイル: `/app/tools/editing-n3/components/layouts/EditingN3PageLayout.tsx`
- 既存リサーチタブ: `/app/tools/research-n3/components/L3Tabs/`
- 既存Amazon Research: `/app/tools/amazon-research/`
- 既存Batch Research: `/app/tools/batch-research/`
- 既存Rakuten Arbitrage: `/app/tools/rakuten-arbitrage/`
- 既存BUYMA Simulator: `/app/tools/buyma-simulator/`

---

## 📌 重要な注意事項

1. **editing-n3のフックは参照しない**
   - `useInventoryData`など、editing-n3固有のフックはresearch-n3では使用しない
   - すべて`useResearchIntegrated`に統合

2. **データ型の統一**
   - `Product` → `ResearchItem` に完全移行
   - `InventoryProduct` も `ResearchItem` に統合

3. **L2タブは削除**
   - research-n3ではL3フィルタータブのみで完結
   - L2タブナビゲーション全体を削除

4. **棚卸し機能は完全削除**
   - バリエーション、セット品、グルーピングなどはresearch-n3には不要

5. **段階的実装**
   - 初期バージョンはモック実装で動作確認
   - 本格的な機能は後で追加

---

## 📅 スケジュール

| Phase | 作業内容 | 想定時間 | 担当 |
|---|---|---|---|
| Phase 1 | ファイルコピー&名前空間置換 | 30分 | Session 1 |
| Phase 2 | L3フィルタータブ拡張 | 1時間 | Session 1 |
| Phase 3 | ツールパネル動的切り替え | 1時間 | Session 1-2 |
| Phase 4 | 新規ツールパネル作成 | 2時間 | Session 2-3 |
| Phase 5 | モックデータ実装 | 1時間 | Session 3 |
| Phase 6 | 動作確認&デバッグ | 2時間 | Session 4 |

---

**作成日**: 2025-12-14  
**最終更新**: 2025-12-14  
**ステータス**: 計画中
