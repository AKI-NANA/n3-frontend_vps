/**
 * ====================================================================
 * N3 在庫監視システム - 高速バッチスクレイピングエンジン
 * ====================================================================
 * ブラウザインスタンスの再利用と並列処理により、実行速度を劇的に向上。
 * VPS (Ubuntu 24) 環境に最適化されています。
 * ====================================================================
 */

import puppeteer, { Browser, Page } from 'puppeteer'

export interface ScrapingTask {
  id: string | number
  url: string
  marketplace?: 'yahoo_auctions' | 'mercari' | 'rakuma' | string
}

export interface BatchScrapingResult {
  productId: string | number
  success: boolean
  price?: number
  stock?: number
  isAvailable: boolean
  status?: 'active' | 'ended' | 'deleted' | 'not_found'
  title?: string
  condition?: string
  error?: string
  timestamp: string
  scrapedAt: string
}

export interface BatchScrapingStats {
  total: number
  success: number
  failed: number
  changesDetected: number
  durationMs: number
  averagePerItem: number
}

/**
 * 高速バッチスクレイピングエンジン
 */
export class BatchScraper {
  private browser: Browser | null = null
  private isInitialized = false
  
  // 設定
  private config = {
    concurrency: 3,           // 並列実行数
    timeout: 30000,           // ページタイムアウト（30秒）
    delayMin: 1000,           // 最小遅延
    delayMax: 3000,           // 最大遅延
    maxRetries: 2,            // リトライ回数
    blockResources: true,     // 画像等のブロック
  }

  constructor(config?: Partial<typeof BatchScraper.prototype.config>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  /**
   * ブラウザを初期化（VPS/Ubuntu環境に最適化）
   */
  async init(): Promise<void> {
    if (this.isInitialized && this.browser) {
      return
    }

    console.log('🚀 バッチスクレイピングエンジン初期化中...')

    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
        '--single-process',              // メモリ節約
        '--no-zygote',                   // メモリ節約
        '--disable-extensions',          // 拡張機能無効
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-first-run',
      ],
      // VPS環境では executablePath を指定することも可能
      // executablePath: '/usr/bin/chromium-browser',
    })

    this.isInitialized = true
    console.log('✅ ブラウザ初期化完了')
  }

  /**
   * 単一ページのスクレイピング（Yahoo!オークション）
   */
  private async scrapeYahooAuctions(
    page: Page,
    task: ScrapingTask
  ): Promise<BatchScrapingResult> {
    const timestamp = new Date().toISOString()

    try {
      // リソースブロック（高速化）
      if (this.config.blockResources) {
        await page.setRequestInterception(true)
        page.removeAllListeners('request') // 既存リスナーをクリア
        page.on('request', (req) => {
          const resourceType = req.resourceType()
          if (['image', 'font', 'stylesheet', 'media'].includes(resourceType)) {
            req.abort()
          } else {
            req.continue()
          }
        })
      }

      // ユーザーエージェント設定
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )

      // ページ読み込み
      const response = await page.goto(task.url, {
        waitUntil: 'domcontentloaded',
        timeout: this.config.timeout,
      })

      // 404チェック
      if (!response || response.status() === 404) {
        return {
          productId: task.id,
          success: true,
          isAvailable: false,
          status: 'not_found',
          timestamp,
          scrapedAt: new Date().toISOString(),
        }
      }

      // データ抽出
      const data = await page.evaluate(() => {
        // ========================================
        // オークション終了チェック
        // ========================================
        const closedHeader = document.querySelector('.ClosedHeader__tag')
        const closedMessage = document.querySelector('.Notice__inner')
        const isEnded = !!(
          closedHeader || 
          (closedMessage && closedMessage.textContent?.includes('終了')) ||
          document.body.textContent?.includes('このオークションは終了しています')
        )

        if (isEnded) {
          return { isEnded: true, price: 0, stock: 0 }
        }

        // ========================================
        // 価格取得
        // ========================================
        let price = 0

        // 新デザイン対応
        const priceValueNew = document.querySelector('.Price__value')
        const priceValueCurrent = document.querySelector('.Price__value--current')
        
        // 旧デザイン対応
        const dtElements = Array.from(document.querySelectorAll('dt'))
        
        // 1. 即決価格を優先
        if (priceValueNew) {
          const priceText = priceValueNew.textContent || ''
          price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0
        }
        
        if (price === 0) {
          const sokketsuDt = dtElements.find(dt => dt.textContent?.includes('即決'))
          if (sokketsuDt) {
            const dd = sokketsuDt.nextElementSibling
            const priceText = dd?.textContent || ''
            price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0
          }
        }

        // 2. 現在価格
        if (price === 0 && priceValueCurrent) {
          const priceText = priceValueCurrent.textContent || ''
          price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0
        }

        if (price === 0) {
          const genzaiDt = dtElements.find(dt => dt.textContent?.includes('現在'))
          if (genzaiDt) {
            const dd = genzaiDt.nextElementSibling
            const priceText = dd?.textContent || ''
            price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0
          }
        }

        // ========================================
        // タイトル取得
        // ========================================
        const titleElement = document.querySelector('h1.ProductTitle__text') ||
                            document.querySelector('.ProductTitle__text') ||
                            document.querySelector('h1')
        const title = titleElement?.textContent?.trim() || ''

        // ========================================
        // 状態取得
        // ========================================
        let condition = ''
        const conditionSvg = document.querySelector('svg[aria-label="状態"]')
        if (conditionSvg) {
          const parentLi = conditionSvg.closest('li')
          const conditionSpan = parentLi?.querySelector('span:not(:has(svg))')
          condition = conditionSpan?.textContent?.trim() || ''
        }

        return {
          isEnded: false,
          price,
          stock: 1, // Yahoo!オークションは基本1点
          title,
          condition,
        }
      })

      if (data.isEnded) {
        return {
          productId: task.id,
          success: true,
          isAvailable: false,
          status: 'ended',
          price: 0,
          stock: 0,
          timestamp,
          scrapedAt: new Date().toISOString(),
        }
      }

      return {
        productId: task.id,
        success: true,
        price: data.price,
        stock: data.stock,
        isAvailable: true,
        status: 'active',
        title: data.title,
        condition: data.condition,
        timestamp,
        scrapedAt: new Date().toISOString(),
      }

    } catch (error: any) {
      return {
        productId: task.id,
        success: false,
        isAvailable: false,
        status: 'not_found',
        error: error.message || 'スクレイピングエラー',
        timestamp,
        scrapedAt: new Date().toISOString(),
      }
    }
  }

  /**
   * リトライ付きスクレイピング
   */
  private async scrapeWithRetry(
    page: Page,
    task: ScrapingTask
  ): Promise<BatchScrapingResult> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`  🔄 リトライ ${attempt}/${this.config.maxRetries}: ${task.id}`)
          await this.sleep(1000 * attempt) // 指数バックオフ
        }

        // マーケットプレイス別に分岐
        const marketplace = task.marketplace || 'yahoo_auctions'
        
        switch (marketplace) {
          case 'yahoo_auctions':
          default:
            return await this.scrapeYahooAuctions(page, task)
          // 将来的にメルカリ等を追加
          // case 'mercari':
          //   return await this.scrapeMercari(page, task)
        }
      } catch (error: any) {
        lastError = error
        console.error(`  ❌ エラー (attempt ${attempt + 1}):`, error.message)
      }
    }

    return {
      productId: task.id,
      success: false,
      isAvailable: false,
      error: lastError?.message || 'Max retries exceeded',
      timestamp: new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
    }
  }

  /**
   * 指定されたタスクリストを並列に実行
   */
  async execute(
    tasks: ScrapingTask[],
    options?: {
      concurrency?: number
      onProgress?: (current: number, total: number, result: BatchScrapingResult) => void
    }
  ): Promise<{ results: BatchScrapingResult[]; stats: BatchScrapingStats }> {
    const startTime = Date.now()
    const concurrency = options?.concurrency ?? this.config.concurrency

    await this.init()

    const results: BatchScrapingResult[] = []
    let successCount = 0
    let changesDetected = 0

    console.log(`📊 バッチスクレイピング開始: ${tasks.length}件 (並列数: ${concurrency})`)

    // 並列実行制御（concurrency個ずつ処理）
    for (let i = 0; i < tasks.length; i += concurrency) {
      const chunk = tasks.slice(i, i + concurrency)
      
      const promises = chunk.map(async (task, chunkIndex) => {
        const page = await this.browser!.newPage()
        
        try {
          const result = await this.scrapeWithRetry(page, task)
          
          if (result.success) {
            successCount++
          }

          // 進捗コールバック
          if (options?.onProgress) {
            options.onProgress(i + chunkIndex + 1, tasks.length, result)
          }

          return result
        } finally {
          await page.close()
        }
      })

      const chunkResults = await Promise.all(promises)
      results.push(...chunkResults)

      // レート制限回避のためのランダムな遅延
      if (i + concurrency < tasks.length) {
        const delay = this.randomInt(this.config.delayMin, this.config.delayMax)
        console.log(`  ⏳ 待機: ${delay}ms`)
        await this.sleep(delay)
      }
    }

    const durationMs = Date.now() - startTime

    const stats: BatchScrapingStats = {
      total: tasks.length,
      success: successCount,
      failed: tasks.length - successCount,
      changesDetected,
      durationMs,
      averagePerItem: tasks.length > 0 ? Math.round(durationMs / tasks.length) : 0,
    }

    console.log(`✅ バッチスクレイピング完了`)
    console.log(`   成功: ${stats.success}/${stats.total}`)
    console.log(`   所要時間: ${Math.round(durationMs / 1000)}秒`)
    console.log(`   平均: ${stats.averagePerItem}ms/件`)

    return { results, stats }
  }

  /**
   * ブラウザを終了
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      this.isInitialized = false
      console.log('🔒 ブラウザ終了')
    }
  }

  /**
   * スリープ
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * ランダム整数
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

/**
 * シングルトンインスタンス（省メモリ）
 */
let scraperInstance: BatchScraper | null = null

export function getBatchScraper(config?: ConstructorParameters<typeof BatchScraper>[0]): BatchScraper {
  if (!scraperInstance) {
    scraperInstance = new BatchScraper(config)
  }
  return scraperInstance
}

export async function closeBatchScraper(): Promise<void> {
  if (scraperInstance) {
    await scraperInstance.close()
    scraperInstance = null
  }
}

/**
 * 簡易実行関数
 */
export async function executeProductScraping(options: {
  url: string
  marketplace?: string
  extract_price?: boolean
  extract_stock?: boolean
  check_page_exists?: boolean
}): Promise<{
  success: boolean
  page_exists: boolean
  price?: number
  stock?: number
  condition?: string
  error?: string
}> {
  const scraper = getBatchScraper()
  
  try {
    const { results } = await scraper.execute([
      {
        id: 'single',
        url: options.url,
        marketplace: options.marketplace as any,
      },
    ])

    const result = results[0]
    
    return {
      success: result.success,
      page_exists: result.isAvailable,
      price: result.price,
      stock: result.stock,
      condition: result.condition,
      error: result.error,
    }
  } catch (error: any) {
    return {
      success: false,
      page_exists: false,
      error: error.message,
    }
  }
  // 注意: シングルトンなのでcloseしない
}
