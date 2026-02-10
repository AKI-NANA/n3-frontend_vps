"use client"

import { useState, useEffect } from "react"
import { Activity, Database, Wifi, WifiOff } from "lucide-react"

export default function Footer() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastSync, setLastSync] = useState<Date>(new Date())

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <footer className="n3-footer">
      {/* Left: Version & Status */}
      <div className="flex items-center gap-4">
        <span className="font-mono">N3 v2.0.0</span>
        
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <>
              <Wifi size={14} className="text-green-500" />
              <span className="text-green-600">Online</span>
            </>
          ) : (
            <>
              <WifiOff size={14} className="text-red-500" />
              <span className="text-red-600">Offline</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Database size={14} />
          <span>Last sync: {formatTime(lastSync)}</span>
        </div>
      </div>

      {/* Right: Links */}
      <div className="flex items-center gap-4">
        <a href="/docs" className="hover:text-gray-700 transition-colors">Documentation</a>
        <a href="/changelog" className="hover:text-gray-700 transition-colors">Changelog</a>
        <a href="/support" className="hover:text-gray-700 transition-colors">Support</a>
        <span>© 2024 N3 Platform</span>
      </div>
    </footer>
  )
}
