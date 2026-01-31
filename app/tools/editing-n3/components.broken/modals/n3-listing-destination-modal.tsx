// app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx
/**
 * 出品先選択モーダル
 * 
 * マルチマーケットプレイス対応
 * - 複数のマーケットプレイス選択
 * - 各マーケットプレイスの複数アカウント選択
 * - 即時出品/スケジュール出品の切り替え
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { X, ShoppingCart, Calendar, Zap, Store, CheckCircle2, Circle, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { N3Button, N3Divider } from '@/components/n3';

// ============================================================
// 型定義
// ============================================================

export interface MarketplaceAccount {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
}

export interface Marketplace {
  id: string;
  name: string;
  displayName: string;
  icon?: React.ReactNode;
  accounts: MarketplaceAccount[];
  isEnabled: boolean;
}

export interface SelectedDestination {
  marketplace: string;
  accountId: string;
}

export interface ListingOptions {
  mode: 'immediate' | 'scheduled';
  scheduleSettings?: {
    startDate?: string;
    intervalMinutes?: number;
  };
}

interface N3ListingDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (destinations: SelectedDestination[], options: ListingOptions) => Promise<void>;
  selectedProductCount: number;
  title?: string;
}

// ============================================================
// マーケットプレイス設定（将来的にはDBから取得）
// ============================================================

const DEFAULT_MARKETPLACES: Marketplace[] = [
  {
    id: 'ebay',
    name: 'ebay',
    displayName: 'eBay',
    isEnabled: true,
    accounts: [
      { id: 'mjt', name: 'mjt', displayName: 'MJT (メイン)', isActive: true },
      { id: 'green', name: 'green', displayName: 'Green', isActive: true },
    ],
  },
  {
    id: 'amazon',
    name: 'amazon',
    displayName: 'Amazon',
    isEnabled: false, // 未実装
    accounts: [
      { id: 'amazon_main', name: 'amazon_main', displayName: 'Amazon Main', isActive: false },
    ],
  },
  {
    id: 'mercari',
    name: 'mercari',
    displayName: 'メルカリ',
    isEnabled: false, // 未実装
    accounts: [
      { id: 'mercari_main', name: 'mercari_main', displayName: 'メルカリ Main', isActive: false },
    ],
  },
  {
    id: 'qoo10',
    name: 'qoo10',
    displayName: 'Qoo10',
    isEnabled: false, // 未実装
    accounts: [
      { id: 'qoo10_main', name: 'qoo10_main', displayName: 'Qoo10 Main', isActive: false },
    ],
  },
];

// ============================================================
// コンポーネント
// ============================================================

export function N3ListingDestinationModal({
  isOpen,
  onClose,
  onConfirm,
  selectedProductCount,
  title = '出品先を選択',
}: N3ListingDestinationModalProps) {
  // State
  const [selectedDestinations, setSelectedDestinations] = useState<SelectedDestination[]>([]);
  const [expandedMarketplaces, setExpandedMarketplaces] = useState<Set<string>>(new Set(['ebay']));
  const [listingMode, setListingMode] = useState<'immediate' | 'scheduled'>('immediate');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // マーケットプレイス展開/折りたたみ
  const toggleMarketplace = useCallback((marketplaceId: string) => {
    setExpandedMarketplaces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(marketplaceId)) {
        newSet.delete(marketplaceId);
      } else {
        newSet.add(marketplaceId);
      }
      return newSet;
    });
  }, []);

  // アカウント選択/解除
  const toggleAccount = useCallback((marketplace: string, accountId: string) => {
    setSelectedDestinations(prev => {
      const exists = prev.some(d => d.marketplace === marketplace && d.accountId === accountId);
      if (exists) {
        return prev.filter(d => !(d.marketplace === marketplace && d.accountId === accountId));
      } else {
        return [...prev, { marketplace, accountId }];
      }
    });
  }, []);

  // マーケットプレイス全体選択/解除
  const toggleAllAccounts = useCallback((marketplace: Marketplace) => {
    const activeAccounts = marketplace.accounts.filter(a => a.isActive);
    const allSelected = activeAccounts.every(account => 
      selectedDestinations.some(d => d.marketplace === marketplace.id && d.accountId === account.id)
    );
    
    setSelectedDestinations(prev => {
      if (allSelected) {
        // 全解除
        return prev.filter(d => d.marketplace !== marketplace.id);
      } else {
        // 全選択
        const others = prev.filter(d => d.marketplace !== marketplace.id);
        const newSelections = activeAccounts.map(account => ({
          marketplace: marketplace.id,
          accountId: account.id,
        }));
        return [...others, ...newSelections];
      }
    });
  }, [selectedDestinations]);

  // 選択されているかチェック
  const isAccountSelected = useCallback((marketplace: string, accountId: string) => {
    return selectedDestinations.some(d => d.marketplace === marketplace && d.accountId === accountId);
  }, [selectedDestinations]);

  // 出品先の総数
  const totalListings = useMemo(() => {
    return selectedProductCount * selectedDestinations.length;
  }, [selectedProductCount, selectedDestinations.length]);

  // 送信処理
  const handleConfirm = async () => {
    if (selectedDestinations.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await onConfirm(selectedDestinations, { mode: listingMode });
      onClose();
    } catch (error) {
      console.error('出品エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div 
        className="rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
        style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}
      >
        {/* ヘッダー */}
        <div 
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--panel-border)' }}
        >
          <div className="flex items-center gap-3">
            <ShoppingCart size={20} style={{ color: 'var(--accent)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* 選択商品数 */}
          <div 
            className="mb-4 p-3 rounded-lg"
            style={{ background: 'var(--highlight)' }}
          >
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              選択中の商品
            </div>
            <div className="text-xl font-bold" style={{ color: 'var(--text)' }}>
              {selectedProductCount} 件
            </div>
          </div>

          {/* 出品モード選択 */}
          <div className="mb-4">
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
              出品方法
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setListingMode('immediate')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all"
                style={{
                  background: listingMode === 'immediate' ? 'var(--accent)' : 'var(--highlight)',
                  color: listingMode === 'immediate' ? 'white' : 'var(--text)',
                  border: listingMode === 'immediate' ? 'none' : '1px solid var(--panel-border)',
                }}
              >
                <Zap size={18} />
                <span className="font-medium">今すぐ出品</span>
              </button>
              <button
                onClick={() => setListingMode('scheduled')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all"
                style={{
                  background: listingMode === 'scheduled' ? 'var(--accent)' : 'var(--highlight)',
                  color: listingMode === 'scheduled' ? 'white' : 'var(--text)',
                  border: listingMode === 'scheduled' ? 'none' : '1px solid var(--panel-border)',
                }}
              >
                <Calendar size={18} />
                <span className="font-medium">スケジュール</span>
              </button>
            </div>
          </div>

          <N3Divider style={{ margin: '16px 0' }} />

          {/* マーケットプレイス選択 */}
          <div className="mb-4">
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
              出品先マーケットプレイス
            </div>
            
            <div className="space-y-2">
              {DEFAULT_MARKETPLACES.map(marketplace => {
                const isExpanded = expandedMarketplaces.has(marketplace.id);
                const activeAccounts = marketplace.accounts.filter(a => a.isActive);
                const selectedCount = selectedDestinations.filter(d => d.marketplace === marketplace.id).length;
                const allSelected = activeAccounts.length > 0 && selectedCount === activeAccounts.length;
                
                return (
                  <div 
                    key={marketplace.id}
                    className="rounded-lg overflow-hidden"
                    style={{ 
                      background: 'var(--highlight)',
                      opacity: marketplace.isEnabled ? 1 : 0.5,
                    }}
                  >
                    {/* マーケットプレイスヘッダー */}
                    <div 
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => marketplace.isEnabled && toggleMarketplace(marketplace.id)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (marketplace.isEnabled) {
                            toggleAllAccounts(marketplace);
                          }
                        }}
                        disabled={!marketplace.isEnabled}
                        className="flex-shrink-0"
                      >
                        {allSelected ? (
                          <CheckCircle2 size={20} style={{ color: 'var(--accent)' }} />
                        ) : selectedCount > 0 ? (
                          <div 
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                            style={{ borderColor: 'var(--accent)', background: 'var(--accent)' }}
                          >
                            <span className="text-xs text-white font-bold">{selectedCount}</span>
                          </div>
                        ) : (
                          <Circle size={20} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </button>
                      
                      <Store size={18} style={{ color: marketplace.isEnabled ? 'var(--text)' : 'var(--text-muted)' }} />
                      
                      <span 
                        className="flex-1 font-medium"
                        style={{ color: marketplace.isEnabled ? 'var(--text)' : 'var(--text-muted)' }}
                      >
                        {marketplace.displayName}
                      </span>
                      
                      {!marketplace.isEnabled && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ background: 'var(--panel)', color: 'var(--text-muted)' }}
                        >
                          準備中
                        </span>
                      )}
                      
                      {marketplace.isEnabled && (
                        isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
                      )}
                    </div>

                    {/* アカウント一覧 */}
                    {isExpanded && marketplace.isEnabled && (
                      <div 
                        className="px-4 pb-3"
                        style={{ borderTop: '1px solid var(--panel-border)' }}
                      >
                        <div className="pt-2 space-y-1">
                          {marketplace.accounts.map(account => {
                            const isSelected = isAccountSelected(marketplace.id, account.id);
                            
                            return (
                              <button
                                key={account.id}
                                onClick={() => account.isActive && toggleAccount(marketplace.id, account.id)}
                                disabled={!account.isActive}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all"
                                style={{
                                  background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                  opacity: account.isActive ? 1 : 0.5,
                                }}
                              >
                                {isSelected ? (
                                  <CheckCircle2 size={16} style={{ color: 'var(--accent)' }} />
                                ) : (
                                  <Circle size={16} style={{ color: 'var(--text-muted)' }} />
                                )}
                                <span 
                                  className="text-sm"
                                  style={{ color: isSelected ? 'var(--accent)' : 'var(--text)' }}
                                >
                                  {account.displayName}
                                </span>
                                {!account.isActive && (
                                  <span 
                                    className="text-xs ml-auto"
                                    style={{ color: 'var(--text-muted)' }}
                                  >
                                    無効
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 出品数サマリー */}
          {selectedDestinations.length > 0 && (
            <div 
              className="p-3 rounded-lg flex items-center gap-3"
              style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent)' }}
            >
              <AlertCircle size={18} style={{ color: 'var(--accent)' }} />
              <div className="text-sm" style={{ color: 'var(--text)' }}>
                <span className="font-bold">{totalListings}</span> 件の出品が作成されます
                <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                  ({selectedProductCount}商品 × {selectedDestinations.length}出品先)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div 
          className="flex items-center justify-between px-5 py-4"
          style={{ borderTop: '1px solid var(--panel-border)', background: 'var(--highlight)' }}
        >
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {selectedDestinations.length > 0 ? (
              <>
                <span className="font-medium" style={{ color: 'var(--text)' }}>
                  {selectedDestinations.length}
                </span> 件の出品先を選択中
              </>
            ) : (
              '出品先を選択してください'
            )}
          </div>
          
          <div className="flex gap-2">
            <N3Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              キャンセル
            </N3Button>
            <N3Button
              variant="primary"
              onClick={handleConfirm}
              disabled={selectedDestinations.length === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  処理中...
                </>
              ) : listingMode === 'immediate' ? (
                <>
                  <Zap size={16} className="mr-1" />
                  今すぐ出品
                </>
              ) : (
                <>
                  <Calendar size={16} className="mr-1" />
                  スケジュール登録
                </>
              )}
            </N3Button>
          </div>
        </div>
      </div>
    </div>
  );
}
