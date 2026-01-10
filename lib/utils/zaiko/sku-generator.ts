import { v4 as uuidv4 } from "uuid"

/**
 * SKU生成関数（無在庫用）
 * フォーマット: INV-[DATE]-[RANDOM]
 * 例: INV-20251110-A1B2C3
 */
export function generateSKU(): string {
  const prefix = "INV"
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const random = uuidv4().slice(0, 6).toUpperCase()

  return `${prefix}-${date}-${random}`
}

/**
 * 有在庫用SKU生成関数
 * フォーマット: STOCK-[DATE]-[RANDOM]
 * 例: STOCK-20251110-A1B2C3
 */
export function generateStockSKU(): string {
  const prefix = "STOCK"
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const random = uuidv4().slice(0, 6).toUpperCase()

  return `${prefix}-${date}-${random}`
}

/**
 * 在庫タイプを指定してSKU生成
 * @param inventoryType 'stock' | 'mu' (無在庫)
 */
export function generateSKUByType(inventoryType: 'stock' | 'mu' = 'mu'): string {
  const prefix = inventoryType === 'stock' ? 'STOCK' : 'INV'
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const random = uuidv4().slice(0, 6).toUpperCase()

  return `${prefix}-${date}-${random}`
}

/**
 * SKUから在庫タイプを判定
 */
export function getInventoryTypeFromSKU(sku: string): 'stock' | 'mu' {
  if (!sku) return 'mu'
  const skuLower = sku.toLowerCase()
  if (skuLower.startsWith('stock')) return 'stock'
  return 'mu'
}

/**
 * 親SKUと子SKUの関連付け
 */
export function generateVariationSKU(parentSKU: string, index: number): string {
  return `${parentSKU}-V${String(index).padStart(2, "0")}`
}
