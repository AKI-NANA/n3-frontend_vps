/**
 * N3ActionBar - アクションボタングループ
 * 
 * Export/Save/Deleteなどの主要アクションボタンを配置
 * 右上に表示される
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, Save, Trash2, ChevronDown, Upload, FileText, Database } from 'lucide-react';

interface ExportOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

export interface N3ActionBarProps {
  /** 選択件数 */
  selectedCount?: number;
  /** 未保存変更あり */
  hasChanges?: boolean;
  /** 保存ボタンクリック */
  onSave?: () => void;
  /** 削除ボタンクリック */
  onDelete?: () => void;
  /** Export CSV */
  onExportCSV?: () => void;
  /** Export eBay */
  onExportEbay?: () => void;
  /** Import */
  onImport?: () => void;
  /** カスタムExportオプション */
  exportOptions?: ExportOption[];
  /** 処理中 */
  processing?: boolean;
}

export function N3ActionBar({
  selectedCount = 0,
  hasChanges = false,
  onSave,
  onDelete,
  onExportCSV,
  onExportEbay,
  onImport,
  exportOptions,
  processing = false,
}: N3ActionBarProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showExportMenu]);

  const defaultExportOptions: ExportOption[] = [
    { id: 'csv', label: 'Export All (CSV)', icon: <FileText size={14} />, onClick: () => { onExportCSV?.(); setShowExportMenu(false); } },
    { id: 'ebay', label: 'Export eBay Format', icon: <Database size={14} />, onClick: () => { onExportEbay?.(); setShowExportMenu(false); } },
  ];

  const finalExportOptions = exportOptions || defaultExportOptions;

  return (
    <div className="n3-action-bar">
      {/* View Toggle (List/Card) - 外部から渡す場合はここに配置 */}
      
      {/* Export Dropdown */}
      <div className="n3-dropdown" ref={exportRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="n3-btn n3-btn-sm n3-btn-secondary"
          disabled={processing}
        >
          <Download size={14} />
          <span>Export</span>
          <ChevronDown size={12} />
        </button>
        {showExportMenu && (
          <div 
            className="n3-dropdown-menu open"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              minWidth: 180,
              background: 'var(--panel)',
              border: '1px solid var(--panel-border)',
              borderRadius: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 100,
              overflow: 'hidden',
            }}
          >
            {finalExportOptions.map((opt) => (
              <button
                key={opt.id}
                className="n3-dropdown-item"
                onClick={opt.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text)',
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--highlight)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={processing || (!hasChanges && selectedCount === 0)}
        className={`n3-btn n3-btn-sm ${hasChanges ? 'n3-btn-primary' : 'n3-btn-secondary'}`}
        style={{
          background: hasChanges ? 'var(--accent)' : undefined,
        }}
      >
        <Save size={14} />
        <span>Save</span>
        {selectedCount > 0 && <span>({selectedCount})</span>}
      </button>

      {/* Delete Button */}
      {selectedCount > 0 && (
        <button
          onClick={onDelete}
          disabled={processing}
          className="n3-btn n3-btn-sm n3-btn-danger"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

export default N3ActionBar;
