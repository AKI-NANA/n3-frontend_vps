# N3 Empire OS - UI状態管理・切替ルール最適化 分析レポート

## 1. 現状UI構造分析

### 1.1 Control Center タブ構成（11タブ）

| Tab ID | Label | Icon | Panel Component | 主要機能 |
|--------|-------|------|-----------------|----------|
| `monitor` | Job Monitor | Activity | JobMonitorPanel | ジョブ一覧・進捗監視 |
| `failed` | Failed Jobs | AlertTriangle | FailedJobsPanel | 失敗ジョブ・リトライ |
| `workflows` | Workflows | Server | WorkflowManagerPanel | n8n ワークフロー管理 |
| `tools` | Tools Registry | Settings | ToolsRegistryPanel | ツール登録・設定 |
| `automation` | Automation | Zap | AutomationControlPanel | 自動化マスタースイッチ |
| `health` | Health | HeartPulse | SystemHealthPanel | API Health・Smoke Test |
| `metrics` | Metrics | TrendingUp | MetricsPanel | パフォーマンス指標 |
| `usage` | Usage | Gauge | UsageDashboard | テナント使用量 |
| `approvals` | Approvals | UserCheck | ApprovalsPanel | HitL承認待ち |
| `status` | System | BarChart3 | SystemStatusPanel | システム状態 |
| `manual` | Manual | Terminal | ManualTriggerPanel | 手動Dispatch |

### 1.2 現在の状態変数（useState）

```typescript
// メイン状態
const [activeTab, setActiveTab] = useState<TabId>('monitor');
const [jobs, setJobs] = useState<Job[]>([]);
const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
const [metrics, setMetrics] = useState<Metrics | null>(null);
const [killSwitch, setKillSwitch] = useState<KillSwitchState>({ enabled: true, killSwitchActive: false });
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [autoRefresh, setAutoRefresh] = useState(true);
const [selectedJob, setSelectedJob] = useState<Job | null>(null);

// Manual Trigger 専用
const [manualToolId, setManualToolId] = useState('');
const [manualAction, setManualAction] = useState('execute');
const [manualParams, setManualParams] = useState('{}');
const [isManualExecuting, setIsManualExecuting] = useState(false);
const [manualResult, setManualResult] = useState<any>(null);
```

### 1.3 子パネルの状態変数

**AutomationControlPanel:**
```typescript
const [settings, setSettings] = useState<AutomationSetting[]>([]);
const [stats, setStats] = useState<Stats>({});
const [isLoading, setIsLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false);
const [expandedCategories, setExpandedCategories] = useState<Set<string>>();
const [selectedCategory, setSelectedCategory] = useState<string>('all');
```

**SystemHealthPanel:**
```typescript
const [apiHealth, setApiHealth] = useState<ApiHealthStatus[]>([]);
const [apiSummary, setApiSummary] = useState({});
const [smokeTest, setSmokeTest] = useState<SmokeTestResult | null>(null);
const [isLoadingApis, setIsLoadingApis] = useState(true);
const [isRunningTest, setIsRunningTest] = useState(false);
```

---

## 2. 問題点

### 2.1 状態管理の問題

| 問題 | 詳細 | 影響 |
|------|------|------|
| **状態の分散** | 親・子で独立したuseState群が存在 | 状態同期が困難、バグ発生リスク |
| **条件分岐の散在** | タブ切替・表示制御がif文で点在 | 保守性低下、予期しない動作 |
| **副作用の管理不足** | API呼び出しとUI状態の同期が手動 | race condition発生 |
| **グローバル状態の欠如** | killSwitch状態が子に伝播しない | 矛盾した表示状態 |

### 2.2 UI制御の問題

| 問題 | 現状 | あるべき姿 |
|------|------|-----------|
| **タブ制限なし** | Kill Switch中でも全タブ操作可能 | 危険操作タブはロック |
| **自動遷移なし** | エラー発生時、Healthへ遷移しない | critical error → Health |
| **操作ロックなし** | Smoke Test中も他操作可能 | テスト中は操作ロック |
| **状態表示不整合** | 子パネルが親の状態を知らない | グローバル状態の共有 |

### 2.3 n8n連携の問題

| 問題 | 詳細 |
|------|------|
| **ポーリング依存** | 5秒ごとのfetchでは遅延が発生 |
| **失敗時のロールバックなし** | n8n実行失敗時、UIが中間状態で停止 |
| **同時実行制御なし** | 複数操作が競合する可能性 |

---

## 3. 状態遷移図（テキスト）

### 3.1 システム状態遷移

```
                    ┌─────────────┐
                    │    IDLE     │
                    │  (初期状態)  │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ LOADING  │    │  ERROR   │    │  READY   │
    │  API取得  │    │ API失敗  │    │ 正常動作  │
    └────┬─────┘    └────┬─────┘    └────┬─────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    ┌──────────┐  ┌────────────┐  ┌──────────┐
    │ EXECUTING│  │KILL_SWITCH │  │MAINTENANCE│
    │  実行中   │  │  緊急停止   │  │ メンテ中  │
    └──────────┘  └────────────┘  └──────────┘
```

### 3.2 タブ状態遷移マップ

| 現在状態 | トリガー | 次状態 | UI制御 |
|---------|---------|--------|--------|
| `idle` | `FETCH_DATA` | `loading` | Loader表示 |
| `loading` | `FETCH_SUCCESS` | `ready` | データ表示 |
| `loading` | `FETCH_ERROR` | `error` | エラーバナー表示 |
| `ready` | `TAB_CLICK(id)` | `ready` | タブ切替 |
| `ready` | `START_EXECUTE` | `executing` | 操作ロック |
| `executing` | `EXECUTE_SUCCESS` | `ready` | ロック解除 |
| `executing` | `EXECUTE_FAIL` | `error` | エラー表示 |
| `ready` | `KILL_SWITCH_ON` | `killed` | 全操作ロック |
| `killed` | `KILL_SWITCH_OFF` | `ready` | ロック解除 |
| `error` | `API_CRITICAL` | `error.health_focus` | Health自動遷移 |
| `ready` | `START_SMOKE_TEST` | `smoke_testing` | 全操作ロック |
| `smoke_testing` | `TEST_COMPLETE` | `ready` | ロック解除 |

### 3.3 タブ別操作許可マトリクス

| 状態/タブ | monitor | failed | workflows | tools | automation | health | manual |
|-----------|---------|--------|-----------|-------|------------|--------|--------|
| `ready` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `loading` | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| `executing` | 👁️ | 👁️ | 🚫 | 🚫 | 🚫 | 👁️ | 🚫 |
| `killed` | 👁️ | 👁️ | 🚫 | 🚫 | ✅* | ✅ | 🚫 |
| `smoke_testing` | 👁️ | 👁️ | 🚫 | 🚫 | 🚫 | 👁️ | 🚫 |
| `error` | 👁️ | ✅ | 🚫 | ✅ | ✅ | ✅ | 🚫 |

*: Kill Switch解除のみ許可
✅: 全操作可能, 👁️: 閲覧のみ, 🚫: アクセス不可, ⏳: ロード中

---

## 4. 推奨State Machine構成

### 4.1 State 構造ツリー（XState v5 対応）

```typescript
// types/control-center-machine.ts

export type SystemState = 
  | 'idle'
  | 'loading'
  | 'ready'
  | 'executing'
  | 'killed'
  | 'smoke_testing'
  | 'error'
  | 'maintenance';

export type TabId = 
  | 'monitor' | 'failed' | 'workflows' | 'tools' 
  | 'automation' | 'health' | 'metrics' | 'usage' 
  | 'approvals' | 'status' | 'manual';

export interface ControlCenterContext {
  // Core State
  currentTab: TabId;
  previousTab: TabId | null;
  
  // Data
  jobs: Job[];
  systemStatus: SystemStatus | null;
  metrics: Metrics | null;
  
  // Kill Switch
  killSwitch: {
    active: boolean;
    reason: string | null;
    activatedAt: Date | null;
  };
  
  // Execution
  pendingAction: {
    type: string;
    payload: any;
  } | null;
  
  // Error
  error: {
    message: string;
    code: string;
    critical: boolean;
  } | null;
  
  // Flags
  autoRefresh: boolean;
  lastFetchAt: Date | null;
}
```

### 4.2 Event 定義

```typescript
// events.ts

export type ControlCenterEvent =
  // Navigation
  | { type: 'TAB_CLICK'; tabId: TabId }
  | { type: 'TAB_FORCE_FOCUS'; tabId: TabId }
  
  // Data Fetch
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; data: FetchData }
  | { type: 'FETCH_ERROR'; error: Error }
  
  // Execution
  | { type: 'START_EXECUTE'; action: string; payload: any }
  | { type: 'EXECUTE_SUCCESS'; result: any }
  | { type: 'EXECUTE_FAIL'; error: Error }
  | { type: 'CANCEL_EXECUTE' }
  
  // Kill Switch
  | { type: 'KILL_SWITCH_ACTIVATE'; reason: string }
  | { type: 'KILL_SWITCH_DEACTIVATE' }
  
  // Smoke Test
  | { type: 'START_SMOKE_TEST' }
  | { type: 'SMOKE_TEST_COMPLETE'; result: SmokeTestResult }
  | { type: 'SMOKE_TEST_FAIL'; error: Error }
  
  // Settings
  | { type: 'TOGGLE_AUTO_REFRESH' }
  
  // Error Recovery
  | { type: 'CLEAR_ERROR' }
  | { type: 'RETRY_LAST_ACTION' };
```

### 4.3 Guard 条件

```typescript
// guards.ts

export const guards = {
  // タブ遷移許可
  canNavigateToTab: ({ context, event }) => {
    const { tabId } = event;
    const state = context.currentState;
    
    // Kill Switch中は automation以外の危険タブ禁止
    if (context.killSwitch.active) {
      return !['manual', 'workflows'].includes(tabId);
    }
    
    // 実行中は閲覧系タブのみ
    if (state === 'executing') {
      return ['monitor', 'failed', 'health', 'status'].includes(tabId);
    }
    
    // Smoke Test中は全タブ禁止
    if (state === 'smoke_testing') {
      return false;
    }
    
    return true;
  },
  
  // 実行許可
  canExecute: ({ context }) => {
    return (
      !context.killSwitch.active &&
      context.currentState === 'ready' &&
      !context.pendingAction
    );
  },
  
  // Kill Switch解除許可
  canDeactivateKillSwitch: ({ context }) => {
    // Admin権限確認（実装時追加）
    return context.killSwitch.active;
  },
  
  // エラーがcriticalかどうか
  isCriticalError: ({ context }) => {
    return context.error?.critical === true;
  },
};
```

### 4.4 Side Effects (Actions)

```typescript
// actions.ts

export const actions = {
  // タブ切替
  setActiveTab: assign({
    previousTab: ({ context }) => context.currentTab,
    currentTab: ({ event }) => event.tabId,
  }),
  
  // データ更新
  updateData: assign({
    jobs: ({ event }) => event.data.jobs,
    systemStatus: ({ event }) => event.data.status,
    metrics: ({ event }) => event.data.metrics,
    lastFetchAt: () => new Date(),
  }),
  
  // Kill Switch
  activateKillSwitch: assign({
    killSwitch: ({ event }) => ({
      active: true,
      reason: event.reason,
      activatedAt: new Date(),
    }),
  }),
  
  deactivateKillSwitch: assign({
    killSwitch: () => ({
      active: false,
      reason: null,
      activatedAt: null,
    }),
  }),
  
  // エラー処理
  setError: assign({
    error: ({ event }) => ({
      message: event.error.message,
      code: event.error.code || 'UNKNOWN',
      critical: event.error.critical || false,
    }),
  }),
  
  clearError: assign({
    error: () => null,
  }),
  
  // Critical Error時のHealth遷移
  focusHealthTab: assign({
    previousTab: ({ context }) => context.currentTab,
    currentTab: () => 'health' as TabId,
  }),
};
```

### 4.5 完全なMachine定義

```typescript
// control-center-machine.ts

import { createMachine, assign } from 'xstate';
import { guards } from './guards';
import { actions } from './actions';

export const controlCenterMachine = createMachine({
  id: 'controlCenter',
  initial: 'idle',
  context: {
    currentTab: 'monitor',
    previousTab: null,
    jobs: [],
    systemStatus: null,
    metrics: null,
    killSwitch: { active: false, reason: null, activatedAt: null },
    pendingAction: null,
    error: null,
    autoRefresh: true,
    lastFetchAt: null,
  },
  
  states: {
    idle: {
      on: {
        FETCH_START: 'loading',
      },
      entry: 'initializeData',
    },
    
    loading: {
      invoke: {
        id: 'fetchData',
        src: 'fetchAllData',
        onDone: {
          target: 'ready',
          actions: 'updateData',
        },
        onError: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    
    ready: {
      on: {
        TAB_CLICK: {
          guard: 'canNavigateToTab',
          actions: 'setActiveTab',
        },
        START_EXECUTE: {
          guard: 'canExecute',
          target: 'executing',
          actions: 'setPendingAction',
        },
        KILL_SWITCH_ACTIVATE: {
          target: 'killed',
          actions: 'activateKillSwitch',
        },
        START_SMOKE_TEST: {
          target: 'smoke_testing',
        },
        FETCH_START: 'loading',
      },
      
      // 自動リフレッシュ
      after: {
        5000: {
          guard: ({ context }) => context.autoRefresh,
          target: 'loading',
        },
      },
    },
    
    executing: {
      invoke: {
        id: 'executeAction',
        src: 'dispatchAction',
        onDone: {
          target: 'ready',
          actions: ['clearPendingAction', 'notifySuccess'],
        },
        onError: {
          target: 'error',
          actions: ['clearPendingAction', 'setError'],
        },
      },
      on: {
        TAB_CLICK: {
          guard: 'canNavigateToTab',
          actions: 'setActiveTab',
        },
        CANCEL_EXECUTE: {
          target: 'ready',
          actions: 'clearPendingAction',
        },
      },
    },
    
    killed: {
      on: {
        KILL_SWITCH_DEACTIVATE: {
          guard: 'canDeactivateKillSwitch',
          target: 'ready',
          actions: 'deactivateKillSwitch',
        },
        TAB_CLICK: {
          guard: 'canNavigateToTab',
          actions: 'setActiveTab',
        },
      },
    },
    
    smoke_testing: {
      invoke: {
        id: 'smokeTest',
        src: 'runSmokeTest',
        onDone: {
          target: 'ready',
          actions: 'setSmokeTestResult',
        },
        onError: {
          target: 'error',
          actions: 'setError',
        },
      },
      // 全操作ロック（タブ切替も不可）
    },
    
    error: {
      entry: [
        { guard: 'isCriticalError', actions: 'focusHealthTab' },
      ],
      on: {
        CLEAR_ERROR: 'ready',
        RETRY_LAST_ACTION: 'loading',
        TAB_CLICK: {
          guard: 'canNavigateToTab',
          actions: 'setActiveTab',
        },
      },
    },
    
    maintenance: {
      // 外部から強制的に設定される
      on: {
        EXIT_MAINTENANCE: 'ready',
      },
    },
  },
});
```

---

## 5. UI + n8n 同期設計

### 5.1 同期方式

```
┌─────────────────────────────────────────────────────────────────┐
│                        UI Layer                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ State       │←───│ XState      │───→│ React       │         │
│  │ Machine     │    │ Actor       │    │ Components  │         │
│  └──────┬──────┘    └──────┬──────┘    └─────────────┘         │
│         │                  │                                    │
└─────────┼──────────────────┼────────────────────────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ /api/       │    │ /api/       │    │ /api/       │         │
│  │ dispatch    │    │ automation  │    │ health      │         │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘         │
│         │                  │                  │                 │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       n8n Layer                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Webhook Endpoints                                       │   │
│  │  /webhook/listing-reserve                                │   │
│  │  /webhook/inventory-sync                                 │   │
│  │  /webhook/schedule-cron                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Callback → API → State Machine Update                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 実行失敗時のUIロールバック

```typescript
// services/n8n-sync.ts

interface ExecutionState {
  jobId: string;
  startedAt: Date;
  status: 'pending' | 'running' | 'success' | 'failed';
  rollbackData?: any;
}

export class N8nSyncService {
  private pendingExecutions = new Map<string, ExecutionState>();
  
  async executeWithRollback(
    action: string,
    payload: any,
    send: (event: any) => void
  ): Promise<void> {
    const jobId = generateJobId();
    
    // スナップショット保存
    this.pendingExecutions.set(jobId, {
      jobId,
      startedAt: new Date(),
      status: 'pending',
      rollbackData: payload.currentState,
    });
    
    try {
      // 実行開始
      send({ type: 'START_EXECUTE', action, payload });
      
      const result = await this.callN8n(action, payload);
      
      if (result.success) {
        send({ type: 'EXECUTE_SUCCESS', result });
        this.pendingExecutions.delete(jobId);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      // ロールバック
      const state = this.pendingExecutions.get(jobId);
      if (state?.rollbackData) {
        send({ type: 'ROLLBACK', data: state.rollbackData });
      }
      send({ type: 'EXECUTE_FAIL', error });
      this.pendingExecutions.delete(jobId);
    }
  }
  
  // タイムアウト監視
  startTimeoutWatcher(
    jobId: string,
    timeout: number,
    send: (event: any) => void
  ) {
    setTimeout(() => {
      const state = this.pendingExecutions.get(jobId);
      if (state && state.status === 'running') {
        send({ type: 'EXECUTE_TIMEOUT', jobId });
      }
    }, timeout);
  }
}
```

### 5.3 再実行・中断フロー

```typescript
// 再実行
const handleRetry = () => {
  if (context.lastFailedAction) {
    send({
      type: 'RETRY_LAST_ACTION',
      action: context.lastFailedAction.type,
      payload: context.lastFailedAction.payload,
    });
  }
};

// 中断
const handleCancel = () => {
  send({ type: 'CANCEL_EXECUTE' });
  // n8n側へもキャンセル通知
  fetch('/api/dispatch/cancel', {
    method: 'POST',
    body: JSON.stringify({ jobId: context.pendingAction?.jobId }),
  });
};
```

---

## 6. 実装ロードマップ

### Phase 1: タブ制御のみState Machine化（Week 1）

**範囲:**
- タブ切替ロジック
- 基本的なguard条件
- ローカル状態管理

**実装:**
```typescript
// Phase 1: Minimal Machine
const tabControlMachine = createMachine({
  id: 'tabControl',
  initial: 'ready',
  context: {
    currentTab: 'monitor',
    previousTab: null,
  },
  states: {
    ready: {
      on: {
        TAB_CLICK: {
          actions: assign({
            previousTab: ({ context }) => context.currentTab,
            currentTab: ({ event }) => event.tabId,
          }),
        },
      },
    },
  },
});
```

**既存コード変更:**
```typescript
// Before
const [activeTab, setActiveTab] = useState<TabId>('monitor');
// ...
<button onClick={() => setActiveTab(tab.id)}>

// After
const [state, send] = useMachine(tabControlMachine);
// ...
<button onClick={() => send({ type: 'TAB_CLICK', tabId: tab.id })}>
```

### Phase 2: Automation連動追加（Week 2）

**範囲:**
- Kill Switch状態管理
- 実行状態管理
- エラー状態管理

**実装:**
- `controlCenterMachine` の `killed` / `executing` 状態追加
- guards の実装
- AutomationControlPanel との連携

### Phase 3: n8n同期・完全移行（Week 3-4）

**範囲:**
- n8n callback連携
- ロールバック機構
- 全パネルの状態統合

**実装:**
- N8nSyncService
- 子パネルのContext連携
- 全useStateの撤去

---

## 7. リスクと対策

### 7.1 UIフリーズリスク

| リスク | 発生条件 | 対策 |
|--------|----------|------|
| 無限ループ | 状態遷移の循環参照 | guard条件で防止、ログ監視 |
| 同期処理ブロック | API応答遅延 | 全API呼び出しをinvokeで非同期化 |
| メモリリーク | Actor未破棄 | useEffectのcleanupで確実に破棄 |

### 7.2 非同期競合

| リスク | 発生条件 | 対策 |
|--------|----------|------|
| 同時実行 | 複数ボタン連打 | guard `canExecute` で排他制御 |
| 古いデータ | fetch競合 | 最新のみ採用（timestamp比較） |
| 状態不整合 | 複数タブ | localStorage同期 or BroadcastChannel |

### 7.3 Race Condition

```typescript
// 対策: 実行IDによる検証
const executeWithId = async (action, payload) => {
  const executionId = Date.now();
  send({ type: 'START_EXECUTE', executionId });
  
  const result = await callApi(action, payload);
  
  // 最新の実行IDと一致する場合のみ反映
  if (context.currentExecutionId === executionId) {
    send({ type: 'EXECUTE_SUCCESS', result });
  }
};
```

### 7.4 n8n遅延時のUI誤表示

| リスク | 対策 |
|--------|------|
| 実行中の進捗不明 | progress: 0-100 のポーリング |
| 完了通知遅延 | 30秒タイムアウト後に手動確認 |
| 部分失敗 | 段階的ロールバック |

---

## 8. 実装優先順位

| 順位 | 項目 | 理由 | 工数 |
|------|------|------|------|
| 1 | タブ制御Machine | 最小影響で効果検証 | 0.5日 |
| 2 | Kill Switch連携 | 安全性向上 | 1日 |
| 3 | 実行状態管理 | race condition防止 | 1日 |
| 4 | エラー状態管理 | UX向上 | 0.5日 |
| 5 | n8n同期Service | 堅牢性向上 | 2日 |
| 6 | 全パネル統合 | 完全移行 | 2日 |

**合計: 約7日（1.5週間）**

---

## 9. 次のアクション

### 即時実行可能

1. **Phase 1 Machineファイル作成**
   - `/lib/state-machines/control-center-machine.ts`

2. **React Hook作成**
   - `/lib/hooks/useControlCenter.ts`

3. **command-center-content.tsx への適用**
   - useState → useMachine 置換

### 確認事項

- XState v5 インストール可否
- 既存テストの存在確認
- パフォーマンス要件確認

---

**このレポートに基づき、Phase 1 の実装コードを生成しますか？**
