"use client"

import { useState } from "react"
import { X, MessageSquare, Clock, TrendingUp, AlertCircle } from "lucide-react"

interface RightSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function RightSidebar({ isOpen = false, onClose }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<'activity' | 'alerts'>('activity')

  return (
    <aside className={`n3-right-sidebar ${isOpen ? 'visible' : ''}`}>
      {/* Header */}
      <div className="n3-right-sidebar-header">
        <h2 className="n3-right-sidebar-title">Activity</h2>
        <button onClick={onClose} className="n3-modal-close">
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="n3-tabs px-4">
        <button
          onClick={() => setActiveTab('activity')}
          className={`n3-tab ${activeTab === 'activity' ? 'active' : ''}`}
        >
          <Clock size={14} className="mr-1.5" />
          Activity
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`n3-tab ${activeTab === 'alerts' ? 'active' : ''}`}
        >
          <AlertCircle size={14} className="mr-1.5" />
          Alerts
        </button>
      </div>

      {/* Content */}
      <div className="n3-right-sidebar-content">
        {activeTab === 'activity' ? (
          <div className="space-y-4">
            {/* Activity Items */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={14} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">Price updated</div>
                <div className="text-xs text-gray-500">Nintendo Switch - $299.99</div>
                <div className="text-xs text-gray-400 mt-1">2 min ago</div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={14} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">New message</div>
                <div className="text-xs text-gray-500">Buyer inquiry on Order #4521</div>
                <div className="text-xs text-gray-400 mt-1">15 min ago</div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Clock size={14} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">Sync completed</div>
                <div className="text-xs text-gray-500">eBay inventory updated</div>
                <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Alert Items */}
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-red-800">Low stock alert</div>
                  <div className="text-xs text-red-600 mt-0.5">5 items below threshold</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-amber-800">Price change detected</div>
                  <div className="text-xs text-amber-600 mt-0.5">3 competitor price drops</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-800">New eBay policy</div>
                  <div className="text-xs text-blue-600 mt-0.5">Updated shipping requirements</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
