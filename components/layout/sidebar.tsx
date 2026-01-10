"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home, Database, Upload, Warehouse, ShoppingCart, Target, BarChart3,
  Package, Calculator, Link as LinkIcon, Heart, FileText, Settings,
  Wrench, GitBranch, FlaskConical, Globe, X, Moon, Sun, Sunrise,
  CheckCircle, DollarSign, Shield, Edit, Edit2,
  Truck, Tags, Code, Layers, BookOpen, Bug, Calendar, List, Search,
  Table, Weight, Grid, PackageCheck, ClipboardList, MessageCircle,
  LayoutDashboard, TrendingUp, Zap, Book, CreditCard, Rocket, Clock,
  RefreshCw, Users, LogIn, UserPlus, LayoutGrid, TestTube, Palette,
  Square, Activity, Utensils, Moon as MoonIcon, Clipboard, Key, Lock,
  CheckSquare, ShieldCheck, Cog, MoreHorizontal, LucideIcon, Server,
  Sparkles
} from "lucide-react"
import { navigationItems, NavigationItem, getActiveNavigationItems } from "./sidebar-config"

// アイコン名からLucideコンポーネントへのマッピング
const iconMap: Record<string, LucideIcon> = {
  "home": Home,
  "database": Database,
  "upload": Upload,
  "warehouse": Warehouse,
  "shopping-cart": ShoppingCart,
  "target": Target,
  "bar-chart": BarChart3,
  "package": Package,
  "calculator": Calculator,
  "link": LinkIcon,
  "heart": Heart,
  "file-text": FileText,
  "settings": Settings,
  "tool": Wrench,
  "git-branch": GitBranch,
  "flask": FlaskConical,
  "check-circle": CheckCircle,
  "dollar-sign": DollarSign,
  "shield": Shield,
  "edit": Edit,
  "edit-2": Edit2,
  "truck": Truck,
  "tags": Tags,
  "code": Code,
  "layers": Layers,
  "book-open": BookOpen,
  "bug": Bug,
  "calendar": Calendar,
  "list": List,
  "search": Search,
  "table": Table,
  "weight": Weight,
  "grid": Grid,
  "package-check": PackageCheck,
  "clipboard-list": ClipboardList,
  "message-circle": MessageCircle,
  "layout-dashboard": LayoutDashboard,
  "trending-up": TrendingUp,
  "zap": Zap,
  "book": Book,
  "credit-card": CreditCard,
  "rocket": Rocket,
  "clock": Clock,
  "refresh-cw": RefreshCw,
  "users": Users,
  "log-in": LogIn,
  "user-plus": UserPlus,
  "layout-grid": LayoutGrid,
  "test-tube": TestTube,
  "palette": Palette,
  "square": Square,
  "layout": LayoutGrid,
  "activity": Activity,
  "utensils": Utensils,
  "moon": MoonIcon,
  "clipboard": Clipboard,
  "key": Key,
  "lock": Lock,
  "globe": Globe,
  "check-square": CheckSquare,
  "shield-check": ShieldCheck,
  "cog": Cog,
  "server": Server,
  "sparkles": Sparkles,
}

const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || MoreHorizontal
}

type ThemeType = "dawn" | "light" | "cyber"

const themeConfig: Record<ThemeType, { icon: typeof Sun; label: string }> = {
  dawn: { icon: Sunrise, label: "Dawn" },
  light: { icon: Sun, label: "Light" },
  cyber: { icon: Moon, label: "Cyber" },
}

export default function Sidebar() {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<NavigationItem | null>(null)
  const [theme, setTheme] = useState<ThemeType>("cyber")

  const isActive = (link: string) => {
    if (!link) return false
    return pathname === link
  }

  const handleItemClick = (item: NavigationItem) => {
    if (item.submenu) {
      setOpenSubmenu(openSubmenu?.id === item.id ? null : item)
    }
  }

  return (
    <>
      {/* Main Sidebar */}
      <aside className={`n3-sidebar ${openSubmenu ? 'keep-expanded' : ''}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-3 border-b flex-shrink-0" style={{ borderColor: 'var(--glass-border)' }}>
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            N3
          </div>
          <span 
            className="nav-label text-lg tracking-wide" 
            style={{ 
              color: 'var(--text)',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 600
            }}
          >
            Nagano-3
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
          {getActiveNavigationItems().map((item) => {
            const Icon = getIcon(item.icon)
            const active = item.link ? isActive(item.link) : false
            const hasOpenSubmenu = openSubmenu?.id === item.id

            return (
              <div key={item.id}>
                {item.link && !item.submenu ? (
                  <Link
                    href={item.link}
                    prefetch={false}
                    className={`nav-item ${active ? 'active' : ''}`}
                  >
                    <Icon />
                    <span className="nav-label">{item.label}</span>
                  </Link>
                ) : (
                  <div
                    onClick={() => handleItemClick(item)}
                    className={`nav-item ${active || hasOpenSubmenu ? 'active' : ''}`}
                  >
                    <Icon />
                    <span className="nav-label">{item.label}</span>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Theme Switcher - 横並び(展開時)、縦並び(閉じた時) */}
        <div className="px-1 py-2 border-t flex-shrink-0" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="n3-sidebar-theme-grid">
            {(["dawn", "light", "cyber"] as ThemeType[]).map((t) => {
              const TIcon = themeConfig[t].icon
              const isCurrentTheme = theme === t
              return (
                <button
                  key={t}
                  onClick={() => {
                    setTheme(t)
                    document.documentElement.setAttribute("data-theme", t)
                    if (t === "cyber") {
                      document.documentElement.classList.add("dark")
                    } else {
                      document.documentElement.classList.remove("dark")
                    }
                  }}
                  className="p-2 rounded-md transition-all flex items-center justify-center"
                  style={{
                    background: isCurrentTheme ? 'var(--accent)' : 'transparent',
                    color: isCurrentTheme ? 'white' : 'var(--text-muted)'
                  }}
                  title={themeConfig[t].label}
                >
                  <TIcon size={14} />
                </button>
              )
            })}
          </div>
        </div>
      </aside>

      {/* Submenu Panel */}
      {openSubmenu && (
        <div className={`n3-submenu-panel ${openSubmenu ? 'open' : ''}`}>
          <div className="submenu-header">
            <div className="flex-1 text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
              {openSubmenu.label}
            </div>
            <button
              onClick={() => setOpenSubmenu(null)}
              className="p-1 rounded hover:bg-[var(--highlight)] transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <div className="py-2">
            {openSubmenu.submenu?.map((sub) => {
              const SubIcon = getIcon(sub.icon)
              const isExternal = sub.link.startsWith('http')
              const subActive = !isExternal && isActive(sub.link)

              if (isExternal) {
                return (
                  <a
                    key={sub.link}
                    href={sub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="submenu-item"
                  >
                    <SubIcon />
                    <span className="flex-1">{sub.text}</span>
                    <Globe size={10} className="opacity-50" />
                  </a>
                )
              }

              return (
                <Link
                  key={sub.link}
                  href={sub.link}
                  prefetch={false}
                  className={`submenu-item ${subActive ? 'active' : ''}`}
                  onClick={() => setOpenSubmenu(null)}
                >
                  <SubIcon />
                  <span className="flex-1">{sub.text}</span>
                  {sub.status === "new" && (
                    <span className="px-1 py-0.5 text-[8px] bg-green-500 text-white rounded flex-shrink-0">NEW</span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
