'use client'

interface CompletedItem {
  id: string
  sku: string
  product_name: string
  previous_quantity: number
  new_quantity: number
  location: string | null
  counted_at: string
}

interface CompletedListProps {
  items: CompletedItem[]
  onBack: () => void
}

export function CompletedList({ items, onBack }: CompletedListProps) {
  // 時間フォーマット
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  }
  
  // 統計情報
  const stats = {
    total: items.length,
    withDiff: items.filter(i => i.previous_quantity !== i.new_quantity).length,
    totalDiff: items.reduce((sum, i) => sum + (i.new_quantity - i.previous_quantity), 0)
  }
  
  return (
    <div className="space-y-4">
      {/* 統計カード */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">本日の棚卸し結果</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-gray-500">完了件数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.withDiff}</div>
            <div className="text-xs text-gray-500">差異あり</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${stats.totalDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalDiff >= 0 ? '+' : ''}{stats.totalDiff}
            </div>
            <div className="text-xs text-gray-500">総差異</div>
          </div>
        </div>
      </div>
      
      {/* リスト */}
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, index) => {
            const diff = item.new_quantity - item.previous_quantity
            return (
              <div 
                key={`${item.id}-${index}`}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {item.sku}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(item.counted_at)}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium line-clamp-1">
                      {item.product_name || '（商品名なし）'}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="text-gray-500">
                        {item.previous_quantity} → <span className="font-medium text-gray-800">{item.new_quantity}</span>
                      </span>
                      {diff !== 0 && (
                        <span className={`font-medium ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {diff > 0 ? '+' : ''}{diff}
                        </span>
                      )}
                      {item.location && (
                        <span className="text-gray-500">📍 {item.location}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg font-medium">まだ棚卸しが完了していません</p>
          <p className="mt-1">商品を検索して棚卸しを開始してください</p>
        </div>
      )}
      
      {/* 戻るボタン */}
      <div className="py-4">
        <button
          onClick={onBack}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          続けて棚卸しする
        </button>
      </div>
    </div>
  )
}
