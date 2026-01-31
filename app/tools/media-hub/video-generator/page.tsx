// app/tools/media-hub/video-generator/page.tsx
/**
 * Media Hub - 動画生成ページ（Remotion連携）
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Film, Zap, Plus, Trash2, ChevronDown, ChevronUp, Image, Type, Users, MousePointer, Eye, Download, Loader2, ArrowRight, Circle, Square } from 'lucide-react';

// 型定義
interface ScriptSegment { id: string; startTime: number; duration: number; text: string; emotion?: string; }
interface Annotation { id: string; type: string; startTime: number; duration: number; position: { x: number; y: number }; size?: number; color?: string; }
interface TelopStyle { position: string; fontSize: number; color: string; backgroundColor?: string; animation: string; }
interface BackgroundConfig { type: string; enableKenBurns: boolean; enableParticles: boolean; particleType?: string; }
interface CharacterConfig { id: string; name: string; position: string; }

const PRESET_CHARACTERS: CharacterConfig[] = [
  { id: 'teacher_01', name: '先生（男性）', position: 'right' },
  { id: 'teacher_02', name: '先生（女性）', position: 'right' },
];

export default function VideoGeneratorPage() {
  const [videoType, setVideoType] = useState<'short' | 'long'>('short');
  const [title, setTitle] = useState('');
  const [segments, setSegments] = useState<ScriptSegment[]>([{ id: 'seg_1', startTime: 0, duration: 3, text: 'こんにちは', emotion: 'neutral' }]);
  const [useCharacter, setUseCharacter] = useState(true);
  const [character, setCharacter] = useState<CharacterConfig | null>(PRESET_CHARACTERS[0]);
  const [telopStyle, setTelopStyle] = useState<TelopStyle>({ position: 'bottom', fontSize: 48, color: '#FFFFFF', backgroundColor: '#000000', animation: 'spring' });
  const [background, setBackground] = useState<BackgroundConfig>({ type: 'gradient', enableKenBurns: true, enableParticles: true, particleType: 'dust' });
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeSection, setActiveSection] = useState<string>('script');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const totalDuration = useMemo(() => segments.reduce((acc, seg) => Math.max(acc, seg.startTime + seg.duration), 0), [segments]);

  const addSegment = useCallback(() => {
    const last = segments[segments.length - 1];
    setSegments(prev => [...prev, { id: `seg_${Date.now()}`, startTime: last ? last.startTime + last.duration : 0, duration: 3, text: '', emotion: 'neutral' }]);
  }, [segments]);

  const startRender = useCallback(async () => {
    setIsRendering(true);
    setRenderProgress(0);
    try {
      const res = await fetch('/api/media/remotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compositionId: videoType === 'short' ? 'ShortVideo' : 'LongVideo',
          props: { title, segments, totalDuration, annotations, character: useCharacter ? character : undefined, telopStyle, background,
            audio: { narrationUrl: '', narrationVolume: 1, bgmVolume: 0.3, bgmDucking: true, bgmDuckingLevel: 0.2 },
            brand: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B', fontFamily: 'Noto Sans JP' },
            fingerprint: { channelId: 'default', contentId: `content_${Date.now()}`, colorShift: true, colorShiftAmount: 3, noiseOverlay: true, noiseAmount: 2, frameJitter: true, jitterAmount: 2 },
          },
          outputFormat: 'mp4', quality: 'production',
        }),
      });
      const result = await res.json();
      if (result.success && result.renderId) {
        const poll = async () => {
          const r = await fetch(`/api/media/remotion?renderId=${result.renderId}`);
          const s = await r.json();
          if (s.status === 'complete') { setRenderProgress(100); setPreviewUrl(s.outputUrl); setIsRendering(false); }
          else if (s.status === 'failed') { setIsRendering(false); alert('エラー: ' + s.error); }
          else { setRenderProgress(s.progress || 0); setTimeout(poll, 1000); }
        };
        poll();
      }
    } catch (e) { alert('エラー'); setIsRendering(false); }
  }, [videoType, title, segments, totalDuration, annotations, character, useCharacter, telopStyle, background]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Film size={24} style={{ color: '#EC4899' }} />
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>動画生成 (Remotion)</h1>
          <span style={{ fontSize: 11, padding: '4px 8px', background: videoType === 'short' ? '#EC489920' : '#3B82F620', color: videoType === 'short' ? '#EC4899' : '#3B82F6', borderRadius: 4 }}>
            {videoType === 'short' ? 'Shorts 9:16' : 'Long 16:9'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <select value={videoType} onChange={e => setVideoType(e.target.value as 'short' | 'long')} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)' }}>
            <option value="short">ショート (9:16)</option>
            <option value="long">ロング (16:9)</option>
          </select>
          <button onClick={startRender} disabled={isRendering || !title} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 6, border: 'none', background: isRendering ? '#6B7280' : '#EC4899', color: 'white', cursor: isRendering ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
            {isRendering ? <><Loader2 size={16} className="animate-spin" /> {renderProgress}%</> : <><Zap size={16} /> レンダリング</>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel */}
        <div style={{ width: 400, borderRight: '1px solid var(--border)', overflow: 'auto', background: 'var(--panel)' }}>
          {/* Title */}
          <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>動画タイトル</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="タイトルを入力" style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)' }} />
          </div>

          {/* Script Section */}
          <Section title="スクリプト" icon={Type} isOpen={activeSection === 'script'} onToggle={() => setActiveSection(activeSection === 'script' ? '' : 'script')} badge={`${segments.length}件`}>
            {segments.map((seg, i) => (
              <div key={seg.id} style={{ marginBottom: 12, padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', background: '#3B82F620', color: '#3B82F6', borderRadius: 4 }}>#{i + 1}</span>
                  <input type="number" value={seg.startTime} onChange={e => setSegments(prev => prev.map(s => s.id === seg.id ? { ...s, startTime: +e.target.value } : s))} style={{ width: 50, padding: 4, borderRadius: 4, border: '1px solid var(--border)' }} />秒〜
                  <input type="number" value={seg.duration} onChange={e => setSegments(prev => prev.map(s => s.id === seg.id ? { ...s, duration: +e.target.value } : s))} style={{ width: 50, padding: 4, borderRadius: 4, border: '1px solid var(--border)' }} />秒
                  <div style={{ flex: 1 }} />
                  <button onClick={() => setSegments(prev => prev.filter(s => s.id !== seg.id))} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} style={{ color: '#EF4444' }} /></button>
                </div>
                <textarea value={seg.text} onChange={e => setSegments(prev => prev.map(s => s.id === seg.id ? { ...s, text: e.target.value } : s))} placeholder="ナレーション" rows={2} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--panel)' }} />
              </div>
            ))}
            <button onClick={addSegment} style={{ width: '100%', padding: 12, borderRadius: 6, border: '2px dashed var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Plus size={16} /> 追加</button>
          </Section>

          {/* Character Section */}
          <Section title="キャラクター" icon={Users} isOpen={activeSection === 'character'} onToggle={() => setActiveSection(activeSection === 'character' ? '' : 'character')} badge={useCharacter ? character?.name : 'なし'}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><input type="checkbox" checked={useCharacter} onChange={e => setUseCharacter(e.target.checked)} /> 使用する</label>
            {useCharacter && PRESET_CHARACTERS.map(c => (
              <div key={c.id} onClick={() => setCharacter(c)} style={{ padding: 12, borderRadius: 8, border: `2px solid ${character?.id === c.id ? '#EC4899' : 'var(--border)'}`, marginBottom: 8, cursor: 'pointer' }}>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
              </div>
            ))}
          </Section>

          {/* Telop Section */}
          <Section title="テロップ" icon={Type} isOpen={activeSection === 'telop'} onToggle={() => setActiveSection(activeSection === 'telop' ? '' : 'telop')}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>アニメーション</label>
              <select value={telopStyle.animation} onChange={e => setTelopStyle({ ...telopStyle, animation: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }}>
                <option value="spring">Spring（弾む）</option>
                <option value="fade">フェード</option>
                <option value="typewriter">タイプライター</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>文字色</label><input type="color" value={telopStyle.color} onChange={e => setTelopStyle({ ...telopStyle, color: e.target.value })} style={{ width: '100%', height: 36 }} /></div>
              <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>背景色</label><input type="color" value={telopStyle.backgroundColor || '#000'} onChange={e => setTelopStyle({ ...telopStyle, backgroundColor: e.target.value })} style={{ width: '100%', height: 36 }} /></div>
            </div>
          </Section>

          {/* Background Section */}
          <Section title="背景" icon={Image} isOpen={activeSection === 'bg'} onToggle={() => setActiveSection(activeSection === 'bg' ? '' : 'bg')}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><input type="checkbox" checked={background.enableKenBurns} onChange={e => setBackground({ ...background, enableKenBurns: e.target.checked })} /> Ken Burns（ズーム）</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={background.enableParticles} onChange={e => setBackground({ ...background, enableParticles: e.target.checked })} /> パーティクル（AI回避）</label>
          </Section>

          {/* Annotation Section */}
          <Section title="注釈（桜井スタイル）" icon={MousePointer} isOpen={activeSection === 'anno'} onToggle={() => setActiveSection(activeSection === 'anno' ? '' : 'anno')} badge={`${annotations.length}件`}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {['circle', 'rectangle', 'arrow', 'pointer'].map(t => (
                <button key={t} onClick={() => setAnnotations(prev => [...prev, { id: `a_${Date.now()}`, type: t, startTime: 0, duration: 3, position: { x: 50, y: 50 }, size: 50, color: '#FF0000' }])} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', fontSize: 12 }}>
                  {t === 'circle' && <><Circle size={14} /> 丸</>}
                  {t === 'rectangle' && <><Square size={14} /> 四角</>}
                  {t === 'arrow' && <><ArrowRight size={14} /> 矢印</>}
                  {t === 'pointer' && <><MousePointer size={14} /> 指</>}
                </button>
              ))}
            </div>
            {annotations.map(a => (
              <div key={a.id} style={{ padding: 8, borderRadius: 6, border: '1px solid var(--border)', marginBottom: 8, fontSize: 12 }}>
                {a.type} | {a.startTime}秒〜{a.startTime + a.duration}秒
                <button onClick={() => setAnnotations(prev => prev.filter(x => x.id !== a.id))} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={12} style={{ color: '#EF4444' }} /></button>
              </div>
            ))}
          </Section>
        </div>

        {/* Right Panel - Preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: 24 }}>
          <div style={{ marginBottom: 16, color: '#666', fontSize: 12 }}>プレビュー ({videoType === 'short' ? '9:16' : '16:9'})</div>
          <div style={{ width: '100%', maxWidth: videoType === 'short' ? 300 : 640, aspectRatio: videoType === 'short' ? '9/16' : '16/9', background: '#1a1a2e', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {isRendering ? (
              <div style={{ textAlign: 'center' }}>
                <Loader2 size={48} className="animate-spin" style={{ color: '#EC4899', marginBottom: 16 }} />
                <div style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>レンダリング中... {renderProgress}%</div>
                <div style={{ width: 200, height: 4, background: '#333', borderRadius: 2, marginTop: 12, overflow: 'hidden' }}>
                  <div style={{ width: `${renderProgress}%`, height: '100%', background: '#EC4899' }} />
                </div>
              </div>
            ) : previewUrl ? (
              <video src={previewUrl} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ textAlign: 'center', color: '#666' }}><Film size={64} style={{ marginBottom: 16, opacity: 0.3 }} /><div>設定を完了してレンダリング</div></div>
            )}
          </div>
          {previewUrl && <a href={previewUrl} download style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#10B981', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}><Download size={16} /> ダウンロード</a>}
        </div>
      </div>
    </div>
  );
}

// Section Component
function Section({ title, icon: Icon, isOpen, onToggle, badge, children }: { title: string; icon: React.ElementType; isOpen: boolean; onToggle: () => void; badge?: string; children: React.ReactNode }) {
  return (
    <>
      <button onClick={onToggle} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, border: 'none', borderBottom: '1px solid var(--border)', background: isOpen ? 'var(--bg)' : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
        <Icon size={16} style={{ color: 'var(--text-muted)' }} />
        <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{title}</span>
        {badge && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{badge}</span>}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div style={{ padding: 16 }}>{children}</div>}
    </>
  );
}
