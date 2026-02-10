"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Package,
  Warehouse,
  ShoppingCart,
  Calculator,
  Settings,
  Tags,
  BarChart3,
  Database,
  FileText,
  DollarSign,
  Shield,
  Globe,
  Edit,
  Truck,
  Search,
  Layers,
  Filter,
  Upload,
  Download,
  RefreshCw,
  Zap,
  ChevronRight
} from "lucide-react"

// Navigation Configuration
const navigation = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    link: "/dashboard",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    submenu: [
      { id: "list", label: "商品一覧", icon: Layers, link: "/inventory", status: "ready" },
      { id: "zaiko", label: "在庫監視", icon: RefreshCw, link: "/zaiko", status: "ready" },
      { id: "editing", label: "出品編集", icon: Edit, link: "/tools/editing", status: "ready" },
      { id: "editing-n3", label: "出品編集 (N3)", icon: Edit, link: "/tools/editing-n3", status: "new" },
    ]
  },
  {
    id: "research",
    label: "Research",
    icon: Search,
    submenu: [
      { id: "research-n3", label: "リサーチ (N3)", icon: Zap, link: "/tools/research-n3", status: "new" },
      { id: "seller-mirror", label: "SellerMirror", icon: BarChart3, link: "/research/seller-mirror", status: "ready" },
      { id: "market", label: "市場調査", icon: Globe, link: "/research/market", status: "pending" },
    ]
  },
  {
    id: "pricing",
    label: "Pricing",
    icon: DollarSign,
    submenu: [
      { id: "calculator", label: "利益計算機", icon: Calculator, link: "/pricing/calculator", status: "ready" },
      { id: "strategies", label: "価格戦略", icon: Tags, link: "/pricing/strategies", status: "ready" },
      { id: "hts", label: "HTS分類", icon: Shield, link: "/pricing/hts", status: "ready" },
    ]
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: Truck,
    submenu: [
      { id: "policies", label: "配送ポリシー", icon: FileText, link: "/shipping/policies", status: "ready" },
      { id: "zones", label: "ゾーン設定", icon: Globe, link: "/shipping/zones", status: "ready" },
    ]
  },
  {
    id: "marketplace",
    label: "Marketplace",
    icon: ShoppingCart,
    submenu: [
      { id: "ebay", label: "eBay", icon: ShoppingCart, link: "/marketplace/ebay", status: "ready" },
      { id: "amazon", label: "Amazon", icon: ShoppingCart, link: "/marketplace/amazon", status: "pending" },
    ]
  },
  {
    id: "data",
    label: "Data",
    icon: Database,
    submenu: [
      { id: "import", label: "インポート", icon: Upload, link: "/data/import", status: "ready" },
      { id: "export", label: "エクスポート", icon: Download, link: "/data/export", status: "ready" },
      { id: "filters", label: "フィルター管理", icon: Filter, link: "/management/filter", status: "ready" },
    ]
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    link: "/settings",
  },
]

const statusColors = {
  ready: "bg-emerald-500",
  pending: "bg-amber-500",
  new: "bg-blue-500",
}

export default function SidebarV2() {
  const pathname = usePathname()
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [submenuPosition, setSubmenuPosition] = useState<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (id: string, event: React.MouseEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    setSubmenuPosition(rect.top)
    setActiveSubmenu(id)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null)
    }, 150)
  }

  const handleSubmenuEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const isActive = (link?: string) => {
    if (!link) return false
    return pathname === link || pathname.startsWith(link + "/")
  }

  return (
    <>
      {/* Main Sidebar */}
      <nav 
        ref={navRef}
        className="n3-sidebar"
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo */}
        <div className="h-12 flex items-center justify-center border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            N3
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const hasSubmenu = !!item.submenu
            const itemIsActive = isActive(item.link) || item.submenu?.some(sub => isActive(sub.link))

            return (
              <div
                key={item.id}
                onMouseEnter={(e) => hasSubmenu ? handleMouseEnter(item.id, e) : null}
                className="relative"
              >
                {hasSubmenu ? (
                  <div
                    className={`n3-sidebar-item ${itemIsActive ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                  </div>
                ) : (
                  <Link
                    href={item.link || "#"}
                    className={`n3-sidebar-item ${itemIsActive ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                  </Link>
                )}

                {/* Active Indicator Dot */}
                {itemIsActive && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="py-2 border-t border-white/10">
          <button className="n3-sidebar-item w-full">
            <Zap size={20} />
          </button>
        </div>
      </nav>

      {/* Submenu Panel */}
      {navigation.map((item) => (
        item.submenu && (
          <div
            key={`submenu-${item.id}`}
            className={`n3-sidebar-submenu ${activeSubmenu === item.id ? 'visible' : ''}`}
            style={{ paddingTop: `${Math.max(submenuPosition - 8, 56)}px` }}
            onMouseEnter={handleSubmenuEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Submenu Header */}
            <div className="px-4 pb-3 mb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <item.icon size={16} />
                {item.label}
              </div>
            </div>

            {/* Submenu Items */}
            {item.submenu.map((sub) => {
              const SubIcon = sub.icon
              return (
                <Link
                  key={sub.id}
                  href={sub.link}
                  className={`n3-sidebar-submenu-item group ${isActive(sub.link) ? 'bg-white/10 text-white' : ''}`}
                >
                  <SubIcon size={14} className="opacity-70" />
                  <span className="flex-1">{sub.label}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusColors[sub.status as keyof typeof statusColors]}`} />
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                </Link>
              )
            })}
          </div>
        )
      ))}
    </>
  )
}
