/**
 * SupplierTable: 仕入先探索テーブル
 * AI仕入先探索 + メール生成機能
 */

'use client';

import { useState } from 'react';
import { Search, Mail, Send, ExternalLink, Loader2, Package, Sparkles, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResearchItem, SupplierContact, ContactStatus } from '../types/research';
import { PriceDisplay, ProfitBadge } from './shared/profit-display';

interface SupplierTableProps {
  items: ResearchItem[];
  loading: boolean;
  onUpdateItem: (id: string, updates: Partial<ResearchItem>) => Promise<ResearchItem | null>;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

// コンタクトステータスの表示設定
const CONTACT_STATUS_CONFIG: Record<ContactStatus, { icon: React.ReactNode; label: string; color: string }> = {
  pending: { icon: <Clock className="w-3 h-3" />, label: '未連絡', color: 'bg-gray-100 text-gray-700' },
  contacted: { icon: <Mail className="w-3 h-3" />, label: '連絡済', color: 'bg-blue-100 text-blue-700' },
  replied: { icon: <CheckCircle className="w-3 h-3" />, label: '返信あり', color: 'bg-green-100 text-green-700' },
  negotiating: { icon: <Sparkles className="w-3 h-3" />, label: '交渉中', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { icon: <CheckCircle className="w-3 h-3" />, label: '確定', color: 'bg-emerald-100 text-emerald-700' },
  rejected: { icon: <XCircle className="w-3 h-3" />, label: '不成立', color: 'bg-red-100 text-red-700' },
};

export function SupplierTable({
  items,
  loading,
  onUpdateItem,
  showToast,
}: SupplierTableProps) {
  const [searchingIds, setSearchingIds] = useState<Set<string>>(new Set());
  const [emailModalItem, setEmailModalItem] = useState<ResearchItem | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [generatingEmail, setGeneratingEmail] = useState(false);

  // AI仕入先探索
  const handleAISearch = async (item: ResearchItem) => {
    setSearchingIds(prev => new Set(prev).add(item.id));

    try {
      const response = await fetch('/api/research/ai-supplier-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          englishTitle: item.english_title,
          targetPrice: item.sold_price_jpy,
          category: item.category_name,
          asin: item.asin,
        }),
      });

      if (!response.ok) {
        throw new Error('仕入先検索に失敗しました');
      }

      const data = await response.json();

      if (data.success && data.supplier) {
        await onUpdateItem(item.id, {
          supplier_name: data.supplier.name,
          supplier_url: data.supplier.url,
          supplier_price_jpy: data.supplier.price,
          supplier_stock: data.supplier.stock,
          supplier_confidence: data.supplier.confidence,
          supplier_source: data.supplier.source,
        });
        showToast(`仕入先を発見: ${data.supplier.name}`);
      } else {
        showToast('適切な仕入先が見つかりませんでした', 'error');
      }
    } catch (error: any) {
      showToast(error.message || '仕入先検索エラー', 'error');
    } finally {
      setSearchingIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  // メール生成
  const handleGenerateEmail = async (item: ResearchItem) => {
    setEmailModalItem(item);
    setGeneratingEmail(true);
    setGeneratedEmail('');

    try {
      const response = await fetch('/api/tools/generate-supplier-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: item.title,
          englishTitle: item.english_title,
          targetPrice: item.supplier_price_jpy || item.sold_price_jpy,
          supplierName: item.supplier_name,
          quantity: 10, // デフォルト発注数
        }),
      });

      if (!response.ok) {
        throw new Error('メール生成に失敗しました');
      }

      const data = await response.json();
      setGeneratedEmail(data.email || '');
    } catch (error: any) {
      showToast(error.message || 'メール生成エラー', 'error');
    } finally {
      setGeneratingEmail(false);
    }
  };

  // メールをクリップボードにコピー
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(generatedEmail);
    showToast('メールをコピーしました');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mb-2" />
          <div className="text-xs text-text-muted">読み込み中...</div>
        </div>
      </div>
    );
  }

  const itemsWithSupplier = items.filter(i => i.supplier_name || i.supplier_url);
  const itemsWithoutSupplier = items.filter(i => !i.supplier_name && !i.supplier_url);

  return (
    <div className="space-y-4">
      {/* 仕入先確定済み */}
      <div className="n3-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-semibold">仕入先確定済み</h3>
            <p className="text-[10px] text-text-muted">{itemsWithSupplier.length}件</p>
          </div>
        </div>

        {itemsWithSupplier.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <div className="text-xs">仕入先が確定した商品はありません</div>
          </div>
        ) : (
          <div className="n3-table-container">
            <table className="n3-table">
              <thead>
                <tr>
                  <th className="w-12">画像</th>
                  <th className="min-w-[180px]">商品名</th>
                  <th>仕入先</th>
                  <th className="text-right">仕入価格</th>
                  <th className="text-right">売価</th>
                  <th className="text-right">利益率</th>
                  <th>在庫</th>
                  <th className="w-24">操作</th>
                </tr>
              </thead>
              <tbody>
                {itemsWithSupplier.map(item => (
                  <tr key={item.id}>
                    <td>
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-highlight rounded flex items-center justify-center">
                          <Package className="w-4 h-4 text-text-subtle" />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="max-w-[180px]">
                        <div className="text-xs line-clamp-1">{item.title}</div>
                        {item.asin && (
                          <div className="text-[9px] text-text-muted font-mono">ASIN: {item.asin}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{item.supplier_name || '-'}</span>
                        {item.supplier_url && (
                          <a
                            href={item.supplier_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {item.supplier_confidence && (
                        <div className="text-[9px] text-text-muted">
                          信頼度: {(item.supplier_confidence * 100).toFixed(0)}%
                        </div>
                      )}
                    </td>
                    <td className="text-right">
                      <PriceDisplay price={item.supplier_price_jpy} currency="JPY" size="sm" />
                    </td>
                    <td className="text-right">
                      <PriceDisplay price={item.sold_price_usd} currency="USD" size="sm" />
                    </td>
                    <td className="text-right">
                      <ProfitBadge margin={item.profit_margin} />
                    </td>
                    <td>
                      <span className={cn(
                        'text-xs',
                        (item.supplier_stock || 0) > 10 ? 'text-green-600' : 'text-orange-600'
                      )}>
                        {item.supplier_stock ?? '-'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleGenerateEmail(item)}
                          className="n3-btn n3-btn-secondary n3-btn-xs"
                          title="問い合わせメール生成"
                        >
                          <Mail className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAISearch(item)}
                          className="n3-btn n3-btn-ghost n3-btn-xs"
                          title="再検索"
                          disabled={searchingIds.has(item.id)}
                        >
                          {searchingIds.has(item.id) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Search className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 仕入先未確定 */}
      <div className="n3-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-semibold">仕入先探索待ち</h3>
            <p className="text-[10px] text-text-muted">{itemsWithoutSupplier.length}件 - AI検索で仕入先を探索</p>
          </div>
          <button
            onClick={async () => {
              for (const item of itemsWithoutSupplier.slice(0, 10)) {
                await handleAISearch(item);
              }
            }}
            className="n3-btn n3-btn-primary n3-btn-xs"
            disabled={searchingIds.size > 0}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            一括AI検索（10件）
          </button>
        </div>

        {itemsWithoutSupplier.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <div className="text-xs">全ての商品に仕入先が設定されています</div>
          </div>
        ) : (
          <div className="n3-table-container max-h-96 overflow-y-auto">
            <table className="n3-table">
              <thead className="sticky top-0">
                <tr>
                  <th className="w-12">画像</th>
                  <th className="min-w-[200px]">商品名</th>
                  <th className="text-right">目標売価</th>
                  <th>カテゴリ</th>
                  <th className="w-20">操作</th>
                </tr>
              </thead>
              <tbody>
                {itemsWithoutSupplier.map(item => (
                  <tr key={item.id}>
                    <td>
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-highlight rounded flex items-center justify-center">
                          <Package className="w-4 h-4 text-text-subtle" />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="max-w-[200px]">
                        <div className="text-xs line-clamp-1">{item.title}</div>
                        {item.english_title && (
                          <div className="text-[9px] text-text-muted line-clamp-1">{item.english_title}</div>
                        )}
                      </div>
                    </td>
                    <td className="text-right">
                      <PriceDisplay price={item.sold_price_usd} currency="USD" size="sm" />
                    </td>
                    <td className="text-[10px] text-text-muted">{item.category_name || '-'}</td>
                    <td>
                      <button
                        onClick={() => handleAISearch(item)}
                        className="n3-btn n3-btn-primary n3-btn-xs"
                        disabled={searchingIds.has(item.id)}
                      >
                        {searchingIds.has(item.id) ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 mr-0.5" />
                            AI検索
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* メール生成モーダル */}
      {emailModalItem && (
        <div className="n3-modal-overlay" onClick={() => setEmailModalItem(null)}>
          <div className="n3-modal w-[600px]" onClick={e => e.stopPropagation()}>
            <div className="n3-modal-header">
              <h3 className="text-sm font-semibold">仕入先問い合わせメール生成</h3>
              <button
                onClick={() => setEmailModalItem(null)}
                className="p-1 hover:bg-highlight rounded"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="n3-modal-body">
              <div className="mb-4">
                <div className="text-xs font-medium mb-1">商品情報</div>
                <div className="p-2 bg-highlight rounded text-xs">
                  <div><span className="text-text-muted">商品名:</span> {emailModalItem.title}</div>
                  <div><span className="text-text-muted">仕入先:</span> {emailModalItem.supplier_name || '-'}</div>
                  <div><span className="text-text-muted">目標価格:</span> ¥{emailModalItem.supplier_price_jpy?.toLocaleString() || '-'}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-medium mb-1">生成されたメール</div>
                {generatingEmail ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                    <span className="ml-2 text-xs text-text-muted">AIがメールを生成中...</span>
                  </div>
                ) : (
                  <textarea
                    value={generatedEmail}
                    onChange={(e) => setGeneratedEmail(e.target.value)}
                    className="n3-input w-full h-64 font-mono text-xs"
                    placeholder="メール本文がここに表示されます"
                  />
                )}
              </div>
            </div>
            <div className="n3-modal-footer">
              <button
                onClick={() => setEmailModalItem(null)}
                className="n3-btn n3-btn-ghost"
              >
                閉じる
              </button>
              <button
                onClick={handleCopyEmail}
                className="n3-btn n3-btn-secondary"
                disabled={!generatedEmail}
              >
                コピー
              </button>
              <button
                onClick={() => handleGenerateEmail(emailModalItem)}
                className="n3-btn n3-btn-primary"
                disabled={generatingEmail}
              >
                {generatingEmail ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                )}
                再生成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
