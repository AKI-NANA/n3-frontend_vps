// app/tools/editing-n3/components/header/n3-workflow-actions.tsx
/**
 * n8n Workflow Action Buttons
 * 
 * 各タブに配置するワークフロー実行ボタン群
 * - レジストリから該当タブのワークフローを取得
 * - ボタンクリックでn8n-proxy経由でWebhook実行
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  ChevronDown, 
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { getWorkflowsByUILocation, N8nWorkflow, WorkflowCategory } from '@/lib/n8n/workflow-registry';
import { toast } from 'sonner';

// カテゴリアイコンマップ
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

// ステータスカラー
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  testing: 'bg-yellow-100 text-yellow-800',
  deprecated: 'bg-gray-100 text-gray-800',
  error: 'bg-red-100 text-red-800',
};

interface WorkflowExecutionState {
  workflowId: string;
  status: 'idle' | 'running' | 'success' | 'error';
  message?: string;
}

interface N3WorkflowActionsProps {
  tab: 'editing-n3' | 'research-n3' | 'operations-n3' | 'finance-n3' | 'control-n3';
  l2Tab?: string;
  l3Filter?: string;
  selectedIds?: (string | number)[];
  onExecutionComplete?: (workflowId: string, result: unknown) => void;
  compact?: boolean;
}

export function N3WorkflowActions({
  tab,
  l2Tab,
  l3Filter,
  selectedIds = [],
  onExecutionComplete,
  compact = false,
}: N3WorkflowActionsProps) {
  const [executionStates, setExecutionStates] = useState<Record<string, WorkflowExecutionState>>({});

  // 該当タブのワークフローを取得
  const workflows = getWorkflowsByUILocation(tab, l2Tab, l3Filter);

  // ワークフロー実行
  const executeWorkflow = useCallback(async (workflow: N8nWorkflow) => {
    const workflowId = workflow.id;
    
    // 実行中状態に更新
    setExecutionStates(prev => ({
      ...prev,
      [workflowId]: { workflowId, status: 'running' },
    }));

    try {
      // 入力パラメータの検証
      if (workflow.requiredInputs?.includes('productIds') && selectedIds.length === 0) {
        toast.warning('商品が選択されていません', {
          description: 'ワークフロー実行には商品を選択してください',
        });
        setExecutionStates(prev => ({
          ...prev,
          [workflowId]: { workflowId, status: 'idle' },
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
            source: 'ui',
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
          workflowId, 
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
          [workflowId]: { workflowId, status: 'idle' },
        }));
      }, 3000);

    } catch (error) {
      console.error(`Workflow execution failed: ${workflowId}`, error);
      
      // エラー状態に更新
      setExecutionStates(prev => ({
        ...prev,
        [workflowId]: { 
          workflowId, 
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
          [workflowId]: { workflowId, status: 'idle' },
        }));
      }, 5000);
    }
  }, [selectedIds, onExecutionComplete]);

  // ワークフローがない場合は何も表示しない
  if (workflows.length === 0) {
    return null;
  }

  // 単一ワークフローの場合は直接ボタンを表示
  if (workflows.length === 1) {
    const workflow = workflows[0];
    const state = executionStates[workflow.id] || { status: 'idle' };
    
    return (
      <Button
        variant={workflow.status === 'active' ? 'default' : 'outline'}
        size={compact ? 'sm' : 'default'}
        onClick={() => executeWorkflow(workflow)}
        disabled={state.status === 'running'}
        className="gap-1.5"
        title={`${workflow.description}\nWebhook: ${workflow.webhookPath}`}
      >
        {state.status === 'running' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : state.status === 'success' ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : state.status === 'error' ? (
          <XCircle className="h-4 w-4 text-red-500" />
        ) : (
          <Zap className="h-4 w-4" />
        )}
        {workflow.uiLocation?.buttonLabel || workflow.nameJa}
      </Button>
    );
  }

  // 複数ワークフローの場合はドロップダウンで表示
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={compact ? 'sm' : 'default'} className="gap-1.5">
          <Zap className="h-4 w-4" />
          n8nアクション
          <ChevronDown className="h-3 w-3" />
          <Badge variant="secondary" className="ml-1">
            {workflows.length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          ワークフロー実行
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workflows.map(workflow => {
          const state = executionStates[workflow.id] || { status: 'idle' };
          
          return (
            <DropdownMenuItem
              key={workflow.id}
              onClick={() => executeWorkflow(workflow)}
              disabled={state.status === 'running' || workflow.status !== 'active'}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>{CATEGORY_ICONS[workflow.category]}</span>
                <div>
                  <div className="font-medium">
                    {workflow.uiLocation?.buttonLabel || workflow.nameJa}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {workflow.webhookPath}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {state.status === 'running' && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
                {state.status === 'success' && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {state.status === 'error' && (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                {workflow.status !== 'active' && (
                  <Badge variant="outline" className={`text-xs ${STATUS_COLORS[workflow.status]}`}>
                    {workflow.status}
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 特定ワークフロー専用のクイックアクションボタン
interface QuickActionButtonProps {
  workflowId: string;
  selectedIds?: (string | number)[];
  onExecutionComplete?: (workflowId: string, result: unknown) => void;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function QuickActionButton({
  workflowId,
  selectedIds = [],
  onExecutionComplete,
  variant = 'default',
  size = 'default',
  className,
}: QuickActionButtonProps) {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  
  // レジストリからワークフロー取得
  const workflows = getWorkflowsByUILocation('editing-n3');
  const workflow = workflows.find(w => w.id === workflowId);
  
  if (!workflow) {
    console.warn(`Workflow not found: ${workflowId}`);
    return null;
  }

  const handleClick = async () => {
    setStatus('running');
    
    try {
      const response = await fetch('/api/n8n-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: workflow.webhookPath,
          data: {
            action: 'execute',
            ids: selectedIds,
            source: 'ui_quick_action',
            workflow_id: workflowId,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      setStatus('success');
      toast.success(`${workflow.nameJa} 完了`);
      onExecutionComplete?.(workflowId, result);
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      toast.error(`${workflow.nameJa} 失敗`);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={status === 'running'}
      className={className}
      title={workflow.description}
    >
      {status === 'running' ? (
        <Loader2 className="h-4 w-4 animate-spin mr-1" />
      ) : status === 'success' ? (
        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
      ) : status === 'error' ? (
        <XCircle className="h-4 w-4 text-red-500 mr-1" />
      ) : (
        <Zap className="h-4 w-4 mr-1" />
      )}
      {workflow.uiLocation?.buttonLabel || workflow.nameJa}
    </Button>
  );
}

export default N3WorkflowActions;
