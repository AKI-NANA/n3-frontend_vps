// app/tools/research-table/components/research-detail-modal.tsx
'use client'

import { X, ExternalLink, CheckCircle, XCircle, ShoppingCart, AlertTriangle, TrendingUp, Package } from 'lucide-react'
import type { ResearchItem } from '../types/research'

interface ResearchDetailModalProps {
  item: ResearchItem
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}

export function ResearchDetailModal({
  item,
  onClose,
  onApprove,
  onReject
}: ResearchDetailModalProps) {

  const scoreColor = (item.total_score || 0) >= 70 ? 'text-emerald-600' :
                     (item.total_score || 0) >= 50 ? 'text-amber-600' : 'text-red-600'

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Package size={20} className="text-indigo-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">商品詳細</h2>
              <p className="text-sm text-gray-500">リサーチID: {item.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-3 gap-6">
            {/* 左カラム: 画像 */}
            <div>
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full aspect-square object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded-lg border flex items-center justify-center">
                  <Package size={48} className="text-gray-300" />
                </div>
              )}
              {item.source_url && (
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 mt-3 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                >
                  <ExternalLink size={14} />
                  元のページを開く
                </a>
              )}
            </div>

            {/* 中央カラム: 商品情報 */}
            <div className="col-span-2 space-y-4">
              {/* タイトル */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                {item.english_title && (
                  <p className="text-sm text-gray-600 mt-1">{item.english_title}</p>
                )}
              </div>

              {/* スコアとステータス */}
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-bold ${scoreColor}`}>
                  {item.total_score || '-'}
                  <span className="text-sm font-normal text-gray-500 ml-1">/ 100</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                  item.status === 'rejected' ? 'bg-gray-100 text-gray-700' :
                  item.status === 'analyzing' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {item.status === 'new' ? '新規' :
                   item.status === 'analyzing' ? '分析中' :
                   item.status === 'approved' ? '承認済' :
                   item.status === 'rejected' ? '却下' :
                   item.status === 'promoted' ? '編集中' : item.status}
                </div>
              </div>

              {/* データグリッド */}
              <div className="grid grid-cols-2 gap-4">
                {/* 販売データ */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">販売データ</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">売価</span>
                      <span className="font-mono font-medium">${item.sold_price_usd?.toFixed(2) || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">販売数</span>
                      <span className="font-mono font-medium">{item.sold_count || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">競合数</span>
                      <span className="font-mono font-medium">{item.competitor_count || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* 仕入先情報 */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">仕入先情報</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ソース</span>
                      <span className="font-medium">{item.supplier_source || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">仕入価格</span>
                      <span className="font-mono font-medium">¥{item.supplier_price_jpy?.toLocaleString() || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">在庫</span>
                      <span className={`font-medium ${
                        item.supplier_stock === 'あり' ? 'text-emerald-600' :
                        item.supplier_stock === 'なし' ? 'text-red-600' : 'text-gray-600'
                      }`}>{item.supplier_stock || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* 利益計算 */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">利益計算</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">予想原価</span>
                      <span className="font-mono font-medium">¥{item.estimated_cost_jpy?.toLocaleString() || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">予想利益</span>
                      <span className={`font-mono font-medium ${(item.estimated_profit_jpy || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        ¥{item.estimated_profit_jpy?.toLocaleString() || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">利益率</span>
                      <span className={`font-mono font-bold ${(item.profit_margin || 0) >= 20 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {item.profit_margin?.toFixed(0) || '-'}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* リスク情報 */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">リスク評価</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {item.risk_level === 'high' && <AlertTriangle size={16} className="text-red-500" />}
                      {item.risk_level === 'medium' && <AlertTriangle size={16} className="text-amber-500" />}
                      {item.risk_level === 'low' && <CheckCircle size={16} className="text-emerald-500" />}
                      <span className={`font-medium ${
                        item.risk_level === 'high' ? 'text-red-600' :
                        item.risk_level === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {item.risk_level === 'high' ? '高リスク' :
                         item.risk_level === 'medium' ? '中リスク' : '低リスク'}
                      </span>
                    </div>
                    {item.section_301_risk && (
                      <div className="text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle size={12} /> Section 301対象
                      </div>
                    )}
                    {item.vero_risk && (
                      <div className="text-xs text-orange-600 flex items-center gap-1">
                        <AlertTriangle size={12} /> VEROリスク
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 刈り取り情報 */}
              {item.karitori_status && item.karitori_status !== 'none' && (
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <div className="flex items-center gap-2 text-orange-700">
                    <ShoppingCart size={16} />
                    <span className="font-medium">刈り取り監視中</span>
                    {item.price_drop_percent && (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <TrendingUp size={14} className="rotate-180" />
                        {item.price_drop_percent}%値下げ
                      </span>
                    )}
                  </div>
                  {item.target_price_jpy && (
                    <div className="text-sm text-orange-600 mt-1">
                      目標価格: ¥{item.target_price_jpy.toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            閉じる
          </button>
          <button
            onClick={onReject}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <XCircle size={16} />
            却下
          </button>
          <button
            onClick={onApprove}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
          >
            <CheckCircle size={16} />
            承認して編集へ
          </button>
        </div>
      </div>
    </>
  )
}
