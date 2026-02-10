// components/n3/sm-sequential-selection-container.tsx
/**
 * SM分析連続選択コンテナ
 * 
 * 機能:
 * - ProductModalをラップして連続選択機能を追加
 * - 1つの商品の競合選択が完了したら自動的に次へ
 * - 進捗バーと全体統計を表示
 * - キーボードショートカット対応（←→でナビゲート）
 */

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { Product } from '@/app/tools/editing/types/product';
import { useSMSequentialSelection, type SMQueueItem } from '@/hooks/use-sm-sequential-selection';
import { TabCompetitors } from '@/components/product-modal/components/Tabs/tab-competitors';

interface SMSequentialSelectionContainerProps {
  products: Product[];
  onClose: () => void;
  onComplete?: (results: SMQueueItem[]) => void;
  onProductUpdate?: (productId: string, updates: any) => void;
}

export function SMSequentialSelectionContainer({
  products,
  onClose,
  onComplete,
  onProductUpdate,
}: SMSequentialSelectionContainerProps) {
  const [isPaused, setIsPaused] = useState(false);

  const {
    queue,
    currentProduct,
    currentIndex,
    progress,
    isActive,
    startSequentialMode,
    completeAndNext,
    skipAndNext,
    jumpTo,
  } = useSMSequentialSelection(products, {
    autoAdvance: !isPaused,
    onComplete: (results) => {
      console.log('[SM Sequential] 完了:', results);
      onComplete?.(results);
    },
  });

  // 初期化時に自動開始
  useEffect(() => {
    if (products.length > 0 && !isActive) {
      startSequentialMode(products);
    }
  }, [products, isActive, startSequentialMode]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'n') {
        e.preventDefault();
        skipAndNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        e.preventDefault();
        if (currentIndex > 0) jumpTo(currentIndex - 1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(p => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, jumpTo, skipAndNext, onClose]);

  const handleSelectComplete = useCallback((selectedCompetitorId: string) => {
    if (currentProduct) {
      onProductUpdate?.(String(currentProduct.id), { selected_competitor_id: selectedCompetitorId });
    }
    completeAndNext(selectedCompetitorId);
  }, [currentProduct, completeAndNext, onProductUpdate]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) jumpTo(currentIndex - 1);
  }, [currentIndex, jumpTo]);

  const handleNext = useCallback(() => {
    if (currentIndex < queue.length - 1) jumpTo(currentIndex + 1);
  }, [currentIndex, queue.length, jumpTo]);

  const isAllComplete = progress.remaining === 0 && queue.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60">
      {/* ヘッダー */}
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fas fa-play"></i>
              </div>
              <div>
                <div className="text-sm font-bold">SM分析 連続選択モード</div>
                <div className="text-xs opacity-80">キーボード: ← → でナビゲート, Space で一時停止, Esc で終了</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsPaused(p => !p)} className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 ${isPaused ? 'bg-yellow-500' : 'bg-white/20 hover:bg-white/30'}`}>
              {isPaused ? <><i className="fas fa-play"></i> 再開</> : <><i className="fas fa-pause"></i> 一時停止</>}
            </button>
            <button onClick={onClose} className="px-3 py-1.5 rounded text-sm font-medium bg-white/20 hover:bg-white/30 flex items-center gap-1.5">
              <i className="fas fa-stop"></i> 終了
            </button>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold">{currentIndex + 1}</span>
              <span className="opacity-60">/</span>
              <span>{queue.length}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <i className="fas fa-check-circle text-green-300"></i> 完了: {progress.completed}
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-forward text-yellow-300"></i> スキップ: {progress.skipped}
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-circle text-white/50"></i> 残り: {progress.remaining}
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 transition-all duration-300" style={{ width: `${progress.percentage}%` }} />
          </div>
        </div>

        {/* 商品サムネイル一覧 */}
        <div className="px-4 pb-2 overflow-x-auto">
          <div className="flex gap-1">
            {queue.map((item, idx) => (
              <button
                key={item.product.id}
                onClick={() => jumpTo(idx)}
                className={`relative w-10 h-10 rounded flex-shrink-0 overflow-hidden border-2 transition-all
                  ${idx === currentIndex ? 'border-white ring-2 ring-white/50' : item.status === 'completed' ? 'border-green-400/50 opacity-60' : item.status === 'skipped' ? 'border-yellow-400/50 opacity-40' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                {(item.product as any).primary_image_url ? (
                  <img src={(item.product as any).primary_image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-xs">{idx + 1}</div>
                )}
                {item.status === 'completed' && <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center"><i className="fas fa-check text-white"></i></div>}
                {item.status === 'skipped' && <div className="absolute inset-0 bg-yellow-500/50 flex items-center justify-center"><i className="fas fa-forward text-white"></i></div>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden bg-white">
        {isAllComplete ? (
          <div className="h-full flex flex-col items-center justify-center">
            <i className="fas fa-check-circle text-green-500 text-6xl mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">全ての選択が完了しました！</h2>
            <p className="text-gray-600 mb-6">{progress.completed}件完了、{progress.skipped}件スキップ</p>
            <button onClick={onClose} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">閉じる</button>
          </div>
        ) : currentProduct ? (
          <TabCompetitors
            product={currentProduct as any}
            isSequentialMode={true}
            sequentialProgress={{ current: currentIndex + 1, total: queue.length }}
            onSelectComplete={handleSelectComplete}
            onSkip={skipAndNext}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <i className="fas fa-spinner fa-spin text-indigo-600 text-3xl"></i>
          </div>
        )}
      </div>

      {/* フッターナビゲーション */}
      {!isAllComplete && (
        <div className="flex-shrink-0 bg-gray-100 border-t px-4 py-3 flex items-center justify-between">
          <button onClick={handlePrev} disabled={currentIndex <= 0} className="px-4 py-2 rounded bg-white border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
            <i className="fas fa-chevron-left"></i> 前へ
          </button>
          <div className="text-sm text-gray-600">
            {currentProduct && <span className="font-medium">{(currentProduct as any).english_title || (currentProduct as any).title}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={skipAndNext} className="px-4 py-2 rounded bg-white border hover:bg-gray-50 flex items-center gap-1">
              スキップ <i className="fas fa-forward"></i>
            </button>
            <button onClick={handleNext} disabled={currentIndex >= queue.length - 1} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
              次へ <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SMSequentialSelectionContainer;
