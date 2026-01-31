// app/tools/control-n3/components/panels/issue-detail-modal.tsx
/**
 * 問題詳細モーダル
 * - 監査で検出された問題の詳細を表示
 * - AI分析結果を含む
 */
'use client';

import React, { memo } from 'react';
import { 
  X, AlertTriangle, XCircle, CheckCircle, Zap,
  FileText, Code
} from 'lucide-react';
import { N3Modal } from '@/components/n3';
import type { AuditIssue } from '../../hooks/use-control-data';

interface IssueDetailModalProps {
  issue: AuditIssue;
  onClose: () => void;
}

export const IssueDetailModal = memo(function IssueDetailModal({
  issue,
  onClose,
}: IssueDetailModalProps) {
  const statusColor = issue.status === 'FAIL' ? '#ef4444' : 
                      issue.status === 'WARN' ? '#f59e0b' : '#f97316';
  const statusBg = issue.status === 'FAIL' ? 'rgba(239, 68, 68, 0.1)' : 
                   issue.status === 'WARN' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(249, 115, 22, 0.1)';
  
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: 'var(--panel)',
          borderRadius: 12,
          maxWidth: 800,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid var(--panel-border)',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            padding: 16,
            borderBottom: '1px solid var(--panel-border)',
            background: statusBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {issue.status === 'FAIL' ? (
              <XCircle size={24} style={{ color: statusColor }} />
            ) : (
              <AlertTriangle size={24} style={{ color: statusColor }} />
            )}
            <div>
              <h2 style={{ 
                fontSize: 16, 
                fontWeight: 600, 
                color: 'var(--text)',
                margin: 0,
              }}>
                {issue.workflow_name}
              </h2>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {new Date(issue.created_at).toLocaleString('ja-JP')}
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              background: 'var(--panel-alt)',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 問題の概要 */}
          <section>
            <h3 style={{ 
              fontSize: 13, 
              fontWeight: 600, 
              color: 'var(--text-muted)',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <FileText size={14} />
              問題の概要
            </h3>
            <div style={{
              padding: 16,
              background: statusBg,
              border: `1px solid ${statusColor}30`,
              borderRadius: 8,
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: 14, 
                color: 'var(--text)',
                lineHeight: 1.6,
              }}>
                {issue.reason}
              </p>
            </div>
          </section>

          {/* 違反ルール */}
          {issue.failed_rules && issue.failed_rules.length > 0 && (
            <section>
              <h3 style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: 'var(--text-muted)',
                marginBottom: 8,
              }}>
                違反ルール
              </h3>
              <ul style={{ 
                margin: 0, 
                padding: 0, 
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                {issue.failed_rules.map((rule, index) => (
                  <li 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      color: '#ef4444',
                    }}
                  >
                    <XCircle size={14} />
                    {rule}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* AI分析結果 */}
          {issue.llm_analysis && (
            <section>
              <h3 style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: 'var(--text-muted)',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <Zap size={14} style={{ color: '#8b5cf6' }} />
                AI分析結果
              </h3>
              <div style={{
                padding: 16,
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}>
                {/* 検出された問題 */}
                {issue.llm_analysis.issues_found && issue.llm_analysis.issues_found.length > 0 && (
                  <div>
                    <div style={{ 
                      fontSize: 12, 
                      color: '#8b5cf6', 
                      fontWeight: 600,
                      marginBottom: 8,
                    }}>
                      検出された問題:
                    </div>
                    <ul style={{ 
                      margin: 0, 
                      paddingLeft: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}>
                      {issue.llm_analysis.issues_found.map((item, index) => (
                        <li key={index} style={{ fontSize: 13, color: 'var(--text)' }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 推奨アクション */}
                {issue.llm_analysis.recommendations && issue.llm_analysis.recommendations.length > 0 && (
                  <div>
                    <div style={{ 
                      fontSize: 12, 
                      color: '#10b981', 
                      fontWeight: 600,
                      marginBottom: 8,
                    }}>
                      推奨アクション:
                    </div>
                    <ul style={{ 
                      margin: 0, 
                      padding: 0,
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}>
                      {issue.llm_analysis.recommendations.map((item, index) => (
                        <li 
                          key={index} 
                          style={{ 
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 8,
                            fontSize: 13, 
                            color: 'var(--text)',
                          }}
                        >
                          <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 分析詳細 */}
                {issue.llm_analysis.reasoning && (
                  <div>
                    <div style={{ 
                      fontSize: 12, 
                      color: 'var(--text-muted)', 
                      fontWeight: 600,
                      marginBottom: 8,
                    }}>
                      分析詳細:
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: 13, 
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                    }}>
                      {issue.llm_analysis.reasoning}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 入力/出力データ */}
          <section>
            <h3 style={{ 
              fontSize: 13, 
              fontWeight: 600, 
              color: 'var(--text-muted)',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <Code size={14} />
              データ詳細
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ 
                  fontSize: 11, 
                  color: 'var(--text-muted)', 
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  入力データ
                </div>
                <pre style={{
                  margin: 0,
                  padding: 12,
                  background: 'var(--bg)',
                  borderRadius: 6,
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  overflow: 'auto',
                  maxHeight: 200,
                  border: '1px solid var(--panel-border)',
                }}>
                  {JSON.stringify(issue.input_data, null, 2)}
                </pre>
              </div>
              <div>
                <div style={{ 
                  fontSize: 11, 
                  color: 'var(--text-muted)', 
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  出力データ
                </div>
                <pre style={{
                  margin: 0,
                  padding: 12,
                  background: 'var(--bg)',
                  borderRadius: 6,
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  overflow: 'auto',
                  maxHeight: 200,
                  border: '1px solid var(--panel-border)',
                }}>
                  {JSON.stringify(issue.output_data, null, 2)}
                </pre>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
});
