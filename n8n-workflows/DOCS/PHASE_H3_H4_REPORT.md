# Phase H-3 + H-4 実装完了レポート

## 🎯 目的達成

### Phase H-3: 実行状態同期
| 機能 | 状態 |
|------|------|
| 実行中は操作不可 | ✅ |
| 実行状態を一目で把握 | ✅ |
| 事故操作ゼロ化 | ✅ |

### Phase H-4: API状態リアルタイム反映
| 機能 | 状態 |
|------|------|
| リロードせずに状態反映 | ✅ |
| Kill外部操作でもUI即反映 | ✅ |
| 実行終了が自動でUI解除 | ✅ |

---

## 📁 変更ファイル

### ① control-center-machine.ts

**追加State:**
```typescript
type SystemState = 'idle' | 'ready' | 'executing' | 'killed' | 'error';
```

**追加Context（H-3 実行状態）:**
```typescript
isExecuting: boolean;
activeJobType: 'scheduler' | 'pipeline' | 'dispatch' | 'startup' | null;
activeJobId: string | null;
progress: number;
progressMessage: string | null;
executionStartedAt: Date | null;
```

**追加Context（H-4 API状態）:**
```typescript
apiHealth: {
  n8n: HealthStatus;
  database: HealthStatus;
  api: HealthStatus;
  scheduler: HealthStatus;
  lastChecked: Date | null;
};
isPolling: boolean;
lastPollAt: Date | null;
pollErrors: number;
```

**追加Event（H-3）:**
```typescript
| { type: 'EXECUTION_START'; jobType: JobType; jobId?: string; message?: string }
| { type: 'EXECUTION_PROGRESS'; progress: number; message?: string }
| { type: 'EXECUTION_COMPLETE'; jobId?: string }
| { type: 'EXECUTION_FAILED'; error: string; code?: string }
```

**追加Event（H-4）:**
```typescript
| { type: 'API_HEALTH_UPDATE'; health: Partial<ApiHealthState> }
| { type: 'POLL_START' }
| { type: 'POLL_STOP' }
| { type: 'POLL_ERROR' }
| { type: 'POLL_SUCCESS' }
```

**実行ロックタブ:**
```typescript
const EXECUTION_LOCKED_TABS: TabId[] = [
  'manual',
  'workflows',
  'automation',
  'tools',
];
```

**Guard追加:**
```typescript
canExecute: (context) => {
  return !context.isKilled && !context.isExecuting && !context.isCritical;
}
```

---

### ② useControlCenter.ts

**追加Export（H-3）:**
```typescript
// 実行状態
isExecuting: boolean;
activeJobType: JobType;
progress: number;
progressMessage: string | null;
canExecute: boolean;

// 実行アクション
startExecution: (jobType: JobType, jobId?: string, message?: string) => void;
updateProgress: (progress: number, message?: string) => void;
completeExecution: () => void;
failExecution: (error: string, code?: string) => void;
```

**追加Export（H-4）:**
```typescript
// API状態
apiHealth: ApiHealthState;
isPolling: boolean;
pollErrors: number;

// Pollingアクション
startPolling: () => void;
stopPolling: () => void;
updateApiHealth: (health: Partial<ApiHealthState>) => void;
```

**Polling実装:**
```typescript
// 5秒間隔でAPI状態をポーリング
useEffect(() => {
  if (!enablePolling || !state.isPolling) return;
  
  poll(); // 即時実行
  pollingRef.current = setInterval(poll, pollingInterval);
  
  return () => clearInterval(pollingRef.current);
}, [enablePolling, state.isPolling, pollingInterval, poll]);

// visibilitychange対応
useEffect(() => {
  const handleVisibility = () => {
    isVisibleRef.current = document.visibilityState === 'visible';
    if (isVisibleRef.current && state.isPolling) poll();
  };
  document.addEventListener('visibilitychange', handleVisibility);
  return () => document.removeEventListener('visibilitychange', handleVisibility);
}, [state.isPolling, poll]);
```

---

### ③ command-center-content.tsx

**Progress Bar Component（H-3）:**
```typescript
<ExecutionProgressBar 
  jobType={activeJobType} 
  progress={progress} 
  message={progressMessage} 
/>

// 表示例:
// 🟢 Running Scheduler... ████████░░ 70%
```

**API Health Badge（H-4）:**
```typescript
<ApiHealthBadge name="n8n" status={apiHealth.n8n} />
<ApiHealthBadge name="DB" status={apiHealth.database} />
<ApiHealthBadge name="API" status={apiHealth.api} />
```

**Polling Status:**
```typescript
<div>
  <Radio size={12} color={isPolling ? COLORS.completed : COLORS.cancelled} />
  <span>{isPolling ? 'Live' : 'Paused'}</span>
  {pollErrors > 0 && ` (${pollErrors} errors)`}
</div>
```

**実行ロックUI:**
```typescript
const isOperationLocked = isKilled || isExecuting;

// ボタン無効化
<button disabled={isOperationLocked || !canExecute}>
  {isDisabled ? <Lock /> : <Play />}
</button>

// タブ無効化
{isExecutionLockedTab(tab.id) && isExecuting && (
  <Lock size={12} style={{ color: COLORS.running }} />
)}
```

---

## 🔄 状態遷移フロー

```
┌─────────────────────────────────────────────────────────────┐
│                         ready                                │
└─────────────────────────────────────────────────────────────┘
         │              │              │
   EXECUTION_START  KILL_ON     CRITICAL_ERROR
         │              │              │
         ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  executing   │ │   killed     │ │    error     │
│              │ │              │ │              │
│ ・操作ロック  │ │ ・危険タブ禁止│ │ ・Health遷移  │
│ ・Progress表示│ │ ・実行強制停止│ │              │
└──────────────┘ └──────────────┘ └──────────────┘
         │              │              │
  COMPLETE/FAIL    KILL_OFF     CLEAR_ERROR
         │              │              │
         ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                         ready                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Polling フロー（H-4）

```
┌─────────────┐    5秒間隔     ┌─────────────┐
│   Start     │───────────────▶│    Poll     │
│   Polling   │                │   API状態    │
└─────────────┘                └──────┬──────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
   ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
   │ Kill状態同期  │          │ Health更新   │          │ 実行状態同期  │
   │              │          │              │          │              │
   │ API→UI反映   │          │ LED更新      │          │ scheduler検知│
   └──────────────┘          └──────────────┘          └──────────────┘
```

**Polling対象API:**
| API | Event |
|-----|-------|
| `/api/dispatch/kill-switch` | `SYNC_KILL_STATE` |
| `/api/dispatch/status` | `EXECUTION_START/COMPLETE` |
| `/api/health/apis` | `API_HEALTH_UPDATE` |

---

## ✅ 完了条件チェック

### Phase H-3
| 条件 | 状態 |
|------|------|
| 実行中に操作不可 | ✅ |
| 実行終了で即解除 | ✅ |
| Kill発動でexecuting→killed強制遷移 | ✅ |

### Phase H-4
| 条件 | 状態 |
|------|------|
| リロードせずに状態反映 | ✅ |
| Kill外部操作でもUI即反映 | ✅ |
| 実行終了が自動でUI解除 | ✅ |
| visibilitychange停止対応 | ✅ |
| error時自動停止（5回連続） | ✅ |

---

## 🎨 UI表示

### ヘッダー状態表示
```
┌────────────────────────────────────────────────────────────┐
│ 🎛️ Empire Command Center                                   │
│ Phase H-4 • State: EXECUTING • EXECUTING SCHEDULER         │
├────────────────────────────────────────────────────────────┤
│ 📡 Live  |  🛑 Kill Switch  |  🔄 Auto Refresh  |  🟢🟢🟢  │
└────────────────────────────────────────────────────────────┘
```

### Progress Bar（実行中）
```
┌────────────────────────────────────────────────────────────┐
│ 🟢 Running Scheduler...  ████████████░░░░░░  70%  Building │
└────────────────────────────────────────────────────────────┘
```

### タブロック表示
```
[Monitor] [Failed] [Workflows🔒] [Tools🔒] [Automation🔒] ...
                       ↑            ↑           ↑
                   実行中ロック（opacity: 0.4, cursor: not-allowed）
```

---

## 📊 Phase H ロードマップ

| Phase | 内容 | 状態 |
|-------|------|------|
| H-1 | タブ制御のみSM化 | ✅ 完了 |
| H-2 | KillSwitch連動 | ✅ 完了 |
| H-3 | 実行状態同期 | ✅ 完了 |
| H-4 | API状態リアルタイム反映 | ✅ 完了 |
| H-5 | 操作フロー制約（事故防止） | 次 |
| H-6 | Realtime Cockpit化（WebSocket） | - |

---

## 🧪 動作確認方法

```bash
# 開発サーバー起動
cd ~/n3-frontend_new
npm run dev

# Control Center アクセス
http://localhost:3000/tools/control-n3

# テスト手順（H-3）
1. Manual タブで実行開始
2. Progress Bar が表示されることを確認
3. 他の危険タブがロックされることを確認
4. 実行完了後にロック解除を確認

# テスト手順（H-4）
1. 別ウィンドウで Kill Switch API を直接呼び出す
2. UI が自動的に KILLED 状態になることを確認
3. API Health の状態が LED に反映されることを確認
4. タブ切替してから戻っても状態が維持されることを確認
```

---

## 次フェーズ: Phase H-5

**操作フロー制約（事故防止フェーズ）**

追加内容:
1. 二重確認UI（`CONFIRM_REQUIRED` event）
2. 起動禁止条件チェック
3. Audit Log（全操作ログ）

```typescript
// 二重確認モーダル
<ConfirmModal
  title="Start Scheduler?"
  message="Type: START to confirm"
  onConfirm={() => startExecution('scheduler')}
/>

// Audit Log
await fetch('/api/system/audit', {
  method: 'POST',
  body: JSON.stringify({
    action: 'KILL_SWITCH_ON',
    beforeState: 'ready',
    afterState: 'killed',
    timestamp: new Date().toISOString(),
  }),
});
```

---

**Phase H-3 + H-4 実装完了。実行状態同期とAPI状態リアルタイム反映が完成しました。**
