/**
 * UI要素とn8nワークフローを紐付ける型定義
 * Next.js App Router対応版
 */

export type UIElementType = 
  | 'button'
  | 'form'
  | 'dropdown'
  | 'checkbox'
  | 'modal'
  | 'tab'
  | 'bulk-action';

export type N8nWorkflowTrigger = {
  workflowId: string;
  webhookPath: string;
  requiredParams: string[];
  optionalParams?: string[];
};

export type UIElement = {
  id: string;
  type: UIElementType;
  label: string;
  description?: string;
  toolPath: string;
  componentPath?: string;
  n8nTrigger?: N8nWorkflowTrigger;
};

export type UIConfigMapping = {
  [toolName: string]: {
    [elementId: string]: UIElement;
  };
};

export const UI_CONFIG: UIConfigMapping = {
  'editing-n3': {
    'bulk-delete': {
      id: 'editing-n3.bulk-delete',
      type: 'button',
      label: '一括削除',
      description: '選択した商品を一括削除',
      toolPath: '/tools/editing-n3',
      componentPath: 'app/tools/editing-n3/page.tsx',
      n8nTrigger: {
        workflowId: 'N3-INVENTORY-SYNC',
        webhookPath: '/webhook/inventory-sync',
        requiredParams: ['action', 'ids'],
        optionalParams: ['reason']
      }
    },
    'bulk-upload': {
      id: 'editing-n3.bulk-upload',
      type: 'button',
      label: '一括アップロード',
      toolPath: '/tools/editing-n3',
      componentPath: 'app/tools/editing-n3/page.tsx',
      n8nTrigger: {
        workflowId: 'N3-INVENTORY-SYNC',
        webhookPath: '/webhook/inventory-sync',
        requiredParams: ['action', 'file']
      }
    }
  },
  
  'listing-n3': {
    'publish-now': {
      id: 'listing-n3.publish-now',
      type: 'button',
      label: '即時出品',
      toolPath: '/tools/listing-n3',
      componentPath: 'app/tools/listing-n3/components/tab-final.tsx',
      n8nTrigger: {
        workflowId: 'N3-LISTING-WEBHOOK-CORRECTED',
        webhookPath: '/webhook/listing-reserve',
        requiredParams: ['action', 'ids', 'target', 'account']
      }
    },
    'schedule-publish': {
      id: 'listing-n3.schedule-publish',
      type: 'button',
      label: 'スケジュール出品',
      toolPath: '/tools/listing-n3',
      n8nTrigger: {
        workflowId: 'N3-SCHEDULE-CRON-COMPLETE',
        webhookPath: '/webhook/schedule-cron',
        requiredParams: ['action', 'ids', 'scheduledAt']
      }
    }
  },

  'operations-n3': {
    'sync-inventory': {
      id: 'operations-n3.sync-inventory',
      type: 'button',
      label: '在庫同期',
      toolPath: '/tools/operations-n3',
      n8nTrigger: {
        workflowId: 'N3-INVENTORY-SYNC',
        webhookPath: '/webhook/inventory-sync',
        requiredParams: ['action', 'platforms']
      }
    },
    'check-stock': {
      id: 'operations-n3.check-stock',
      type: 'button',
      label: '在庫チェック',
      toolPath: '/tools/operations-n3',
      n8nTrigger: {
        workflowId: 'N3-INVENTORY-MONITORING',
        webhookPath: '/webhook/inventory-monitoring',
        requiredParams: ['action']
      }
    }
  }
};

export function getN8nTrigger(uiElementId: string): N8nWorkflowTrigger | null {
  const [toolName, elementId] = uiElementId.split('.');
  const element = UI_CONFIG[toolName]?.[elementId];
  return element?.n8nTrigger || null;
}

export function getToolUIElements(toolName: string): UIElement[] {
  const toolConfig = UI_CONFIG[toolName];
  if (!toolConfig) return [];
  return Object.values(toolConfig);
}

export function getAllN8nEnabledElements(): UIElement[] {
  const elements: UIElement[] = [];
  Object.values(UI_CONFIG).forEach(toolConfig => {
    Object.values(toolConfig).forEach(element => {
      if (element.n8nTrigger) {
        elements.push(element);
      }
    });
  });
  return elements;
}
