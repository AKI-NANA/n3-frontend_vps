// app/tools/editing/components/l2-tab-contents.tsx
'use client'

interface ContentProps {
  className?: string
}

export function LogisticsContent({ className }: ContentProps) {
  return (
    <div className={className}>
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
            ロジスティクス
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            配送設定、送料計算、発送方法の管理を行います。
          </p>
        </div>
        
        <div 
          className="p-4 rounded"
          style={{ 
            background: 'var(--panel)', 
            border: '1px solid var(--panel-border)' 
          }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            配送設定
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            商品の配送方法、送料テンプレート、発送元住所などを設定します。
          </p>
        </div>

        <div 
          className="p-4 rounded"
          style={{ 
            background: 'var(--panel)', 
            border: '1px solid var(--panel-border)' 
          }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            送料計算
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            サイズ、重量、配送先に基づいた送料の自動計算を行います。
          </p>
        </div>
      </div>
    </div>
  )
}

export function ComplianceContent({ className }: ContentProps) {
  return (
    <div className={className}>
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
            関税・法令
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            HSコード、関税率、法的規制の管理を行います。
          </p>
        </div>
        
        <div 
          className="p-4 rounded"
          style={{ 
            background: 'var(--panel)', 
            border: '1px solid var(--panel-border)' 
          }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            HSコード分類
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            商品のHSコードを設定し、関税率を自動計算します。
          </p>
        </div>

        <div 
          className="p-4 rounded"
          style={{ 
            background: 'var(--panel)', 
            border: '1px solid var(--panel-border)' 
          }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            法令遵守
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            EU GPSR、VERO、その他の法的規制への対応状況を管理します。
          </p>
        </div>
      </div>
    </div>
  )
}

export function MediaContent({ className }: ContentProps) {
  return (
    <div className={className}>
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
            メディア
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            商品画像、動画、HTMLコンテンツの管理を行います。
          </p>
        </div>
        
        <div 
          className="p-4 rounded"
          style={{ 
            background: 'var(--panel)', 
            border: '1px solid var(--panel-border)' 
          }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            画像管理
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            商品画像のアップロード、編集、最適化を行います。
          </p>
        </div>

        <div 
          className="p-4 rounded"
          style={{ 
            background: 'var(--panel)', 
            border: '1px solid var(--panel-border)' 
          }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            HTMLコンテンツ
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            商品説明のHTML生成、プレビュー、テンプレート管理を行います。
          </p>
        </div>
      </div>
    </div>
  )
}

export function HistoryContent({ className }: ContentProps) {
  return (
    <div className={className}>
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
            履歴・監査
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            商品の変更履歴、監査ログ、バージョン管理を行います。
          </p>
        </div>
        
        <div 
          className="p-4 rounded"
          style={{ 
            background: 'var(--panel)', 
            border: '1px solid var(--panel-border)' 
          }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            変更履歴
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            商品情報の変更履歴をタイムラインで確認できます。
          </p>
        </div>

        <div 
          className="p-4 rounded"
          style={{ 
            background: 'var(--panel)', 
            border: '1px solid var(--panel-border)' 
          }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            監査ログ
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            誰がいつ何を変更したかを追跡し、コンプライアンスを確保します。
          </p>
        </div>
      </div>
    </div>
  )
}
