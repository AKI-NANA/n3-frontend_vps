"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { 
  User, LogOut, Settings, HelpCircle,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

// Tenant組織切替
import { OrganizationSwitcher } from "@/components/tenant"

// N3コンポーネント
import {
  N3LanguageSwitch,
  N3WorldClock,
  N3CurrencyDisplay,
  N3NotificationBell,
  N3UserAvatar,
  N3Divider,
  N3HeaderSearchInput,
} from "@/components/n3"

// World clocks config
const CLOCKS_CONFIG = [
  { label: "LA", tz: "America/Los_Angeles" },
  { label: "NY", tz: "America/New_York" },
  { label: "DE", tz: "Europe/Berlin" },
  { label: "JP", tz: "Asia/Tokyo" },
]

/**
 * Header コンポーネント
 * 
 * - /tools/editing ページでは表示しない（EditingPageLayoutが専用ヘッダーを持つ）
 * - その他のページでは通常のヘッダーを表示
 */
export default function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  
  const [times, setTimes] = useState<Record<string, string>>({})
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [language, setLanguage] = useState<'ja' | 'en'>('ja')
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // /tools/editing および関連ページでは表示しない
  const isEditingPage = pathname === '/tools/editing' || pathname.startsWith('/tools/editing/') ||
                        pathname === '/tools/editing-n3' || pathname.startsWith('/tools/editing-n3/') ||
                        pathname === '/tools/editing-legacy' || pathname.startsWith('/tools/editing-legacy/')
  
  // N3ページ（サイドバーのみ、ヘッダー非表示）
  const isN3PageWithSidebar = pathname === '/tools/research-n3' || pathname.startsWith('/tools/research-n3/') ||
                              pathname === '/tools/bookkeeping-n3' || pathname.startsWith('/tools/bookkeeping-n3/') ||
                              pathname === '/tools/amazon-research-n3' || pathname.startsWith('/tools/amazon-research-n3/') ||
                              pathname === '/tools/control-n3' || pathname.startsWith('/tools/control-n3/') ||
                              pathname === '/tools/listing-n3' || pathname.startsWith('/tools/listing-n3/') ||
                              pathname === '/tools/operations-n3' || pathname.startsWith('/tools/operations-n3/') ||
                              pathname === '/tools/finance-n3' || pathname.startsWith('/tools/finance-n3/') ||
                              pathname === '/tools/command-center' || pathname.startsWith('/tools/command-center/') ||
                              pathname === '/tools/workspace' || pathname.startsWith('/tools/workspace/')
  
  // Update clocks
  useEffect(() => {
    const update = () => {
      const newTimes: Record<string, string> = {}
      CLOCKS_CONFIG.forEach(c => {
        newTimes[c.label] = new Date().toLocaleTimeString("en-US", { 
          timeZone: c.tz,
          hour: "2-digit", 
          minute: "2-digit",
          hour12: false 
        })
      })
      setTimes(newTimes)
    }
    update()
    const interval = setInterval(update, 30000)
    return () => clearInterval(interval)
  }, [])

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // /tools/editing では表示しない、またはN3ページでも表示しない
  if (isEditingPage || isN3PageWithSidebar) {
    return null
  }

  // WorldClock用データ
  const clocksData = CLOCKS_CONFIG.map(c => ({
    label: c.label,
    time: times[c.label] || '--:--'
  }))

  return (
    <header className="n3-header">
      {/* Left */}
      <div className="n3-header-left">
        <h1 className="n3-header-title">N3 Platform</h1>
      </div>

      {/* Center - Search */}
      <div className="n3-header-center">
        <N3HeaderSearchInput
          placeholder="Search..."
          shortcut="⌘K"
          width={240}
        />
      </div>

      {/* Right */}
      <div className="n3-header-right">
        {/* World Clocks */}
        <N3WorldClock clocks={clocksData} />

        <N3Divider orientation="vertical" />

        {/* Exchange Rate */}
        <N3CurrencyDisplay value={149.50} trend="up" />

        <N3Divider orientation="vertical" />

        {/* Organization Switcher */}
        <OrganizationSwitcher />

        <N3Divider orientation="vertical" />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <N3NotificationBell 
            count={3} 
            active={showNotifications}
            onClick={() => setShowNotifications(!showNotifications)} 
          />
          
          {showNotifications && (
            <div className="n3-dropdown" style={{ width: 280, right: 0 }}>
              <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--panel-border)' }}>
                <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Notifications</span>
              </div>
              {[
                { title: "価格更新", desc: "3件の商品価格を更新", time: "2分前", color: "var(--color-success)" },
                { title: "在庫アラート", desc: "SKU-8012 在庫わずか", time: "12分前", color: "var(--color-warning)" },
                { title: "出品完了", desc: "eBayに5件出品完了", time: "1時間前", color: "var(--color-info)" },
              ].map((n, i) => (
                <div key={i} className="n3-dropdown-item">
                  <div className="n3-status-dot" style={{ background: n.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{n.title}</div>
                    <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{n.desc}</div>
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <N3UserAvatar 
            name={user?.username || 'User'} 
            onClick={() => setShowUserMenu(!showUserMenu)}
          />

          {showUserMenu && (
            <div className="n3-dropdown" style={{ width: 180 }}>
              <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--panel-border)' }}>
                <div className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
                  {user?.username || "User"}
                </div>
                <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                  {user?.email || "user@example.com"}
                </div>
              </div>
              <div className="n3-dropdown-item">
                <User size={14} /> Profile
              </div>
              <div className="n3-dropdown-item">
                <Settings size={14} /> Settings
              </div>
              <div className="n3-dropdown-item">
                <HelpCircle size={14} /> Help
              </div>
              <div className="n3-dropdown-divider" />
              <div 
                className="n3-dropdown-item"
                style={{ color: 'var(--color-error)' }}
                onClick={() => { setShowUserMenu(false); logout() }}
              >
                <LogOut size={14} /> Sign out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
