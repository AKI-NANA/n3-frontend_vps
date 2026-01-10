"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Bell, Moon, Sun, User, ChevronDown, LogOut, Settings, HelpCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function HeaderV2() {
  const [isDark, setIsDark] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [clocks, setClocks] = useState({ la: "", ny: "", tokyo: "" })
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()

  // World clocks
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date()
      setClocks({
        la: now.toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: "2-digit", minute: "2-digit", hour12: false }),
        ny: now.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", hour12: false }),
        tokyo: now.toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit", hour12: false }),
      })
    }
    updateClocks()
    const interval = setInterval(updateClocks, 60000)
    return () => clearInterval(interval)
  }, [])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showUserMenu])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const handleLogout = async () => {
    setShowUserMenu(false)
    await logout()
  }

  return (
    <header className="n3-header">
      {/* Left: Breadcrumb / Page Title */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">Products</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-muted-foreground">Editing</span>
      </div>

      {/* Center: Search (optional) */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search... (⌘K)"
            className="n3-input w-full pl-9 pr-4"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* World Clocks */}
        <div className="hidden lg:flex items-center gap-4 mr-4 text-xs">
          <div className="text-center">
            <div className="text-muted-foreground text-[10px] uppercase tracking-wider">LA</div>
            <div className="font-mono font-medium">{clocks.la}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground text-[10px] uppercase tracking-wider">NY</div>
            <div className="font-mono font-medium">{clocks.ny}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground text-[10px] uppercase tracking-wider">JP</div>
            <div className="font-mono font-medium text-primary">{clocks.tokyo}</div>
          </div>
        </div>

        <div className="n3-toolbar-divider" />

        {/* Notifications */}
        <button className="n3-btn n3-btn-ghost n3-btn-icon relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="n3-btn n3-btn-ghost n3-btn-icon"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="n3-btn n3-btn-ghost flex items-center gap-2 px-2"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <ChevronDown size={14} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          <div className={`n3-dropdown-menu ${showUserMenu ? 'open' : ''}`}>
            {/* User Info */}
            <div className="px-3 py-2 border-b border-border mb-1">
              <div className="text-sm font-medium">{user?.username}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>

            <button className="n3-dropdown-item w-full text-left">
              <Settings size={14} />
              Settings
            </button>
            <button className="n3-dropdown-item w-full text-left">
              <HelpCircle size={14} />
              Help
            </button>
            
            <div className="border-t border-border my-1" />
            
            <button 
              onClick={handleLogout}
              className="n3-dropdown-item w-full text-left text-red-600 hover:bg-red-50"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
