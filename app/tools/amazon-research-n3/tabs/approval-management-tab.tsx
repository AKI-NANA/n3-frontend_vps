/**
 * Approval Management Tab
 */

'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Send, Package } from 'lucide-react';
import { N3Button, N3Badge } from '@/components/n3';

export function ApprovalManagementTab() {
  const [items, setItems] = useState([
    {
      id: 1,
      asin: 'B08N5WRWNW',
      title: 'Echo Dot (第4世代)',
      profitScore: 85,
      status: 'pending'
    },
    {
      id: 2,
      asin: 'B09V2KXJPB',
      title: 'Fire TV Stick 4K Max',
      profitScore: 72,
      status: 'pending'
    }
  ]);

  const handleApprove = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'approved' } : item
    ));
  };

  const handleReject = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'rejected' } : item
    ));
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ 
        background: 'var(--panel)', 
        borderRadius: 8, 
        padding: 16,
        marginBottom: 20,
        border: '1px solid var(--panel-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>承認管理</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            リサーチ結果の承認・却下・編集送信
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <N3Button variant="outline" icon={<CheckCircle2 size={16} />}>
            一括承認
          </N3Button>
          <N3Button variant="outline" icon={<XCircle size={16} />}>
            一括却下
          </N3Button>
          <N3Button variant="primary" icon={<Send size={16} />}>
            編集へ送信
          </N3Button>
        </div>
      </div>

      <div style={{ 
        background: 'var(--panel)', 
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid var(--panel-border)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--panel-border)', borderBottom: '2px solid var(--panel-border)' }}>
              <th style={{ padding: 12, textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                <input type="checkbox" />
              </th>
              <th style={{ padding: 12, textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>商品</th>
              <th style={{ padding: 12, textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>スコア</th>
              <th style={{ padding: 12, textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>ステータス</th>
              <th style={{ padding: 12, textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>アクション</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--panel-border)' }}>
                <td style={{ padding: 12 }}>
                  <input type="checkbox" />
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      background: 'var(--panel-border)', 
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Package size={20} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ASIN: {item.asin}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  <div style={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: '50%',
                    background: item.profitScore >= 80 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(251, 146, 60, 0.1)',
                    border: `2px solid ${item.profitScore >= 80 ? 'rgb(34, 197, 94)' : 'rgb(251, 146, 60)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: item.profitScore >= 80 ? 'rgb(34, 197, 94)' : 'rgb(251, 146, 60)',
                    margin: '0 auto'
                  }}>
                    {item.profitScore}
                  </div>
                </td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  {item.status === 'approved' && <N3Badge variant="success">承認済</N3Badge>}
                  {item.status === 'rejected' && <N3Badge variant="error">却下済</N3Badge>}
                  {item.status === 'pending' && <N3Badge variant="default">保留中</N3Badge>}
                </td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  {item.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <N3Button
                        variant="ghost"
                        size="sm"
                        icon={<CheckCircle2 size={14} />}
                        onClick={() => handleApprove(item.id)}
                      />
                      <N3Button
                        variant="ghost"
                        size="sm"
                        icon={<XCircle size={14} />}
                        onClick={() => handleReject(item.id)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
