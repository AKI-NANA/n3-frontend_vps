// app/tools/editing/components/pagination.tsx
/**
 * Pagination - 数字ボタン付きページネーション
 * 
 * Phase 1: ページネーション復活
 * - 数字ボタン (1 2 3 ... 10)
 * - 前後ボタン (« ‹ › »)
 * - ページサイズ選択 (25/50/100/500/1000/5000/全件)
 * - 上限1000件制限撤廃
 */

'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  total,
  pageSize,
  currentPage,
  onPageSizeChange,
  onPageChange,
  pageSizeOptions = [25, 50, 100, 500, 1000, 5000]
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize) || 1;
  
  // ページ番号の配列を生成
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // 7ページ以下なら全て表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 先頭
      pages.push(1);
      
      // 先頭付近の省略
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // 現在ページ周辺
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      // 末尾付近の省略
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // 末尾
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);
  
  return (
    <div className="n3-pagination">
      {/* 左側: 表示情報 */}
      <div className="n3-pagination__info">
        <strong>{startItem}</strong> - <strong>{endItem}</strong> / 全<strong>{total}</strong>件
      </div>
      
      {/* 右側: コントロール */}
      <div className="n3-pagination__controls">
        {/* ページサイズ選択 */}
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="n3-pagination__size-select"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}件
            </option>
          ))}
          <option value={99999}>全件</option>
        </select>
        
        {/* ページ番号 */}
        <div className="n3-pagination__pages">
          {/* 最初へ */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="n3-pagination__btn"
            title="最初のページへ"
          >
            <ChevronsLeft size={14} />
          </button>
          
          {/* 前へ */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
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
                className={`n3-pagination__btn ${currentPage === pageNum ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {/* 次へ */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="n3-pagination__btn"
            title="次のページへ"
          >
            <ChevronRight size={14} />
          </button>
          
          {/* 最後へ */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="n3-pagination__btn"
            title="最後のページへ"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
