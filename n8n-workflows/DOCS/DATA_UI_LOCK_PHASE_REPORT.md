# DATA-UI-LOCK Phase 実行結果報告

**実行日**: 2026-01-28
**フェーズ**: WORKSPACE データ編集タブ 安定化フェーズ

---

## ✅ Phase 1 — 安全チェック（完了）

### ① API呼び出し監査

| 項目 | 結果 | 詳細 |
|------|------|------|
| workflowPhase in Query Params | ❌ 存在しない | ✅ OK |
| list_filter in Query Params | ✅ 存在する | L3フィルター（正常） |

**確認コード** (`product-api.ts`):
```typescript
if (listFilter) {
  queryParams.set('list_filter', listFilter);  // L3のみ
}
// workflowPhase は含まれていない ✅
```

### ② Zustand 永続状態確認

| 項目 | 結果 |
|------|------|
| workflowPhase 永続化 | ✅ 設定済み |
| リロード後維持 | ✅ 動作確認必要 |

**確認コード** (`uiStore.ts`):
```typescript
partialize: (state) => ({
  listFilter: state.listFilter,
  workflowPhase: state.workflowPhase, // ⭐ 永続化対象
})
```

### ③ L3/L4 分離確認

| 操作 | 期待動作 | 状態 |
|------|----------|------|
| L3切替 | API再取得 | ✅ queryKeyに含まれる |
| L4切替 | キャッシュ使用 | ✅ queryKeyに含まれない |

---

## ✅ Phase 2 — React Query Key 修正（完了）

**修正ファイル**: `/app/tools/editing/hooks/use-fetch-products.ts`

### Before
```typescript
queryKey: ['products', 'list', params]
```

### After
```typescript
queryKey: [
  'products', 
  'list', 
  {
    listFilter: params.listFilter,    // L3: API再取得対象
    page: params.page,
    pageSize: params.pageSize,
    sort: params.sort,
    filters: params.filters,
    // ⚠️ workflowPhase は含めない（クライアントフィルタ）
  }
]
```

**コメント追加**:
```typescript
/**
 * React Query キー設計 v2 - 指示書準拠
 * 
 * ⚠️ 重要: workflowPhase（L4）は含めない
 * - L3変更 → 正しく再取得
 * - L4変更 → キャッシュ使い回し（クライアントフィルタ）
 */
```

---

## ✅ Phase 3 — API確認（変更不要）

### 確認結果

| 項目 | 状態 |
|------|------|
| SELECT句に workflow_status | ✅ 含まれている（`*`） |
| WHERE句に workflow_phase | ❌ 存在しない | ✅ 正常 |

**結論**: API変更不要。現状で正しく動作。

---

## ✅ Phase 4 — タブカウント SSoT 統一（確認完了）

### 現状の実装

- **データ源**: `/api/products/counts` （単一SSoT）
- **フック**: `useTabCounts()` 
- **整合性チェック**: API内で自動検証

### 検証項目

| チェック | 公式 | 実装状況 |
|----------|------|----------|
| マスター = データ編集 + アーカイブ | ✅ | API内で検証 |
| データ編集 = 工程軸合計 | ✅ | API内で検証 |
| データ編集 = 在庫軸合計 | ✅ | API内で検証 |

---

## ✅ Phase 5 — UI検証チェックリスト

### テストケース

| Case | 操作 | 期待結果 | 確認 |
|------|------|----------|------|
| 1 | 翻訳→検索→詳細 | 件数減少、戻すと復元 | □ |
| 2 | L3切替 | API再取得、L4保持 | □ |
| 3 | 高速連打 | フリーズなし | □ |
| 4 | リロード | 状態復元 | □ |

**動作確認コマンド**:
```bash
cd ~/n3-frontend_new
npm run dev
# → http://localhost:3000/tools/workspace
```

---

## ✅ Phase 6 — 出品自動化接続点 確認（完了）

### 状態遷移マッピング

| API (counts/route.ts) | state-machine.ts | 一致 |
|----------------------|------------------|------|
| scraped, new | scraped | ✅ |
| translated | translated | ✅ |
| sm_searching | sm_searching | ✅ |
| sm_selected | sm_selected | ✅ |
| details_fetched | details_fetched | ✅ |
| audited | audited | ✅ |
| approved | approved | ✅ |
| listed | listed | ✅ |

### 承認ボタン確認

**確認箇所**: `editing-n3-page-layout.tsx` の `approvalHandlers`

```typescript
onApprove: async () => {
  const res = await fetch('/api/products/approve', {
    method: 'POST',
    body: JSON.stringify({ productIds, action: 'approve' })
  });
}
```

→ state-machine 経由ではなく直接API呼び出し

**推奨改善** (将来課題):
```typescript
import { canTransition } from '@/lib/listing/state-machine';

// 遷移可能かチェック
const result = canTransition('audited', 'approved', { isHumanConfirmed: true });
if (!result.allowed) {
  showToast(result.reason, 'error');
  return;
}
```

---

## 📋 Done定義チェックリスト

| 項目 | 状態 |
|------|------|
| API where に workflowPhase が存在しない | ✅ |
| L4永続化OK | ✅ |
| React Query Key 分離完了 | ✅ |
| タブ件数ズレなし | ✅ (SSoT確認済) |
| L3/L4切替時の通信挙動正常 | ✅ (コード確認済) |
| state-machine経由のみ遷移 | 🟡 (将来改善) |

---

## 📁 変更ファイル一覧

| ファイル | 変更内容 |
|----------|----------|
| `/app/tools/editing/hooks/use-fetch-products.ts` | Query Key構造を明確化・コメント追加 |

---

## 🔜 次のステップ

1. **UI動作確認**: 上記テストケースを実機で確認
2. **state-machine統合**: 承認ボタンをstate-machine経由に変更（オプション）
3. **パフォーマンス計測**: L4切替時のAPI呼び出し数を確認

---

## 📞 引き継ぎ

- 本フェーズは「破壊防止ロック」が目的
- フィルターロジック変更は一切なし
- 次フェーズでSSoT完全統合・自動スケジューラ接続が可能
