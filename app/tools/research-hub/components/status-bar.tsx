// app/tools/research-hub/components/status-bar.tsx
'use client'

interface StatusBarProps {
  stats: {
    total: number
    new: number
    analyzing: number
    approved: number
    rejected: number
    highScore: number
    lowRisk: number
    mediumRisk: number
    highRisk: number
    watching: number
    alert: number
  }
}

function StatItem({ 
  color, 
  label, 
  value, 
  tip 
}: { 
  color: string; 
  label: string; 
  value: number;
  tip?: string 
}) {
  return (
    <span 
      className="flex items-center gap-1 group relative cursor-help" 
      style={{ color }}
    >
      <span 
        className="w-2 h-2 rounded-full" 
        style={{ background: color }}
      />
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
      {tip && (
        <div className="absolute bottom-full left-0 mb-1 px-2 py-1 text-[10px] 
          bg-gray-800 text-white rounded whitespace-nowrap opacity-0 invisible 
          group-hover:opacity-100 group-hover:visible transition-all z-50">
          {tip}
        </div>
      )}
    </span>
  )
}

export function StatusBar({ stats }: StatusBarProps) {
  return (
    <div className="n3-status-bar">
      <div className="flex items-center gap-4 text-[11px]">
        <StatItem 
          color="var(--text-secondary)" 
          label="Total" 
          value={stats.total}
          tip="全リサーチ商品数"
        />
        <StatItem 
          color="var(--info)" 
          label="New" 
          value={stats.new}
          tip="新規リサーチ商品"
        />
        <StatItem 
          color="var(--warning)" 
          label="Analyzing" 
          value={stats.analyzing}
          tip="分析中の商品"
        />
        <StatItem 
          color="var(--success)" 
          label="Approved" 
          value={stats.approved}
          tip="承認済み商品"
        />
        <StatItem 
          color="var(--error)" 
          label="Rejected" 
          value={stats.rejected}
          tip="却下された商品"
        />
        
        <div className="n3-status-bar-divider" />
        
        <StatItem 
          color="var(--accent)" 
          label="High Score" 
          value={stats.highScore}
          tip="スコア70以上の商品"
        />
        <StatItem 
          color="var(--success)" 
          label="Low Risk" 
          value={stats.lowRisk}
          tip="低リスク商品"
        />
      </div>
    </div>
  )
}
