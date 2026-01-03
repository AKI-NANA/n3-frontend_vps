/**
 * Research N3 v2 - 統合マーケットプレイスリサーチツール
 * 
 * 改善点:
 * - サイドバーナビゲーション
 * - マーケットプレイスごとの専用UI
 * - Keepa API統合
 * - 明確なデータ入力フロー
 * - リサーチ→分析→スコアリング→仕入先探索の統合
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Search, Settings, HelpCircle, LogOut,
  ShoppingCart, Globe, Package, TrendingUp, Database,
  ChevronRight, ChevronDown, AlertCircle, Loader2,
  Eye, Download, Upload, RefreshCw, Filter,
  BarChart3, DollarSign, Percent, Clock,
  CheckCircle, XCircle, AlertTriangle,
  Amazon, Ebay, // These would be custom icons
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Components
import AmazonResearchPanel from './components/amazon-research-panel';
import EbayResearchPanel from './components/ebay-research-panel';
import YahooResearchPanel from './components/yahoo-research-panel';
import AnalysisResultsPanel from './components/analysis-results-panel';
import ScoreboardPanel from './components/scoreboard-panel';
import SupplierSearchPanel from './components/supplier-search-panel';

// Types
type MarketplaceId = 'amazon' | 'ebay' | 'yahoo' | 'mercari' | 'rakuten';
type ResearchMode = 'single' | 'batch' | 'seller' | 'keyword';
type ViewSection = 'research' | 'analysis' | 'scoring' | 'supplier';

interface Marketplace {
  id: MarketplaceId;
  name: string;
  icon: React.ElementType;
  color: string;
  apiType: 'keepa' | 'browse' | 'scraping' | 'api';
  regions?: string[];
}

interface ResearchItem {
  id: string;
  marketplace: MarketplaceId;
  identifier: string; // ASIN, ItemID, etc.
  title: string;
  titleEn?: string;
  imageUrl?: string;
  price: number;
  currency: string;
  supplierPrice?: number;
  profitMargin?: number;
  scores: {
    total: number;
    profit: number;
    demand: number;
    competition: number;
    risk: number;
  };
  status: 'pending' | 'analyzing' | 'completed' | 'error';
  data?: any;
  suppliers?: any[];
}

// Constants
const MARKETPLACES: Marketplace[] = [
  { 
    id: 'amazon', 
    name: 'Amazon', 
    icon: Package, // Would be Amazon icon
    color: '#FF9900',
    apiType: 'keepa',
    regions: ['JP', 'US', 'UK', 'DE', 'FR', 'IT', 'ES', 'CA']
  },
  { 
    id: 'ebay', 
    name: 'eBay', 
    icon: ShoppingCart, // Would be eBay icon
    color: '#E53238',
    apiType: 'browse',
    regions: ['US', 'UK', 'DE', 'AU']
  },
  { 
    id: 'yahoo', 
    name: 'Yahoo Auctions', 
    icon: Globe,
    color: '#FF0033',
    apiType: 'scraping'
  },
  { 
    id: 'mercari', 
    name: 'Mercari', 
    icon: Package,
    color: '#FF2A00',
    apiType: 'api'
  },
  { 
    id: 'rakuten', 
    name: 'Rakuten', 
    icon: Globe,
    color: '#BF0000',
    apiType: 'api'
  },
];

const SIDEBAR_WIDTH = 260;
const HEADER_HEIGHT = 56;

// Main Component
export default function ResearchN3V2() {
  const { user, logout } = useAuth();
  
  // State
  const [activeMarketplace, setActiveMarketplace] = useState<MarketplaceId>('amazon');
  const [activeSection, setActiveSection] = useState<ViewSection>('research');
  const [researchMode, setResearchMode] = useState<ResearchMode>('batch');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<Record<string, any>>({});

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize API status
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      // Check Keepa API
      const keepaRes = await fetch('/api/keepa/token-status');
      const keepaStatus = await keepaRes.json();
      
      // Check eBay API
      const ebayRes = await fetch('/api/ebay/auth/status');
      const ebayStatus = await ebayRes.json();
      
      setApiStatus({
        keepa: keepaStatus,
        ebay: ebayStatus,
      });
    } catch (error) {
      console.error('Failed to check API status:', error);
    }
  };

  // Handlers
  const handleBatchUpload = (marketplace: MarketplaceId, data: string[]) => {
    const newItems: ResearchItem[] = data.map((identifier, index) => ({
      id: `${marketplace}-${identifier}-${Date.now()}-${index}`,
      marketplace,
      identifier,
      title: `Loading ${identifier}...`,
      imageUrl: undefined,
      price: 0,
      currency: marketplace === 'amazon' ? 'JPY' : 'USD',
      scores: {
        total: 0,
        profit: 0,
        demand: 0,
        competition: 0,
        risk: 0,
      },
      status: 'pending',
    }));
    
    setItems(prev => [...prev, ...newItems]);
    processResearchQueue(newItems);
  };

  const processResearchQueue = async (itemsToProcess: ResearchItem[]) => {
    setIsLoading(true);
    
    for (const item of itemsToProcess) {
      try {
        // Update status to analyzing
        setItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, status: 'analyzing' } : i
        ));

        let result;
        switch (item.marketplace) {
          case 'amazon':
            result = await fetchAmazonProduct(item.identifier);
            break;
          case 'ebay':
            result = await fetchEbayProduct(item.identifier);
            break;
          default:
            throw new Error(`Unsupported marketplace: ${item.marketplace}`);
        }

        // Update with results
        setItems(prev => prev.map(i => 
          i.id === item.id ? {
            ...i,
            ...result,
            status: 'completed',
          } : i
        ));
      } catch (error) {
        console.error(`Failed to process ${item.identifier}:`, error);
        setItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, status: 'error' } : i
        ));
      }
    }
    
    setIsLoading(false);
  };

  const fetchAmazonProduct = async (asin: string) => {
    const response = await fetch(`/api/keepa/product?asin=${asin}&domain=5`); // 5 = JP
    const data = await response.json();
    
    // Process Keepa data
    return {
      title: data.title || asin,
      titleEn: data.titleEn,
      imageUrl: data.imagesCSV?.split(',')[0],
      price: data.stats?.current?.[0] || 0, // Current price
      supplierPrice: data.stats?.current?.[0] || 0,
      profitMargin: calculateProfitMargin(data),
      scores: calculateScores(data),
      data,
    };
  };

  const fetchEbayProduct = async (itemId: string) => {
    const response = await fetch(`/api/ebay/browse/item/${itemId}`);
    const data = await response.json();
    
    return {
      title: data.title,
      imageUrl: data.image?.imageUrl,
      price: parseFloat(data.price?.value || '0'),
      currency: data.price?.currency || 'USD',
      scores: calculateEbayScores(data),
      data,
    };
  };

  const calculateProfitMargin = (data: any): number => {
    // Simple calculation - would be more complex in production
    const sellingPrice = data.stats?.current?.[0] || 0;
    const cost = sellingPrice * 0.7; // Assume 70% cost
    return ((sellingPrice - cost) / sellingPrice) * 100;
  };

  const calculateScores = (data: any): ResearchItem['scores'] => {
    // Simplified scoring logic
    return {
      total: 75,
      profit: 80,
      demand: 70,
      competition: 65,
      risk: 85,
    };
  };

  const calculateEbayScores = (data: any): ResearchItem['scores'] => {
    return {
      total: 70,
      profit: 75,
      demand: 65,
      competition: 70,
      risk: 80,
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      handleBatchUpload(activeMarketplace, lines);
    };
    reader.readAsText(file);
  };

  const exportResults = () => {
    const csv = [
      ['Marketplace', 'ID', 'Title', 'Price', 'Profit Margin', 'Total Score'].join(','),
      ...items.filter(i => i.status === 'completed').map(item => 
        [
          item.marketplace,
          item.identifier,
          `"${item.title}"`,
          item.price,
          item.profitMargin?.toFixed(2) || '0',
          item.scores.total
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-results-${Date.now()}.csv`;
    a.click();
  };

  const activeMarketplaceConfig = MARKETPLACES.find(m => m.id === activeMarketplace);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`
          ${sidebarCollapsed ? 'w-16' : `w-[${SIDEBAR_WIDTH}px]`}
          bg-white border-r border-gray-200 flex flex-col transition-all duration-300
        `}
        style={{ width: sidebarCollapsed ? 64 : SIDEBAR_WIDTH }}
      >
        {/* Logo */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-gray-900">Research N3</span>
              <span className="text-xs text-gray-500">v2.0</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight 
              className={`w-4 h-4 text-gray-500 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {/* Marketplaces Section */}
          <div className="mb-6">
            {!sidebarCollapsed && (
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Marketplaces
                </span>
              </div>
            )}
            <div className="space-y-1">
              {MARKETPLACES.map(marketplace => {
                const Icon = marketplace.icon;
                const isActive = activeMarketplace === marketplace.id;
                const hasApiKey = marketplace.apiType === 'keepa' 
                  ? apiStatus.keepa?.hasApiKey 
                  : marketplace.apiType === 'browse'
                  ? apiStatus.ebay?.isAuthorized
                  : true;

                return (
                  <button
                    key={marketplace.id}
                    onClick={() => setActiveMarketplace(marketplace.id)}
                    className={`
                      w-full px-4 py-2 flex items-center gap-3
                      transition-colors relative
                      ${isActive 
                        ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon 
                      className="w-5 h-5 flex-shrink-0" 
                      style={{ color: isActive ? undefined : marketplace.color }}
                    />
                    {!sidebarCollapsed && (
                      <>
                        <span className="text-sm font-medium flex-1 text-left">
                          {marketplace.name}
                        </span>
                        {!hasApiKey && (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sections */}
          {!sidebarCollapsed && (
            <div>
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Workflow
                </span>
              </div>
              <div className="space-y-1">
                {[
                  { id: 'research' as ViewSection, label: 'リサーチ', icon: Search },
                  { id: 'analysis' as ViewSection, label: '分析', icon: BarChart3 },
                  { id: 'scoring' as ViewSection, label: 'スコアリング', icon: TrendingUp },
                  { id: 'supplier' as ViewSection, label: '仕入先探索', icon: Package },
                ].map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full px-4 py-2 flex items-center gap-3
                      transition-colors
                      ${activeSection === section.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm">{section.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* User Menu */}
        <div className="border-t border-gray-200 p-4">
          {sidebarCollapsed ? (
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-indigo-600">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.username}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <LogOut className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header 
          className="bg-white border-b border-gray-200 px-6 flex items-center justify-between"
          style={{ height: HEADER_HEIGHT }}
        >
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {activeMarketplaceConfig?.name} Research
            </h1>
            <div className="flex items-center gap-2">
              {activeMarketplaceConfig?.apiType === 'keepa' && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Keepa API
                  {apiStatus.keepa?.tokensLeft && (
                    <span className="ml-1">({apiStatus.keepa.tokensLeft} tokens)</span>
                  )}
                </div>
              )}
              {activeMarketplaceConfig?.apiType === 'browse' && apiStatus.ebay?.isAuthorized && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  eBay API Connected
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Total:</span>
                <span className="text-sm font-semibold text-gray-900">{items.length}</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">完了:</span>
                <span className="text-sm font-semibold text-emerald-600">
                  {items.filter(i => i.status === 'completed').length}
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">選択:</span>
                <span className="text-sm font-semibold text-indigo-600">{selectedItems.size}</span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button
              onClick={exportResults}
              disabled={items.filter(i => i.status === 'completed').length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export Results
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Main Panel */}
          <div className="flex-1 overflow-auto">
            {activeSection === 'research' && (
              <>
                {activeMarketplace === 'amazon' && (
                  <AmazonResearchPanel
                    onBatchSubmit={(asins) => handleBatchUpload('amazon', asins)}
                    apiStatus={apiStatus.keepa}
                  />
                )}
                {activeMarketplace === 'ebay' && (
                  <EbayResearchPanel
                    onBatchSubmit={(itemIds) => handleBatchUpload('ebay', itemIds)}
                    apiStatus={apiStatus.ebay}
                  />
                )}
                {activeMarketplace === 'yahoo' && (
                  <YahooResearchPanel
                    onBatchSubmit={(ids) => handleBatchUpload('yahoo', ids)}
                  />
                )}
              </>
            )}
            
            {activeSection === 'analysis' && (
              <AnalysisResultsPanel
                items={items}
                selectedItems={selectedItems}
                onSelectItem={(id) => {
                  setSelectedItems(prev => {
                    const next = new Set(prev);
                    if (next.has(id)) {
                      next.delete(id);
                    } else {
                      next.add(id);
                    }
                    return next;
                  });
                }}
              />
            )}
            
            {activeSection === 'scoring' && (
              <ScoreboardPanel items={items.filter(i => i.status === 'completed')} />
            )}
            
            {activeSection === 'supplier' && (
              <SupplierSearchPanel
                selectedItems={items.filter(i => selectedItems.has(i.id))}
              />
            )}
          </div>

          {/* Detail Panel (when item selected) */}
          {selectedItems.size === 1 && (
            <div className="w-96 border-l border-gray-200 bg-white overflow-auto">
              {/* Item details would go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
