// app/tools/n8n-workflows/components/workflow-detail-view.tsx
/**
 * ワークフロー詳細表示コンポーネント
 * 
 * 各ワークフローの詳細情報を表示
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Code,
  FileJson,
  Play,
  Tag,
} from 'lucide-react';
import type { N8nWorkflow, WorkflowStatus } from '@/lib/n8n/workflow-registry';

const STATUS_CONFIG: Record<WorkflowStatus, { label: string; color: string; icon: React.ComponentType<any> }> = {
  active: {
    label: 'アクティブ',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  testing: {
    label: 'テスト中',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
  },
  deprecated: {
    label: '非推奨',
    color: 'bg-gray-100 text-gray-800',
    icon: XCircle,
  },
  error: {
    label: 'エラー',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

interface WorkflowDetailViewProps {
  workflow: N8nWorkflow;
  onExecute?: (workflow: N8nWorkflow) => void;
}

export function WorkflowDetailView({ workflow, onExecute }: WorkflowDetailViewProps) {
  const StatusIcon = STATUS_CONFIG[workflow.status].icon;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {workflow.nameJa}
              <Badge className={STATUS_CONFIG[workflow.status].color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {STATUS_CONFIG[workflow.status].label}
              </Badge>
            </CardTitle>
            <CardDescription>
              {workflow.nameEn} • v{workflow.version}
            </CardDescription>
          </div>
          {workflow.status === 'active' && onExecute && (
            <Button
              size="sm"
              onClick={() => onExecute(workflow)}
            >
              <Play className="h-4 w-4 mr-1" />
              実行
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* 説明 */}
        <div>
          <h4 className="text-sm font-medium mb-2">📝 説明</h4>
          <p className="text-sm text-muted-foreground">{workflow.description}</p>
        </div>

        <Separator />

        {/* Webhook情報 */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Code className="h-4 w-4" />
            Webhook Path
          </h4>
          <code className="text-sm px-3 py-1.5 rounded bg-muted block">
            {workflow.webhookPath}
          </code>
          {workflow.n8nWorkflowId && (
            <p className="text-xs text-muted-foreground mt-2">
              n8n Workflow ID: <code>{workflow.n8nWorkflowId}</code>
            </p>
          )}
        </div>

        <Separator />

        {/* 入力パラメータ */}
        <div>
          <h4 className="text-sm font-medium mb-2">⚙️ 入力パラメータ</h4>
          <div className="space-y-2">
            {workflow.requiredInputs && workflow.requiredInputs.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">必須:</p>
                <div className="flex flex-wrap gap-1">
                  {workflow.requiredInputs.map(input => (
                    <Badge key={input} variant="destructive" className="text-xs">
                      {input}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {workflow.optionalInputs && workflow.optionalInputs.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">オプション:</p>
                <div className="flex flex-wrap gap-1">
                  {workflow.optionalInputs.map(input => (
                    <Badge key={input} variant="secondary" className="text-xs">
                      {input}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* タグ */}
        {workflow.tags && workflow.tags.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Tag className="h-4 w-4" />
                タグ
              </h4>
              <div className="flex flex-wrap gap-1">
                {workflow.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default WorkflowDetailView;
