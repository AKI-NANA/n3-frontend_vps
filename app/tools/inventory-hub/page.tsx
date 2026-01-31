// app/tools/inventory-hub/page.tsx
/**
 * 📦 Inventory Hub - 在庫統合母艦
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Package, Monitor, Truck, RefreshCw, Shield, AlertCircle, TrendingUp, TrendingDown, Search, Loader2 } from 'lucide-react';
import { BaseHubLayout, HubTool, useDispatch, ToolExecutionPanel } from '@/components/n3/empire/base-hub-layout';

// ============================================================
// Stock Monitor Tool
// ============================================================

function StockMonitorTool() {
  const [stockData, setStockData] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out' | 'ok'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    setStockData([
      { id: 1, sku: 'PKM-25TH-001', title: 'ポケモンカード 25周年', stock: 5, threshold: 10, status: 'low', trend: 'down' },
      { id: 2, sku: 'DBZ-ICH-002', title: 'ドラゴンボール フィギュア', stock: 0, threshold: 5, status: 'out', trend: 'down' },
      { id: 3, sku: 'KMY-TAN-003', title: '鬼滅の刃 フィギュア', stock: 25, threshold: 10, status: 'ok', trend: 'up' },
    ]);
  }, []);
  
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = { ok: 'bg-green-500/20 text-green-500', low: 'bg-yellow-500/20 text-yellow-500', out: 'bg-red-500/20 text-red-500' };
    const labels: Record<string, string> = { ok: '正常', low: '低在庫', out: '在庫切れ' };
    return <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };
  
  const filteredData = stockData.filter(item => filterStatus === 'all' || item.status === filterStatus);
  const stats = { total: stockData.length, ok: stockData.filter(i => i.status === 'ok').length, low: stockData.filter(i => i.status === 'low').length, out: stockData.filter(i => i.status === 'out').length };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[{ label: '総商品数', value: stats.total, color: '' }, { label: '正常', value: stats.ok, color: 'text-green-500' }, { label: '低在庫', value: stats.low, color: 'text-yellow-500' }, { label: '在庫切れ', value: stats.out, color: 'text-red-500' }].map((s, i) => (
          <div key={i} className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--highlight)]"><tr><th className="px-4 py-3 text-left">SKU</th><th className="px-4 py-3 text-left">商品名</th><th className="px-4 py-3 text-right">在庫数</th><th className="px-4 py-3 text-center">ステータス</th></tr></thead>
          <tbody className="divide-y divide-[var(--panel-border)]">
            {filteredData.map(item => (
              <tr key={item.id} className="hover:bg-[var(--highlight)]">
                <td className="px-4 py-3 font-mono text-xs">{item.sku}</td>
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3 text-right font-bold">{item.stock}</td>
                <td className="px-4 py-3 text-center">{getStatusBadge(item.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// Suppliers Tool
// ============================================================

function SuppliersTool() {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Yahoo Auctions', region: 'JP', status: 'active', items: 150, lastSync: '2026-01-26T15:00:00' },
    { id: 2, name: 'Amazon Japan', region: 'JP', status: 'active', items: 80, lastSync: '2026-01-26T14:30:00' },
    { id: 3, name: 'Rakuten', region: 'JP', status: 'warning', items: 45, lastSync: '2026-01-26T10:00:00' },
  ]);
  
  return (
    <div className="space-y-6">
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)]"><h3 className="font-bold flex items-center gap-2"><Truck className="w-5 h-5" />仕入先一覧</h3></div>
        <div className="divide-y divide-[var(--panel-border)]">
          {suppliers.map(s => (
            <div key={s.id} className="p-4 flex items-center justify-between hover:bg-[var(--highlight)]">
              <div><div className="font-medium">{s.name}</div><div className="text-xs text-[var(--text-muted)]">{s.region} • {s.items}商品</div></div>
              <div className="text-right"><div className={`text-xs px-2 py-1 rounded ${s.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{s.status === 'active' ? '正常' : '要確認'}</div><div className="text-xs text-[var(--text-muted)] mt-1">最終同期: {new Date(s.lastSync).toLocaleTimeString('ja-JP')}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Sync Tool
// ============================================================

function SyncTool() {
  const { execute, loading } = useDispatch();
  const fields = [
    { id: 'syncType', label: '同期タイプ', type: 'select' as const, options: [{ value: 'full', label: '完全同期' }, { value: 'incremental', label: '差分同期' }, { value: 'stock_only', label: '在庫数のみ' }], defaultValue: 'incremental' },
    { id: 'platforms', label: '対象プラットフォーム', type: 'select' as const, options: [{ value: 'all', label: 'すべて' }, { value: 'ebay', label: 'eBay' }, { value: 'amazon', label: 'Amazon' }], defaultValue: 'all' },
  ];
  return (
    <div className="space-y-6">
      <ToolExecutionPanel toolId="inventory-stock-sync" title="在庫同期" description="全販路の在庫数を一括同期します。" fields={fields} />
    </div>
  );
}

// ============================================================
// Price Defense Tool
// ============================================================

function PriceDefenseTool() {
  const fields = [
    { id: 'mode', label: '防衛モード', type: 'select' as const, options: [{ value: 'monitor', label: '監視のみ' }, { value: 'auto_adjust', label: '自動価格調整' }, { value: 'alert', label: 'アラート通知' }], defaultValue: 'monitor' },
    { id: 'threshold', label: '価格変動閾値 (%)', type: 'number' as const, placeholder: '10', defaultValue: 10 },
  ];
  return (
    <div className="space-y-6">
      <ToolExecutionPanel toolId="inventory-price-defense" title="価格防衛" description="競合の価格変動を監視し、自動で対応します。" fields={fields} />
    </div>
  );
}

// ============================================================
// Hub Tools Definition
// ============================================================

const INVENTORY_TOOLS: HubTool[] = [
  { id: 'inventory-stock-monitor', name: 'Stock Monitor', description: '在庫状況をリアルタイム監視', icon: <Monitor className="w-4 h-4" />, component: <StockMonitorTool />, category: 'inventory' },
  { id: 'inventory-suppliers', name: 'Suppliers', description: '仕入先管理', icon: <Truck className="w-4 h-4" />, component: <SuppliersTool />, category: 'inventory' },
  { id: 'inventory-sync', name: 'Sync', description: '在庫同期', icon: <RefreshCw className="w-4 h-4" />, component: <SyncTool />, requiresJob: true, category: 'inventory' },
  { id: 'inventory-price-defense', name: 'Price Defense', description: '価格防衛', icon: <Shield className="w-4 h-4" />, component: <PriceDefenseTool />, requiresJob: true, category: 'inventory' },
];

export default function InventoryHubPage() {
  return <BaseHubLayout title="Inventory Hub" titleEn="Inventory Hub" description="在庫管理・仕入先監視・価格防衛を統合" icon={<Package className="w-6 h-6" />} tools={INVENTORY_TOOLS} defaultTool="inventory-stock-monitor" />;
}
