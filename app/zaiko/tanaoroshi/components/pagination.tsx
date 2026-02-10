'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, total, itemsPerPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else if (page <= 4) {
      for (let i = 1; i <= maxVisible; i++) pages.push(i)
    } else if (page >= totalPages - 3) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i)
    } else {
      for (let i = page - 3; i <= page + 3; i++) pages.push(i)
    }

    return pages
  }

  const startItem = Math.min((page - 1) * itemsPerPage + 1, total)
  const endItem = Math.min(page * itemsPerPage, total)

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* 表示件数情報 */}
        <p className="text-sm text-slate-600">
          全 <span className="font-bold text-slate-900">{total.toLocaleString()}</span> 件中、
          <span className="font-bold text-blue-600">{startItem.toLocaleString()}</span> ～
          <span className="font-bold text-blue-600">{endItem.toLocaleString()}</span> 件を表示
        </p>

        {/* ページネーションボタン */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map(num => (
            <Button
              key={num}
              variant={page === num ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(num)}
              className={`w-9 ${page === num ? "bg-blue-600" : ""}`}
            >
              {num}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        {/* ページ情報 */}
        <div className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
          ページ <span className="font-semibold text-blue-600">{page}</span> / {totalPages}
        </div>
      </div>
    </div>
  )
}
