/**
 * NAGANO-3 B2B Partnership - 企業リサーチャー
 *
 * 目的: 企業のウェブサイトから情報を自動収集し、親和性スコアを計算
 */

import type { CompanyResearchData } from '@/types/b2b-partnership';

/**
 * 企業情報をリサーチ
 *
 * TODO: 実際のスクレイピング実装
 * - Puppeteerを使用してウェブサイトをクロール
 * - 会社概要、事業内容、ニュース等を抽出
 * - コンタクト情報を収集
 */
export async function researchCompany(
  companyUrl: string,
  options?: {
    deep_research?: boolean; // 深堀りリサーチ（複数ページをクロール）
    extract_contacts?: boolean; // コンタクト情報を抽出
    analyze_campaigns?: boolean; // 最近のキャンペーンを分析
  }
): Promise<CompanyResearchData> {
  console.log(`[B2B] Researching company: ${companyUrl}`);

  try {
    // URLを正規化
    const normalizedUrl = normalizeUrl(companyUrl);

    // 基本情報をスクレイピング
    const basicInfo = await scrapeBasicInfo(normalizedUrl);

    // コンタクト情報を抽出（オプション）
    let contactInfo;
    if (options?.extract_contacts) {
      contactInfo = await extractContactInfo(normalizedUrl);
    }

    // SNS情報を抽出
    const socialMedia = await extractSocialMedia(normalizedUrl);

    // 最近のキャンペーン情報を分析（オプション）
    let recentCampaigns;
    if (options?.analyze_campaigns) {
      recentCampaigns = await analyzeCampaigns(normalizedUrl);
    }

    const researchData: CompanyResearchData = {
      company_name: basicInfo.name,
      company_url: normalizedUrl,
      industry: basicInfo.industry || '不明',
      size: basicInfo.size || 'unknown',
      description: basicInfo.description || '',
      recent_campaigns: recentCampaigns,
      contact_info: contactInfo,
      social_media: socialMedia,
    };

    console.log(`[B2B] Research completed for ${basicInfo.name}`);

    return researchData;
  } catch (error) {
    console.error(`[B2B] Error researching company:`, error);
    throw error;
  }
}

/**
 * 企業とペルソナの親和性スコアを計算
 */
export function calculateAffinityScore(
  companyData: CompanyResearchData,
  personaData: {
    expertise_areas?: string[];
    category?: string;
    target_audience?: string;
  }
): number {
  let score = 0;

  // 業種の一致（最大30点）
  if (personaData.category && companyData.industry) {
    if (isIndustryMatch(personaData.category, companyData.industry)) {
      score += 30;
    } else if (isIndustryRelated(personaData.category, companyData.industry)) {
      score += 15;
    }
  }

  // 専門分野の一致（最大40点）
  if (personaData.expertise_areas && personaData.expertise_areas.length > 0) {
    const description = companyData.description.toLowerCase();
    const matchedAreas = personaData.expertise_areas.filter((area) =>
      description.includes(area.toLowerCase())
    );

    score += Math.min(40, matchedAreas.length * 10);
  }

  // 企業規模（最大15点）
  if (companyData.size) {
    switch (companyData.size) {
      case 'enterprise':
        score += 15; // 大企業は予算が多い
        break;
      case 'sme':
        score += 10; // 中小企業は柔軟性がある
        break;
      case 'startup':
        score += 5; // スタートアップは予算が限られる
        break;
    }
  }

  // SNS活用度（最大15点）
  if (companyData.social_media) {
    const platformCount = Object.values(companyData.social_media).filter(Boolean).length;
    score += Math.min(15, platformCount * 3);
  }

  return Math.min(100, score);
}

// ================================================================
// スクレイピング関数（TODO: 実装）
// ================================================================

/**
 * 基本情報をスクレイピング（Puppeteer使用）
 */
async function scrapeBasicInfo(url: string): Promise<{
  name: string;
  industry?: string;
  size?: string;
  description?: string;
}> {
  // Puppeteerが利用可能かチェック
  const puppeteerAvailable = process.env.PUPPETEER_ENABLED === 'true';

  if (!puppeteerAvailable) {
    console.warn('[Scraper] Puppeteer not enabled, using fallback scraping');
    return await scrapeBasicInfoFallback(url);
  }

  try {
    const puppeteer = await import('puppeteer');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // User-Agentを設定（ボット検知を回避）
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // ページ情報を抽出
    const info = await page.evaluate(() => {
      // タイトルから企業名を抽出
      const title =
        document.querySelector('title')?.textContent ||
        document.querySelector('h1')?.textContent ||
        '';

      // メタディスクリプションから説明を抽出
      const metaDescription =
        (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content ||
        (document.querySelector('meta[property="og:description"]') as HTMLMetaElement)
          ?.content ||
        '';

      // 本文から説明を抽出（メタディスクリプションがない場合）
      let description = metaDescription;
      if (!description) {
        const aboutSection =
          document.querySelector('.about')?.textContent ||
          document.querySelector('#about')?.textContent ||
          document.querySelector('main p')?.textContent ||
          '';
        description = aboutSection.substring(0, 300);
      }

      // 会社概要ページへのリンクを探す
      const companyPageLink = Array.from(document.querySelectorAll('a')).find((a) =>
        /会社概要|company|about/i.test(a.textContent || '')
      );

      return {
        title: title.trim(),
        description: description.trim(),
        companyPageUrl: companyPageLink?.href,
      };
    });

    // 会社概要ページがあれば追加情報を取得
    let industry: string | undefined;
    let size: string | undefined;

    if (info.companyPageUrl) {
      try {
        await page.goto(info.companyPageUrl, { waitUntil: 'networkidle0', timeout: 30000 });

        const companyInfo = await page.evaluate(() => {
          const text = document.body.textContent || '';

          // 業種を推測
          let detectedIndustry: string | undefined;
          if (/化粧品|コスメ|美容/.test(text)) {
            detectedIndustry = '化粧品';
          } else if (/IT|ソフトウェア|システム/.test(text)) {
            detectedIndustry = 'IT・ソフトウェア';
          } else if (/食品|飲料/.test(text)) {
            detectedIndustry = '食品';
          } else if (/アパレル|ファッション/.test(text)) {
            detectedIndustry = 'ファッション';
          }

          // 企業規模を推測
          let detectedSize: string | undefined;
          if (/上場|東証/.test(text)) {
            detectedSize = 'enterprise';
          } else if (/従業員.*?(\d+)人/.test(text)) {
            const match = text.match(/従業員.*?(\d+)人/);
            const employeeCount = match ? parseInt(match[1]) : 0;
            if (employeeCount > 1000) {
              detectedSize = 'enterprise';
            } else if (employeeCount > 100) {
              detectedSize = 'sme';
            } else {
              detectedSize = 'startup';
            }
          }

          return {
            industry: detectedIndustry,
            size: detectedSize,
          };
        });

        industry = companyInfo.industry;
        size = companyInfo.size;
      } catch (error) {
        console.warn('[Scraper] Error scraping company page:', error);
      }
    }

    await browser.close();

    return {
      name: info.title || new URL(url).hostname,
      industry,
      size,
      description: info.description,
    };
  } catch (error) {
    console.error('[Scraper] Error with Puppeteer:', error);
    return await scrapeBasicInfoFallback(url);
  }
}

/**
 * フォールバックスクレイピング（Puppeteer不使用）
 */
async function scrapeBasicInfoFallback(url: string): Promise<{
  name: string;
  industry?: string;
  size?: string;
  description?: string;
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const html = await response.text();

    // 簡易HTMLパーサー
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const metaDescMatch = html.match(
      /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i
    );

    const name = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;
    const description = metaDescMatch ? metaDescMatch[1].trim() : '';

    // 業種を推測
    let industry: string | undefined;
    if (/化粧品|コスメ|美容/.test(html)) {
      industry = '化粧品';
    } else if (/IT|ソフトウェア|システム/.test(html)) {
      industry = 'IT・ソフトウェア';
    } else if (/食品|飲料/.test(html)) {
      industry = '食品';
    } else if (/アパレル|ファッション/.test(html)) {
      industry = 'ファッション';
    }

    return {
      name,
      industry,
      size: 'unknown',
      description,
    };
  } catch (error) {
    console.error('[Scraper] Error with fallback scraping:', error);

    // 最終的なフォールバック（ドメイン名から推測）
    const domain = new URL(url).hostname;
    const companyName = domain.split('.')[0];

    return {
      name: companyName.charAt(0).toUpperCase() + companyName.slice(1) + '株式会社',
      industry: '不明',
      size: 'unknown',
      description: '',
    };
  }
}

/**
 * コンタクト情報を抽出（Puppeteer使用）
 */
async function extractContactInfo(url: string): Promise<{
  email?: string;
  phone?: string;
  address?: string;
}> {
  const puppeteerAvailable = process.env.PUPPETEER_ENABLED === 'true';

  if (!puppeteerAvailable) {
    return extractContactInfoFallback(url);
  }

  try {
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // お問い合わせページへのリンクを探す
    const contactPageUrl = await page.evaluate(() => {
      const contactLink = Array.from(document.querySelectorAll('a')).find((a) =>
        /お問い合わせ|contact|問合せ/i.test(a.textContent || '')
      );
      return contactLink?.href;
    });

    // お問い合わせページがあれば移動
    if (contactPageUrl) {
      await page.goto(contactPageUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    }

    // コンタクト情報を抽出
    const contactInfo = await page.evaluate(() => {
      const text = document.body.textContent || '';

      // メールアドレスを抽出
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const email = emailMatch ? emailMatch[0] : undefined;

      // 電話番号を抽出
      const phoneMatch = text.match(/0\d{1,4}-\d{1,4}-\d{4}/);
      const phone = phoneMatch ? phoneMatch[0] : undefined;

      // 住所を抽出
      const addressMatch = text.match(/〒?\d{3}-?\d{4}.*?(都|道|府|県).*?(市|区|町|村)/);
      const address = addressMatch ? addressMatch[0].substring(0, 100) : undefined;

      return { email, phone, address };
    });

    await browser.close();

    return contactInfo;
  } catch (error) {
    console.error('[Scraper] Error extracting contact info:', error);
    return extractContactInfoFallback(url);
  }
}

/**
 * コンタクト情報抽出（フォールバック）
 */
async function extractContactInfoFallback(url: string): Promise<{
  email?: string;
  phone?: string;
  address?: string;
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return {};
    }

    const html = await response.text();

    const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = html.match(/0\d{1,4}-\d{1,4}-\d{4}/);

    return {
      email: emailMatch ? emailMatch[0] : undefined,
      phone: phoneMatch ? phoneMatch[0] : undefined,
    };
  } catch (error) {
    console.error('[Scraper] Error with fallback contact extraction:', error);
    return {};
  }
}

/**
 * SNS情報を抽出（Puppeteer使用）
 */
async function extractSocialMedia(url: string): Promise<{
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}> {
  const puppeteerAvailable = process.env.PUPPETEER_ENABLED === 'true';

  if (!puppeteerAvailable) {
    return extractSocialMediaFallback(url);
  }

  try {
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    const socialLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]'));

      const twitter = links.find((a) => /twitter\.com|x\.com/i.test(a.href))?.href;
      const facebook = links.find((a) => /facebook\.com/i.test(a.href))?.href;
      const instagram = links.find((a) => /instagram\.com/i.test(a.href))?.href;
      const linkedin = links.find((a) => /linkedin\.com/i.test(a.href))?.href;

      return { twitter, facebook, instagram, linkedin };
    });

    await browser.close();

    return socialLinks;
  } catch (error) {
    console.error('[Scraper] Error extracting social media:', error);
    return extractSocialMediaFallback(url);
  }
}

/**
 * SNS情報抽出（フォールバック）
 */
async function extractSocialMediaFallback(url: string): Promise<{
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return {};
    }

    const html = await response.text();

    const twitterMatch = html.match(/https?:\/\/(twitter|x)\.com\/[a-zA-Z0-9_]+/);
    const facebookMatch = html.match(/https?:\/\/facebook\.com\/[a-zA-Z0-9.]+/);
    const instagramMatch = html.match(/https?:\/\/instagram\.com\/[a-zA-Z0-9_.]+/);
    const linkedinMatch = html.match(/https?:\/\/linkedin\.com\/(company|in)\/[a-zA-Z0-9-]+/);

    return {
      twitter: twitterMatch ? twitterMatch[0] : undefined,
      facebook: facebookMatch ? facebookMatch[0] : undefined,
      instagram: instagramMatch ? instagramMatch[0] : undefined,
      linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
    };
  } catch (error) {
    console.error('[Scraper] Error with fallback social media extraction:', error);
    return {};
  }
}

/**
 * 最近のキャンペーン情報を分析
 */
async function analyzeCampaigns(url: string): Promise<string[]> {
  // TODO: Puppeteerで実装
  // - ニュースページやブログをクロール
  // - 「キャンペーン」「プロモーション」等のキーワードで記事を抽出
  // - 直近3ヶ月のキャンペーン情報を収集

  // モックデータ（開発用）
  return [
    '春の新商品キャンペーン（2025年3月）',
    'インフルエンサーコラボ企画（2025年2月）',
    '年末セール（2024年12月）',
  ];
}

// ================================================================
// ヘルパー関数
// ================================================================

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    // プロトコルがない場合は追加
    return `https://${url}`;
  }
}

function isIndustryMatch(category: string, industry: string): boolean {
  const categoryLower = category.toLowerCase();
  const industryLower = industry.toLowerCase();

  const matchMap: { [key: string]: string[] } = {
    美容: ['化粧品', 'コスメ', '美容', 'beauty', 'cosmetics'],
    ファッション: ['アパレル', 'ファッション', 'fashion', 'apparel'],
    食品: ['食品', 'フード', 'food', '飲料', 'beverage'],
    ビジネス: ['it', 'ソフトウェア', 'コンサルティング', 'マーケティング'],
    健康: ['健康', 'ヘルスケア', 'health', 'wellness', 'フィットネス'],
  };

  const keywords = matchMap[category] || [categoryLower];

  return keywords.some((keyword) => industryLower.includes(keyword));
}

function isIndustryRelated(category: string, industry: string): boolean {
  const relatedMap: { [key: string]: string[] } = {
    美容: ['ファッション', 'アパレル', '健康', 'ヘルスケア'],
    ファッション: ['美容', '化粧品', 'ライフスタイル'],
    食品: ['健康', 'フィットネス', 'ライフスタイル'],
    ビジネス: ['マーケティング', 'コンサルティング', 'テクノロジー'],
  };

  const relatedIndustries = relatedMap[category] || [];
  const industryLower = industry.toLowerCase();

  return relatedIndustries.some((related) => industryLower.includes(related.toLowerCase()));
}
