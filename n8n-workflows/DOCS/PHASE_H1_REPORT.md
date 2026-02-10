# Phase H-1 実装完了レポート

## 🎯 目的達成

Control Center の **タブ切替ロジック** を State Machine に一本化

| 項目 | Before | After |
|------|--------|-------|
| タブ状態管理 | `useState<TabId>` | `useControlCenter()` |
| タブ切替 | `setActiveTab(id)` | `sendTabChange(id)` |
| アクティブ判定 | `activeTab === id` | `isTabActive(id)` |
| if分岐 | 直接比較 | Machine経由 |

---

## 📁 作成ファイル

### ① State Machine定義
**`/lib/state-machines/control-center-machine.ts`**

```typescript
// 型定義
export type TabId = 'monitor' | 'failed' | ... | 'manual';
export type SystemState = 'idle' | 'ready';

// Context
export interface ControlCenterContext {
  activeTab: TabId;
  previousTab: TabId | null;
}

// Events
export type ControlCenterEvent =
  | { type: 'TAB_CLICK'; tabId: TabId }
  | { type: 'INIT' };

// Guards（Phase 1は常にtrue）
export const guards = {
  canNavigateToTab: () => true,
};

// Pure Reducer（XState不要）
export function controlCenterReducer(state, action) {
  switch (action.type) {
    case 'TAB_CLICK':
      if (!guards.canNavigateToTab(state, action)) return state;
      return actions.setActiveTab(state, action);
    default:
      return state;
  }
}
```

### ② React Hook
**`/lib/hooks/useControlCenter.ts`**

```typescript
export function useControlCenter(initialTab?: TabId) {
  const [state, dispatch] = useReducer(controlCenterReducer, init);
  
  return {
    // 状態
    state,
    currentTab,
    previousTab,
    
    // アクション
    send,
    sendTabChange,
    
    // ユーティリティ
    isTabActive,
  };
}
```

### ③ 改修ファイル
**`command-center-content.tsx`**

**削除:**
```typescript
// Before
const [activeTab, setActiveTab] = useState<TabId>('monitor');
```

**追加:**
```typescript
// After
import { useControlCenter } from '@/lib/hooks/useControlCenter';
import type { TabId } from '@/lib/state-machines/control-center-machine';

const { currentTab, sendTabChange, isTabActive } = useControlCenter('monitor');
```

**タブクリック:**
```typescript
// Before
onClick={() => setActiveTab(tab.id)}

// After
onClick={() => sendTabChange(tab.id)}
```

**アクティブ判定:**
```typescript
// Before
const isActive = activeTab === tab.id;

// After
const isActive = isTabActive(tab.id);
```

---

## ✅ 完了条件チェック

| 条件 | 状態 |
|------|------|
| タブ切替がStateMachine経由のみ | ✅ |
| useState(activeTab)がゼロ | ✅ |
| 動作は今と同じ | ✅ |
| 既存UI構造を壊さない | ✅ |
| デザイン変更なし | ✅ |

---

## 🔮 Phase H ロードマップ

| Phase | 内容 | 状態 |
|-------|------|------|
| H-1 | タブ制御のみSM化 | ✅ 完了 |
| H-2 | KillSwitch連動 | 次 |
| H-3 | Scheduler/Executing同期 | - |
| H-4 | 完全UI制御統合 | - |

---

## 📊 変更差分

**追加ファイル:**
- `/lib/state-machines/control-center-machine.ts` (新規)
- `/lib/hooks/useControlCenter.ts` (新規)

**変更ファイル:**
- `/app/tools/control-n3/components/command-center-content.tsx`
  - import追加（useControlCenter, TabId）
  - useState削除（activeTab）
  - useControlCenter()呼び出し追加
  - onClick → sendTabChange()
  - activeTab === → isTabActive()

**削除:**
- なし

---

## 🧪 動作確認方法

```bash
# 開発サーバー起動
cd ~/n3-frontend_new
npm run dev

# Control Center アクセス
http://localhost:3000/tools/control-n3

# タブ切替テスト
- 各タブをクリック
- 正常に切り替わることを確認
- コンソールエラーがないことを確認
```

---

## 次のステップ: Phase H-2

**KillSwitch連動**

追加内容:
1. guards.canNavigateToTab に KillSwitch条件追加
2. `killed` 状態の追加
3. KillSwitch時のタブ制限（manual, workflows禁止）
4. 自動遷移（critical error → health）

```typescript
// Phase H-2 で追加
canNavigateToTab: (context, event) => {
  // KillSwitch中は危険タブ禁止
  if (context.killSwitch.active) {
    return !['manual', 'workflows'].includes(event.tabId);
  }
  return true;
},
```

---

**Phase H-1 実装完了。システムの「操縦席」が State Machine 制御下に入りました。**
