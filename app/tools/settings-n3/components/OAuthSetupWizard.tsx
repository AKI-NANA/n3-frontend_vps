// app/tools/settings-n3/components/OAuthSetupWizard.tsx
// ========================================
// 🔐 N3 Empire OS V8.2.1-Autonomous
// UI-011: OAuth認証セットアップウィザード
// ========================================

'use client';

import React, { useState, useEffect } from 'react';

// ========================================
// 型定義
// ========================================

type OAuthProvider = 'ebay' | 'amazon' | 'google' | 'shopee' | 'rakuten';

interface ProviderConfig {
  id: OAuthProvider;
  name: string;
  icon: string;
  description: string;
  requiredScopes: string[];
  estimatedTime: string;
}

interface CredentialStatus {
  provider: OAuthProvider;
  isConnected: boolean;
  isValid: boolean;
  expiresAt?: string;
  lastValidatedAt?: string;
  error?: string;
}

// ========================================
// プロバイダー設定
// ========================================

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'ebay',
    name: 'eBay',
    icon: '🛒',
    description: 'eBayマーケットプレイスとの連携',
    requiredScopes: ['出品管理', '在庫管理', '注文管理', 'マーケティング'],
    estimatedTime: '約2分'
  },
  {
    id: 'amazon',
    name: 'Amazon SP-API',
    icon: '📦',
    description: 'Amazon Selling Partner APIとの連携',
    requiredScopes: ['商品情報', '価格管理', '在庫管理', '注文管理'],
    estimatedTime: '約3分'
  },
  {
    id: 'google',
    name: 'Google',
    icon: '🔵',
    description: 'Google Sheets/Driveとの連携',
    requiredScopes: ['スプレッドシート', 'ドライブ'],
    estimatedTime: '約1分'
  },
  {
    id: 'shopee',
    name: 'Shopee',
    icon: '🧡',
    description: 'Shopeeマーケットプレイスとの連携',
    requiredScopes: ['商品管理', '注文管理'],
    estimatedTime: '約2分'
  },
  {
    id: 'rakuten',
    name: '楽天',
    icon: '🔴',
    description: '楽天市場との連携',
    requiredScopes: ['商品管理', '在庫管理', '注文管理'],
    estimatedTime: '約3分'
  }
];

// ========================================
// スタイル
// ========================================

const styles = {
  container: {
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto',
  } as React.CSSProperties,
  header: {
    marginBottom: '32px',
  } as React.CSSProperties,
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#fff',
  } as React.CSSProperties,
  subtitle: {
    color: '#9ca3af',
    fontSize: '14px',
  } as React.CSSProperties,
  providerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  } as React.CSSProperties,
  providerCard: {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #334155',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  providerCardSelected: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
  } as React.CSSProperties,
  providerCardConnected: {
    borderColor: '#22c55e',
  } as React.CSSProperties,
  providerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  } as React.CSSProperties,
  providerIcon: {
    fontSize: '32px',
  } as React.CSSProperties,
  providerName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
  } as React.CSSProperties,
  providerDescription: {
    color: '#9ca3af',
    fontSize: '13px',
    marginBottom: '12px',
  } as React.CSSProperties,
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '500',
  } as React.CSSProperties,
  statusConnected: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#22c55e',
  } as React.CSSProperties,
  statusDisconnected: {
    background: 'rgba(156, 163, 175, 0.1)',
    color: '#9ca3af',
  } as React.CSSProperties,
  statusExpiring: {
    background: 'rgba(234, 179, 8, 0.1)',
    color: '#eab308',
  } as React.CSSProperties,
  wizardPanel: {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #334155',
  } as React.CSSProperties,
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
  } as React.CSSProperties,
  stepDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
  } as React.CSSProperties,
  stepDotActive: {
    background: '#3b82f6',
    color: '#fff',
  } as React.CSSProperties,
  stepDotInactive: {
    background: '#334155',
    color: '#9ca3af',
  } as React.CSSProperties,
  stepDotComplete: {
    background: '#22c55e',
    color: '#fff',
  } as React.CSSProperties,
  stepLine: {
    flex: 1,
    height: '2px',
    background: '#334155',
  } as React.CSSProperties,
  stepLineActive: {
    background: '#3b82f6',
  } as React.CSSProperties,
  stepContent: {
    minHeight: '200px',
  } as React.CSSProperties,
  stepTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '8px',
  } as React.CSSProperties,
  stepDescription: {
    color: '#9ca3af',
    fontSize: '14px',
    marginBottom: '20px',
  } as React.CSSProperties,
  scopeList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px',
  } as React.CSSProperties,
  scopeTag: {
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#60a5fa',
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '13px',
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #334155',
  } as React.CSSProperties,
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  buttonPrimary: {
    background: '#3b82f6',
    color: '#fff',
  } as React.CSSProperties,
  buttonSecondary: {
    background: '#334155',
    color: '#fff',
  } as React.CSSProperties,
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  } as React.CSSProperties,
  successMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    textAlign: 'center',
  } as React.CSSProperties,
  successIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  } as React.CSSProperties,
  successTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#22c55e',
    marginBottom: '8px',
  } as React.CSSProperties,
  loadingSpinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '40px',
    color: '#9ca3af',
  } as React.CSSProperties,
};

// ========================================
// コンポーネント
// ========================================

export function OAuthSetupWizard() {
  const [statuses, setStatuses] = useState<CredentialStatus[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<OAuthProvider | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 認証状態を取得
  useEffect(() => {
    fetchStatuses();
    
    // URLパラメータからOAuth結果を取得
    const params = new URLSearchParams(window.location.search);
    const oauthSuccess = params.get('oauth_success');
    const oauthError = params.get('oauth_error');
    const oauthProvider = params.get('oauth_provider');
    
    if (oauthSuccess === 'true' && oauthProvider) {
      setSelectedProvider(oauthProvider as OAuthProvider);
      setCurrentStep(3); // 完了ステップ
      // URLをクリーンアップ
      window.history.replaceState({}, '', window.location.pathname);
    } else if (oauthError) {
      setError(params.get('oauth_error_description') || 'OAuth認証に失敗しました');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);
  
  const fetchStatuses = async () => {
    try {
      const response = await fetch('/api/auth/oauth');
      const data = await response.json();
      if (data.success) {
        setStatuses(data.statuses);
      }
    } catch (err) {
      console.error('Failed to fetch OAuth statuses:', err);
    }
  };
  
  const getProviderStatus = (providerId: OAuthProvider): CredentialStatus | undefined => {
    return statuses.find(s => s.provider === providerId);
  };
  
  const isProviderConnected = (providerId: OAuthProvider): boolean => {
    const status = getProviderStatus(providerId);
    return status?.isConnected ?? false;
  };
  
  const isTokenExpiring = (providerId: OAuthProvider): boolean => {
    const status = getProviderStatus(providerId);
    if (!status?.expiresAt) return false;
    const expiresAt = new Date(status.expiresAt);
    const now = new Date();
    const hoursDiff = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24 && hoursDiff > 0;
  };
  
  const handleProviderSelect = (provider: OAuthProvider) => {
    setSelectedProvider(provider);
    setCurrentStep(1);
    setError(null);
  };
  
  const handleStartAuth = async () => {
    if (!selectedProvider) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: selectedProvider })
      });
      
      const data = await response.json();
      
      if (data.success && data.authUrl) {
        setCurrentStep(2);
        // 認証URLにリダイレクト
        window.location.href = data.authUrl;
      } else {
        setError(data.error || '認証の開始に失敗しました');
      }
    } catch (err) {
      setError('サーバーとの通信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefreshToken = async () => {
    if (!selectedProvider) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/oauth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: selectedProvider })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchStatuses();
        setCurrentStep(3);
      } else {
        setError(data.error || 'トークンの更新に失敗しました');
      }
    } catch (err) {
      setError('サーバーとの通信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    setSelectedProvider(null);
    setCurrentStep(0);
    setError(null);
    fetchStatuses();
  };
  
  const renderStepIndicator = () => {
    const steps = ['選択', '確認', '認証', '完了'];
    
    return (
      <div style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              style={{
                ...styles.stepDot,
                ...(index < currentStep
                  ? styles.stepDotComplete
                  : index === currentStep
                  ? styles.stepDotActive
                  : styles.stepDotInactive)
              }}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                style={{
                  ...styles.stepLine,
                  ...(index < currentStep ? styles.stepLineActive : {})
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  const renderStepContent = () => {
    const provider = PROVIDERS.find(p => p.id === selectedProvider);
    
    switch (currentStep) {
      case 1: // 確認ステップ
        return (
          <div style={styles.stepContent}>
            <h3 style={styles.stepTitle}>{provider?.name}との連携を開始</h3>
            <p style={styles.stepDescription}>
              以下の権限を許可します。連携には{provider?.estimatedTime}程度かかります。
            </p>
            
            <div style={styles.scopeList}>
              {provider?.requiredScopes.map(scope => (
                <span key={scope} style={styles.scopeTag}>{scope}</span>
              ))}
            </div>
            
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>
              ⚠️ 認証後、自動的にこのページに戻ります。ブラウザのポップアップをブロックしないでください。
            </p>
            
            {error && (
              <p style={{ color: '#ef4444', marginTop: '16px' }}>⚠️ {error}</p>
            )}
          </div>
        );
        
      case 2: // 認証中
        return (
          <div style={styles.loadingSpinner}>
            <span>🔄</span>
            <span>{provider?.name}で認証中...</span>
          </div>
        );
        
      case 3: // 完了
        return (
          <div style={styles.successMessage as React.CSSProperties}>
            <span style={styles.successIcon}>✅</span>
            <h3 style={styles.successTitle}>連携が完了しました！</h3>
            <p style={{ color: '#9ca3af' }}>
              {provider?.name}との連携が正常に完了しました。
              <br />
              自動的にトークンが更新されます。
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🔐 API連携設定</h2>
        <p style={styles.subtitle}>
          マーケットプレイスやサービスとの連携を管理します。
          n8nを触ることなく、ここですべての認証を完了できます。
        </p>
      </div>
      
      {/* プロバイダー選択グリッド */}
      {!selectedProvider && (
        <div style={styles.providerGrid}>
          {PROVIDERS.map(provider => {
            const connected = isProviderConnected(provider.id);
            const expiring = isTokenExpiring(provider.id);
            
            return (
              <div
                key={provider.id}
                style={{
                  ...styles.providerCard,
                  ...(connected ? styles.providerCardConnected : {})
                }}
                onClick={() => handleProviderSelect(provider.id)}
              >
                <div style={styles.providerHeader}>
                  <span style={styles.providerIcon}>{provider.icon}</span>
                  <span style={styles.providerName}>{provider.name}</span>
                </div>
                <p style={styles.providerDescription}>{provider.description}</p>
                <div
                  style={{
                    ...styles.statusBadge,
                    ...(connected
                      ? expiring
                        ? styles.statusExpiring
                        : styles.statusConnected
                      : styles.statusDisconnected)
                  }}
                >
                  <span>{connected ? (expiring ? '⚠️' : '✓') : '○'}</span>
                  <span>
                    {connected
                      ? expiring
                        ? 'まもなく期限切れ'
                        : '連携済み'
                      : '未連携'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* ウィザードパネル */}
      {selectedProvider && (
        <div style={styles.wizardPanel}>
          {renderStepIndicator()}
          {renderStepContent()}
          
          <div style={styles.buttonGroup}>
            {currentStep < 3 && (
              <button
                style={{ ...styles.button, ...styles.buttonSecondary }}
                onClick={handleClose}
              >
                キャンセル
              </button>
            )}
            
            {currentStep === 1 && (
              <>
                {isProviderConnected(selectedProvider) && (
                  <button
                    style={{
                      ...styles.button,
                      ...styles.buttonSecondary,
                      ...(isLoading ? styles.buttonDisabled : {})
                    }}
                    onClick={handleRefreshToken}
                    disabled={isLoading}
                  >
                    トークンを更新
                  </button>
                )}
                <button
                  style={{
                    ...styles.button,
                    ...styles.buttonPrimary,
                    ...(isLoading ? styles.buttonDisabled : {})
                  }}
                  onClick={handleStartAuth}
                  disabled={isLoading}
                >
                  {isLoading ? '処理中...' : isProviderConnected(selectedProvider) ? '再認証' : '認証を開始'}
                </button>
              </>
            )}
            
            {currentStep === 3 && (
              <button
                style={{ ...styles.button, ...styles.buttonPrimary }}
                onClick={handleClose}
              >
                完了
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OAuthSetupWizard;
