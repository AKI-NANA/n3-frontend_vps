// contexts/KillSwitchContext.tsx
/**
 * KillSwitch Context - 緊急停止時のUI制御
 * 
 * Phase I Task Group E: Phase H完全完了
 * 
 * 機能:
 * - KillSwitch時 UI操作ロック
 * - critical error → Health自動遷移
 * - Automation実行中 編集禁止
 * - n8n 実行中タブロック
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// ============================================================
// 型定義
// ============================================================

interface KillSwitchState {
  isActive: boolean;
  activatedAt: string | null;
  reason: string | null;
  affectedSystems: string[];
}

interface AutomationState {
  isRunning: boolean;
  runningTools: string[];
  lockedTabs: string[];
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  lastCheck: string;
  errors: string[];
}

interface KillSwitchContextType {
  // KillSwitch状態
  killSwitch: KillSwitchState;
  activateKillSwitch: (reason?: string) => void;
  deactivateKillSwitch: () => void;
  
  // Automation状態
  automation: AutomationState;
  registerRunningTool: (toolId: string) => void;
  unregisterRunningTool: (toolId: string) => void;
  
  // UI制御
  isTabLocked: (tabId: string) => boolean;
  isEditingDisabled: boolean;
  
  // システムヘルス
  systemHealth: SystemHealth;
  checkSystemHealth: () => Promise<void>;
  
  // UIロック状態
  isUILocked: boolean;
}

// ============================================================
// デフォルト値
// ============================================================

const defaultKillSwitch: KillSwitchState = {
  isActive: false,
  activatedAt: null,
  reason: null,
  affectedSystems: [],
};

const defaultAutomation: AutomationState = {
  isRunning: false,
  runningTools: [],
  lockedTabs: [],
};

const defaultSystemHealth: SystemHealth = {
  status: 'healthy',
  lastCheck: new Date().toISOString(),
  errors: [],
};

// ============================================================
// Context
// ============================================================

const KillSwitchContext = createContext<KillSwitchContextType | null>(null);

// ============================================================
// Provider
// ============================================================

export function KillSwitchProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  
  const [killSwitch, setKillSwitch] = useState<KillSwitchState>(defaultKillSwitch);
  const [automation, setAutomation] = useState<AutomationState>(defaultAutomation);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(defaultSystemHealth);

  // KillSwitch 起動
  const activateKillSwitch = useCallback((reason?: string) => {
    setKillSwitch({
      isActive: true,
      activatedAt: new Date().toISOString(),
      reason: reason || 'Manual activation',
      affectedSystems: ['n8n Workflows', 'Scheduled Tasks', 'API Webhooks', 'Inventory Sync', 'Order Processing'],
    });
    
    // API通知
    fetch('/api/killswitch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: true, reason }),
    }).catch(console.error);
  }, []);

  // KillSwitch 解除
  const deactivateKillSwitch = useCallback(() => {
    setKillSwitch(defaultKillSwitch);
    
    // API通知
    fetch('/api/killswitch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    }).catch(console.error);
  }, []);

  // ツール実行登録
  const registerRunningTool = useCallback((toolId: string) => {
    setAutomation(prev => ({
      ...prev,
      isRunning: true,
      runningTools: [...prev.runningTools, toolId],
      lockedTabs: getLockedTabsForTool(toolId, prev.lockedTabs),
    }));
  }, []);

  // ツール実行解除
  const unregisterRunningTool = useCallback((toolId: string) => {
    setAutomation(prev => {
      const newRunningTools = prev.runningTools.filter(t => t !== toolId);
      return {
        ...prev,
        isRunning: newRunningTools.length > 0,
        runningTools: newRunningTools,
        lockedTabs: newRunningTools.length === 0 ? [] : prev.lockedTabs,
      };
    });
  }, []);

  // タブロック判定
  const isTabLocked = useCallback((tabId: string) => {
    if (killSwitch.isActive) return true;
    return automation.lockedTabs.includes(tabId);
  }, [killSwitch.isActive, automation.lockedTabs]);

  // 編集無効判定
  const isEditingDisabled = killSwitch.isActive || automation.isRunning;

  // UIロック判定
  const isUILocked = killSwitch.isActive;

  // システムヘルスチェック
  const checkSystemHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/dispatch/status');
      if (res.ok) {
        const data = await res.json();
        const errors: string[] = [];
        
        // ヘルスチェック
        if (data.health?.n8n === 'offline') errors.push('n8n is offline');
        if (data.health?.database === 'offline') errors.push('Database is offline');
        if (data.health?.api === 'offline') errors.push('API is offline');
        
        const status = errors.length === 0 ? 'healthy' : errors.length >= 2 ? 'critical' : 'degraded';
        
        setSystemHealth({
          status,
          lastCheck: new Date().toISOString(),
          errors,
        });
        
        // critical時は自動でHealthページへ遷移
        if (status === 'critical') {
          router.push('/tools/control-n3?tab=status');
        }
      }
    } catch (error) {
      setSystemHealth(prev => ({
        ...prev,
        status: 'critical',
        lastCheck: new Date().toISOString(),
        errors: ['Failed to check system health'],
      }));
    }
  }, [router]);

  // 定期ヘルスチェック
  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // 30秒ごと
    return () => clearInterval(interval);
  }, [checkSystemHealth]);

  return (
    <KillSwitchContext.Provider
      value={{
        killSwitch,
        activateKillSwitch,
        deactivateKillSwitch,
        automation,
        registerRunningTool,
        unregisterRunningTool,
        isTabLocked,
        isEditingDisabled,
        systemHealth,
        checkSystemHealth,
        isUILocked,
      }}
    >
      {children}
      
      {/* UIロック時のオーバーレイ */}
      {isUILocked && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              animation: 'pulse 2s infinite',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#EF4444', marginBottom: 12 }}>
            SYSTEM HALTED
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 24 }}>
            {killSwitch.reason || 'Emergency stop activated'}
          </p>
          <button
            onClick={deactivateKillSwitch}
            style={{
              padding: '16px 32px',
              borderRadius: 12,
              border: '2px solid #EF4444',
              background: 'transparent',
              color: '#EF4444',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Resume System
          </button>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
        }
      `}</style>
    </KillSwitchContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useKillSwitch() {
  const context = useContext(KillSwitchContext);
  if (!context) {
    throw new Error('useKillSwitch must be used within a KillSwitchProvider');
  }
  return context;
}

// ============================================================
// ヘルパー関数
// ============================================================

function getLockedTabsForTool(toolId: string, currentLocked: string[]): string[] {
  // ツールによってロックするタブを決定
  const lockMap: Record<string, string[]> = {
    'listing-ebay': ['editing-n3'],
    'inventory-sync': ['editing-n3', 'operations-n3'],
    'order-processing': ['operations-n3'],
  };
  
  const additionalLocks = lockMap[toolId] || [];
  return [...new Set([...currentLocked, ...additionalLocks])];
}

export { KillSwitchContext };
