# Phase H-5 + H-6 実装完了レポート

## 🎯 目的達成

### Phase H-5: 操作フロー制約（事故防止）
| 機能 | 状態 |
|------|------|
| 危険操作は二段階確認 | ✅ |
| UI単体で事故不可 | ✅ |
| 操作ログ100%取得 | ✅ |

### Phase H-6: Realtime Cockpit化
| 機能 | 状態 |
|------|------|
| SSE リアルタイム接続 | ✅ |
| Push通知 | ✅ |
| Progress Stream | ✅ |

---

## 📁 新規作成ファイル

### ① /app/api/system/audit/route.ts
```typescript
// Audit Log API
POST /api/system/audit
{
  action: string,
  action_category: 'kill_switch' | 'execution' | 'startup' | 'config' | 'approval' | 'system',
  target_type?: string,
  target_id?: string,
  before_state?: Record<string, any>,
  after_state?: Record<string, any>,
  metadata?: Record<string, any>
}

GET /api/system/audit?limit=100&category=kill_switch&since=2025-01-01
```

### ② /app/api/system/events/route.ts
```typescript
// SSE リアルタイムイベント API
GET /api/system/events (SSE Stream)

Events:
- connected: 接続確立
- system_status: システム状態（3秒間隔）
- kill_switch: Kill状態変更
- execution_start: 実行開始
- execution_progress: 進捗更新
- execution_complete: 実行完了
- execution_failed: 実行失敗
- health_update: Health状態変更
- error: エラー通知
- heartbeat: 接続維持
```

### ③ /app/tools/control-n3/components/confirm-modal.tsx
```typescript
// 二重確認モーダルコンポーネント
<ConfirmModal
  isOpen={true}
  title="Deactivate Kill Switch?"
  message="This will re-enable all automation services."
  confirmText="DEACTIVATE"
  onConfirm={() => {}}
  onCancel={() => {}}
  variant="warning"
/>

// 入力一致で初めて実行可能
// Type: DEACTIVATE to confirm
```

---

## 📁 変更ファイル

### control-center-machine.ts

**追加State:**
```typescript
type SystemState = '... | confirming';
```

**追加Context（H-5）:**
```typescript
// 確認モーダル
confirm: {
  isOpen: boolean;
  action: ConfirmableAction | null;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: (() => void) | null;
  metadata?: Record<string, any>;
};
pendingAuditLogs: AuditEntry[];

// Preflight
preflightPassed: boolean;
preflightErrors: string[];
```

**追加Context（H-6）:**
```typescript
sseConnected: boolean;
lastSseEvent: Date | null;
```

**追加Event（H-5）:**
```typescript
| { type: 'CONFIRM_REQUIRED'; action: ConfirmableAction; title: string; message: string; confirmText: string; metadata?: Record<string, any> }
| { type: 'CONFIRM_ACCEPT' }
| { type: 'CONFIRM_CANCEL' }
| { type: 'PREFLIGHT_PASS' }
| { type: 'PREFLIGHT_FAIL'; errors: string[] }
| { type: 'AUDIT_LOG'; entry: AuditEntry }
| { type: 'AUDIT_LOG_SENT' }
```

**追加Event（H-6）:**
```typescript
| { type: 'SSE_CONNECTED' }
| { type: 'SSE_DISCONNECTED' }
| { type: 'SSE_EVENT'; eventType: string; data: any }
```

**二重確認対象アクション:**
```typescript
type ConfirmableAction = 
  | 'startup'
  | 'kill_deactivate'
  | 'manual_execute'
  | 'bulk_retry'
  | 'scheduler_start';

const CONFIRMABLE_ACTIONS = {
  startup: { title: 'Start System?', confirmText: 'START' },
  kill_deactivate: { title: 'Deactivate Kill Switch?', confirmText: 'DEACTIVATE' },
  manual_execute: { title: 'Execute Manual Dispatch?', confirmText: 'EXECUTE' },
  bulk_retry: { title: 'Retry All Failed Jobs?', confirmText: 'RETRY ALL' },
  scheduler_start: { title: 'Start Scheduler?', confirmText: 'START' },
};
```

---

### useControlCenter.ts

**追加Export（H-5）:**
```typescript
// 確認モーダル
isConfirming: boolean;
confirmState: ConfirmState;
requestConfirm: (action: ConfirmableAction, metadata?: Record<string, any>) => void;
confirmAccept: () => void;
confirmCancel: () => void;

// Preflight
preflightPassed: boolean;
preflightErrors: string[];
preflightPass: () => void;
preflightFail: (errors: string[]) => void;

// Audit Log
logAudit: (entry: AuditEntry) => Promise<void>;

// ユーティリティ
requiresConfirmation: (action: ConfirmableAction) => boolean;
```

**追加Export（H-6）:**
```typescript
sseConnected: boolean;
```

**SSE接続:**
```typescript
useEffect(() => {
  if (!enableSSE) return;
  
  const sse = new EventSource('/api/system/events');
  
  sse.onopen = () => dispatch({ type: 'SSE_CONNECTED' });
  sse.onerror = () => {
    dispatch({ type: 'SSE_DISCONNECTED' });
    setTimeout(connectSSE, 5000); // 自動再接続
  };
  
  // イベントリスナー
  sse.addEventListener('system_status', (event) => {
    const data = JSON.parse(event.data);
    dispatch({ type: 'SYNC_KILL_STATE', ... });
  });
  
  // ... 他のイベント
  
  return () => sse.close();
}, [enableSSE]);
```

---

## 🔒 二重確認フロー

```
┌─────────────┐
│  ユーザー    │
│ 危険操作要求 │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ requestConfirm │
│ (action, meta) │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│           確認モーダル               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Deactivate Kill Switch?     │   │
│  │                             │   │
│  │ Type: DEACTIVATE to confirm │   │
│  │ [________________]          │   │
│  │                             │   │
│  │ [Cancel]  [Confirm:disabled]│   │
│  └─────────────────────────────┘   │
└─────────────────┬───────────────────┘
                  │
       ┌──────────┴──────────┐
       │                     │
       ▼                     ▼
┌─────────────┐       ┌─────────────┐
│ 入力不一致   │       │ 入力一致    │
│             │       │ DEACTIVATE  │
│ Confirm無効 │       │ Confirm有効 │
└─────────────┘       └──────┬──────┘
                             │
                             ▼
                      ┌─────────────┐
                      │ confirmAccept │
                      │ + callback実行│
                      │ + Audit Log  │
                      └─────────────┘
```

---

## 📝 Audit Log フロー

```
┌─────────────┐
│  危険操作    │
│ （確認済み） │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ logAudit({                          │
│   action: 'KILL_SWITCH_DEACTIVATE', │
│   action_category: 'kill_switch',   │
│   before_state: { isKilled: true }, │
│   after_state: { isKilled: false }, │
│ })                                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────┐
│ POST        │
│ /api/system │
│ /audit      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Supabase    │
│ audit_logs  │
│ テーブル    │
└─────────────┘
```

---

## 📡 SSE リアルタイムフロー（H-6）

```
┌─────────────┐        ┌─────────────┐
│   Client    │◀──────│    Server   │
│  (Browser)  │  SSE  │   (Next.js) │
└──────┬──────┘        └──────┬──────┘
       │                      │
       │ GET /api/system/events
       │─────────────────────▶│
       │                      │
       │◀─ event: connected ──│
       │                      │
       │                      │ (3秒間隔)
       │◀─ event: system_status
       │                      │
       │◀─ event: heartbeat ──│
       │                      │
       │      (Kill発動時)     │
       │◀─ event: kill_switch─│
       │                      │
       │      (実行開始時)     │
       │◀─ execution_start ───│
       │◀─ execution_progress─│
       │◀─ execution_complete─│
       │                      │
```

---

## 🎨 UI表示

### ヘッダー状態表示（H-6追加）
```
┌────────────────────────────────────────────────────────────┐
│ 🎛️ Empire Command Center                                   │
│ Phase H-6 Final • State: READY                             │
├────────────────────────────────────────────────────────────┤
│ 📶 Realtime  |  📡 Live  |  🛑 Kill  |  🟢🟢🟢            │
│  ↑ SSE接続      ↑ Polling                                  │
└────────────────────────────────────────────────────────────┘
```

### 確認モーダル（H-5）
```
┌────────────────────────────────────────────────────────────┐
│ 🛡️ Deactivate Kill Switch?                              ✕ │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ This will re-enable all automation services.               │
│                                                            │
│ Type DEACTIVATE to confirm                                 │
│ ┌────────────────────────────────────────────────────────┐ │
│ │                    DEACTIVA                            │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ ┌──────────────┐  ┌──────────────────────────────────────┐│
│ │    Cancel    │  │           Confirm (disabled)         ││
│ └──────────────┘  └──────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

### Preflight エラー表示（H-5）
```
┌────────────────────────────────────────────────────────────┐
│ ⚠️ Preflight check failed: n8n offline, database degraded  │
└────────────────────────────────────────────────────────────┘
```

---

## ✅ 完了条件チェック

### Phase H-5
| 条件 | 状態 |
|------|------|
| 危険操作は二段階確認 | ✅ |
| UI単体で事故不可 | ✅ |
| 操作ログ100%取得 | ✅ |
| Preflight チェック | ✅ |

### Phase H-6
| 条件 | 状態 |
|------|------|
| SSE リアルタイム接続 | ✅ |
| Kill Switch Push通知 | ✅ |
| 実行 Progress Stream | ✅ |
| Health Push通知 | ✅ |
| 自動再接続 | ✅ |

---

## 📊 Phase H 全体ロードマップ

| Phase | 内容 | 状態 |
|-------|------|------|
| H-1 | タブ制御SM化 | ✅ 完了 |
| H-2 | KillSwitch連動 | ✅ 完了 |
| H-3 | 実行状態同期 | ✅ 完了 |
| H-4 | API状態リアルタイム | ✅ 完了 |
| H-5 | 操作フロー制約 | ✅ 完了 |
| H-6 | Realtime Cockpit化 | ✅ 完了 |

---

## 🧪 動作確認方法

```bash
# 開発サーバー起動
cd ~/n3-frontend_new
npm run dev

# Control Center アクセス
http://localhost:3000/tools/control-n3

# テスト手順（H-5 二重確認）
1. Kill Switch を有効化
2. Deactivate ボタンクリック
3. 確認モーダルが表示される
4. "DEACTIVATE" と入力
5. 入力一致で Confirm ボタンが有効化
6. Confirm クリックで実行

# テスト手順（H-5 Audit Log）
1. 任意の操作を実行
2. コンソールまたはDB で audit_logs を確認
3. action, before_state, after_state が記録されている

# テスト手順（H-6 SSE）
1. ブラウザのネットワークタブを開く
2. /api/system/events への接続を確認
3. 別ウィンドウで Kill Switch を操作
4. 元のウィンドウで即座に状態が反映される
```

---

## 📊 完成形: Empire Command Center

```
リアルタイム制御盤
＝ 運用監視センター

機能:
✅ タブ制御 State Machine
✅ KillSwitch 連動
✅ 実行状態同期
✅ API Polling (5秒)
✅ SSE リアルタイム (3秒)
✅ 二重確認モーダル
✅ Audit Log
✅ Preflight チェック
✅ 自動再接続
✅ Progress Bar
✅ Health Badge
```

---

**Phase H 全フェーズ実装完了！🎉**

Empire Command Center は完全な運用監視センターとして機能します。
