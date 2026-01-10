'use client'

// ⚠️ このコンポーネントは廃止されました
// 代わりに PartialBulkUploader 内の syncRateTables 関数を使用してください

export function RateTableIdFetcher() {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-800">
        ⚠️ このコンポーネントは廃止されました。<br/>
        PartialBulkUploader の「Rate Table同期」機能をご利用ください。
      </p>
    </div>
  )
}
