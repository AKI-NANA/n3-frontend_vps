// app/tools/media-hub/channels/page.tsx
// N3 Empire OS - チャンネル管理UI
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Settings, RefreshCw, Eye, Youtube } from 'lucide-react';

interface MediaChannel {
  id: number;
  channel_id: string;
  channel_name: string;
  youtube_handle?: string;
  subscriber_count: number;
  brand_config: any;
  voice_config: any;
  production_config: any;
  security_config: any;
  genre: string;
  revenue_rank: 'S' | 'A' | 'B' | 'C';
  monthly_revenue_usd: number;
  status: 'active' | 'paused' | 'suspended' | 'archived';
  created_at: string;
}

const GENRES = [
  { id: 'education', label: '教育', icon: '📚' },
  { id: 'entertainment', label: 'エンタメ', icon: '🎬' },
  { id: 'business', label: 'ビジネス', icon: '💼' },
  { id: 'tech', label: 'テック', icon: '💻' },
];

const RANK_COLORS: Record<string, { bg: string; text: string }> = {
  S: { bg: '#FFD700', text: '#000' },
  A: { bg: '#C0C0C0', text: '#000' },
  B: { bg: '#CD7F32', text: '#fff' },
  C: { bg: '#6B7280', text: '#fff' },
};

export default function ChannelsPage() {
  const [channels, setChannels] = useState<MediaChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState<MediaChannel | null>(null);
  
  const loadChannels = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      const res = await fetch(`/api/media/channels?${params}`);
      const data = await res.json();
      setChannels(data.channels || []);
    } catch (error) {
      console.error('チャンネル読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);
  
  useEffect(() => { loadChannels(); }, [loadChannels]);
  
  const filteredChannels = channels.filter(ch => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return ch.channel_name.toLowerCase().includes(q) || ch.channel_id.toLowerCase().includes(q);
    }
    return true;
  });
  
  const stats = {
    total: channels.length,
    active: channels.filter(c => c.status === 'active').length,
    totalSubscribers: channels.reduce((sum, c) => sum + (c.subscriber_count || 0), 0),
    totalRevenue: channels.reduce((sum, c) => sum + (c.monthly_revenue_usd || 0), 0),
  };
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };
  
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text)' }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/tools/media-hub" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>
          <ArrowLeft size={14} />戻る
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#EC4899', margin: 0 }}>📺 チャンネル管理</h1>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#EC4899', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          <Plus size={16} />新規チャンネル
        </button>
      </div>
      
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: '総チャンネル', value: stats.total, icon: '📺', color: '#EC4899' },
          { label: '稼働中', value: stats.active, icon: '✅', color: '#10B981' },
          { label: '総登録者', value: formatNumber(stats.totalSubscribers), icon: '👥', color: '#3B82F6' },
          { label: '月間収益', value: `$${formatNumber(stats.totalRevenue)}`, icon: '💰', color: '#F59E0B' },
        ].map((s, i) => (
          <div key={i} style={{ padding: 16, background: 'var(--panel)', borderRadius: 12, border: '1px solid var(--panel-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)', fontSize: 13 }} />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '10px 12px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)', fontSize: 13 }}>
          <option value="all">全ステータス</option>
          <option value="active">稼働中</option>
          <option value="paused">一時停止</option>
        </select>
        <button onClick={loadChannels} style={{ padding: '10px 12px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 8, cursor: 'pointer' }}>
          <RefreshCw size={14} />
        </button>
      </div>
      
      <div style={{ padding: '0 20px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>読み込み中...</div>
        ) : filteredChannels.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            チャンネルがありません
            <button onClick={() => setShowCreateModal(true)} style={{ display: 'block', margin: '16px auto', padding: '8px 16px', background: '#EC4899', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>作成</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
            {filteredChannels.map(channel => {
              const brand = channel.brand_config || {};
              const genre = GENRES.find(g => g.id === channel.genre);
              const rankColor = RANK_COLORS[channel.revenue_rank] || RANK_COLORS.C;
              return (
                <div key={channel.channel_id} style={{ background: 'var(--panel)', borderRadius: 12, border: '1px solid var(--panel-border)', overflow: 'hidden' }}>
                  <div style={{ height: 8, background: `linear-gradient(90deg, ${brand.primaryColor || '#3B82F6'}, ${brand.secondaryColor || '#1E40AF'})` }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 8, background: brand.primaryColor || '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700 }}>
                        {channel.channel_name[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{channel.channel_name}</span>
                          <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: rankColor.bg, color: rankColor.text }}>{channel.revenue_rank}</span>
                          <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, background: channel.status === 'active' ? '#10B98120' : '#6B728020', color: channel.status === 'active' ? '#10B981' : '#6B7280' }}>
                            {channel.status === 'active' ? '稼働中' : channel.status}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{channel.channel_id}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{genre?.icon} {genre?.label || channel.genre}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>👥 {formatNumber(channel.subscriber_count || 0)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>💰 ${formatNumber(channel.monthly_revenue_usd || 0)}/月</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>🎙️ {channel.voice_config?.provider || 'elevenlabs'}</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                      {channel.production_config?.enableCharacter && <span style={{ padding: '2px 6px', background: 'var(--background)', borderRadius: 4, fontSize: 10 }}>👤 キャラ</span>}
                      {channel.production_config?.enableParticles && <span style={{ padding: '2px 6px', background: 'var(--background)', borderRadius: 4, fontSize: 10 }}>✨ パーティクル</span>}
                      {channel.security_config?.enableDigitalFingerprint && <span style={{ padding: '2px 6px', background: 'var(--background)', borderRadius: 4, fontSize: 10 }}>🔒 指紋</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setEditingChannel(channel)} style={{ flex: 1, padding: '8px 12px', background: 'var(--background)', border: '1px solid var(--panel-border)', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12 }}>
                        <Settings size={14} />設定
                      </button>
                      <Link href={`/tools/media-hub/contents?channel=${channel.channel_id}`} style={{ flex: 1, padding: '8px 12px', background: '#EC489920', border: '1px solid #EC489940', borderRadius: 6, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#EC4899' }}>
                        <Eye size={14} />コンテンツ
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {(showCreateModal || editingChannel) && (
        <ChannelModal channel={editingChannel} onClose={() => { setShowCreateModal(false); setEditingChannel(null); }} onSave={() => { setShowCreateModal(false); setEditingChannel(null); loadChannels(); }} />
      )}
    </div>
  );
}

function ChannelModal({ channel, onClose, onSave }: { channel: MediaChannel | null; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    channel_name: channel?.channel_name || '',
    genre: channel?.genre || 'education',
    revenue_rank: channel?.revenue_rank || 'C',
    brand_config: channel?.brand_config || { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B', fontFamily: 'Noto Sans JP' },
    voice_config: channel?.voice_config || { provider: 'elevenlabs', stability: 0.65, similarityBoost: 0.75 },
    production_config: channel?.production_config || { telopAnimation: 'spring', enableCharacter: true, enableParticles: true, enableKenBurns: true },
    security_config: channel?.security_config || { enableDigitalFingerprint: true, fingerprintVariation: 5, dailyPostLimit: 3 },
  });
  const [activeTab, setActiveTab] = useState<'basic' | 'brand' | 'voice' | 'production' | 'security'>('basic');
  const [saving, setSaving] = useState(false);
  
  const handleSave = async () => {
    setSaving(true);
    try {
      const url = channel ? `/api/media/channels/${channel.channel_id}` : '/api/media/channels';
      const method = channel ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) onSave();
      else alert('保存に失敗しました');
    } catch (error) {
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ width: 600, maxHeight: '90vh', background: 'var(--panel)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, flex: 1 }}>{channel ? 'チャンネル編集' : '新規チャンネル'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }}>×</button>
        </div>
        
        <div style={{ display: 'flex', borderBottom: '1px solid var(--panel-border)' }}>
          {[
            { id: 'basic', label: '📝 基本' },
            { id: 'brand', label: '🎨 ブランド' },
            { id: 'voice', label: '🎙️ 声' },
            { id: 'production', label: '🎬 演出' },
            { id: 'security', label: '🔒 セキュリティ' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              style={{ flex: 1, padding: '12px 8px', background: activeTab === tab.id ? 'var(--background)' : 'transparent', border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #EC4899' : '2px solid transparent', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                color: activeTab === tab.id ? '#EC4899' : 'var(--text-muted)' }}>
              {tab.label}
            </button>
          ))}
        </div>
        
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {activeTab === 'basic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>チャンネル名</label>
                <input type="text" value={formData.channel_name} onChange={(e) => setFormData({ ...formData, channel_name: e.target.value })} placeholder="例: 宅建合格チャンネル"
                  style={{ width: '100%', padding: 10, background: 'var(--background)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>ジャンル</label>
                <select value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  style={{ width: '100%', padding: 10, background: 'var(--background)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)' }}>
                  {GENRES.map(g => <option key={g.id} value={g.id}>{g.icon} {g.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>収益ランク</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['S', 'A', 'B', 'C'] as const).map(rank => (
                    <button key={rank} onClick={() => setFormData({ ...formData, revenue_rank: rank })}
                      style={{ flex: 1, padding: 12, borderRadius: 8, border: '2px solid', borderColor: formData.revenue_rank === rank ? RANK_COLORS[rank].bg : 'var(--panel-border)',
                        background: formData.revenue_rank === rank ? RANK_COLORS[rank].bg : 'var(--background)', color: formData.revenue_rank === rank ? RANK_COLORS[rank].text : 'var(--text)',
                        cursor: 'pointer', fontWeight: 700 }}>
                      {rank}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'brand' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['primaryColor', 'secondaryColor', 'accentColor'].map(colorKey => (
                <div key={colorKey}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
                    {colorKey === 'primaryColor' ? 'プライマリ' : colorKey === 'secondaryColor' ? 'セカンダリ' : 'アクセント'}カラー
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="color" value={formData.brand_config[colorKey] || '#3B82F6'}
                      onChange={(e) => setFormData({ ...formData, brand_config: { ...formData.brand_config, [colorKey]: e.target.value } })}
                      style={{ width: 50, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                    <input type="text" value={formData.brand_config[colorKey] || ''}
                      onChange={(e) => setFormData({ ...formData, brand_config: { ...formData.brand_config, [colorKey]: e.target.value } })}
                      style={{ flex: 1, padding: 10, background: 'var(--background)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)' }} />
                  </div>
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>フォント</label>
                <select value={formData.brand_config.fontFamily || 'Noto Sans JP'}
                  onChange={(e) => setFormData({ ...formData, brand_config: { ...formData.brand_config, fontFamily: e.target.value } })}
                  style={{ width: '100%', padding: 10, background: 'var(--background)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)' }}>
                  <option value="Noto Sans JP">Noto Sans JP</option>
                  <option value="M PLUS Rounded 1c">M PLUS Rounded 1c</option>
                  <option value="Kosugi Maru">Kosugi Maru</option>
                </select>
              </div>
            </div>
          )}
          
          {activeTab === 'voice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>プロバイダー</label>
                <select value={formData.voice_config.provider || 'elevenlabs'}
                  onChange={(e) => setFormData({ ...formData, voice_config: { ...formData.voice_config, provider: e.target.value } })}
                  style={{ width: '100%', padding: 10, background: 'var(--background)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)' }}>
                  <option value="elevenlabs">ElevenLabs（高品質）💰</option>
                  <option value="openai">OpenAI TTS（中品質）</option>
                  <option value="google">Google TTS（低コスト）</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>安定性: {formData.voice_config.stability || 0.65}</label>
                <input type="range" min="0" max="1" step="0.05" value={formData.voice_config.stability || 0.65}
                  onChange={(e) => setFormData({ ...formData, voice_config: { ...formData.voice_config, stability: parseFloat(e.target.value) } })}
                  style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>類似度: {formData.voice_config.similarityBoost || 0.75}</label>
                <input type="range" min="0" max="1" step="0.05" value={formData.voice_config.similarityBoost || 0.75}
                  onChange={(e) => setFormData({ ...formData, voice_config: { ...formData.voice_config, similarityBoost: parseFloat(e.target.value) } })}
                  style={{ width: '100%' }} />
              </div>
            </div>
          )}
          
          {activeTab === 'production' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>テロップアニメーション</label>
                <select value={formData.production_config.telopAnimation || 'spring'}
                  onChange={(e) => setFormData({ ...formData, production_config: { ...formData.production_config, telopAnimation: e.target.value } })}
                  style={{ width: '100%', padding: 10, background: 'var(--background)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)' }}>
                  <option value="spring">Spring（物理演算）🌟</option>
                  <option value="fade">フェード</option>
                  <option value="typewriter">タイプライター</option>
                  <option value="slide">スライド</option>
                  <option value="bounce">バウンス</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { key: 'enableCharacter', label: '👤 キャラクター' },
                  { key: 'enableParticles', label: '✨ パーティクル' },
                  { key: 'enableKenBurns', label: '🎬 Ken Burns' },
                ].map(opt => (
                  <button key={opt.key}
                    onClick={() => setFormData({ ...formData, production_config: { ...formData.production_config, [opt.key]: !formData.production_config[opt.key] } })}
                    style={{ padding: 12, borderRadius: 8, border: '1px solid', borderColor: formData.production_config[opt.key] ? '#EC4899' : 'var(--panel-border)',
                      background: formData.production_config[opt.key] ? '#EC489920' : 'var(--background)', color: formData.production_config[opt.key] ? '#EC4899' : 'var(--text-muted)',
                      cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                    {formData.production_config[opt.key] ? '✓ ' : ''}{opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <button onClick={() => setFormData({ ...formData, security_config: { ...formData.security_config, enableDigitalFingerprint: !formData.security_config.enableDigitalFingerprint } })}
                style={{ padding: 16, borderRadius: 8, border: '1px solid', borderColor: formData.security_config.enableDigitalFingerprint ? '#EC4899' : 'var(--panel-border)',
                  background: formData.security_config.enableDigitalFingerprint ? '#EC489920' : 'var(--background)', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontWeight: 600, color: formData.security_config.enableDigitalFingerprint ? '#EC4899' : 'var(--text)' }}>
                  {formData.security_config.enableDigitalFingerprint ? '✓ ' : ''}🔒 デジタル指紋（BAN回避）
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>色/ノイズ/フレームの微変動で動画をユニーク化</div>
              </button>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>指紋変動量: {formData.security_config.fingerprintVariation || 5}</label>
                <input type="range" min="1" max="10" value={formData.security_config.fingerprintVariation || 5}
                  onChange={(e) => setFormData({ ...formData, security_config: { ...formData.security_config, fingerprintVariation: parseInt(e.target.value) } })}
                  style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>1日の投稿上限</label>
                <input type="number" min="1" max="10" value={formData.security_config.dailyPostLimit || 3}
                  onChange={(e) => setFormData({ ...formData, security_config: { ...formData.security_config, dailyPostLimit: parseInt(e.target.value) } })}
                  style={{ width: '100%', padding: 10, background: 'var(--background)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)' }} />
              </div>
            </div>
          )}
        </div>
        
        <div style={{ padding: 20, borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={onClose} style={{ padding: '10px 20px', background: 'var(--background)', border: '1px solid var(--panel-border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text)' }}>
            キャンセル
          </button>
          <button onClick={handleSave} disabled={saving || !formData.channel_name}
            style={{ padding: '10px 20px', background: formData.channel_name ? '#EC4899' : '#6B7280', color: '#fff', border: 'none', borderRadius: 8, cursor: formData.channel_name ? 'pointer' : 'not-allowed', fontWeight: 600 }}>
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
