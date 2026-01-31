// app/tools/editing-n3/components/l3-tabs/ComplianceTab/hts-hierarchy-panel.tsx
/**
 * HTS階層構造パネル
 * 既存の /tools/hts-hierarchy の機能をそのまま移植
 */
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, RefreshCw, ChevronRight, Bug, Ban } from 'lucide-react';

const supabase = createClient();

export function HTSHierarchyPanel() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
  const [headings, setHeadings] = useState<any[]>([]);
  const [selectedHeading, setSelectedHeading] = useState<any | null>(null);
  const [subheadings, setSubheadings] = useState<any[]>([]);
  const [selectedSubheading, setSelectedSubheading] = useState<any | null>(null);
  const [fullCodes, setFullCodes] = useState<any[]>([]);
  const [selectedCode, setSelectedCode] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ 
    chapters: 0, 
    headings: 0, 
    subheadings: 0, 
    fullCodes: 0 
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [showExcluded, setShowExcluded] = useState(false);

  useEffect(() => {
    loadStats();
    loadChapters();
  }, []);

  const loadStats = async () => {
    try {
      const [chaptersRes, headingsRes, subheadingsRes, detailsRes] = await Promise.all([
        supabase.from('hts_chapters').select('*', { count: 'exact', head: true }),
        supabase.from('hts_codes_headings').select('*', { count: 'exact', head: true }),
        supabase.from('hts_codes_subheadings').select('*', { count: 'exact', head: true }),
        supabase.from('hts_codes_details').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        chapters: chaptersRes.count || 0,
        headings: headingsRes.count || 0,
        subheadings: subheadingsRes.count || 0,
        fullCodes: detailsRes.count || 0
      });
    } catch (error) {
      console.error('Stats error:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const loadChapters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hts_chapters')
        .select('*')
        .order('chapter_code');

      if (!error && data) {
        setChapters(data);
      }
    } catch (error) {
      console.error('Load chapters error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHeadings = async (chapter: any) => {
    if (selectedChapter?.chapter_code === chapter.chapter_code) {
      setSelectedChapter(null);
      setHeadings([]);
      setSubheadings([]);
      setFullCodes([]);
      setSelectedHeading(null);
      setSelectedSubheading(null);
      return;
    }

    setSelectedChapter(chapter);
    setHeadings([]);
    setSubheadings([]);  
    setFullCodes([]);
    setSelectedHeading(null);
    setSelectedSubheading(null);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('hts_codes_headings')
        .select('*')
        .like('heading_code', `${chapter.chapter_code}%`)
        .order('heading_code');

      if (!error && data) {
        setHeadings(data);
      }
    } catch (error) {
      console.error('Load headings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubheadings = async (heading: any) => {
    if (selectedHeading?.heading_code === heading.heading_code) {
      setSelectedHeading(null);
      setSubheadings([]);
      setFullCodes([]);
      setSelectedSubheading(null);
      return;
    }

    setSelectedHeading(heading);
    setSubheadings([]);
    setFullCodes([]);
    setSelectedSubheading(null);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('hts_codes_subheadings')
        .select('*')
        .like('subheading_code', `${heading.heading_code}%`)
        .order('subheading_code');

      if (!error && data) {
        setSubheadings(data);
      }
    } catch (error) {
      console.error('Load subheadings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFullCodes = async (subheading: any) => {
    if (selectedSubheading?.subheading_code === subheading.subheading_code) {
      setSelectedSubheading(null);
      setFullCodes([]);
      return;
    }

    setSelectedSubheading(subheading);
    setFullCodes([]);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('hts_codes_details')
        .select('*')
        .eq('subheading_code', subheading.subheading_code)
        .order('hts_number');

      if (!error && data) {
        setFullCodes(data);
      }
    } catch (error) {
      console.error('Load full codes error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 検索フィルタリング
  const filteredChapters = chapters.filter(c => {
    if (!showExcluded && c.is_excluded) return false;
    if (!searchQuery) return true;
    return c.chapter_code?.includes(searchQuery) || 
           c.chapter_description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getDescription = (item: any, type: string) => {
    let en = '';
    let ja = '';
    
    if (type === 'chapter') {
      en = item.chapter_description || item.description_en || item.description || 'No description';
      ja = item.description_ja || item.name_ja || '';
    } else if (type === 'heading') {
      en = item.heading_description || item.description || item.title || 'No description';
      ja = item.description_ja || item.name_ja || '';
    } else if (type === 'subheading') {
      en = item.subheading_description || item.description || item.title || 'No description';
      ja = item.description_ja || item.name_ja || '';
    } else {
      en = item.description || 'No description';
      ja = item.description_ja || '';
    }
    
    return { en, ja };
  };

  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 統計バー */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        padding: 16,
        background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(139, 92, 246))',
        borderRadius: 8,
        color: 'white',
      }}>
        {dataLoading ? (
          <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: 16 }}>
            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: 8 }}>読み込み中...</div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.chapters}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Chapter（2桁）</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.headings}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Heading（4桁）</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.subheadings}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Subheading（6桁）</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.fullCodes.toLocaleString()}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Full Code（10桁）</div>
            </div>
          </>
        )}
      </div>

      {/* 検索バー */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Chapterコード または 説明で検索..."
            style={{
              width: '100%',
              paddingLeft: 36,
              paddingRight: 12,
              height: 36,
              border: '1px solid var(--panel-border)',
              borderRadius: 6,
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: 13,
            }}
          />
        </div>
        <button
          onClick={() => setShowExcluded(!showExcluded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '0 12px',
            height: 36,
            border: '2px solid',
            borderColor: showExcluded ? 'rgb(239, 68, 68)' : 'var(--panel-border)',
            background: showExcluded ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg)',
            color: showExcluded ? 'rgb(239, 68, 68)' : 'var(--text)',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <Ban size={14} />
          除外表示
        </button>
      </div>

      {/* 4階層ブラウザ */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, minHeight: 0 }}>
        {/* Chapter */}
        <HierarchyColumn
          title="Chapter"
          subtitle="大分類（2桁）"
          color="blue"
          count={filteredChapters.length}
          totalCount={stats.chapters}
          items={filteredChapters}
          selectedItem={selectedChapter}
          onSelect={loadHeadings}
          loading={loading && !chapters.length}
          emptyMessage="読込中..."
          renderItem={(c) => {
            const desc = getDescription(c, 'chapter');
            return {
              code: c.chapter_code,
              description: desc.en,
              descriptionJa: desc.ja,
              isExcluded: c.is_excluded,
              exclusionReason: c.exclusion_reason
            };
          }}
        />

        {/* Heading */}
        <HierarchyColumn
          title="Heading"
          subtitle="中分類（4桁）"
          color="green"
          count={headings.length}
          totalCount={stats.headings}
          items={headings}
          selectedItem={selectedHeading}
          onSelect={loadSubheadings}
          loading={loading && selectedChapter !== null}
          emptyMessage={!selectedChapter ? "← Chapterを選択" : "読込中..."}
          renderItem={(h) => {
            const desc = getDescription(h, 'heading');
            return {
              code: h.heading_code,
              description: desc.en,
              descriptionJa: desc.ja
            };
          }}
        />

        {/* Subheading */}
        <HierarchyColumn
          title="Subheading"
          subtitle="小分類（6桁）"
          color="yellow"
          count={subheadings.length}
          totalCount={stats.subheadings}
          items={subheadings}
          selectedItem={selectedSubheading}
          onSelect={loadFullCodes}
          loading={loading && selectedHeading !== null}
          emptyMessage={!selectedHeading ? "← Headingを選択" : "読込中..."}
          renderItem={(s) => {
            const desc = getDescription(s, 'subheading');
            return {
              code: s.subheading_code,
              description: desc.en,
              descriptionJa: desc.ja
            };
          }}
        />

        {/* Full Code */}
        <div style={{
          background: 'var(--panel)',
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', background: 'rgba(139, 92, 246, 0.1)' }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Full Code</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>完全コード（10桁）</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgb(139, 92, 246)', marginTop: 4 }}>
              {selectedSubheading ? `${fullCodes.length}件` : `全${stats.fullCodes.toLocaleString()}件`}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
            {loading && selectedSubheading ? (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
                <div style={{ fontSize: 12 }}>読込中...</div>
              </div>
            ) : !selectedSubheading ? (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 12 }}>
                ← Subheadingを選択
              </div>
            ) : (
              fullCodes.map(f => (
                <div
                  key={f.hts_number}
                  onClick={() => setSelectedCode(f)}
                  style={{
                    padding: 10,
                    marginBottom: 6,
                    border: '1px solid',
                    borderColor: selectedCode?.hts_number === f.hts_number ? 'rgb(139, 92, 246)' : 'var(--panel-border)',
                    borderRadius: 6,
                    background: selectedCode?.hts_number === f.hts_number ? 'rgba(139, 92, 246, 0.1)' : 'var(--highlight)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'rgb(139, 92, 246)' }}>
                    {f.hts_number}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                    {f.description?.substring(0, 100)}...
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    関税: {f.general_rate || 'Free'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 選択されたコードの詳細 */}
      {selectedCode && (
        <div style={{
          padding: 16,
          background: 'var(--panel)',
          borderRadius: 8,
          border: '2px solid rgb(139, 92, 246)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>選択されたHTSコード</div>
              <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 700, color: 'rgb(139, 92, 246)' }}>
                {selectedCode.hts_number}
              </div>
            </div>
            <button
              onClick={() => setSelectedCode(null)}
              style={{
                padding: '4px 8px',
                background: 'var(--highlight)',
                border: '1px solid var(--panel-border)',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 12, lineHeight: 1.5 }}>
            {selectedCode.description}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            <div style={{ padding: 10, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 6, border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Chapter</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16 }}>{selectedChapter?.chapter_code}</div>
            </div>
            <div style={{ padding: 10, background: 'rgba(34, 197, 94, 0.1)', borderRadius: 6, border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Heading</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16 }}>{selectedHeading?.heading_code}</div>
            </div>
            <div style={{ padding: 10, background: 'rgba(245, 158, 11, 0.1)', borderRadius: 6, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Subheading</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16 }}>{selectedCode.subheading_code}</div>
            </div>
            <div style={{ padding: 10, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 6, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>一般関税率</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'rgb(239, 68, 68)' }}>{selectedCode.general_rate || 'Free'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 階層カラムコンポーネント
function HierarchyColumn({ title, subtitle, color, count, totalCount, items, selectedItem, onSelect, loading, emptyMessage, renderItem }: any) {
  const colorMap: Record<string, string> = {
    blue: 'rgb(59, 130, 246)',
    green: 'rgb(34, 197, 94)',
    yellow: 'rgb(245, 158, 11)',
    purple: 'rgb(139, 92, 246)',
  };
  const bgMap: Record<string, string> = {
    blue: 'rgba(59, 130, 246, 0.1)',
    green: 'rgba(34, 197, 94, 0.1)',
    yellow: 'rgba(245, 158, 11, 0.1)',
    purple: 'rgba(139, 92, 246, 0.1)',
  };

  return (
    <div style={{
      background: 'var(--panel)',
      borderRadius: 8,
      border: '1px solid var(--panel-border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', background: bgMap[color] }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{subtitle}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: colorMap[color], marginTop: 4 }}>
          {count}件 / 全{totalCount}件
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
            <div style={{ fontSize: 12 }}>{emptyMessage}</div>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 12 }}>
            {emptyMessage}
          </div>
        ) : (
          items.map((item: any) => {
            const rendered = renderItem(item);
            const isSelected = selectedItem && (
              (item.chapter_code && selectedItem.chapter_code === item.chapter_code) ||
              (item.heading_code && selectedItem.heading_code === item.heading_code) ||
              (item.subheading_code && selectedItem.subheading_code === item.subheading_code)
            );

            return (
              <button
                key={item.id || rendered.code}
                onClick={() => !rendered.isExcluded && onSelect(item)}
                disabled={rendered.isExcluded}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: 8,
                  marginBottom: 4,
                  border: 'none',
                  borderRadius: 6,
                  background: rendered.isExcluded
                    ? 'var(--highlight)'
                    : isSelected
                      ? colorMap[color]
                      : 'var(--highlight)',
                  color: rendered.isExcluded
                    ? 'var(--text-muted)'
                    : isSelected
                      ? 'white'
                      : 'var(--text)',
                  cursor: rendered.isExcluded ? 'not-allowed' : 'pointer',
                  opacity: rendered.isExcluded ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>{rendered.code}</span>
                  {rendered.isExcluded && <Ban size={12} style={{ color: 'rgb(239, 68, 68)' }} />}
                </div>
                {rendered.description && (
                  <div style={{ fontSize: 10, marginTop: 4, opacity: 0.8, lineHeight: 1.3 }}>
                    {rendered.description.substring(0, 50)}...
                  </div>
                )}
                {rendered.descriptionJa && (
                  <div style={{ fontSize: 10, marginTop: 2, fontWeight: 600, color: isSelected ? 'white' : 'rgb(59, 130, 246)' }}>
                    {rendered.descriptionJa.substring(0, 30)}...
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
