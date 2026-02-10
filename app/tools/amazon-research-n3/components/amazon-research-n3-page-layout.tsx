// app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx
/**
 * Amazon Research N3 - メインレイアウト（完全版）
 * 
 * 3段階スコア表示:
 * - N3基本スコア (PA-API)
 * - N3 Keepaスコア (将来)
 * - N3 AIスコア (将来)
 */

'use client';

import React, { useState, useEffect, useCallback, memo, useRef, useMemo } from 'react';
import {
  Search, Package, TrendingUp, Star, DollarSign, AlertTriangle,
  Upload, Download, RefreshCw, Settings, Clock, Zap, Play,
  FileSpreadsheet, ArrowRight, ExternalLink, Eye, X, Filter,
  Bot, Calendar, BarChart3, CheckCircle2, AlertCircle, Loader2,
  ChevronRight, Copy, Trash2, History, Sparkles, Edit3, Plus,
  Users, Target, Bell, Pause, MoreVertical, Info, Database,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  N3CollapsibleHeader,
  N3FilterTab,
  N3Divider,
  N3Footer,
  N3Tooltip,
  N3Badge,
  N3Button,
  N3Input,
  N3ToastContainer,
  useToast,
  N3ViewModeToggle,
} from '@/components/n3';

import { N3PageHeader, HEADER_HEIGHT } from '@/app/tools/editing-n3/components/header';
import type { PanelTabId } from '@/app/tools/editing-n3/components/header';

import { useAmazonResearchStore, useFilteredItems, usePaginatedItems } from '../store/use-amazon-research-store';
import { enrichItemsWithAllScores } from '../lib/score-calculator';
import type { AmazonResearchItem, ResearchFilterType, ResearchSortType, RiskFlag, AutoResearchConfig } from '../types';

// ============================================================
// 定数
// ============================================================

type L2TabId = 'research' | 'automation' | 'history' | 'ai_tools';

const L2_TABS: { id: L2TabId; label: string; labelEn: string; icon: React.ElementType }[] = [
  { id: 'research', label: 'リサーチ', labelEn: 'Research', icon: Search },
  { id: 'ai_tools', label: 'AI分析', labelEn: 'AI Tools', icon: Sparkles },
  { id: 'automation', label: '自動化', labelEn: 'Automation', icon: Bot },
  { id: 'history', label: '履歴', labelEn: 'History', icon: History },
];

const FILTER_TABS: { id: ResearchFilterType; label: string }[] = [
  { id: 'all', label: '全て' },
  { id: 'high_score', label: 'スコア80+' },
  { id: 'profitable', label: '利益率20%+' },
  { id: 'high_sales', label: '月販100+' },
  { id: 'low_competition', label: '競合少' },
  { id: 'new_products', label: '新製品' },
  { id: 'risky', label: 'リスク' },
  { id: 'exists', label: '登録済' },
];

const SORT_OPTIONS: { value: ResearchSortType; label: string }[] = [
  { value: 'score_desc', label: 'スコア↓' },
  { value: 'profit_desc', label: '利益率↓' },
  { value: 'sales_desc', label: '月販↓' },
  { value: 'bsr_asc', label: 'BSR↑' },
  { value: 'date_desc', label: '新しい↓' },
];

// 詳細パネル幅を拡大（580px）
const DETAIL_PANEL_WIDTH = 580;

// ============================================================
// サブコンポーネント
// ============================================================

// 3段階スコア表示
const N3ScoreDisplay = memo(function N3ScoreDisplay({ 
  basicScore, 
  keepaScore, 
  aiScore,
  size = 'md',
  showAll = false,
}: { 
  basicScore?: number; 
  keepaScore?: number;
  aiScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showAll?: boolean;
}) {
  const displayScore = keepaScore ?? basicScore ?? 0;
  const color = displayScore >= 80 ? 'var(--success)' : displayScore >= 60 ? 'var(--warning)' : 'var(--error)';
  const sizes = { sm: 28, md: 36, lg: 52 };
  const fonts = { sm: 10, md: 12, lg: 18 };
  
  if (showAll) {
    return (
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <N3Tooltip content="N3基本スコア (PA-API)">
          <div style={{ 
            width: 36, height: 36, borderRadius: '50%', 
            background: `${color}15`, border: `2px solid ${color}`, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: 13, fontWeight: 700, color 
          }}>{basicScore ?? '-'}</div>
        </N3Tooltip>
        <N3Tooltip content="N3 Keepaスコア (履歴データ)">
          <div style={{ 
            width: 36, height: 36, borderRadius: '50%', 
            background: keepaScore ? 'rgba(59, 130, 246, 0.15)' : 'var(--panel)', 
            border: `2px solid ${keepaScore ? 'rgb(59, 130, 246)' : 'var(--panel-border)'}`, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: 13, fontWeight: 700, 
            color: keepaScore ? 'rgb(59, 130, 246)' : 'var(--text-muted)',
            opacity: keepaScore ? 1 : 0.5,
          }}>{keepaScore ?? 'K'}</div>
        </N3Tooltip>
        <N3Tooltip content="N3 AIスコア (将来)">
          <div style={{ 
            width: 36, height: 36, borderRadius: '50%', 
            background: aiScore ? 'rgba(168, 85, 247, 0.15)' : 'var(--panel)', 
            border: `2px solid ${aiScore ? 'rgb(168, 85, 247)' : 'var(--panel-border)'}`, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: 13, fontWeight: 700, 
            color: aiScore ? 'rgb(168, 85, 247)' : 'var(--text-muted)',
            opacity: aiScore ? 1 : 0.5,
          }}>{aiScore ?? 'AI'}</div>
        </N3Tooltip>
      </div>
    );
  }
  
  return (
    <div style={{ 
      width: sizes[size], height: sizes[size], borderRadius: '50%', 
      background: `${color}15`, border: `2px solid ${color}`, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      fontSize: fonts[size], fontWeight: 700, color 
    }}>{displayScore}</div>
  );
});

// リスクバッジ
const N3RiskBadge = memo(function N3RiskBadge({ flags, level }: { flags?: RiskFlag[]; level?: string }) {
  if (!flags || flags.length === 0) {
    return <span style={{ fontSize: 10, color: 'var(--success)', fontWeight: 500 }}>✓ 低リスク</span>;
  }
  
  const labels: Record<string, { l: string; c: string }> = {
    ip_risk: { l: '知財', c: 'var(--error)' },
    hazmat: { l: '危険', c: 'var(--error)' },
    restricted: { l: '制限', c: 'var(--error)' },
    approval_required: { l: '承認', c: 'var(--warning)' },
    amazon_sell: { l: 'Amazon', c: 'var(--warning)' },
    high_competition: { l: '競合多', c: 'var(--warning)' },
    price_volatile: { l: '価格変動', c: 'var(--warning)' },
    low_margin: { l: '低益', c: 'var(--warning)' },
    seasonal: { l: '季節', c: 'var(--text-muted)' },
    new_product: { l: '新製品', c: 'var(--accent)' },
  };
  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {flags.slice(0, 3).map((f) => (
        <span key={f} style={{ 
          padding: '1px 4px', fontSize: 9, fontWeight: 500, 
          background: `${labels[f]?.c || 'var(--text-muted)'}15`, 
          color: labels[f]?.c || 'var(--text-muted)', 
          borderRadius: 3 
        }}>{labels[f]?.l || f}</span>
      ))}
      {flags.length > 3 && (
        <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>+{flags.length - 3}</span>
      )}
    </div>
  );
});

// ASIN入力パネル
const ASINInputPanel = memo(function ASINInputPanel({ 
  onSubmit, 
  isProcessing 
}: { 
  onSubmit: (asins: string[]) => void; 
  isProcessing: boolean;
}) {
  const [input, setInput] = useState('');
  const parsedCount = useMemo(() => ([...new Set(input.match(/[A-Z0-9]{10}/g) || [])]).length, [input]);
  
  return (
    <div style={{ background: 'var(--highlight)', borderRadius: 8, border: '1px solid var(--panel-border)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--panel-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Upload size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>ASIN一括入力</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button 
            onClick={async () => { const text = await navigator.clipboard.readText(); setInput((p) => p + '\n' + text); }} 
            style={{ padding: '3px 8px', fontSize: 11, background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 4, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          ><Copy size={11} /> 貼付</button>
          <button 
            onClick={() => setInput('')} 
            style={{ padding: '3px 8px', fontSize: 11, background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 4, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          ><Trash2 size={11} /> クリア</button>
        </div>
      </div>
      <textarea 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="ASINを入力（改行/カンマ/スペース区切り）&#10;例: B08N5WRWNW, B09V3KXJPB, B07XJ8C8F5" 
        style={{ 
          width: '100%', height: 70, padding: 10, fontSize: 12, 
          fontFamily: 'var(--font-mono)', background: 'var(--bg)', 
          border: 'none', color: 'var(--text)', resize: 'none', outline: 'none' 
        }} 
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderTop: '1px solid var(--panel-border)' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {parsedCount > 0 ? (
            <><strong style={{ color: 'var(--accent)' }}>{parsedCount}</strong>件のASIN検出</>
          ) : (
            'ASINを入力してください'
          )}
        </span>
        <N3Button 
          variant="primary" 
          size="sm" 
          onClick={() => { 
            const a = [...new Set(input.match(/[A-Z0-9]{10}/g) || [])]; 
            if (a.length) { onSubmit(a); setInput(''); } 
          }} 
          disabled={!parsedCount || isProcessing} 
          icon={isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
        >
          {isProcessing ? '処理中...' : 'リサーチ開始'}
        </N3Button>
      </div>
    </div>
  );
});

// テーブル行
const ResearchTableRow = memo(function ResearchTableRow({ 
  item, 
  isSelected, 
  onSelect, 
  onShowDetail 
}: { 
  item: AmazonResearchItem; 
  isSelected: boolean; 
  onSelect: () => void; 
  onShowDetail: () => void;
}) {
  const fmt = (n?: number) => n?.toLocaleString() ?? '-';
  const fmtY = (n?: number) => n ? `¥${n.toLocaleString()}` : '-';
  
  return (
    <tr 
      style={{ 
        background: isSelected ? 'var(--accent-subtle)' : 'transparent', 
        cursor: 'pointer', 
        transition: 'background 0.1s', 
        borderBottom: '1px solid var(--panel-border)' 
      }} 
      onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = 'var(--highlight)')} 
      onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = 'transparent')} 
      onClick={onShowDetail}
    >
      <td style={{ padding: '8px', width: 32 }} onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
      </td>
      <td style={{ padding: '8px', width: 44 }}>
        {item.main_image_url ? (
          <img src={item.main_image_url} alt="" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4, background: '#fff' }} />
        ) : (
          <div style={{ width: 36, height: 36, background: 'var(--panel-border)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
      </td>
      <td style={{ padding: '8px' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300 }}>
          {item.title || item.asin}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, marginTop: 2 }}>
          <a 
            href={`https://www.amazon.co.jp/dp/${item.asin}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => e.stopPropagation()} 
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
          >{item.asin}</a>
          {item.brand && <span style={{ color: 'var(--text-muted)' }}>• {item.brand}</span>}
          {item.is_new_product && <N3Badge variant="primary" size="sm">NEW</N3Badge>}
        </div>
      </td>
      <td style={{ padding: '8px', textAlign: 'center', width: 50 }}>
        <N3ScoreDisplay basicScore={item.n3_score} keepaScore={item.n3_keepa_score} size="sm" />
      </td>
      <td style={{ padding: '8px', textAlign: 'right', width: 85 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: (item.estimated_profit_margin || 0) >= 20 ? 'var(--success)' : 'var(--text)' }}>
          {fmtY(item.estimated_profit_jpy)}
        </div>
        <div style={{ fontSize: 10, color: (item.estimated_profit_margin || 0) >= 20 ? 'var(--success)' : 'var(--text-muted)' }}>
          {item.estimated_profit_margin?.toFixed(1)}%
        </div>
      </td>
      <td style={{ padding: '8px', textAlign: 'right', width: 75 }}>
        <div style={{ fontSize: 11 }}>{item.bsr_current ? `#${fmt(item.bsr_current)}` : '-'}</div>
        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
          {item.bsr_drops_30d ? `↑${item.bsr_drops_30d}/月` : ''}
        </div>
      </td>
      <td style={{ padding: '8px', textAlign: 'right', width: 55 }}>
        <div style={{ fontSize: 11, fontWeight: 500 }}>{fmt(item.monthly_sales_estimate)}</div>
        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>/月</div>
      </td>
      <td style={{ padding: '8px', textAlign: 'center', width: 50 }}>
        <div style={{ fontSize: 11 }}>{item.fba_offer_count ?? '-'}</div>
        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>FBA</div>
      </td>
      <td style={{ padding: '8px', width: 90 }}>
        <N3RiskBadge flags={item.risk_flags} level={item.risk_level} />
      </td>
      <td style={{ padding: '8px', width: 50 }}>
        {item.status === 'exists' ? (
          <N3Badge variant="secondary" size="sm">登録済</N3Badge>
        ) : item.is_auto_tracked ? (
          <N3Badge variant="primary" size="sm">追跡中</N3Badge>
        ) : (
          <N3Badge variant="success" size="sm">完了</N3Badge>
        )}
      </td>
    </tr>
  );
});

// 詳細パネル（拡大版・スクロールなし）
const DetailPanel = memo(function DetailPanel({ 
  item, 
  onClose, 
  onSendToEditing 
}: { 
  item: AmazonResearchItem | null; 
  onClose: () => void; 
  onSendToEditing: (item: AmazonResearchItem) => void;
}) {
  if (!item) return null;
  
  const fmt = (n?: number) => n?.toLocaleString() ?? '-';
  const fmtY = (n?: number) => n ? `¥${n.toLocaleString()}` : '-';
  const fmtU = (n?: number) => n ? `$${n.toFixed(2)}` : '-';
  
  // グリッドセル共通スタイル
  const cellStyle = { padding: '6px 8px', background: 'var(--highlight)', borderRadius: 6 };
  const labelStyle = { fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 };
  const valueStyle = { fontSize: 12, fontWeight: 600, color: 'var(--text)' };
  
  return (
    <div style={{ 
      width: DETAIL_PANEL_WIDTH, 
      height: '100%', 
      borderLeft: '1px solid var(--panel-border)', 
      background: 'var(--panel)', 
      display: 'flex', 
      flexDirection: 'column', 
      flexShrink: 0,
    }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--panel-border)', flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>商品詳細</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
          <X size={16} />
        </button>
      </div>
      
      {/* コンテンツ（スクロールなし） */}
      <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* 画像+基本情報 */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 80, height: 80, flexShrink: 0, borderRadius: 6, overflow: 'hidden', background: '#fff', border: '1px solid var(--panel-border)' }}>
            {item.main_image_url ? (
              <img src={item.main_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--highlight)' }}>
                <Package size={28} style={{ color: 'var(--text-muted)' }} />
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {item.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 10 }}>
              <a href={`https://www.amazon.co.jp/dp/${item.asin}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 2 }}>
                {item.asin}<ExternalLink size={9} />
              </a>
              {item.brand && <span style={{ color: 'var(--text-muted)' }}>• {item.brand}</span>}
            </div>
            <div style={{ marginTop: 6 }}>
              <N3RiskBadge flags={item.risk_flags} level={item.risk_level} />
            </div>
          </div>
        </div>
        
        {/* 3段階スコア */}
        <div style={{ padding: 10, background: 'var(--highlight)', borderRadius: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <N3ScoreDisplay 
              basicScore={item.n3_score} 
              keepaScore={item.n3_keepa_score} 
              aiScore={item.n3_ai_score}
              showAll 
            />
            {item.n3_score_breakdown && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontSize: 10 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-muted)' }}>利益</div>
                  <div style={{ fontWeight: 600 }}>{item.n3_score_breakdown.profit_score}/30</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-muted)' }}>需要</div>
                  <div style={{ fontWeight: 600 }}>{item.n3_score_breakdown.demand_score}/30</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-muted)' }}>競合</div>
                  <div style={{ fontWeight: 600 }}>{item.n3_score_breakdown.competition_score}/20</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-muted)' }}>リスク</div>
                  <div style={{ fontWeight: 600 }}>{item.n3_score_breakdown.risk_score}/20</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 価格・利益（横6列） */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <DollarSign size={11} /> 価格・利益
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
            <div style={cellStyle}><div style={labelStyle}>Amazon</div><div style={valueStyle}>{fmtY(item.amazon_price_jpy)}</div></div>
            <div style={cellStyle}><div style={labelStyle}>eBay想定</div><div style={valueStyle}>{fmtU(item.ebay_estimated_price_usd)}</div></div>
            <div style={cellStyle}><div style={labelStyle}>利益</div><div style={{ ...valueStyle, color: 'var(--success)' }}>{fmtY(item.estimated_profit_jpy)}</div></div>
            <div style={cellStyle}><div style={labelStyle}>利益率</div><div style={{ ...valueStyle, color: (item.estimated_profit_margin || 0) >= 20 ? 'var(--success)' : 'var(--text)' }}>{item.estimated_profit_margin?.toFixed(1)}%</div></div>
            <div style={cellStyle}><div style={labelStyle}>FBA手数料</div><div style={valueStyle}>{fmtY(item.fba_fees_jpy)}</div></div>
            <div style={cellStyle}><div style={labelStyle}>紹介料</div><div style={valueStyle}>{item.referral_fee_percent || 15}%</div></div>
          </div>
        </div>
        
        {/* 需要指標（横6列） */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={11} /> 需要指標
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
            <div style={cellStyle}><div style={labelStyle}>BSR</div><div style={valueStyle}>{item.bsr_current ? `#${fmt(item.bsr_current)}` : '-'}</div></div>
            <div style={cellStyle}><div style={labelStyle}>BSRドロップ</div><div style={valueStyle}>{item.bsr_drops_30d ? `↑${item.bsr_drops_30d}` : '-'}</div></div>
            <div style={cellStyle}><div style={labelStyle}>月販</div><div style={valueStyle}>{fmt(item.monthly_sales_estimate)}個</div></div>
            <div style={cellStyle}><div style={labelStyle}>月間売上</div><div style={valueStyle}>{fmtY(item.monthly_revenue_estimate)}</div></div>
            <div style={cellStyle}><div style={labelStyle}>品切れ率</div><div style={valueStyle}>{item.out_of_stock_percentage_30d ? `${Math.round(item.out_of_stock_percentage_30d * 100)}%` : '-'}</div></div>
            <div style={cellStyle}><div style={labelStyle}>新製品</div><div style={{ ...valueStyle, color: item.is_new_product ? 'var(--accent)' : 'var(--text-muted)' }}>{item.is_new_product ? '✓' : '✗'}</div></div>
          </div>
        </div>
        
        {/* 競合状況（横6列） */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={11} /> 競合状況
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
            <div style={cellStyle}><div style={labelStyle}>出品者数</div><div style={valueStyle}>{fmt((item.new_offer_count || 0) + (item.fba_offer_count || 0))}</div></div>
            <div style={cellStyle}><div style={labelStyle}>FBA</div><div style={{ ...valueStyle, color: (item.fba_offer_count || 0) >= 15 ? 'var(--warning)' : 'var(--text)' }}>{fmt(item.fba_offer_count)}</div></div>
            <div style={cellStyle}><div style={labelStyle}>Amazon</div><div style={{ ...valueStyle, color: item.is_amazon ? 'var(--warning)' : 'var(--success)' }}>{item.is_amazon ? '⚠ Yes' : '✓ No'}</div></div>
            <div style={cellStyle}><div style={labelStyle}>Buy Box</div><div style={valueStyle}>{fmtY(item.buy_box_price_jpy)}</div></div>
            <div style={cellStyle}><div style={labelStyle}>最安値</div><div style={valueStyle}>{fmtY(item.lowest_new_price_jpy)}</div></div>
            <div style={cellStyle}><div style={labelStyle}>レビュー</div><div style={valueStyle}>{fmt(item.review_count)} ★{item.star_rating || '-'}</div></div>
          </div>
        </div>
        
        {/* 物理情報・カテゴリ（横4列） */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Package size={11} /> 物理情報
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
            <div style={cellStyle}><div style={labelStyle}>サイズ</div><div style={{ fontSize: 11, fontWeight: 500 }}>{item.length_cm ? `${item.length_cm}×${item.width_cm}×${item.height_cm}cm` : '-'}</div></div>
            <div style={cellStyle}><div style={labelStyle}>重量</div><div style={{ fontSize: 11, fontWeight: 500 }}>{item.weight_g ? `${item.weight_g}g` : '-'}</div></div>
            <div style={cellStyle}><div style={labelStyle}>カテゴリ</div><div style={{ fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.category || '-'}</div></div>
            <div style={cellStyle}><div style={labelStyle}>発売日</div><div style={{ fontSize: 11, fontWeight: 500 }}>{item.release_date ? new Date(item.release_date).toLocaleDateString('ja-JP') : '-'}</div></div>
          </div>
        </div>
        
        {/* 外部リンク */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          <a href={`https://www.amazon.co.jp/dp/${item.asin}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 8, background: 'var(--highlight)', borderRadius: 6, color: 'var(--accent)', fontSize: 11, fontWeight: 500, textDecoration: 'none' }}>
            Amazon <ExternalLink size={10} />
          </a>
          <a href={`https://keepa.com/#!product/5-${item.asin}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 8, background: 'var(--highlight)', borderRadius: 6, color: 'var(--accent)', fontSize: 11, fontWeight: 500, textDecoration: 'none' }}>
            <BarChart3 size={11} /> Keepa <ExternalLink size={10} />
          </a>
          <a href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(item.title || item.asin)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 8, background: 'var(--highlight)', borderRadius: 6, color: 'var(--accent)', fontSize: 11, fontWeight: 500, textDecoration: 'none' }}>
            eBay検索 <ExternalLink size={10} />
          </a>
        </div>
      </div>
      
      {/* フッター */}
      <div style={{ padding: 12, borderTop: '1px solid var(--panel-border)', flexShrink: 0 }}>
        <N3Button 
          variant="primary" 
          onClick={() => onSendToEditing(item)} 
          disabled={item.status === 'exists'} 
          icon={<ArrowRight size={14} />} 
          style={{ width: '100%' }}
        >
          {item.status === 'exists' ? '登録済み' : 'データ編集に登録'}
        </N3Button>
      </div>
    </div>
  );
});

// 自動化タブ
const AutomationTab = memo(function AutomationTab() {
  const [configs, setConfigs] = useState<AutoResearchConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast: showToast } = useToast();
  
  useEffect(() => {
    loadConfigs();
  }, []);
  
  const loadConfigs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/research/amazon-auto?includeStats=true');
      const data = await res.json();
      if (data.success) setConfigs(data.data || []);
    } catch (err) {
      console.error('Load configs error:', err);
    }
    setIsLoading(false);
  };
  
  const handleRunNow = async (configId: string) => {
    try {
      const res = await fetch('/api/cron/amazon-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ ${data.processed || 0}件処理完了`, 'success');
        loadConfigs();
      } else {
        showToast(`❌ ${data.error}`, 'error');
      }
    } catch (err) {
      showToast('エラーが発生しました', 'error');
    }
  };
  
  const handleToggleEnabled = async (config: AutoResearchConfig) => {
    try {
      const res = await fetch('/api/research/amazon-auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          config: { id: config.id, enabled: !config.enabled },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${config.enabled ? '⏸ 停止' : '▶ 有効化'}しました`, 'success');
        loadConfigs();
      }
    } catch (err) {
      showToast('エラーが発生しました', 'error');
    }
  };
  
  if (isLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }
  
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>自動リサーチ設定</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>
            セラー監視・キーワード監視・カテゴリランキング取得を自動化
          </p>
        </div>
        <N3Button variant="primary" icon={<Plus size={14} />}>
          新規作成
        </N3Button>
      </div>
      
      {configs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <Bot size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>自動リサーチ設定がありません</div>
          <div style={{ fontSize: 12, marginBottom: 16 }}>
            セラーID・キーワード・カテゴリを設定して<br/>
            自動でASINを収集・分析できます
          </div>
          <N3Button variant="primary" icon={<Plus size={14} />}>
            最初の設定を作成
          </N3Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {configs.map((config) => (
            <div 
              key={config.id}
              style={{ 
                padding: 16, background: 'var(--panel)', borderRadius: 8, 
                border: '1px solid var(--panel-border)',
                opacity: config.enabled ? 1 : 0.6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{config.name}</span>
                    <N3Badge variant={config.enabled ? 'success' : 'secondary'} size="sm">
                      {config.enabled ? '有効' : '停止中'}
                    </N3Badge>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    {config.schedule_type === 'daily' ? '毎日' : config.schedule_type === 'weekly' ? '毎週' : '毎時'}
                    {config.schedule_time && ` ${config.schedule_time}`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <N3Button variant="secondary" size="sm" icon={<Play size={12} />} onClick={() => handleRunNow(config.id)}>
                    実行
                  </N3Button>
                  <N3Button variant="secondary" size="sm" icon={config.enabled ? <Pause size={12} /> : <Play size={12} />} onClick={() => handleToggleEnabled(config)}>
                    {config.enabled ? '停止' : '有効'}
                  </N3Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// ============================================================
// AI Toolsタブ (Extension Slot)
// ============================================================

const AIToolsTab = memo(function AIToolsTab() {
  const [activePanel, setActivePanel] = useState<'agent' | 'market' | 'competitor'>('agent');
  
  // Lazy load extension slot components
  const [ResearchAgentPanel, setResearchAgentPanel] = useState<React.ComponentType | null>(null);
  const [MarketScorePanel, setMarketScorePanel] = useState<React.ComponentType | null>(null);
  const [CompetitorScanPanel, setCompetitorScanPanel] = useState<React.ComponentType | null>(null);
  
  useEffect(() => {
    // Dynamic import for extension slot components
    import('../extension-slot/research-agent-panel').then(m => setResearchAgentPanel(() => m.ResearchAgentPanel));
    import('../extension-slot/market-score-panel').then(m => setMarketScorePanel(() => m.MarketScorePanel));
    import('../extension-slot/competitor-scan-panel').then(m => setCompetitorScanPanel(() => m.CompetitorScanPanel));
  }, []);
  
  const panels = [
    { id: 'agent' as const, label: 'AIリサーチ', icon: Bot, color: '#8B5CF6' },
    { id: 'market' as const, label: '市場分析', icon: BarChart3, color: '#10B981' },
    { id: 'competitor' as const, label: '競合分析', icon: Users, color: '#F59E0B' },
  ];
  
  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* 左サイドバー */}
      <div style={{ width: 200, borderRight: '1px solid var(--panel-border)', background: 'var(--panel)', display: 'flex', flexDirection: 'column', padding: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sparkles size={12} /> AI分析ツール
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {panels.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActivePanel(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', borderRadius: 6,
                background: activePanel === id ? `${color}15` : 'transparent',
                border: activePanel === id ? `1px solid ${color}40` : '1px solid transparent',
                color: activePanel === id ? color : 'var(--text-muted)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
            </button>
          ))}
        </div>
        
        <div style={{ marginTop: 'auto', padding: 8, background: 'var(--highlight)', borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>💡 Dispatch API経由</div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>すべてのAI分析は/api/dispatchを経由してn8nで実行されます</div>
        </div>
      </div>
      
      {/* メインパネル */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activePanel === 'agent' && ResearchAgentPanel && <ResearchAgentPanel />}
        {activePanel === 'market' && MarketScorePanel && <MarketScorePanel />}
        {activePanel === 'competitor' && CompetitorScanPanel && <CompetitorScanPanel />}
        
        {/* ローディング */}
        {!ResearchAgentPanel && !MarketScorePanel && !CompetitorScanPanel && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
        )}
      </div>
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export function AmazonResearchN3PageLayout() {
  const { user, logout } = useAuth();
  const { toasts, removeToast, toast: showToast } = useToast();
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // Store
  const store = useAmazonResearchStore();
  const { 
    items, setItems, addItems, updateItem, recalculateStats,
    isLoading, setIsLoading, isProcessing, setIsProcessing, 
    filter, setFilter, sortType, setSortType, searchQuery, setSearchQuery, 
    selectedIds, toggleSelection, selectAll, deselectAll, 
    selectedItem, setSelectedItem, showDetailPanel, setShowDetailPanel, 
    stats, setStats, viewMode, setViewMode, pageSize, setPageSize,
  } = store;
  const filteredItems = useFilteredItems();
  const paginatedItems = usePaginatedItems();
  
  // UI状態
  const [activeL2Tab, setActiveL2Tab] = useState<L2TabId>('research');
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const [pinnedTab, setPinnedTab] = useState<PanelTabId | null>(null);
  const [hoveredTab, setHoveredTab] = useState<PanelTabId | null>(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [tipsEnabled, setTipsEnabled] = useState(true);
  const [fastMode, setFastMode] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // 初期データロード（DBから）
  useEffect(() => {
    loadFromDatabase();
  }, []);
  
  const loadFromDatabase = async () => {
    setIsLoading(true);
    setIsInitialLoading(true);
    try {
      const res = await fetch('/api/research/amazon-batch?limit=200');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        // DBからデータ取得成功
        const enriched = enrichItemsWithAllScores(data.data);
        setItems(enriched);
        showToast(`📦 ${data.data.length}件のデータを読み込みました`, 'success');
      } else {
        // DBにデータがない場合は空のまま
        setItems([]);
      }
    } catch (err) {
      console.error('Load from DB error:', err);
      setItems([]);
    }
    setIsLoading(false);
    setIsInitialLoading(false);
    recalculateStats();
  };
  
  useEffect(() => {
    if (!isInitialLoading) {
      recalculateStats();
    }
  }, [items, isInitialLoading]);
  
  // ASIN投入
  const handleSubmitASINs = useCallback(async (asins: string[]) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/research/amazon-batch', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ asins }) 
      });
      if (res.ok) {
        const data = await res.json();
        if (data.results) {
          const enriched = enrichItemsWithAllScores(data.results);
          addItems(enriched);
          showToast(`✅ ${data.completed}/${data.total}件処理完了`, 'success');
        }
      } else {
        showToast('エラーが発生しました', 'error');
      }
    } catch (err) { 
      showToast('エラーが発生しました', 'error'); 
    }
    setIsProcessing(false);
  }, [addItems, showToast, setIsProcessing]);
  
  // 商品登録
  const handleSendToEditing = useCallback(async (item: AmazonResearchItem) => {
    try {
      const res = await fetch('/api/products/create-from-research', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          asin: item.asin, 
          title: item.title, 
          image_url: item.main_image_url, 
          price_jpy: item.amazon_price_jpy, 
          brand: item.brand, 
          category: item.category,
          n3_score: item.n3_score,
        }) 
      });
      if (res.ok) { 
        updateItem(item.id, { status: 'exists' }); 
        showToast(`✅ ${item.asin} をデータ編集に登録しました`, 'success'); 
      }
    } catch (err) { 
      showToast('登録エラー', 'error'); 
    }
  }, [updateItem, showToast]);
  
  // エクスポート
  const handleExport = useCallback(async () => {
    showToast('📥 Excelエクスポート準備中...', 'success');
    // TODO: 実装
  }, [showToast]);
  
  // 🔬 Send to Catalog: 選択した商品をediting-n3のResearch待ちへ送る
  const [isSendingToCatalog, setIsSendingToCatalog] = useState(false);
  
  const handleSendToCatalog = useCallback(async () => {
    if (selectedIds.size === 0) {
      showToast('商品を選択してください', 'warning');
      return;
    }
    
    setIsSendingToCatalog(true);
    try {
      const res = await fetch('/api/research/send-to-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      const data = await res.json();
      
      if (data.success) {
        showToast(`✅ ${data.updated}件をCatalogへ送信しました`, 'success');
        // ステータスを更新
        selectedIds.forEach(id => updateItem(id, { status: 'pending' }));
        deselectAll();
      } else {
        showToast(`❌ ${data.error || 'エラーが発生しました'}`, 'error');
      }
    } catch (err) {
      console.error('Send to catalog error:', err);
      showToast('❌ 送信エラーが発生しました', 'error');
    }
    setIsSendingToCatalog(false);
  }, [selectedIds, showToast, updateItem, deselectAll]);
  
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <N3ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div ref={mainContentRef} id="main-scroll-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', minWidth: 0, overflow: 'hidden' }}>
        <N3CollapsibleHeader scrollContainerId="main-scroll-container" threshold={10} transitionDuration={200} zIndex={40}>
          <N3PageHeader
            user={user}
            onLogout={logout}
            language={language}
            onLanguageToggle={() => setLanguage(l => l === 'ja' ? 'en' : 'ja')}
            pinnedTab={pinnedTab}
            onPinnedTabChange={setPinnedTab}
            hoveredTab={hoveredTab}
            onHoveredTabChange={setHoveredTab}
            isHeaderHovered={isHeaderHovered}
            onHeaderHoveredChange={setIsHeaderHovered}
          />
          
          {/* L2タブ */}
          <div style={{ height: 40, display: 'flex', alignItems: 'center', background: 'var(--panel)', borderBottom: '1px solid var(--panel-border)', padding: '0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #FF9900, #FF6600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={14} style={{ color: 'white' }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Amazon Research</span>
            </div>
            <N3Divider orientation="vertical" style={{ height: 24 }} />
            {L2_TABS.map((tab) => { 
              const Icon = tab.icon; 
              return (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveL2Tab(tab.id)} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 5, 
                    padding: '6px 12px', marginLeft: 6, 
                    fontSize: 12, fontWeight: 500, 
                    background: activeL2Tab === tab.id ? 'var(--accent)' : 'transparent', 
                    color: activeL2Tab === tab.id ? 'white' : 'var(--text-muted)', 
                    border: 'none', borderRadius: 6, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon size={14} />
                  {language === 'ja' ? tab.label : tab.labelEn}
                </button>
              ); 
            })}
            <div style={{ flex: 1 }} />
            <N3Button 
              variant="secondary" 
              size="sm" 
              icon={<RefreshCw size={12} />} 
              onClick={loadFromDatabase}
              disabled={isLoading}
            >
              更新
            </N3Button>
          </div>
          
          {/* リサーチタブのみ表示 */}
          {activeL2Tab === 'research' && (
            <>
              {/* 統計カード */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, padding: '8px 12px', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>
                {[
                  { icon: <Database size={14} />, label: 'リサーチ済', value: stats.total, color: 'var(--accent)' },
                  { icon: <CheckCircle2 size={14} />, label: '完了', value: stats.completed, sub: `${stats.total > 0 ? Math.round(stats.completed / stats.total * 100) : 0}%`, color: 'var(--success)' },
                  { icon: <Star size={14} />, label: 'スコア80+', value: stats.high_score_count, color: '#FFD700', onClick: () => setFilter({ type: 'high_score' }) },
                  { icon: <DollarSign size={14} />, label: '利益率20%+', value: stats.profitable_count, color: 'var(--success)', onClick: () => setFilter({ type: 'profitable' }) },
                  { icon: <TrendingUp size={14} />, label: '月販100+', value: stats.high_sales_count, color: 'var(--accent)', onClick: () => setFilter({ type: 'high_sales' }) },
                  { icon: <AlertTriangle size={14} />, label: '登録済', value: stats.exists_in_db_count, color: 'var(--warning)', onClick: () => setFilter({ type: 'exists' }) },
                ].map((s) => (
                  <div 
                    key={s.label} 
                    onClick={s.onClick} 
                    style={{ 
                      padding: '10px 12px', background: 'var(--panel)', borderRadius: 8, 
                      border: '1px solid var(--panel-border)', cursor: s.onClick ? 'pointer' : 'default',
                      transition: 'transform 0.15s',
                    }}
                    onMouseEnter={(e) => s.onClick && (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={(e) => s.onClick && (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ color: s.color }}>{s.icon}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{s.value}</div>
                    {s.sub && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.sub}</div>}
                  </div>
                ))}
              </div>
              
              {/* ASIN入力 */}
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--panel-border)' }}>
                <ASINInputPanel onSubmit={handleSubmitASINs} isProcessing={isProcessing} />
              </div>
              
              {/* L3フィルター */}
              <div style={{ height: 40, display: 'flex', alignItems: 'center', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)', padding: '0 12px', overflowX: 'auto' }}>
                {FILTER_TABS.map((tab) => {
                  const count = tab.id === 'all' ? items.length : 
                    tab.id === 'high_score' ? stats.high_score_count : 
                    tab.id === 'profitable' ? stats.profitable_count : 
                    tab.id === 'high_sales' ? stats.high_sales_count : 
                    tab.id === 'low_competition' ? stats.low_competition_count || 0 :
                    tab.id === 'new_products' ? stats.new_products_count || 0 :
                    tab.id === 'risky' ? stats.risky_count || 0 : 
                    stats.exists_in_db_count;
                  return (
                    <N3FilterTab 
                      key={tab.id} 
                      id={tab.id} 
                      label={tab.label} 
                      count={count} 
                      active={filter.type === tab.id} 
                      onClick={() => setFilter({ type: tab.id })} 
                    />
                  );
                })}
              </div>
              
              {/* サブツールバー */}
              <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--panel)', borderBottom: '1px solid var(--panel-border)', padding: '0 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => setTipsEnabled(!tipsEnabled)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', fontSize: 11, background: tipsEnabled ? 'rgba(59,130,246,0.1)' : 'transparent', border: `1px solid ${tipsEnabled ? 'rgba(59,130,246,0.3)' : 'var(--panel-border)'}`, borderRadius: 6, color: tipsEnabled ? 'rgb(59,130,246)' : 'var(--text-muted)', cursor: 'pointer' }}>💡 Tips</button>
                  <button onClick={() => setFastMode(!fastMode)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', fontSize: 11, background: fastMode ? 'rgba(245,158,11,0.1)' : 'transparent', border: `1px solid ${fastMode ? 'rgba(245,158,11,0.3)' : 'var(--panel-border)'}`, borderRadius: 6, color: fastMode ? 'rgb(245,158,11)' : 'var(--text-muted)', cursor: 'pointer' }}>⚡ Fast</button>
                  <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} style={{ height: 30, padding: '0 8px', fontSize: 11, border: '1px solid var(--panel-border)', borderRadius: 6, background: 'var(--panel)', color: 'var(--text)' }}>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={500}>500</option>
                  </select>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filteredItems.length}/{items.length}件</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <N3Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ASIN/タイトル/ブランド..." style={{ width: 180, height: 30, fontSize: 11 }} />
                  <select value={sortType} onChange={(e) => setSortType(e.target.value as ResearchSortType)} style={{ height: 30, padding: '0 8px', fontSize: 11, background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 6, color: 'var(--text)' }}>
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <N3Divider orientation="vertical" style={{ height: 20 }} />
                  <N3Button variant="secondary" size="sm" icon={<FileSpreadsheet size={12} />} onClick={handleExport}>Excel</N3Button>
                  <N3Button 
                    variant="primary" 
                    size="sm" 
                    icon={isSendingToCatalog ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />} 
                    disabled={selectedIds.size === 0 || isSendingToCatalog}
                    onClick={handleSendToCatalog}
                  >
                    {isSendingToCatalog ? '送信中...' : `🔬Catalogへ(${selectedIds.size})`}
                  </N3Button>
                  <N3ViewModeToggle value={viewMode as 'list' | 'card'} onChange={(m) => setViewMode(m)} size="sm" />
                </div>
              </div>
            </>
          )}
        </N3CollapsibleHeader>
        
        {/* メインコンテンツ */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {activeL2Tab === 'research' && (
            <>
              <div style={{ flex: 1, overflow: 'auto' }}>
                {isInitialLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent)', marginBottom: 12 }} />
                      <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>データを読み込み中...</div>
                    </div>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'var(--panel)', zIndex: 10 }}>
                      <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
                        <th style={{ padding: 8, width: 32 }}>
                          <input type="checkbox" checked={selectedIds.size === paginatedItems.length && paginatedItems.length > 0} onChange={() => selectedIds.size === paginatedItems.length ? deselectAll() : selectAll()} />
                        </th>
                        <th style={{ padding: 8, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'left' }}>画像</th>
                        <th style={{ padding: 8, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'left' }}>商品情報</th>
                        <th style={{ padding: 8, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>スコア</th>
                        <th style={{ padding: 8, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>利益</th>
                        <th style={{ padding: 8, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>BSR</th>
                        <th style={{ padding: 8, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>月販</th>
                        <th style={{ padding: 8, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>競合</th>
                        <th style={{ padding: 8, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'left' }}>リスク</th>
                        <th style={{ padding: 8, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'left' }}>状態</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedItems.length === 0 ? (
                        <tr>
                          <td colSpan={10} style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Package size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
                            <div style={{ fontSize: 14, fontWeight: 500 }}>データがありません</div>
                            <div style={{ fontSize: 12, marginTop: 4 }}>ASINを入力してリサーチを開始してください</div>
                          </td>
                        </tr>
                      ) : (
                        paginatedItems.map((item) => (
                          <ResearchTableRow 
                            key={item.id} 
                            item={item} 
                            isSelected={selectedIds.has(item.id)} 
                            onSelect={() => toggleSelection(item.id)} 
                            onShowDetail={() => { setSelectedItem(item); setShowDetailPanel(true); }} 
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              {showDetailPanel && (
                <DetailPanel 
                  item={selectedItem} 
                  onClose={() => setShowDetailPanel(false)} 
                  onSendToEditing={handleSendToEditing} 
                />
              )}
            </>
          )}
          
          {activeL2Tab === 'automation' && <AutomationTab />}
          
          {activeL2Tab === 'ai_tools' && <AIToolsTab />}
          
          {activeL2Tab === 'history' && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <div style={{ textAlign: 'center' }}>
                <History size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>リサーチ履歴</div>
                <div style={{ fontSize: 12 }}>過去のリサーチ結果・価格変動履歴を表示</div>
              </div>
            </div>
          )}
        </div>
        
        <N3Footer 
          copyright="© 2025 N3 Platform" 
          version="Amazon Research v3.0" 
          status={{ label: 'DB', connected: true }} 
          links={[
            { id: 'amazon', label: 'Amazon.co.jp', href: 'https://www.amazon.co.jp' }, 
            { id: 'keepa', label: 'Keepa', href: 'https://keepa.com' }
          ]} 
        />
      </div>
    </div>
  );
}
