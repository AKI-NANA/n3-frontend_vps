# 🎨 Research N3 UIコピー実装ガイド

## 📋 戦略: UIを先にコピー、機能は後で実装

**フェーズ1**: ビジュアルUIのみコピー（モックデータ使用）  
**フェーズ2**: 実際のデータフック統合（後のセッション）

---

## ✅ 使用コンポーネント一覧（FullPreviewDemoから確認済み）

### 共通N3コンポーネント

```typescript
import {
  N3PinButton,           // ✅ ピン留めボタン
  N3HeaderTab,           // ✅ ヘッダータブ (tools/flow/stats/filter)
  N3HeaderSearchInput,   // ✅ 検索ボックス
  N3LanguageSwitch,      // ✅ 言語切り替え (ja/en)
  N3WorldClock,          // ✅ 世界時計 (LA/NY/DE/JP)
  N3CurrencyDisplay,     // ✅ 通貨表示 (¥149.50)
  N3NotificationBell,    // ✅ 通知ベル
  N3UserAvatar,          // ✅ ユーザーアバター
  N3Divider,             // ✅ 区切り線
} from '@/components/n3';

import { N3SidebarMini } from '@/components/n3/layout/N3SidebarMini';  // ✅ サイドバー
```

### L2タブ（編集タブ）

```typescript
const L2_TABS = [
  { id: 'basic', label: '基本編集', icon: Edit3 },
  { id: 'logistics', label: 'ロジスティクス', icon: Truck },
  { id: 'compliance', label: '関税・法令', icon: Shield },
  { id: 'media', label: 'メディア', icon: ImageIcon },
  { id: 'history', label: '履歴・監査', icon: History },
];
```

**Research N3では削除**: L2タブは不要（L3フィルターのみで完結）

### L3フィルター

```typescript
// editing-n3 (12個)
import { L3ListFilter } from '@/app/tools/editing/components/L3ListFilter';

// research-n3 (11個) - カスタム実装
const FILTER_TABS = [
  // ステータス (4)
  { id: 'all', label: '全件', group: 'status' },
  { id: 'new', label: '新規', group: 'status' },
  { id: 'analyzing', label: '分析中', group: 'status' },
  { id: 'approved', label: '承認済', group: 'status' },
  
  // 刈り取り (2)
  { id: 'watching', label: '刈取監視', group: 'karitori' },
  { id: 'alert', label: 'アラート', group: 'karitori' },
  
  // 仕入元 (4)
  { id: 'yahoo', label: 'Yahoo', group: 'source' },
  { id: 'amazon', label: 'Amazon', group: 'source' },
  { id: 'rakuten', label: '楽天', group: 'source' },
  { id: 'buyma', label: 'BUYMA', group: 'source' },
  
  // その他 (1)
  { id: 'supplier', label: '仕入先', group: 'other' },
];
```

### ツールパネル（動的切り替え）

```typescript
// 既存パネル
import {
  ResearchToolPanel,       // ✅ 既存
  KaritoriToolPanel,       // ✅ 既存
  SupplierToolPanel,       // ✅ 既存
  ApprovalToolPanel,       // ✅ 既存
  AmazonResearchToolPanel, // ✅ 既存
} from '../L3Tabs';

// 新規パネル（作成済み）
import {
  RakutenResearchToolPanel,  // ✅ 作成済み
  BuymaResearchToolPanel,    // ✅ 作成済み
  BatchResearchToolPanel,    // ✅ 作成済み (既存batch-researchから)
} from '../L3Tabs';
```

### メインコンテンツ（カード/リスト）

```typescript
// research-n3専用
import { ResearchItemCard } from '../cards';  // ✅ 既存

// カードビュー
<N3CardGrid
  items={items.map(item => ({ ... }))}
  columns="auto"
  gap={8}
  minCardWidth={180}
/>

// リストビュー
<ResearchItemList
  items={items}
  selectedIds={selectedIds}
  onSelect={toggleSelect}
  onDetail={handleDetail}
/>
```

---

## 🚀 実装手順（今回のセッション）

### Step 1: ベースファイル作成

```bash
# FullPreviewDemo.tsx をベースにResearchN3PreviewDemo.tsx作成
cd /Users/AKI-NANA/n3-frontend_new/app/tools/design-catalog/categories/layout

# 既存のResearchN3PreviewDemo.tsxを確認
ls -la ResearchN3PreviewDemo.tsx
```

### Step 2: コンポーネント構造のコピー

**コピー元**: `FullPreviewDemo.tsx`  
**コピー先**: `ResearchN3PreviewDemo.tsx`

#### 主要な変更点:

1. **L2タブを削除**
```typescript
// ❌ 削除
const L2_TABS = [ ... ];

// ❌ 削除
<div className="n3-l2-tabs-container">...</div>
```

2. **L3フィルター置き換え**
```typescript
// ❌ 削除
import { L3ListFilter } from '@/app/tools/editing/components/L3ListFilter';

// ✅ 追加: カスタムL3フィルターバー
<div className="flex items-center gap-4">
  {/* ステータスグループ */}
  {FILTER_TABS.filter(t => t.group === 'status').map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveFilter(tab.id)}
      className={activeFilter === tab.id ? 'active' : ''}
    >
      {tab.label}
      <span className="count">{counts[tab.id]}</span>
    </button>
  ))}
  
  <N3Divider orientation="vertical" />
  
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

3. **ツールパネルの動的切り替え**
```typescript
const getPanelContent = (tabId: PanelTabId | null) => {
  if (tabId !== 'tools') return null;
  
  switch (activeFilter) {
    case 'watching':
    case 'alert':
      return <KaritoriToolPanel {...mockProps} />;
      
    case 'supplier':
      return <SupplierToolPanel {...mockProps} />;
      
    case 'approved':
      return <ApprovalToolPanel {...mockProps} />;
      
    case 'amazon':
      return <AmazonResearchToolPanel {...mockProps} />;
      
    case 'rakuten':
      return <RakutenResearchToolPanel {...mockProps} />;
      
    case 'buyma':
      return <BuymaResearchToolPanel {...mockProps} />;
      
    case 'yahoo':
    default:
      return <ResearchToolPanel {...mockProps} />;
  }
};
```

4. **メインコンテンツ置き換え**
```typescript
// ❌ 削除
<EditingTableV2 ... />

// ✅ 追加
{viewMode === 'card' ? (
  <N3CardGrid
    items={mockItems.map(item => ({
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
  <div className="research-list">
    {mockItems.map(item => (
      <ResearchItemCard
        key={item.id}
        item={item}
        selected={selectedIds.includes(item.id)}
        onSelect={toggleSelect}
        onDetail={handleDetail}
      />
    ))}
  </div>
)}
```

---

## 📊 モックデータ

### ResearchItem型（簡易版）

```typescript
interface ResearchItem {
  id: string;
  source: 'Yahoo' | 'Amazon' | 'Rakuten' | 'BUYMA';
  title: string;
  englishTitle?: string;
  current_price: number;
  profit_margin?: number;
  bsr?: number;
  category?: string;
  status: 'new' | 'analyzing' | 'approved' | 'watching' | 'alert';
  primary_image_url?: string;
  created_at: string;
  
  // Amazon専用
  is_prime_eligible?: boolean;
  
  // 楽天専用
  point_rate?: number;
  
  // BUYMA専用
  supplier?: string;
}
```

### モックデータ例

```typescript
const MOCK_RESEARCH_ITEMS: ResearchItem[] = [
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
    primary_image_url: 'https://picsum.photos/seed/amz1/100/100',
    created_at: '2025-01-10T10:00:00Z',
  },
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
    primary_image_url: 'https://picsum.photos/seed/rak1/100/100',
    created_at: '2025-01-11T14:30:00Z',
  },
  {
    id: 'buy-1',
    source: 'BUYMA',
    title: 'エルメス バーキン',
    englishTitle: 'Hermes Birkin',
    current_price: 980000,
    profit_margin: 15,
    supplier: 'Supplier A',
    category: 'Bags > Luxury',
    status: 'approved',
    primary_image_url: 'https://picsum.photos/seed/buy1/100/100',
    created_at: '2025-01-09T09:00:00Z',
  },
  {
    id: 'yah-1',
    source: 'Yahoo',
    title: 'ヴィンテージカメラ Canon AE-1',
    englishTitle: 'Vintage Canon AE-1 Camera',
    current_price: 15000,
    profit_margin: 22,
    category: 'Cameras > Film Cameras',
    status: 'watching',
    primary_image_url: 'https://picsum.photos/seed/yah1/100/100',
    created_at: '2025-01-12T16:00:00Z',
  },
];
```

### カウント計算

```typescript
const counts = {
  all: mockItems.length,
  new: mockItems.filter(i => i.status === 'new').length,
  analyzing: mockItems.filter(i => i.status === 'analyzing').length,
  approved: mockItems.filter(i => i.status === 'approved').length,
  watching: mockItems.filter(i => i.status === 'watching').length,
  alert: mockItems.filter(i => i.status === 'alert').length,
  yahoo: mockItems.filter(i => i.source === 'Yahoo').length,
  amazon: mockItems.filter(i => i.source === 'Amazon').length,
  rakuten: mockItems.filter(i => i.source === 'Rakuten').length,
  buyma: mockItems.filter(i => i.source === 'BUYMA').length,
  supplier: mockItems.filter(i => !!i.supplier).length,
};
```

---

## 📋 実装チェックリスト

### ✅ Phase 1: UIコピー（今回のセッション）

- [ ] FullPreviewDemo.tsx の構造をコピー
- [ ] L2タブを削除
- [ ] L3フィルターを11個のカスタムタブに置き換え
- [ ] グループ区切り（N3Divider）を追加
- [ ] ツールパネル動的切り替えロジック実装
- [ ] メインコンテンツをResearchItemCard/N3CardGridに置き換え
- [ ] モックデータ作成（10-20件）
- [ ] http://localhost:3000/tools/design-catalog でプレビュー確認

### ⏳ Phase 2: データ統合（次回セッション）

- [ ] useResearchIntegrated() フック作成
- [ ] 実際のSupabaseデータ取得
- [ ] フィルター機能の実装
- [ ] 選択機能の実装
- [ ] ページネーションの実装

---

## 🎨 スタイリング

editing-n3と同じスタイリングを使用:

```css
/* L3フィルタータブ */
.research-filter-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: var(--highlight);
  border-bottom: 1px solid var(--panel-border);
}

.research-filter-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  background: transparent;
  color: var(--text-muted);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.research-filter-tab.active {
  background: var(--accent);
  color: white;
}

.research-filter-tab .count {
  padding: 2px 6px;
  font-size: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
```

---

## 🔍 動作確認方法

### 1. Design Catalogでプレビュー

```bash
# ローカルサーバー起動
cd /Users/AKI-NANA/n3-frontend_new
npm run dev

# ブラウザで確認
http://localhost:3000/tools/design-catalog
```

### 2. チェックポイント

- [ ] ヘッダーパネル（ピン留め/ホバー）が動作
- [ ] L3フィルタータブが11個表示される
- [ ] グループ区切りが正しく表示される
- [ ] フィルタークリックでツールパネルが切り替わる
- [ ] カード/リストビュー切り替えが動作
- [ ] モックデータが正しく表示される
- [ ] コンソールエラーなし

---

## 📝 次回セッションへの引き継ぎ

### 完了事項
- ✅ UIコンポーネント構造のコピー完了
- ✅ L3フィルター11個の実装完了
- ✅ ツールパネル動的切り替え実装完了
- ✅ モックデータでの動作確認完了

### 次回実装事項
1. useResearchIntegrated() フック作成
2. Supabaseデータ取得
3. フィルター機能実装
4. 本番環境への統合

---

**作成日**: 2025-12-14  
**最終更新**: 2025-12-14  
**ステータス**: Phase 1 実装中
