// components/n3/workflow-action-bar.tsx
/**
 * N3 Workflow Action Bar
 * 
 * タブ上部に表示されるn8nワークフロー実行ボタン群
 * 選択された商品に対してワークフローを実行
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Loader2, 
  CheckCircle, 
  XCircle,
  ChevronRight
} from 'lucide-react';
import { getWorkflowsByUILocation, N8nWorkflow, WorkflowCategory } from '@/lib/n8n/workflow-registry';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// カテゴリアイコン
const CATEGORY_ICONS: Record<WorkflowCategory, string> = {
  listing: '📦',
  inventory: '📊',
  research: '🔍',
  orders: '📋',
  shipping: '🚚',
  sync: '🔄',
  ai: '🤖',
  pricing: '💰',
  translation: '🌐',
  approval: '✅',
  notification: '🔔',
  defense: '🛡️',
  command: '⚡',
  media: '🎬',
  finance: '💹',
  other: '📁',
};

interface ExecutionState {
  status: 'idle' | 'running' | 'success' | 'error';
  message?: string;
}

interface WorkflowActionBarProps {
  tab: 'editing-n3' | 'research-n3' | 'operations-n3' | 'finance-n3' | 'control-n3';
  l2Tab?: string;
  l3Filter?: string;
  selectedIds?: (string | number)[];
  onExecutionComplete?: (workflowId: string, result: unknown) => void;
  className?: string;
}

export function WorkflowActionBar({
  tab,
  l2Tab,
  l3Filter,
  selectedIds = [],
  onExecutionComplete,
  className,
}: WorkflowActionBarProps) {
  const [executionStates, setExecutionStates] = useState<Record<string, ExecutionState>>({});

  // 該当タブのワークフローを取得
  const workflows = useMemo(() => {
    return getWorkflowsByUILocation(tab, l2Tab, l3Filter);
  }, [tab, l2Tab, l3Filter]);

  // ワークフロー実行
  const executeWorkflow = useCallback(async (workflow: N8nWorkflow) => {
    const workflowId = workflow.id;
    
    // 実行中状態に更新
    setExecutionStates(prev => ({
      ...prev,
      [workflowId]: { status: 'running' },
    }));

    try {
      // 入力パラメータの検証
      if (workflow.requiredInputs?.includes('productIds') && selectedIds.length === 0) {
        toast.warning('商品が選択されていません', {
          description: 'ワークフロー実行には商品を選択してください',
        });
        setExecutionStates(prev => ({
          ...prev,
          [workflowId]: { status: 'idle' },
        }));
        return;
      }

      // n8n-proxy経由でWebhook呼び出し
      const response = await fetch('/api/n8n-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: workflow.webhookPath,
          data: {
            action: 'execute',
            ids: selectedIds,
            source: 'workflow_action_bar',
            workflow_id: workflowId,
            workflow_version: workflow.version,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // 成功状態に更新
      setExecutionStates(prev => ({
        ...prev,
        [workflowId]: { 
          status: 'success',
          message: result.message || '実行完了',
        },
      }));

      toast.success(`${workflow.nameJa} 実行完了`, {
        description: result.message || `${selectedIds.length}件処理しました`,
      });

      // コールバック呼び出し
      onExecutionComplete?.(workflowId, result);

      // 3秒後にアイドル状態に戻す
      setTimeout(() => {
        setExecutionStates(prev => ({
          ...prev,
          [workflowId]: { status: 'idle' },
        }));
      }, 3000);

    } catch (error) {
      console.error(`Workflow execution failed: ${workflowId}`, error);
      
      // エラー状態に更新
      setExecutionStates(prev => ({
        ...prev,
        [workflowId]: { 
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }));

      toast.error(`${workflow.nameJa} 実行失敗`, {
        description: error instanceof Error ? error.message : '不明なエラー',
      });

      // 5秒後にアイドル状態に戻す
      setTimeout(() => {
        setExecutionStates(prev => ({
          ...prev,
          [workflowId]: { status: 'idle' },
        }));
      }, 5000);
    }
  }, [selectedIds, onExecutionComplete]);

  // ワークフローがない場合は何も表示しない
  if (workflows.length === 0) {
    return null;
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 border-b",
        "bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20",
        "border-amber-200/50 dark:border-amber-800/50",
        className
      )}
    >
      {/* ラベル */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
        <Zap className="h-3.5 w-3.5" />
        <span>n8n</span>
        <ChevronRight className="h-3 w-3 opacity-50" />
      </div>

      {/* ワークフローボタン群 */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {workflows.map(workflow => {
          const state = executionStates[workflow.id] || { status: 'idle' };
          const isRunning = state.status === 'running';
          const isSuccess = state.status === 'success';
          const isError = state.status === 'error';
          const isDisabled = isRunning || workflow.status !== 'active';

          // Tooltip代わりにtitle属性を使用
          const tooltipText = `${workflow.nameJa}\n${workflow.description}\nWebhook: ${workflow.webhookPath}\nVersion: ${workflow.version}`;

          return (
            <Button
              key={workflow.id}
              variant={isSuccess ? 'outline' : isError ? 'destructive' : 'secondary'}
              size="sm"
              onClick={() => executeWorkflow(workflow)}
              disabled={isDisabled}
              title={tooltipText}
              className={cn(
                "h-7 px-2.5 text-xs gap-1.5 transition-all",
                isSuccess && "border-green-500 text-green-700 bg-green-50",
                isError && "border-red-500"
              )}
            >
              {isRunning ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isSuccess ? (
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              ) : isError ? (
                <XCircle className="h-3.5 w-3.5" />
              ) : (
                <span>{CATEGORY_ICONS[workflow.category]}</span>
              )}
              {workflow.uiLocation?.buttonLabel || workflow.nameJa}
            </Button>
          );
        })}
      </div>

      {/* 選択数表示 */}
      {selectedIds.length > 0 && (
        <Badge variant="secondary" className="ml-auto text-xs">
          {selectedIds.length}件選択中
        </Badge>
      )}
    </div>
  );
}

export default WorkflowActionBar;
