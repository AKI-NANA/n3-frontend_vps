// N3 Puppeteer PDF/PNG マイクロサービス
// VPS上で動作する無料のHTML→PDF/PNG変換サービス
// 
// 使用方法:
// 1. npm install puppeteer express
// 2. node puppeteer-service.js
// 3. POST http://localhost:3200/render でPDF/PNG生成

const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json({ limit: '50mb' }));

// 出力ディレクトリ
const OUTPUT_DIR = '/tmp/rendered';
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ブラウザインスタンス（再利用）
let browser = null;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=none'
      ]
    });
  }
  return browser;
}

// ============================================================================
// メインエンドポイント: HTML → PDF/PNG
// ============================================================================
app.post('/render', async (req, res) => {
  const {
    html,
    format = 'png',      // 'png', 'pdf', 'jpg', 'webp'
    width = 1920,
    height = 1080,
    quality = 90,
    fullPage = false,
    // PDF専用オプション
    pdfFormat = 'A4',    // 'A4', 'A5', 'Letter', 'Legal'
    landscape = false,
    printBackground = true
  } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'html is required' });
  }

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    // ビューポート設定
    await page.setViewport({ width: parseInt(width), height: parseInt(height) });

    // HTML読み込み
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

    // フォント読み込み待機
    await page.evaluateHandle('document.fonts.ready');

    const timestamp = Date.now();
    const filename = `render_${timestamp}.${format === 'pdf' ? 'pdf' : format}`;
    const filepath = path.join(OUTPUT_DIR, filename);

    let buffer;

    if (format === 'pdf') {
      // PDF生成（YouTube用スライドショー対応）
      buffer = await page.pdf({
        path: filepath,
        format: pdfFormat,
        landscape: landscape,
        printBackground: printBackground,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        preferCSSPageSize: true
      });
    } else {
      // 画像生成（PNG/JPG/WebP）
      const screenshotOptions = {
        path: filepath,
        type: format === 'jpg' ? 'jpeg' : format,
        fullPage: fullPage
      };

      if (format !== 'png') {
        screenshotOptions.quality = parseInt(quality);
      }

      buffer = await page.screenshot(screenshotOptions);
    }

    await page.close();

    // バイナリで返す
    const contentType = format === 'pdf' ? 'application/pdf' : 
                        format === 'png' ? 'image/png' :
                        format === 'jpg' ? 'image/jpeg' : 'image/webp';

    res.set({
      'Content-Type': contentType,
      'Content-Length': buffer.length,
      'X-Filename': filename
    });

    res.send(buffer);

  } catch (error) {
    console.error('Render error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// YouTube用スライドショーPDF生成
// 複数スライドを1つのPDFに統合
// ============================================================================
app.post('/render-slideshow', async (req, res) => {
  const {
    slides,              // [{html: '...', duration?: 5}, ...]
    width = 1920,
    height = 1080,
    format = 'pdf'       // 'pdf' or 'images' (ZIPで返す)
  } = req.body;

  if (!slides || !Array.isArray(slides) || slides.length === 0) {
    return res.status(400).json({ error: 'slides array is required' });
  }

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: parseInt(width), height: parseInt(height) });

    const timestamp = Date.now();

    if (format === 'pdf') {
      // 全スライドを1つのHTMLに統合（CSS Page Break使用）
      const combinedHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @page { size: ${width}px ${height}px; margin: 0; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: ${width}px; }
            .slide { 
              width: ${width}px; 
              height: ${height}px; 
              page-break-after: always;
              overflow: hidden;
            }
            .slide:last-child { page-break-after: avoid; }
          </style>
        </head>
        <body>
          ${slides.map((s, i) => `<div class="slide" data-index="${i}">${s.html}</div>`).join('')}
        </body>
        </html>
      `;

      await page.setContent(combinedHtml, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.evaluateHandle('document.fonts.ready');

      const filename = `slideshow_${timestamp}.pdf`;
      const filepath = path.join(OUTPUT_DIR, filename);

      const buffer = await page.pdf({
        path: filepath,
        width: `${width}px`,
        height: `${height}px`,
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
      });

      await page.close();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length,
        'X-Filename': filename,
        'X-Slide-Count': slides.length
      });

      res.send(buffer);

    } else {
      // 個別画像として返す（JSON配列）
      const images = [];

      for (let i = 0; i < slides.length; i++) {
        await page.setContent(slides[i].html, { waitUntil: 'networkidle0' });
        await page.evaluateHandle('document.fonts.ready');
        
        const buffer = await page.screenshot({ type: 'png' });
        images.push({
          index: i,
          duration: slides[i].duration || 5,
          data: buffer.toString('base64')
        });
      }

      await page.close();

      res.json({
        success: true,
        count: images.length,
        images: images
      });
    }

  } catch (error) {
    console.error('Slideshow render error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// ヘルスチェック
// ============================================================================
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'N3 Puppeteer Renderer',
    browserActive: !!browser
  });
});

// ============================================================================
// サーバー起動
// ============================================================================
const PORT = process.env.PORT || 3200;

app.listen(PORT, () => {
  console.log(`🖼️  N3 Puppeteer Renderer running on port ${PORT}`);
  console.log(`   POST /render          - HTML → PNG/PDF/JPG`);
  console.log(`   POST /render-slideshow - 複数スライド → PDF`);
  console.log(`   GET  /health          - ヘルスチェック`);
});

// 終了時にブラウザをクリーンアップ
process.on('SIGINT', async () => {
  if (browser) await browser.close();
  process.exit();
});
