/**
 * N3Pagination - Container Component
 *
 * ページネーション（Paginationの共通版）
 *
 * 設計ルール:
 * - 状態とロジックを子に注入
 * - 子要素間のgap/marginを定義（Container責務）
 * - Hooksを呼び出せる
 *
 * @example
 * <N3Pagination
 *   total={1000}
 *   pageSize={50}
 *   currentPage={1}
 *   onPageChange={setPage}
 *   onPageSizeChange={setPageSize}
 * />
 */

'use client';

import { memo, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { N3Select } from '../presentational/n3-select';

// ============================================================
// Types
// ============================================================

export interface N3PaginationProps {
  /** 総アイテム数 */
  total: number;
  /** 1ページあたりの件数 */
  pageSize: number;
  /** 現在のページ */
  currentPage: number;
  /** ページ変更ハンドラ */
  onPageChange: (page: number) => void;
  /** ページサイズ変更ハンドラ */
  onPageSizeChange: (size: number) => void;
  /** ページサイズオプション */
  pageSizeOptions?: number[];
  /** 全件オプション表示 */
  showAllOption?: boolean;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Component
// ============================================================

export const N3Pagination = memo(function N3Pagination({
  total = 0,
  pageSize = 50,
  currentPage = 1,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100, 500, 1000],
  showAllOption = true,
  className = '',
}: N3PaginationProps) {
  // NaN対策: 数値が無効な場合はデフォルト値を使用
  const safeTotal = Number.isFinite(total) ? total : 0;
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 50;
  const safeCurrentPage = Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;

  const totalPages = Math.ceil(safeTotal / safePageSize) || 1;
  const startItem = safeTotal === 0 ? 0 : (safeCurrentPage - 1) * safePageSize + 1;
  const endItem = Math.min(safeCurrentPage * safePageSize, safeTotal);

  // ページ番号の配列を生成
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push('...');

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (safeCurrentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  }, [totalPages, safeCurrentPage]);

  // ページサイズオプションを変換
  const sizeOptions = useMemo(() => {
    const options = pageSizeOptions.map((size) => ({
      value: size.toString(),
      label: `${size}件`,
    }));
    if (showAllOption) {
      options.push({ value: '99999', label: '全件' });
    }
    return options;
  }, [pageSizeOptions, showAllOption]);

  const classes = ['n3-pagination', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {/* 左側: 表示情報 */}
      <div className="n3-pagination__info">
        <strong>{startItem}</strong> - <strong>{endItem}</strong> / 全
        <strong>{safeTotal}</strong>件
      </div>

      {/* 右側: コントロール */}
      <div className="n3-pagination__controls">
        {/* ページサイズ選択 */}
        <N3Select
          value={safePageSize.toString()}
          onValueChange={(v) => onPageSizeChange(Number(v))}
          options={sizeOptions}
          size="xs"
        />

        {/* ページ番号 */}
        <div className="n3-pagination__pages">
          {/* 最初へ */}
          <button
            onClick={() => onPageChange(1)}
            disabled={safeCurrentPage === 1}
            className="n3-pagination__btn"
            title="最初のページへ"
          >
            <ChevronsLeft size={14} />
          </button>

          {/* 前へ */}
          <button
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            className="n3-pagination__btn"
            title="前のページへ"
          >
            <ChevronLeft size={14} />
          </button>

          {/* ページ番号ボタン */}
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="n3-pagination__ellipsis">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`n3-pagination__btn ${
                  safeCurrentPage === pageNum ? 'active' : ''
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* 次へ */}
          <button
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage >= totalPages}
            className="n3-pagination__btn"
            title="次のページへ"
          >
            <ChevronRight size={14} />
          </button>

          {/* 最後へ */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={safeCurrentPage >= totalPages}
            className="n3-pagination__btn"
            title="最後のページへ"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
});

N3Pagination.displayName = 'N3Pagination';
