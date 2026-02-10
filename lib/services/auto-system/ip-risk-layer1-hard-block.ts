/**
 * ============================================================
 * N3 IP Risk Engine - Layer1: Hard Block (ルールベース)
 * ============================================================
 * 
 * 指示書②準拠:
 * - VERO ブランドマッチ
 * - 輸出禁止リスト
 * - HSコード禁止
 * - バッテリー制限
 * - 医療/無線
 * 
 * 即Reject条件:
 * if vero_brand_match or export_ban or category_ban:
 *     reject
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export interface HardBlockCheckResult {
  blocked: boolean;
  blockReasons: string[];
  details: {
    vero_brand_match: boolean;
    vero_brand_name?: string;
    export_ban: boolean;
    export_ban_reason?: string;
    category_ban: boolean;
    category_ban_reason?: string;
    hs_code_ban: boolean;
    hs_code?: string;
  };
}

export interface ProductForCheck {
  title?: string;
  brand?: string;
  category_id?: string;
  category_name?: string;
  hs_code?: string;
  keywords?: string[];
  destination_country?: string;
}

export class IPRiskHardBlockService {
  private supabase;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  /**
   * Hard Block チェック（全レイヤー統合）
   * 指示書: if vero_brand_match or export_ban or category_ban: reject
   */
  async checkHardBlock(product: ProductForCheck): Promise<HardBlockCheckResult> {
    const result: HardBlockCheckResult = {
      blocked: false,
      blockReasons: [],
      details: {
        vero_brand_match: false,
        export_ban: false,
        category_ban: false,
        hs_code_ban: false,
      },
    };

    // 並列実行で高速化
    const [veroResult, exportResult, categoryResult, hsCodeResult] = await Promise.all([
      this.checkVEROBrand(product),
      this.checkExportBan(product),
      this.checkCategoryBan(product),
      this.checkHSCodeBan(product),
    ]);

    // VERO Brand Check
    if (veroResult.matched) {
      result.blocked = true;
      result.details.vero_brand_match = true;
      result.details.vero_brand_name = veroResult.brandName;
      result.blockReasons.push(`VERO Brand Match: ${veroResult.brandName}`);
    }

    // Export Ban Check
    if (exportResult.banned) {
      result.blocked = true;
      result.details.export_ban = true;
      result.details.export_ban_reason = exportResult.reason;
      result.blockReasons.push(`Export Ban: ${exportResult.reason}`);
    }

    // Category Ban Check
    if (categoryResult.banned) {
      result.blocked = true;
      result.details.category_ban = true;
      result.details.category_ban_reason = categoryResult.reason;
      result.blockReasons.push(`Category Ban: ${categoryResult.reason}`);
    }

    // HS Code Ban Check
    if (hsCodeResult.banned) {
      result.blocked = true;
      result.details.hs_code_ban = true;
      result.details.hs_code = hsCodeResult.hsCode;
      result.blockReasons.push(`HS Code Ban: ${hsCodeResult.hsCode}`);
    }

    return result;
  }

  /**
   * VERO Brand チェック
   * タイトル・ブランド名からVEROリストとマッチング
   */
  async checkVEROBrand(product: ProductForCheck): Promise<{ matched: boolean; brandName?: string }> {
    const { data: veroBrands, error } = await this.supabase
      .from('vero_brands')
      .select('brand_name, brand_aliases')
      .eq('is_active', true);

    if (error || !veroBrands) {
      console.error('VERO brands fetch error:', error);
      return { matched: false };
    }

    const searchText = [
      product.title || '',
      product.brand || '',
      ...(product.keywords || []),
    ].join(' ').toLowerCase();

    for (const vero of veroBrands) {
      // メインブランド名チェック
      if (searchText.includes(vero.brand_name.toLowerCase())) {
        return { matched: true, brandName: vero.brand_name };
      }

      // エイリアスチェック
      if (vero.brand_aliases) {
        for (const alias of vero.brand_aliases) {
          if (searchText.includes(alias.toLowerCase())) {
            return { matched: true, brandName: vero.brand_name };
          }
        }
      }
    }

    return { matched: false };
  }

  /**
   * 輸出禁止チェック
   */
  async checkExportBan(product: ProductForCheck): Promise<{ banned: boolean; reason?: string }> {
    const { data: exportBans, error } = await this.supabase
      .from('export_bans')
      .select('*')
      .eq('is_active', true);

    if (error || !exportBans) {
      console.error('Export bans fetch error:', error);
      return { banned: false };
    }

    const searchText = [
      product.title || '',
      product.category_name || '',
      ...(product.keywords || []),
    ].join(' ').toLowerCase();

    for (const ban of exportBans) {
      // 対象国フィルター
      if (ban.destination_countries && ban.destination_countries.length > 0) {
        if (!product.destination_country || !ban.destination_countries.includes(product.destination_country)) {
          continue;
        }
      }

      switch (ban.item_type) {
        case 'keyword':
          if (searchText.includes(ban.item_value.toLowerCase())) {
            return { banned: true, reason: ban.ban_reason || `Keyword match: ${ban.item_value}` };
          }
          break;
        case 'hs_code':
          if (product.hs_code && product.hs_code.startsWith(ban.item_value)) {
            return { banned: true, reason: ban.ban_reason || `HS Code: ${ban.item_value}` };
          }
          break;
        case 'category':
          if (product.category_id === ban.item_value) {
            return { banned: true, reason: ban.ban_reason || `Category: ${ban.item_value}` };
          }
          break;
      }
    }

    return { banned: false };
  }

  /**
   * カテゴリ禁止チェック
   * バッテリー/医療/無線等
   */
  async checkCategoryBan(product: ProductForCheck): Promise<{ banned: boolean; reason?: string }> {
    if (!product.category_id) {
      return { banned: false };
    }

    const { data: categoryBans, error } = await this.supabase
      .from('category_bans')
      .select('*')
      .eq('category_id', product.category_id)
      .eq('is_active', true)
      .single();

    if (error || !categoryBans) {
      return { banned: false };
    }

    return {
      banned: true,
      reason: categoryBans.ban_reason || `Banned category: ${categoryBans.category_name}`,
    };
  }

  /**
   * HSコード禁止チェック
   */
  async checkHSCodeBan(product: ProductForCheck): Promise<{ banned: boolean; hsCode?: string }> {
    if (!product.hs_code) {
      return { banned: false };
    }

    const { data: exportBans, error } = await this.supabase
      .from('export_bans')
      .select('item_value')
      .eq('item_type', 'hs_code')
      .eq('is_active', true);

    if (error || !exportBans) {
      return { banned: false };
    }

    for (const ban of exportBans) {
      if (product.hs_code.startsWith(ban.item_value)) {
        return { banned: true, hsCode: ban.item_value };
      }
    }

    return { banned: false };
  }

  /**
   * バッチチェック（複数商品を一括処理）
   */
  async checkHardBlockBatch(products: ProductForCheck[]): Promise<Map<number, HardBlockCheckResult>> {
    const results = new Map<number, HardBlockCheckResult>();

    // VEROブランドを事前にキャッシュ
    const { data: veroBrands } = await this.supabase
      .from('vero_brands')
      .select('brand_name, brand_aliases')
      .eq('is_active', true);

    const { data: exportBans } = await this.supabase
      .from('export_bans')
      .select('*')
      .eq('is_active', true);

    const { data: categoryBans } = await this.supabase
      .from('category_bans')
      .select('*')
      .eq('is_active', true);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const result = await this.checkHardBlockWithCache(
        product,
        veroBrands || [],
        exportBans || [],
        categoryBans || []
      );
      results.set(i, result);
    }

    return results;
  }

  /**
   * キャッシュ使用版チェック
   */
  private async checkHardBlockWithCache(
    product: ProductForCheck,
    veroBrands: any[],
    exportBans: any[],
    categoryBans: any[]
  ): Promise<HardBlockCheckResult> {
    const result: HardBlockCheckResult = {
      blocked: false,
      blockReasons: [],
      details: {
        vero_brand_match: false,
        export_ban: false,
        category_ban: false,
        hs_code_ban: false,
      },
    };

    const searchText = [
      product.title || '',
      product.brand || '',
      ...(product.keywords || []),
    ].join(' ').toLowerCase();

    // VERO Check
    for (const vero of veroBrands) {
      if (searchText.includes(vero.brand_name.toLowerCase())) {
        result.blocked = true;
        result.details.vero_brand_match = true;
        result.details.vero_brand_name = vero.brand_name;
        result.blockReasons.push(`VERO Brand Match: ${vero.brand_name}`);
        break;
      }
      if (vero.brand_aliases) {
        for (const alias of vero.brand_aliases) {
          if (searchText.includes(alias.toLowerCase())) {
            result.blocked = true;
            result.details.vero_brand_match = true;
            result.details.vero_brand_name = vero.brand_name;
            result.blockReasons.push(`VERO Brand Match: ${vero.brand_name}`);
            break;
          }
        }
      }
    }

    // Export Ban Check
    for (const ban of exportBans) {
      if (ban.item_type === 'keyword' && searchText.includes(ban.item_value.toLowerCase())) {
        result.blocked = true;
        result.details.export_ban = true;
        result.details.export_ban_reason = ban.ban_reason;
        result.blockReasons.push(`Export Ban: ${ban.ban_reason || ban.item_value}`);
        break;
      }
      if (ban.item_type === 'hs_code' && product.hs_code?.startsWith(ban.item_value)) {
        result.blocked = true;
        result.details.hs_code_ban = true;
        result.details.hs_code = ban.item_value;
        result.blockReasons.push(`HS Code Ban: ${ban.item_value}`);
        break;
      }
    }

    // Category Ban Check
    if (product.category_id) {
      const categoryBan = categoryBans.find(cb => cb.category_id === product.category_id);
      if (categoryBan) {
        result.blocked = true;
        result.details.category_ban = true;
        result.details.category_ban_reason = categoryBan.ban_reason;
        result.blockReasons.push(`Category Ban: ${categoryBan.ban_reason}`);
      }
    }

    return result;
  }
}

export const ipRiskHardBlockService = new IPRiskHardBlockService();
