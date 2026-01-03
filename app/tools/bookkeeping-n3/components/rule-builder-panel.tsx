// app/tools/bookkeeping-n3/components/rule-builder-panel.tsx
/**
 * 右パネル: ルール作成フォーム
 * 
 * - 選択した取引の生テキストを表示
 * - キーワード抽出（AI/手動）
 * - 勘定科目の割り当て
 * - ルールの保存
 */

'use client';

import React, { memo, useState } from 'react';
import { 
  Sparkles, 
  Tag, 
  ChevronRight, 
  Save, 
  X, 
  Lightbulb,
  ArrowRight,
  Check,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { N3Button, N3Input, N3Select, N3Badge, N3Skeleton } from '@/components/n3';
import type { RawTransaction, AIKeywordSuggestion, AIAccountSuggestion } from '../types';

// ============================================================
// Props
// ============================================================

interface RuleBuilderPanelProps {
  transaction: RawTransaction | null;
  draftRule: {
    keyword: string;
    match_type: 'partial' | 'exact' | 'regex';
    target_category: string;
    target_sub_category: string;
    tax_code: string;
    priority: number;
    rule_name: string;
    rule_description: string;
  };
  extractedKeywords: AIKeywordSuggestion[];
  suggestedAccounts: AIAccountSuggestion[];
  aiLoading: boolean;
  isCreatingRule: boolean;
  onUpdateDraft: (updates: Partial<RuleBuilderPanelProps['draftRule']>) => void;
  onSelectKeyword: (keyword: string) => void;
  onSelectAccount: (account: AIAccountSuggestion) => void;
  onSave: () => Promise<boolean>;
  onCancel: () => void;
  onRequestAI: () => void;
}

// ============================================================
// Constants
// ============================================================

const ACCOUNT_OPTIONS = [
  { value: '仕入高', label: '仕入高' },
  { value: '支払手数料', label: '支払手数料' },
  { value: '発送費', label: '発送費' },
  { value: '広告宣伝費', label: '広告宣伝費' },
  { value: '通信費', label: '通信費' },
  { value: '消耗品費', label: '消耗品費' },
  { value: '雑費', label: '雑費' },
  { value: '売上高', label: '売上高' },
];

const TAX_OPTIONS = [
  { value: '課税仕入 10%', label: '課税仕入 10%' },
  { value: '課税仕入 8%', label: '課税仕入 8%（軽減）' },
  { value: '課税売上 10%', label: '課税売上 10%' },
  { value: '非課税', label: '非課税' },
  { value: '不課税', label: '不課税' },
];

// ============================================================
// Sub Components
// ============================================================

const EmptyState = memo(function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 24,
        gap: 12,
        color: 'var(--text-muted)',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--highlight)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Lightbulb size={28} style={{ color: 'var(--accent)' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
          取引を選択してください
        </div>
        <div style={{ fontSize: 12 }}>
          左の一覧から取引をクリックすると、
          <br />
          ここにルール作成フォームが表示されます
        </div>
      </div>
    </div>
  );
});

const KeywordChip = memo(function KeywordChip({
  keyword,
  confidence,
  source,
  isSelected,
  onClick,
}: {
  keyword: string;
  confidence: number;
  source: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const confidenceColor = 
    confidence >= 0.8 ? 'var(--success)' :
    confidence >= 0.5 ? 'var(--warning)' :
    'var(--text-muted)';
  
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        fontSize: 12,
        fontWeight: 500,
        background: isSelected ? 'var(--accent)' : 'var(--highlight)',
        color: isSelected ? 'white' : 'var(--text)',
        border: isSelected ? 'none' : '1px solid var(--panel-border)',
        borderRadius: 16,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {source === 'ai' && <Sparkles size={12} style={{ color: isSelected ? 'white' : 'var(--accent)' }} />}
      <span>{keyword}</span>
      <span
        style={{
          fontSize: 10,
          padding: '1px 4px',
          background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--panel)',
          borderRadius: 8,
          color: isSelected ? 'white' : confidenceColor,
        }}
      >
        {Math.round(confidence * 100)}%
      </span>
    </button>
  );
});

const AccountSuggestionCard = memo(function AccountSuggestionCard({
  suggestion,
  isSelected,
  onClick,
}: {
  suggestion: AIAccountSuggestion;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: 12,
        background: isSelected ? 'var(--accent-subtle)' : 'var(--highlight)',
        border: isSelected ? '2px solid var(--accent)' : '1px solid var(--panel-border)',
        borderRadius: 8,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'all 0.15s ease',
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: isSelected ? 'var(--accent)' : 'var(--panel-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isSelected && <Check size={12} style={{ color: 'white' }} />}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
            {suggestion.account}
          </span>
          {suggestion.sub_account && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              / {suggestion.sub_account}
            </span>
          )}
          <N3Badge 
            variant={suggestion.confidence >= 0.8 ? 'success' : 'secondary'} 
            size="sm"
          >
            {Math.round(suggestion.confidence * 100)}%
          </N3Badge>
        </div>
        
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
          税区分: {suggestion.tax_code}
        </div>
        
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          {suggestion.reasoning}
        </div>
      </div>
    </button>
  );
});

// ============================================================
// Main Component
// ============================================================

export const RuleBuilderPanel = memo(function RuleBuilderPanel({
  transaction,
  draftRule,
  extractedKeywords,
  suggestedAccounts,
  aiLoading,
  isCreatingRule,
  onUpdateDraft,
  onSelectKeyword,
  onSelectAccount,
  onSave,
  onCancel,
  onRequestAI,
}: RuleBuilderPanelProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const success = await onSave();
      if (!success) {
        setSaveError('ルールの保存に失敗しました');
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // 空状態
  if (!transaction) {
    return (
      <div style={{ height: '100%', background: 'var(--bg)' }}>
        <EmptyState />
      </div>
    );
  }
  
  const isValid = draftRule.keyword && draftRule.target_category;
  
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg)',
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--panel-border)',
          background: 'var(--panel)',
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0 }}>
          ルール作成
        </h3>
        <N3Button variant="ghost" size="sm" onClick={onCancel} style={{ padding: 4 }}>
          <X size={16} />
        </N3Button>
      </div>
      
      {/* コンテンツ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {/* 元の取引データ */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 8,
            }}
          >
            対象取引
          </div>
          <div
            style={{
              padding: 12,
              background: 'var(--panel)',
              borderRadius: 8,
              border: '1px solid var(--panel-border)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
              {transaction.raw_memo}
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>{transaction.transaction_date}</span>
              <span>{transaction.source_name}</span>
              <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                ¥{Math.abs(transaction.amount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Step 1: キーワード選択 */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: draftRule.keyword ? 'var(--success)' : 'var(--accent)',
                color: 'white',
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {draftRule.keyword ? <Check size={12} /> : '1'}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
              キーワードを選択
            </span>
            <N3Button
              variant="ghost"
              size="sm"
              onClick={onRequestAI}
              disabled={aiLoading}
              style={{ marginLeft: 'auto', padding: '2px 8px', fontSize: 11 }}
            >
              {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              <span style={{ marginLeft: 4 }}>AI抽出</span>
            </N3Button>
          </div>
          
          {aiLoading ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[...Array(4)].map((_, i) => (
                <N3Skeleton key={i} style={{ width: 80, height: 28, borderRadius: 16 }} />
              ))}
            </div>
          ) : extractedKeywords.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {extractedKeywords.map((kw) => (
                <KeywordChip
                  key={kw.keyword}
                  keyword={kw.keyword}
                  confidence={kw.confidence}
                  source={kw.source}
                  isSelected={draftRule.keyword === kw.keyword}
                  onClick={() => onSelectKeyword(kw.keyword)}
                />
              ))}
            </div>
          ) : null}
          
          <N3Input
            value={draftRule.keyword}
            onChange={(e) => onUpdateDraft({ keyword: e.target.value })}
            placeholder="キーワードを入力または上から選択"
            style={{ marginTop: 8 }}
          />
        </div>
        
        {/* Step 2: 勘定科目選択 */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: draftRule.target_category ? 'var(--success)' : 'var(--panel-border)',
                color: draftRule.target_category ? 'white' : 'var(--text-muted)',
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {draftRule.target_category ? <Check size={12} /> : '2'}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
              勘定科目を選択
            </span>
          </div>
          
          {/* AI推薦 */}
          {suggestedAccounts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {suggestedAccounts.slice(0, 3).map((suggestion) => (
                <AccountSuggestionCard
                  key={suggestion.account}
                  suggestion={suggestion}
                  isSelected={draftRule.target_category === suggestion.account}
                  onClick={() => onSelectAccount(suggestion)}
                />
              ))}
            </div>
          )}
          
          {/* 手動選択 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                勘定科目
              </label>
              <select
                value={draftRule.target_category}
                onChange={(e) => onUpdateDraft({ target_category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  fontSize: 13,
                  background: 'var(--panel)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 6,
                  color: 'var(--text)',
                  outline: 'none',
                }}
              >
                <option value="">選択...</option>
                {ACCOUNT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                税区分
              </label>
              <select
                value={draftRule.tax_code}
                onChange={(e) => onUpdateDraft({ tax_code: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  fontSize: 13,
                  background: 'var(--panel)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 6,
                  color: 'var(--text)',
                  outline: 'none',
                }}
              >
                {TAX_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Step 3: ルール詳細 */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'var(--panel-border)',
                color: 'var(--text-muted)',
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              3
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
              ルール詳細（任意）
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <N3Input
              value={draftRule.rule_name}
              onChange={(e) => onUpdateDraft({ rule_name: e.target.value })}
              placeholder="ルール名（例: Amazon仕入れ）"
            />
            <N3Input
              value={draftRule.rule_description}
              onChange={(e) => onUpdateDraft({ rule_description: e.target.value })}
              placeholder="説明（任意）"
            />
          </div>
        </div>
        
        {/* エラー表示 */}
        {saveError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: 12,
              background: 'var(--error-subtle)',
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <AlertTriangle size={16} style={{ color: 'var(--error)' }} />
            <span style={{ fontSize: 12, color: 'var(--error)' }}>{saveError}</span>
          </div>
        )}
      </div>
      
      {/* フッター */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: 16,
          borderTop: '1px solid var(--panel-border)',
          background: 'var(--panel)',
        }}
      >
        <N3Button variant="ghost" onClick={onCancel} style={{ flex: 1 }}>
          キャンセル
        </N3Button>
        <N3Button
          variant="primary"
          onClick={handleSave}
          disabled={!isValid || isSaving}
          style={{ flex: 1 }}
        >
          {isSaving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span style={{ marginLeft: 6 }}>保存中...</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span style={{ marginLeft: 6 }}>ルール保存</span>
            </>
          )}
        </N3Button>
      </div>
    </div>
  );
});
