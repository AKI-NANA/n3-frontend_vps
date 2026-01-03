# editing-n3 アーキテクチャガイド

## 🎯 設計原則

### ファイルサイズ制限

| ファイル種別 | 最大サイズ | 最大行数 |
|-------------|-----------|---------|
| Layout (レイアウト) | 30KB | 800行 |
| View (ビュー) | 15KB | 400行 |
| Panel (パネル) | 10KB | 300行 |
| Modal (モーダル) | 15KB | 400行 |
| Component (部品) | 8KB | 200行 |

**⚠️ これらの制限を超える場合は、必ずコンポーネントを分割してください。**

---

## 📁 ディレクトリ構造

```
editing-n3/
├── page.tsx                    # エントリーポイントのみ (< 50行)
├── ARCHITECTURE.md             # このファイル
├── components/
│   ├── layouts/                # レイアウト組み立て
│   │   ├── EditingN3PageLayout.tsx  # メインレイアウト (< 800行)
│   │   └── L2TabContent.tsx         # L2タブコンテンツ
│   │
│   ├── header/                 # ヘッダー関連
│   │   ├── N3PageHeader.tsx         # ページヘッダー
│   │   ├── N3SubToolbar.tsx         # サブツールバー
│   │   └── index.ts
│   │
│   ├── views/                  # ビュー表示
│   │   ├── N3BasicEditView.tsx      # リスト/カードビュー
│   │   ├── N3InventoryView.tsx      # 棚卸しビュー
│   │   └── index.ts
│   │
│   ├── panels/                 # パネルコンテンツ
│   │   ├── N3ToolsPanelContent.tsx  # ツールパネル
│   │   ├── N3StatsPanelContent.tsx  # 統計パネル
│   │   ├── N3GroupingPanel.tsx      # グルーピングパネル
│   │   └── index.ts
│   │
│   ├── L3Tabs/                 # L3タブ固有コンポーネント
│   │   ├── InventoryToolPanel.tsx
│   │   ├── VariationToolPanel.tsx
│   │   ├── SetProductToolPanel.tsx
│   │   ├── HistoryTab.tsx
│   │   └── index.ts
│   │
│   ├── modals/                 # モーダル
│   │   ├── N3BulkImageUploadModal.tsx
│   │   ├── N3InventoryDetailModal.tsx
│   │   ├── N3NewProductModal.tsx
│   │   └── index.ts
│   │
│   └── ProductRow.tsx          # 商品行コンポーネント
│
└── hooks/                      # カスタムフック
    ├── useInventoryData.ts
    ├── useInventorySync.ts
    ├── useVariationCreation.ts
    ├── useSetCreation.ts
    ├── useTabCounts.ts
    └── index.ts
```

---

## 🚫 禁止事項

### 1. レイアウトファイルへの直接追加禁止

❌ **やってはいけない:**
```tsx
// EditingN3PageLayout.tsx に直接追加
function EditingN3PageLayout() {
  // 新しいUIをここに直接書く ← 禁止！
  return (
    <div>
      {/* 100行以上のJSXを追加 */}
    </div>
  );
}
```

✅ **正しい方法:**
```tsx
// 1. 新しいコンポーネントファイルを作成
// components/views/N3NewFeatureView.tsx

// 2. レイアウトでインポートして使用
import { N3NewFeatureView } from '../views';

function EditingN3PageLayout() {
  return <N3NewFeatureView {...props} />;
}
```

### 2. 巨大な関数の禁止

❌ **やってはいけない:**
```tsx
const getPanelContent = (tabId: string) => {
  // 200行以上の switch 文 ← 禁止！
  switch (tabId) {
    case 'tools': return /* 50行のJSX */;
    case 'stats': return /* 50行のJSX */;
    // ...
  }
};
```

✅ **正しい方法:**
```tsx
// パネルコンテンツを別コンポーネントに分離
import { N3ToolsPanelContent, N3StatsPanelContent } from '../panels';

const getPanelContent = (tabId: string) => {
  switch (tabId) {
    case 'tools': return <N3ToolsPanelContent {...props} />;
    case 'stats': return <N3StatsPanelContent {...props} />;
  }
};
```

### 3. 重複コードの禁止

共通パターンは必ず共通コンポーネント化してください。

---

## ✅ 新機能追加時のチェックリスト

新しい機能を追加する前に確認:

- [ ] 追加するコードは50行以内か？
  - 50行以上 → 新しいコンポーネントファイルを作成
- [ ] 既存のコンポーネントを再利用できないか？
- [ ] 類似のコンポーネントが既に存在しないか？
- [ ] 追加後のファイルサイズは制限内か？

---

## 📊 現在のファイルサイズ

| ファイル | サイズ | 状態 |
|---------|--------|------|
| EditingN3PageLayout.tsx | ~30KB | ✅ OK |
| N3BasicEditView.tsx | ~8KB | ✅ OK |
| N3InventoryView.tsx | ~6KB | ✅ OK |
| N3ToolsPanelContent.tsx | ~10KB | ✅ OK |
| N3StatsPanelContent.tsx | ~5KB | ✅ OK |
| N3PageHeader.tsx | ~6KB | ✅ OK |
| N3SubToolbar.tsx | ~4KB | ✅ OK |

---

## 🔄 定期メンテナンス

月1回以下を確認:

1. **ファイルサイズチェック**
   ```bash
   find app/tools/editing-n3 -name "*.tsx" -exec wc -c {} \; | sort -n
   ```

2. **行数チェック**
   ```bash
   find app/tools/editing-n3 -name "*.tsx" -exec wc -l {} \; | sort -n
   ```

3. **制限超過ファイルの分割**

---

## 📝 変更履歴

| 日付 | 変更内容 |
|------|---------|
| 2025-12-17 | 初期リファクタリング: 101KB → 30KB |
| 2025-12-17 | ヘッダー・サブツールバー分離 |
| 2025-12-17 | ARCHITECTURE.md 作成 |
| 2025-12-22 | **P0**: 無限ループ停止ガード実装 |

---

## ⚠️ 無限ループ対策 (P0)

### 問題
- useEffectの依存配列に関数参照が含まれると、毎レンダリングで新しい参照が作成され無限ループの原因に
- Zustand Storeの状態変更が連鎖的に再レンダリングを引き起こす

### 対策
1. **useRefで関数参照を安定化**
   ```tsx
   const loadProductsRef = useRef(inventoryData.loadProducts);
   useEffect(() => {
     loadProductsRef.current = inventoryData.loadProducts;
   });
   ```

2. **依存配列にはプリミティブ値のみ**
   ```tsx
   // ✗ NG
   useEffect(() => {...}, [inventoryData]);
   
   // ○ OK
   const length = inventoryData.products.length;
   useEffect(() => {...}, [length]);
   ```

3. **マウントカウントによる検知**
   - page.tsx: 10回/10秒でブロック
   - EditingN3PageLayout: 5回/10秒で警告
   - Hooks: 3回/10秒で警告
