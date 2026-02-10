import { InventoryProduct } from '@/types/inventory'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, ExternalLink, Package, Clock, TrendingDown, AlertTriangle, Settings } from 'lucide-react'
import {
  daysSinceAcquisition,
  daysUntilDeadline,
  determinePricePhase,
  getPhaseName,
  getPhaseColor,
  calculateFinalProfitMargin
} from '@/lib/services/inventory/automatic-price-reduction-service'

interface ProductCardProps {
  product: InventoryProduct
  onEdit: () => void
  onDelete: () => void
  onDeactivate?: () => void
  onCardClick?: () => void  // 🆕 カード全体のクリックハンドラ
  isSelected?: boolean       // 🆕 選択状態
  onSelect?: () => void      // 🆕 選択ハンドラ
}

export function ProductCard({ product, onEdit, onDelete, onDeactivate, onCardClick, isSelected, onSelect }: ProductCardProps) {
  // 🆕 在庫最適化データの計算
  const daysHeld = daysSinceAcquisition(product.date_acquired || null)
  const remainingDays = daysUntilDeadline(product.target_sale_deadline || null)
  const currentPhase = product.current_price_phase || determinePricePhase(product.date_acquired || null)
  const phaseColors = getPhaseColor(currentPhase)
  const profitMargin = calculateFinalProfitMargin(product)

  // source_dataからマーケットプレイスとアカウントを取得
  const sourceData = product.source_data || {}
  const marketplace = product.marketplace || sourceData.marketplace || null
  const account = product.account || sourceData.ebay_account || sourceData.mercari_account || null

  // P0-11: 価格表示（マーケットプレイスに応じた通貨表示）
  const formatPrice = (price: number) => {
    if (!price || price === 0) return '未設定'
    
    // メルカリ商品は円表示
    if (product.marketplace === 'mercari') {
      return `¥${price.toLocaleString()}`
    }
    // それ以外はドル表示
    return `${price.toFixed(2)}`
  }

  // 🔧 マーケットプレイスバッジ（推測排除）
  const getMarketplaceBadge = () => {
    // P0-11: メルカリ対応
    if (product.marketplace === 'mercari') {
      const accountName = product.account || product.source_data?.mercari_account || 'default'
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          🔴 メルカリ {accountName !== 'default' ? `(${accountName})` : ''}
        </Badge>
      )
    }
    
    if (product.marketplace === 'ebay') {
      // P1-2: アカウント表示（account または source_data.ebay_account から取得）
      const accountName = product.account || product.source_data?.ebay_account || 'UNKNOWN'
      const accountUpper = accountName.toUpperCase()

      // アカウント別に色分け
      const badgeClass = accountUpper === 'GREEN'
        ? 'bg-green-50 text-green-700 border-green-200'
        : accountUpper === 'MJT'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-slate-50 text-slate-700 border-slate-200'

      return (
        <Badge variant="outline" className={badgeClass}>
          eBay {accountUpper}
        </Badge>
      )
    }
    // 手動登録
    if (product.marketplace === 'manual' || product.is_manual_entry) {
      return (
        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
          ✏️ 手動登録
        </Badge>
      )
    }
    
    // 🔧 推測排除: マーケットプレイスが不明な場合
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        <AlertTriangle className="w-3 h-3 mr-1" />
        不明
      </Badge>
    )
  }

  // 🔧 商品タイプバッジ（推測排除）
  const getProductTypeBadge = () => {
    const sku = product.sku?.toLowerCase() || ''
    const productType = product.product_type
    
    // SKUに"stock"が含まれる場合は有在庫
    if (sku.includes('stock')) {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          📦 有在庫
        </Badge>
      )
    }
    
    // product_typeが設定されている場合
    if (productType === 'stock') {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          📦 有在庫
        </Badge>
      )
    } else if (productType === 'dropship') {
      // 🔧 同期直後は「未判定」と表示
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-300">
          ❓ 未判定
        </Badge>
      )
    } else if (productType === 'set') {
      return (
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
          📦 セット品
        </Badge>
      )
    }
    
    // 🔧 推測排除: 商品タイプが不明な場合
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-300">
        ⚠️ 未設定
      </Badge>
    )
  }

  // 🔧 コンディションバッジ（推測排除）
  const getConditionBadge = () => {
    const condition = product.condition_name
    
    if (!condition) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-300 text-xs">
          状態: 未設定
        </Badge>
      )
    }
    
    return (
      <Badge variant="secondary" className="text-xs">
        {condition}
      </Badge>
    )
  }

  const getStockBadge = () => {
    const qty = product.physical_quantity || 0
    if (qty === 0) {
      return <Badge variant="destructive">在庫なし</Badge>
    } else if (qty < 5) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        少量 ({qty})
      </Badge>
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        在庫 {qty}
      </Badge>
    }
  }

  const getProfitMarginBadge = () => {
    if (!product.date_acquired) return null

    let colorClass = 'bg-green-50 text-green-700 border-green-200'
    if (profitMargin < 5) {
      colorClass = 'bg-red-50 text-red-700 border-red-200'
    } else if (profitMargin < 10) {
      colorClass = 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }

    return (
      <Badge variant="outline" className={colorClass}>
        利益率 {profitMargin.toFixed(1)}%
      </Badge>
    )
  }

  const getInventoryTypeBadge = () => {
    if (!product.inventory_type) return null

    const isRotation = product.inventory_type === 'ROTATION_90_DAYS'
    return (
      <Badge variant="outline" className={isRotation ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'}>
        {isRotation ? '⚡ 回転商品' : '💎 投資商品'}
      </Badge>
    )
  }

  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : '/placeholder-product.jpg'

  // eBayリンク
  const ebayItemId = sourceData.ebay_item_id
  const ebayUrl = ebayItemId ? `https://www.ebay.com/itm/${ebayItemId}` : null
  // P0-3/P0-9: Seller Hub編集ページリンク
  const sellerHubUrl = ebayItemId ? `https://www.ebay.com/sh/lst/active?q=${ebayItemId}` : null

  return (
    <div
      className={`
        group relative bg-white rounded-xl overflow-hidden
        transition-all duration-300 ease-out cursor-pointer
        shadow-sm hover:shadow-xl border
        hover:-translate-y-1 hover:border-indigo-300
        ${isSelected
          ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-lg'
          : 'border-slate-200'
        }
      `}
      onClick={(e) => {
        // ボタンクリック時はカード全体のクリックを無効化
        if ((e.target as HTMLElement).closest('button')) return
        // 🆕 カードクリックで選択トグル
        if (onSelect) {
          onSelect()
        } else if (onCardClick) {
          onCardClick()
        }
      }}
    >
      {/* 画像 */}
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.product_name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image'
          }}
        />
        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* 上部：マーケットプレイス＋フェーズバッジ */}
        <div className="absolute top-2 left-2 right-2 flex gap-1 flex-wrap">
          {getMarketplaceBadge()}
          {product.date_acquired && (
            <Badge variant="outline" className={`${phaseColors.bg} ${phaseColors.text} ${phaseColors.border}`}>
              {getPhaseName(currentPhase)}
            </Badge>
          )}
        </div>

        {/* 下部：在庫バッジ */}
        <div className="absolute bottom-2 right-2">
          {getStockBadge()}
        </div>

        {/* 🆕 経過日数バッジ（左下） */}
        {product.date_acquired && (
          <div className="absolute bottom-2 left-2 flex flex-col gap-1">
            <Badge variant="outline" className="bg-slate-900/70 text-white border-slate-700 backdrop-blur-sm">
              <Clock className="w-3 h-3 mr-1" />
              {daysHeld}日経過
            </Badge>
            {remainingDays > 0 && remainingDays < 90 && (
              <Badge variant="outline" className="bg-orange-900/70 text-white border-orange-700 backdrop-blur-sm">
                残り{remainingDays}日
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* 商品情報 */}
      <div className="p-4 space-y-3">
        {/* タイトル */}
        <h3 className="font-medium text-sm text-slate-800 line-clamp-2 min-h-[2.5rem]">
          {product.product_name}
        </h3>

        {/* SKU */}
        {product.sku && (
          <div className="text-xs text-muted-foreground font-mono">
            SKU: {product.sku}
          </div>
        )}

        {/* 価格情報 - P0-11: マーケットプレイスに応じた通貨表示 */}
        <div className="bg-slate-50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">販売価格</span>
            <span className={`font-bold ${product.marketplace === 'mercari' ? 'text-red-600' : 'text-indigo-600'}`}>
              {formatPrice(product.selling_price)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">出品数</span>
            <span className="font-bold text-slate-800">
              {product.listing_quantity || 0}
            </span>
          </div>
        </div>

        {/* バッジ */}
        <div className="flex flex-wrap gap-1">
          {/* P1-4: 商品状態を常に表示（null時は"状態不明"） */}
          <Badge
            variant="secondary"
            className={`text-xs ${
              !product.condition_name
                ? 'bg-slate-100 text-slate-500'
                : product.condition_name.toLowerCase() === 'new'
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {product.condition_name || '状態不明'}
          </Badge>
          {product.ebay_data?.listing_id && (
            <Badge variant="outline" className="text-xs">
              出品中
            </Badge>
          )}
          {getProfitMarginBadge()}
          {getInventoryTypeBadge()}
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2 pt-3 border-t border-slate-100 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="flex-1 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
          >
            <Edit className="w-3 h-3 mr-1" />
            詳細
          </Button>
          {/* P0-3/P0-9: Seller Hubリンクを優先表示 */}
          {sellerHubUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                window.open(sellerHubUrl, '_blank')
              }}
              title="Seller Hubで編集"
              className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
            >
              <Settings className="w-3 h-3" />
            </Button>
          )}
          {ebayUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                window.open(ebayUrl, '_blank')
              }}
              title="eBayで開く"
              className="hover:bg-slate-100"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
