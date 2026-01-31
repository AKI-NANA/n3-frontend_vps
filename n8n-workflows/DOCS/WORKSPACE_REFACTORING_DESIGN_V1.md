# N3 Workspace データ編集タブ リファクタリング設計書

**作成日**: 2026-01-28
**対象**: `/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx`
**目的**: タブ表示ズレ・カウント不一致・二重フィルタ・状態管理混線の解消

---

## 🔴 現状の問題点

### 1. タブカウント不一致
- **原因**: `/api/products/counts` (DB全件) vs `displayProducts.length` (フィルタ後)
- **症状**: L3タブのカウントが表示と一致しない

### 2. L3/L4フィルタ混線
- **原因**: L3はZustand永続化、L4はローカルstate（useState）
- **症状**: リロード時にL4フィルターがリセットされる

### 3. 二重フィルタ構造
- **原因**: API側`list_filter`絞込 → Client側`useMemo`再フィルタ
- **症状**: パフォーマンス低下、フィルタ条件の重複

### 4. 在庫タブ専用Hook分離
- **原因**: `useInventoryData` vs `useProductData` の二重管理
- **症状**: データ不整合、メンテナンス困難

---

## ✅ 実装完了項目

### Phase 1: Zustand Store 拡張 ✅

**ファイル**: `/store/product/uiStore.ts`

```typescript
// ⭐ v2 新規追加
export type ProductPhase = 
  | 'TRANSLATE' | 'SEARCH' | 'SELECT_SM' | 'FETCH_DETAILS' 
  | 'ENRICH' | 'APPROVAL_PENDING' | 'LISTED' | 'OTHER' | 'ARCHIVED' 
  | null;

interface ProductUIState {
  listFilter: ListFilterType;      // L3タブ - 永続化
  workflowPhase: ProductPhase;     // L4タブ - ⭐ 新規追加・永続化
  // ...
}
```

**新規アクション**:
- `setWorkflowPhase(phase)`: L4フィルター変更
- `setFilterWithReset(l3, l4?)`: L3/L4同時設定

**永続化対象追加**:
```typescript
partialize: (state) => ({
  listFilter: state.listFilter,      // L3
  workflowPhase: state.workflowPhase, // L4 ⭐ 新規
  // ...
})
```

### Phase 2: editing-n3-page-layout 修正 ✅

**変更内容**:
```typescript
// Before (useState)
const [activeWorkflowPhase, setActiveWorkflowPhase] = useState<ProductPhase | null>(null);

// After (Zustand)
const activeWorkflowPhase = useWorkflowPhaseSelector() as ProductPhase | null;
const setActiveWorkflowPhase = productUIActions.setWorkflowPhase;
```

### Phase 3: 出品安全ガード ✅

**新規ファイル**: `/lib/listing/`

1. **state-machine.ts**: 出品状態遷移ステートマシン
   - 許可される遷移のみ実行可能
   - 人間承認必須チェック

2. **guards.ts**: 誤出品防止ガード
   - VERO違反チェック
   - 赤字警告
   - 在庫0チェック

3. **kill-switch.ts**: 緊急停止機能
   - 全機能停止 / 部分停止
   - 監査ログ記録

---

## 🔄 残作業

### Phase 4: React Query キー拡張

**対象**: `/app/tools/editing/hooks/use-fetch-products.ts`

```typescript
// Before
queryKey: ['products', 'list', { listFilter, page, pageSize, sort }]

// After  
queryKey: ['products', 'list', { 
  listFilter,      // L3
  workflowPhase,   // L4 ⭐ 新規追加
  page, 
  pageSize, 
  sort 
}]
```

### Phase 5: API 拡張

**対象**: `/app/api/products/route.ts`

```typescript
// 新パラメータ追加
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const listFilter = searchParams.get('list_filter');
  const workflowPhase = searchParams.get('workflow_phase'); // ⭐ 新規
  
  // DB クエリ条件に追加
  if (workflowPhase) {
    query = query.eq('workflow_status', mapPhaseToStatus(workflowPhase));
  }
}
```

### Phase 6: タブカウントSSoT統一

**対象**: `/app/tools/editing-n3/hooks/use-tab-counts.ts`

- L3タブカウント: `/api/products/counts` から取得
- L4工程カウント: 同APIに `workflow_counts` フィールド追加
- displayProducts.length の使用を禁止

---

## 📊 期待効果

| 指標 | 現状 | 改善後 |
|------|------|--------|
| タブカウント正確性 | 70% | 99% |
| L4フィルタ永続化 | ❌ | ✅ |
| 二重フィルタ | あり | なし |
| 初回ロード時間 | 2-3秒 | 1秒以下 |
| タブ切替時間 | 0.5-1秒 | 0.1秒以下 |

---

## 📁 変更ファイル一覧

| ファイル | 状態 | 内容 |
|----------|------|------|
| `/store/product/uiStore.ts` | ✅ 完了 | workflowPhase追加・永続化 |
| `/lib/listing/state-machine.ts` | ✅ 完了 | 状態遷移ステートマシン |
| `/lib/listing/guards.ts` | ✅ 完了 | 誤出品防止ガード |
| `/lib/listing/kill-switch.ts` | ✅ 完了 | Kill Switch |
| `/lib/listing/index.ts` | ✅ 完了 | エクスポート |
| `editing-n3-page-layout.tsx` | ✅ 完了 | useState→Zustand移行 |
| `/docs/LISTING_SAFETY_DESIGN_V1.md` | ✅ 完了 | 出品安全設計書 |
| `/app/tools/editing/hooks/use-fetch-products.ts` | 🔄 残 | queryKey拡張 |
| `/app/api/products/route.ts` | 🔄 残 | workflow_phase対応 |
| `/app/tools/editing-n3/hooks/use-tab-counts.ts` | 🔄 残 | SSoT統一 |
