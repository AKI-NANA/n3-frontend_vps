# Phase H-2 実装完了レポート

## 🎯 目的達成

Kill Switch を UI操作権限レベルまで完全統合

| 機能 | 状態 |
|------|------|
| Kill中は危険タブに入れない | ✅ |
| Kill解除までは実行系UIを全ロック | ✅ |
| 致命エラー時はHealthへ強制遷移 | ✅ |

---

## 📁 変更ファイル

### ① control-center-machine.ts（拡張）

**追加State:**
```typescript
type SystemState = 'idle' | 'ready' | 'killed' | 'error';
```

**追加Context:**
```typescript
interface ControlCenterContext {
  // タブ
  activeTab: TabId;
  previousTab: TabId | null;
  lastSafeTab: TabId;  // NEW
  
  // システム
  systemState: SystemState;  // NEW
  
  // KillSwitch
  isKilled: boolean;  // NEW
  killReason: string | null;  // NEW
  killedAt: Date | null;  // NEW
  
  // エラー
  hasError: boolean;  // NEW
  errorMessage: string | null;  // NEW
  errorCode: string | null;  // NEW
  isCritical: boolean;  // NEW
}
```

**追加Event:**
```typescript
type ControlCenterEvent =
  | { type: 'TAB_CLICK'; tabId: TabId }
  | { type: 'INIT' }
  | { type: 'KILL_SWITCH_ON'; reason?: string }  // NEW
  | { type: 'KILL_SWITCH_OFF' }  // NEW
  | { type: 'CRITICAL_ERROR'; message: string; code?: string }  // NEW
  | { type: 'CLEAR_ERROR' }  // NEW
  | { type: 'SYNC_KILL_STATE'; isKilled: boolean; reason?: string };  // NEW
```

**危険タブ定義:**
```typescript
const DANGEROUS_TABS: TabId[] = [
  'manual',      // 手動実行
  'workflows',   // ワークフロー操作
  'automation',  // 自動化設定
];
```

**Guard条件:**
```typescript
canNavigateToTab: (context, event) => {
  // Kill中は危険タブ禁止
  if (context.isKilled && DANGEROUS_TABS.includes(event.tabId)) {
    return false;
  }
  // Critical Error中も危険タブ禁止
  if (context.isCritical && DANGEROUS_TABS.includes(event.tabId)) {
    return false;
  }
  return true;
}
```

---

### ② useControlCenter.ts（拡張）

**追加Export:**
```typescript
// KillSwitch状態
isKilled: boolean;
killReason: string | null;

// エラー状態
hasError: boolean;
isCriticalError: boolean;
errorMessage: string | null;

// アクション
sendKillOn: (reason?: string) => void;
sendKillOff: () => void;
sendCriticalError: (message: string, code?: string) => void;
sendClearError: () => void;
syncKillState: (isKilled: boolean, reason?: string) => void;

// ユーティリティ
isTabDisabled: (tabId: TabId) => boolean;
isDangerousTab: (tabId: TabId) => boolean;
canNavigateTo: (tabId: TabId) => boolean;
```

---

### ③ command-center-content.tsx（UI連動）

**タブUI制御:**
```typescript
// Kill中の危険タブ
<button
  disabled={isDisabled}
  style={{
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.4 : 1,
    color: isDisabled ? 'rgba(255,255,255,0.25)' : ...
  }}
>
  {/* 危険タブマーカー */}
  {isDangerous && isKilled && <Lock size={12} />}
</button>
```

**Kill Switch バナー:**
```typescript
{isKilled && (
  <div style={{ background: '#EF4444' }}>
    <ShieldOff /> KILL SWITCH ACTIVE
    {killReason && <span>• {killReason}</span>}
    <button onClick={() => handleKillSwitch(false)}>Deactivate</button>
  </div>
)}
```

**Critical Error バナー:**
```typescript
{isCriticalError && (
  <div style={{ background: '#DC2626' }}>
    <AlertTriangle /> CRITICAL ERROR: {errorMessage}
    <button onClick={sendClearError}>Dismiss</button>
  </div>
)}
```

**実行系UI無効化:**
```typescript
// Manual Dispatch
<button disabled={isKilled}>
  {isKilled ? <Lock /> : <Play />}
</button>

// Retry ボタン
{!isKilled && <button onClick={onRetry}>Retry</button>}
```

---

## ✅ 完了条件チェック

| 条件 | 状態 |
|------|------|
| Kill ON → 即座に危険タブ操作不可 | ✅ |
| Kill OFF → 元のタブ復帰可能 | ✅ |
| error発生 → healthへ自動遷移 | ✅ |
| useState(activeTab)残存ゼロ | ✅ |
| UI崩れなし | ✅ |

---

## 🔄 遷移フロー

```
                    ┌─────────────┐
                    │    ready    │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ TAB_CLICK│    │KILL_ON   │    │CRIT_ERR  │
    │          │    │          │    │          │
    └────┬─────┘    └────┬─────┘    └────┬─────┘
         │               │               │
         │ (guard OK)    │               │
         ▼               ▼               ▼
    ┌──────────┐  ┌────────────┐  ┌──────────┐
    │  ready   │  │   killed   │  │  error   │
    │(new tab) │  │(危険タブ禁止)│  │(→health) │
    └──────────┘  └──────┬─────┘  └──────────┘
                         │
                   KILL_OFF
                         │
                         ▼
                  ┌──────────┐
                  │  ready   │
                  │(復帰)    │
                  └──────────┘
```

---

## 🧪 動作確認方法

```bash
# 開発サーバー起動
cd ~/n3-frontend_new
npm run dev

# Control Center アクセス
http://localhost:3000/tools/control-n3

# テスト手順
1. Kill Switch ボタンをクリック
2. 理由を入力して確定
3. 危険タブ（Manual, Workflows, Automation）がロックされることを確認
4. 安全タブ（Monitor, Health等）は操作可能
5. Deactivate で解除
6. 全タブ操作可能に復帰
```

---

## 📊 Phase H ロードマップ

| Phase | 内容 | 状態 |
|-------|------|------|
| H-1 | タブ制御のみSM化 | ✅ 完了 |
| H-2 | KillSwitch連動 | ✅ 完了 |
| H-3 | Scheduler/Executing同期 | 次 |
| H-4 | 完全UI制御統合 | - |

---

## 次フェーズ予告: Phase H-3

**Scheduler / Executing 状態とUI同期**

追加内容:
1. `executing` State追加
2. 実行中タブロック
3. dispatch中操作禁止
4. 実行中ステータスバー表示
5. n8n状態リアルタイム同期

```typescript
// Phase H-3 で追加
type SystemState = 'idle' | 'ready' | 'killed' | 'error' | 'executing';

// 実行中は全危険タブ + 一部安全タブもロック
const LOCKED_DURING_EXECUTION: TabId[] = [
  ...DANGEROUS_TABS,
  'tools',  // ツール設定変更禁止
];
```

---

**Phase H-2 実装完了。Kill Switch が UI操作権限レベルで完全統合されました。**
