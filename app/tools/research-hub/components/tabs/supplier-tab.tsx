// app/tools/research-hub/components/tabs/supplier-tab.tsx
'use client'

import type { ResearchItem } from '../../types/research'
import { Package } from 'lucide-react'

interface SupplierTabProps {
  items: ResearchItem[]
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function SupplierTab({ items, showToast }: SupplierTabProps) {
  return (
    <div className="p-12 text-center">
      <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
        仕入先探索
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        実装予定（AI-Powered Supplier Discovery）
      </p>
    </div>
  )
}
