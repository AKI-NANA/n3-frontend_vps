// app/tools/settings-n3/layouts/settings-n3-page-layout.tsx
/**
 * Settings N3 ページレイアウト
 * 設定・マスタ・連携の統合レイアウト
 *
 * ゴールドスタンダード準拠: useSettingsIntegrated フックを使用
 */

'use client';

import React, { memo, useState } from 'react';
import {
  Settings,
  Globe,
  ShoppingBag,
  Zap,
  Key,
  Server,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  Check,
  Clock,
} from 'lucide-react';
import { N3Button } from '@/components/n3/presentational/n3-button';
import { N3Badge } from '@/components/n3/presentational/n3-badge';
import { N3TreeView, TreeNode } from '@/components/n3/container/n3-tree-view';
import { useSettingsIntegrated } from '../hooks';
import { AutomationSettingsPanel } from '../components';
import type { SettingsL3Tab, HTSCode, EbaySettings, EbaySettingsExtended, AutomationRule, Credential } from '../types/settings';

// L3タブ設定
const L3_TABS: { id: SettingsL3Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'hts', label: 'HTS分類', icon: <Globe size={14} /> },
  { id: 'ebay', label: 'eBay設定', icon: <ShoppingBag size={14} /> },
  { id: 'amazon', label: 'Amazon設定', icon: <ShoppingBag size={14} /> },
  { id: 'automation', label: '自動化ルール', icon: <Zap size={14} /> },
  { id: 'credentials', label: '認証管理', icon: <Key size={14} /> },
  { id: 'system', label: 'システム設定', icon: <Server size={14} /> },
];

// HTSをTreeNode形式に変換
const convertHTSToTreeNode = (hts: any[]): TreeNode[] => {
  return hts.map(item => ({
    id: item.id || item.code,
    label: `${item.code} - ${item.name || item.description || ''}`,
    children: item.children ? convertHTSToTreeNode(item.children) : undefined,
    data: item,
  }));
};

// eBay設定カード
const EbaySettingCard = memo(function EbaySettingCard({
  setting,
  onToggle,
}: {
  setting: EbaySettings | EbaySettingsExtended | any;
  onToggle: () => void;
}) {
  // 値を文字列に変換するヘルパー
  const formatValue = (val: any): string => {
    if (val === null || val === undefined) return '-';
    if (typeof val === 'object') {
      // オブジェクトの場合はサマリを返す
      if ('accepted' in val) return val.accepted ? '有効' : '無効';
      if ('domestic' in val) return val.domestic || '-';
      return JSON.stringify(val).slice(0, 30);
    }
    return String(val);
  };

  // アカウント名の取得
  const accountName = setting.accountName || setting.name || 'eBay Account';
  const siteId = setting.siteId || setting.site || 'EBAY_US';
  const isActive = setting.isActive ?? setting.enabled ?? true;

  // ポリシー値の取得
  const paymentPolicy = formatValue(setting.paymentPolicy);
  const shippingPolicy = formatValue(setting.shippingPolicy || setting.defaultShipping);
  const returnPolicy = formatValue(setting.returnPolicy);

  return (
    <div
      style={{
        padding: '16px',
        background: 'var(--panel)',
        borderRadius: 'var(--style-radius-lg, 12px)',
        border: `1px solid ${isActive ? 'var(--color-success)' : 'var(--panel-border)'}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingBag size={18} style={{ color: 'var(--color-primary)' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
              {accountName}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {siteId}
            </div>
          </div>
        </div>
        <N3Button
          variant={isActive ? 'success' : 'secondary'}
          size="xs"
          onClick={onToggle}
        >
          {isActive ? <Check size={12} /> : <Play size={12} />}
          {isActive ? '有効' : '無効'}
        </N3Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {[
          { label: '支払ポリシー', value: paymentPolicy },
          { label: '配送ポリシー', value: shippingPolicy },
          { label: '返品ポリシー', value: returnPolicy },
        ].map(item => (
          <div key={item.label} style={{ padding: '8px', background: 'var(--highlight)', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>{item.label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {setting.lastSync && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>
          最終同期: {new Date(setting.lastSync).toLocaleString('ja-JP')}
        </div>
      )}
    </div>
  );
});

// 自動化ルールカード
const AutomationRuleCard = memo(function AutomationRuleCard({
  rule,
  onToggle,
}: {
  rule: AutomationRule;
  onToggle: () => void;
}) {
  const isActive = rule.enabled ?? rule.isActive;

  return (
    <div
      style={{
        padding: '14px 16px',
        background: 'var(--panel)',
        borderRadius: 'var(--style-radius-md, 8px)',
        border: '1px solid var(--panel-border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={16} style={{ color: isActive ? 'var(--color-warning)' : 'var(--text-muted)' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
              {rule.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <N3Badge variant="outline" size="xs">{rule.trigger}</N3Badge>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                実行回数: {rule.runCount || 0}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {rule.lastRun && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              <Clock size={10} style={{ marginRight: '4px' }} />
              {new Date(rule.lastRun).toLocaleString('ja-JP')}
            </span>
          )}
          <N3Button
            variant={isActive ? 'warning' : 'secondary'}
            size="xs"
            onClick={onToggle}
          >
            {isActive ? <Pause size={12} /> : <Play size={12} />}
          </N3Button>
        </div>
      </div>
    </div>
  );
});

// 認証情報カード
const CredentialCard = memo(function CredentialCard({
  credential,
  onRefresh,
}: {
  credential: Credential;
  onRefresh: () => void;
}) {
  const statusConfig = {
    active: { color: 'var(--color-success)', label: '有効' },
    valid: { color: 'var(--color-success)', label: '有効' },
    expired: { color: 'var(--color-error)', label: '期限切れ' },
    expiring: { color: 'var(--color-warning)', label: 'まもなく期限切れ' },
    revoked: { color: 'var(--text-muted)', label: '無効' },
  };
  const config = statusConfig[credential.status as keyof typeof statusConfig] || statusConfig.active;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: 'var(--panel)',
        borderRadius: 'var(--style-radius-md, 8px)',
        border: '1px solid var(--panel-border)',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'var(--highlight)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Key size={16} style={{ color: config.color }} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
          {credential.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <N3Badge variant="outline" size="xs">{credential.type?.toUpperCase() || 'API'}</N3Badge>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: config.color }}>
          {credential.status === 'expired' ? <AlertTriangle size={12} /> : <Check size={12} />}
          {config.label}
        </div>
        {credential.expiresAt && (
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {credential.status === 'expired' ? '期限切れ' : `有効期限: ${new Date(credential.expiresAt).toLocaleDateString('ja-JP')}`}
          </div>
        )}
      </div>

      <N3Button variant="ghost" size="xs" onClick={onRefresh}>
        <RefreshCw size={12} />
      </N3Button>
    </div>
  );
});

export const SettingsN3PageLayout = memo(function SettingsN3PageLayout() {
  // ゴールドスタンダード: 統合フックを使用
  const {
    htsCategories,
    htsSearch,
    setHtsSearch,
    ebaySettings,
    ebayAccounts,
    automationRules,
    credentials,
    credentialFilter,
    setCredentialFilter,
    activeTab,
    setActiveTab,
    toggleRule,
    refreshCredential,
    isLoading,
    refresh,
  } = useSettingsIntegrated();

  const [selectedHTS, setSelectedHTS] = useState<string[]>([]);

  // HTS TreeNodeデータ
  const htsTreeData = convertHTSToTreeNode(htsCategories);

  // タブコンテンツ
  const renderTabContent = () => {
    switch (activeTab) {
      case 'hts':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                padding: '16px',
                background: 'var(--panel)',
                borderRadius: 'var(--style-radius-lg, 12px)',
                border: '1px solid var(--panel-border)',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
                HTS (関税コード) 分類
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                商品の関税コードを検索・選択してください。
              </div>
              <N3TreeView
                data={htsTreeData}
                selectedIds={selectedHTS}
                onSelectionChange={setSelectedHTS}
                searchable
                showIcons
                defaultExpandAll={false}
                variant="bordered"
              />
            </div>
          </div>
        );

      case 'ebay':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                eBayアカウント設定
              </div>
              <N3Button variant="primary" size="sm">
                アカウント追加
              </N3Button>
            </div>
            {ebaySettings ? (
              <EbaySettingCard
                setting={ebaySettings as EbaySettings}
                onToggle={() => {}}
              />
            ) : ebayAccounts.length > 0 ? (
              ebayAccounts.map(account => (
                <div
                  key={account.id}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--panel)',
                    borderRadius: 'var(--style-radius-md, 8px)',
                    border: '1px solid var(--panel-border)',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                    {account.name}
                  </div>
                  <N3Badge
                    variant={account.status === 'active' ? 'success' : 'error'}
                    size="xs"
                    style={{ marginTop: '4px' }}
                  >
                    {account.status === 'active' ? '有効' : '期限切れ'}
                  </N3Badge>
                </div>
              ))
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                eBayアカウントが設定されていません
              </div>
            )}
          </div>
        );

      case 'automation':
        return <AutomationSettingsPanel />;

      case 'credentials':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                認証情報管理
              </div>
              <N3Button variant="primary" size="sm">
                認証追加
              </N3Button>
            </div>
            {credentials.length > 0 ? (
              credentials.map(credential => (
                <CredentialCard
                  key={credential.id}
                  credential={credential as Credential}
                  onRefresh={() => refreshCredential(credential.id)}
                />
              ))
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                認証情報がありません
              </div>
            )}
          </div>
        );

      default:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              background: 'var(--panel)',
              borderRadius: 'var(--style-radius-lg, 12px)',
              border: '1px solid var(--panel-border)',
            }}
          >
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Settings size={32} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '14px' }}>準備中...</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--panel-border)',
          background: 'var(--panel)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--text-muted), var(--color-primary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Settings size={20} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                設定管理 (N3)
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                HTS分類・プラットフォーム連携・自動化設定
              </p>
            </div>
          </div>

          <N3Button variant="secondary" size="sm" onClick={refresh} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            更新
          </N3Button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左サイドバー */}
        <div
          style={{
            width: '200px',
            borderRight: '1px solid var(--panel-border)',
            background: 'var(--panel)',
            padding: '12px',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', padding: '0 8px' }}>
            設定メニュー
          </div>
          {L3_TABS.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--style-radius-md, 8px)',
                cursor: 'pointer',
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text)',
                marginBottom: '4px',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              <span style={{ fontSize: '13px', fontWeight: activeTab === tab.id ? 600 : 400 }}>
                {tab.label}
              </span>
            </div>
          ))}
        </div>

        {/* コンテンツエリア */}
        <div
          style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            background: 'var(--bg)',
          }}
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
});

export default SettingsN3PageLayout;
