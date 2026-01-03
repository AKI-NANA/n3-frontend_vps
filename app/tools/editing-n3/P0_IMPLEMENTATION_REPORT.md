# P0タスク実装レポート: 無限ループ停止ガード

## 📋 概要

**実施日**: 2025-12-22  
**対象**: `editing-n3` ツール  
**目的**: Macのフリーズを引き起こす無限ループを物理的に停止

---

## 🔧 実装内容

### 1. page.tsx - メイン無限ループガード

**ファイル**: `app/tools/editing-n3/page.tsx`

**変更点**:
- レンダー回数カウント（1秒以内に50回以上で停止）
- マウント回数カウント（10秒以内に10回以上で停止）
- Suspense + lazy loadで初期メモリ削減
- キャッシュクリア機能付きフォールバックUI

```tsx
// レンダー回数が閾値を超えたら即座に停止
if (renderCount > LOOP_DETECTION.RENDER_THRESHOLD) {
  console.error(`[EditingN3Page] 🚨 レンダー無限ループ検知! (${renderCount}回/秒)`);
  return <LoopDetectedFallback reason="render" count={renderCount} />;
}
```

---

### 2. EditingN3PageLayout.tsx - useEffect依存配列修正

**ファイル**: `app/tools/editing-n3/components/layouts/EditingN3PageLayout.tsx`

**問題の原因**:
- `inventoryData.loadProducts` などの関数参照が依存配列に含まれていた
- 毎レンダリングで新しい関数参照が生成され、useEffectが再実行される無限ループ

**対策**:
1. **useRefで関数参照を安定化**
   ```tsx
   const inventoryLoadProductsRef = useRef(inventoryData.loadProducts);
   const inventorySetFilterRef = useRef(inventoryData.setFilter);
   
   useEffect(() => {
     inventoryLoadProductsRef.current = inventoryData.loadProducts;
     inventorySetFilterRef.current = inventoryData.setFilter;
   });
   ```

2. **依存配列をプリミティブ値のみに変更**
   ```tsx
   // ❌ 変更前
   useEffect(() => {...}, [isInventoryActive, inventoryData.products.length, inventoryData.loading, inventoryData.loadProducts]);
   
   // ✅ 変更後
   const inventoryProductsLength = inventoryData.products.length;
   const inventoryLoading = inventoryData.loading;
   useEffect(() => {...}, [isInventoryActive, inventoryProductsLength, inventoryLoading]);
   ```

3. **マウント回数追跡の追加**
   - 10秒以内に5回以上でコンソール警告

---

### 3. useInventoryData.ts - マウントカウント追加

**ファイル**: `app/tools/editing-n3/hooks/useInventoryData.ts`

**変更点**:
- マウントカウント追跡（3回/10秒で警告）
- インポートに `useRef`, `useEffect` 追加

---

### 4. useTabCounts.ts - 初回実行制御強化

**ファイル**: `app/tools/editing-n3/hooks/useTabCounts.ts`

**変更点**:
- `fetchAllCounts` 関数参照をuseRefで安定化
- 初回のみ実行を厳密に制御

```tsx
const fetchAllCountsRef = useRef(fetchAllCounts);
useEffect(() => {
  fetchAllCountsRef.current = fetchAllCounts;
});

useEffect(() => {
  if (autoFetch && !hasFetchedRef.current) {
    hasFetchedRef.current = true;
    fetchAllCountsRef.current();
  }
}, [autoFetch]);
```

---

## 📊 無限ループ検知閾値

| レベル | 対象 | 閾値 | アクション |
|-------|------|------|------------|
| Critical | page.tsx レンダー | 50回/秒 | 即座にブロック |
| Critical | page.tsx マウント | 10回/10秒 | 即座にブロック |
| Warning | EditingN3PageLayout | 5回/10秒 | コンソール警告 |
| Warning | useInventoryData | 3回/10秒 | コンソール警告 |

---

## 🧪 テスト方法

### 1. 正常動作確認
```bash
cd ~/n3-frontend_new
npm run dev
# http://localhost:3000/tools/editing-n3 にアクセス
```

### 2. 無限ループ検知確認
- DevTools → Console を開いてログを確認
- 正常時: `[EditingN3Page] RENDER #1` のみ表示
- 異常時: `🚨 無限ループ検知!` が表示されUIがブロック

### 3. キャッシュクリア確認
- ブロックUI表示時に「キャッシュクリア&リロード」ボタンをクリック
- LocalStorageの `product-ui-store` が削除されることを確認

---

## 📝 次のステップ (P1以降)

1. **P1: DBマイグレーション**
   - `inventory_master_id` カラムの追加
   - `current_stock` の排除

2. **P2: APIクエリのJOIN化**
   - 在庫表示の正常化

3. **P3: 階層フィルターの実装**
   - Supabase Realtimeの活用（推奨）
   - 親セット品の在庫変更通知

---

## ⚠️ 注意事項

1. **開発環境のみの警告ログ**
   - `process.env.NODE_ENV === 'development'` でのみ詳細ログを出力
   - 本番環境ではパフォーマンスへの影響を最小限に

2. **LocalStorageの競合リスク**
   - 複数タブで同じ画面を開く際は注意
   - `partialize` 設定で書き込み範囲を最小限に設定済み

3. **HMR（Hot Module Replacement）での注意**
   - 開発中のファイル保存で `renderCount` がリセットされない場合がある
   - その場合はブラウザをリロード
