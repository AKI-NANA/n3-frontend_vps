// app/tools/operations/components/marketplace-selector.tsx
// コピー元: editing/components/marketplace-selector.tsx

"use client"

import { ShoppingCart, Store, Package } from "lucide-react"

export interface MarketplaceSelection {
  all: boolean
  ebay: boolean
  shopee: boolean
  shopify: boolean
}

interface MarketplaceSelectorProps {
  marketplaces: MarketplaceSelection
  onChange: (value: MarketplaceSelection) => void
}

const items = [
  { key: "ebay" as const, label: "eBay", icon: ShoppingCart, color: "#E53238" },
  { key: "shopee" as const, label: "Shopee", icon: Store, color: "#EE4D2D" },
  { key: "shopify" as const, label: "Shopify", icon: Package, color: "#96BF48" },
]

export function MarketplaceSelector({ marketplaces, onChange }: MarketplaceSelectorProps) {
  const handleChange = (key: keyof MarketplaceSelection) => {
    onChange({ ...marketplaces, [key]: !marketplaces[key] })
  }

  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Marketplaces:</span>
      {items.map((mp) => {
        const Icon = mp.icon
        const isActive = marketplaces[mp.key]
        return (
          <button
            key={mp.key}
            onClick={() => handleChange(mp.key)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-all"
            style={{ 
              border: `1px solid ${isActive ? mp.color : 'var(--panel-border)'}`,
              background: isActive ? `${mp.color}10` : 'transparent',
              color: isActive ? mp.color : 'var(--text-muted)'
            }}
          >
            <Icon size={11} />
            {mp.label}
          </button>
        )
      })}
    </div>
  )
}
