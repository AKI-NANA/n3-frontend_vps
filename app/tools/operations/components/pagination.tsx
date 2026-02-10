// app/tools/operations/components/pagination.tsx
// コピー元: editing/components/pagination.tsx

'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  itemsPerPage?: number
  total?: number
  pageSize?: number
  onPageSizeChange?: (size: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  total,
  pageSize,
  onPageSizeChange
}: PaginationProps) {
  // 互換性のための計算
  const effectiveTotalItems = totalItems ?? total ?? 0
  const effectiveItemsPerPage = itemsPerPage ?? pageSize ?? 50
  const effectiveTotalPages = totalPages || Math.ceil(effectiveTotalItems / effectiveItemsPerPage)
  
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7
    
    if (effectiveTotalPages <= maxVisible) {
      for (let i = 1; i <= effectiveTotalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i)
        pages.push('ellipsis-1')
        pages.push(effectiveTotalPages)
      } else if (currentPage >= effectiveTotalPages - 3) {
        pages.push(1)
        pages.push('ellipsis-2')
        for (let i = effectiveTotalPages - 4; i <= effectiveTotalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('ellipsis-3')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('ellipsis-4')
        pages.push(effectiveTotalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-secondary rounded-lg">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {effectiveTotalItems > 0 && effectiveItemsPerPage > 0 && (
          <span>
            {((currentPage - 1) * effectiveItemsPerPage) + 1}-{Math.min(currentPage * effectiveItemsPerPage, effectiveTotalItems)} / {effectiveTotalItems}件
          </span>
        )}
        {onPageSizeChange && (
          <select
            value={effectiveItemsPerPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value={25}>25件</option>
            <option value={50}>50件</option>
            <option value={100}>100件</option>
          </select>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          最初
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          前へ
        </button>
        
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            const isEllipsis = typeof page === 'string' && page.startsWith('ellipsis')
            const uniqueKey = isEllipsis ? page : `page-${page}`
            
            return isEllipsis ? (
              <span key={uniqueKey} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                key={uniqueKey}
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-1 rounded border text-sm ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border bg-background hover:bg-accent'
                }`}
              >
                {page}
              </button>
            )
          })}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === effectiveTotalPages}
          className="px-3 py-1 rounded border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          次へ
        </button>
        
        <button
          onClick={() => onPageChange(effectiveTotalPages)}
          disabled={currentPage === effectiveTotalPages}
          className="px-3 py-1 rounded border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          最後
        </button>
      </div>
    </div>
  )
}
