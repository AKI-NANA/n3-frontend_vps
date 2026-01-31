// lib/listing/state-machine.ts
/**
 * 出品状態遷移ステートマシン
 * 
 * 設計書: docs/LISTING_SAFETY_DESIGN_V1.md
 * 
 * 目的:
 * - 誤出品防止
 * - 人間承認必須の強制
 * - 状態遷移の一貫性保証
 */

// ============================================================
// 型定義
// ============================================================

export type WorkflowStatus = 
  | 'scraped'
  | 'translated'
  | 'sm_searching'
  | 'sm_selected'
  | 'details_fetched'
  | 'audited'
  | 'approved'
  | 'auto_approved'
  | 'rejected'
  | 'listing_queued'
  | 'scheduled'
  | 'listing_now'
  | 'listing'
  | 'listed'
  | 'error'
  | 'partial';

export interface TransitionContext {
  isAutoApprovalEnabled: boolean;
  isHumanConfirmed: boolean;
  userId?: string;
  source?: 'ui-manual' | 'scheduler' | 'api';
}

export interface TransitionResult {
  allowed: boolean;
  reason?: string;
  requiresConfirmation?: boolean;
}

// ============================================================
// ステートマシン定義
// ============================================================

export const LISTING_STATE_MACHINE = {
  /**
   * 状態遷移マップ
   * 現在の状態 → 許可される次の状態の配列
   */
  transitions: {
    // 工程フロー
    'scraped': ['translated'],
    'translated': ['sm_searching'],
    'sm_searching': ['sm_selected'],
    'sm_selected': ['details_fetched'],
    'details_fetched': ['audited'],
    
    // 承認分岐
    'audited': ['approved', 'rejected', 'auto_approved'],
    
    // 出品フロー（承認後のみ）
    'approved': ['listing_queued', 'scheduled', 'listing_now'],
    'auto_approved': ['listing_queued', 'scheduled', 'listing_now'],
    
    // キュー処理
    'listing_queued': ['listing'],
    'scheduled': ['listing'],
    'listing_now': ['listing'],
    
    // 出品結果
    'listing': ['listed', 'error', 'partial'],
    
    // エラーリカバリ
    'error': ['translated', 'audited'],
    'partial': ['listed', 'error'],
    
    // 却下からの復帰
    'rejected': ['translated'],
  } as Record<WorkflowStatus, WorkflowStatus[]>,
  
  /**
   * 人間承認が必要な遷移
   */
  requiresHumanApproval: [
    'audited → approved',
    'approved → listing_now',
  ],
  
  /**
   * 自動遷移可能（条件付き）
   */
  autoTransitionAllowed: [
    'audited → auto_approved',
    'approved → scheduled',
    'scheduled → listing',
    'listing_queued → listing',
  ],
  
  /**
   * 危険な遷移（追加確認推奨）
   */
  dangerousTransitions: [
    'approved → listing_now',  // 即時出品
  ],
};

// ============================================================
// バリデーション関数
// ============================================================

/**
 * 状態遷移が許可されているかチェック
 */
export function canTransition(
  from: WorkflowStatus,
  to: WorkflowStatus,
  context: TransitionContext
): TransitionResult {
  // 1. 基本的な遷移チェック
  const allowedNextStates = LISTING_STATE_MACHINE.transitions[from];
  
  if (!allowedNextStates) {
    return { 
      allowed: false, 
      reason: `Unknown status: ${from}` 
    };
  }
  
  if (!allowedNextStates.includes(to)) {
    return { 
      allowed: false, 
      reason: `${from} → ${to} は許可されていません。許可される遷移: ${allowedNextStates.join(', ')}` 
    };
  }
  
  const transitionKey = `${from} → ${to}`;
  
  // 2. 人間承認チェック
  if (LISTING_STATE_MACHINE.requiresHumanApproval.includes(transitionKey)) {
    if (!context.isHumanConfirmed) {
      return { 
        allowed: false, 
        reason: '人間による承認が必要です',
        requiresConfirmation: true,
      };
    }
  }
  
  // 3. 自動承認チェック
  if (transitionKey === 'audited → auto_approved') {
    if (!context.isAutoApprovalEnabled) {
      return { 
        allowed: false, 
        reason: '自動承認が無効です。設定で有効にしてください。' 
      };
    }
  }
  
  // 4. スケジューラからの遷移チェック
  if (context.source === 'scheduler') {
    // スケジューラは自動承認が有効でないと出品できない
    if (to === 'listing' || to === 'listing_now') {
      if (!context.isAutoApprovalEnabled) {
        return { 
          allowed: false, 
          reason: 'スケジューラからの出品には自動承認の有効化が必要です' 
        };
      }
    }
  }
  
  // 5. 危険な遷移の追加確認
  if (LISTING_STATE_MACHINE.dangerousTransitions.includes(transitionKey)) {
    return {
      allowed: true,
      requiresConfirmation: true,
    };
  }
  
  return { allowed: true };
}

/**
 * 出品可能かチェック
 */
export function canList(status: WorkflowStatus): boolean {
  return status === 'approved' || status === 'auto_approved';
}

/**
 * 承認可能かチェック
 */
export function canApprove(status: WorkflowStatus): boolean {
  return status === 'audited';
}

/**
 * 工程を戻せるかチェック
 */
export function canRevert(
  from: WorkflowStatus, 
  to: WorkflowStatus
): boolean {
  // エラー状態からの復帰
  if (from === 'error' || from === 'rejected') {
    return to === 'translated' || to === 'audited';
  }
  return false;
}

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * 次に許可される状態一覧を取得
 */
export function getAllowedNextStates(
  current: WorkflowStatus,
  context: TransitionContext
): WorkflowStatus[] {
  const allNext = LISTING_STATE_MACHINE.transitions[current] || [];
  
  return allNext.filter(next => {
    const result = canTransition(current, next, context);
    return result.allowed || result.requiresConfirmation;
  });
}

/**
 * 状態のカテゴリを取得
 */
export function getStatusCategory(status: WorkflowStatus): 
  'workflow' | 'approval' | 'listing' | 'result' | 'error' {
  const workflowStatuses: WorkflowStatus[] = [
    'scraped', 'translated', 'sm_searching', 'sm_selected', 
    'details_fetched', 'audited'
  ];
  const approvalStatuses: WorkflowStatus[] = [
    'approved', 'auto_approved', 'rejected'
  ];
  const listingStatuses: WorkflowStatus[] = [
    'listing_queued', 'scheduled', 'listing_now', 'listing'
  ];
  const resultStatuses: WorkflowStatus[] = ['listed'];
  const errorStatuses: WorkflowStatus[] = ['error', 'partial'];
  
  if (workflowStatuses.includes(status)) return 'workflow';
  if (approvalStatuses.includes(status)) return 'approval';
  if (listingStatuses.includes(status)) return 'listing';
  if (resultStatuses.includes(status)) return 'result';
  if (errorStatuses.includes(status)) return 'error';
  
  return 'workflow';
}

/**
 * 状態の表示ラベルを取得
 */
export function getStatusLabel(status: WorkflowStatus): string {
  const labels: Record<WorkflowStatus, string> = {
    'scraped': '取得済み',
    'translated': '翻訳済み',
    'sm_searching': 'SM検索中',
    'sm_selected': 'SM選択済み',
    'details_fetched': '詳細取得済み',
    'audited': '監査完了',
    'approved': '承認済み',
    'auto_approved': '自動承認済み',
    'rejected': '却下',
    'listing_queued': '出品待ち',
    'scheduled': '出品予約',
    'listing_now': '即時出品中',
    'listing': '出品処理中',
    'listed': '出品完了',
    'error': 'エラー',
    'partial': '部分成功',
  };
  
  return labels[status] || status;
}
