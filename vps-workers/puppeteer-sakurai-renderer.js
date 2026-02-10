// ============================================================================
// N3 Empire OS: Puppeteer マルチレイヤー・レンダラー
// 1つのHTMLから「背景」「図解」「注釈」を個別PNG出力
// ============================================================================

const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json({ limit: '50mb' }));

const OUTPUT_DIR = '/tmp/rendered';
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

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
        '--font-render-hinting=none',
      ],
    });
  }
  return browser;
}

// ============================================================================
// 桜井スタイル CSS テンプレート
// ============================================================================

const SAKURAI_BASE_CSS = `
/* ============================================
   桜井スタイル ベースCSS
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;900&family=Noto+Sans+JP:wght@400;700;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #1a1a2e;
  --secondary: #16213e;
  --accent: #e94560;
  --background: #0f0f23;
  --text: #ffffff;
  --text-highlight: #ffd700;
  --safe-margin: 5%;
}

body {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  font-family: 'Noto Sans JP', sans-serif;
  background: var(--background);
  color: var(--text);
}

/* レイヤーコンテナ */
.layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.layer-background { z-index: 1; }
.layer-visual { z-index: 10; }
.layer-annotation { z-index: 20; }
.layer-overlay { z-index: 30; }

/* 背景レイヤー */
.bg-solid { background: var(--background); }
.bg-gradient-dark {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
}
.bg-gradient-accent {
  background: linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 100%);
}

/* ビジュアルレイヤー */
.visual-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--safe-margin);
}

.visual-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.visual-image.with-frame {
  border: 4px solid var(--accent);
}

/* 図解カード */
.diagram-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
}

/* テキストカード */
.text-card {
  background: linear-gradient(135deg, rgba(233, 69, 96, 0.1) 0%, rgba(26, 26, 46, 0.9) 100%);
  border-left: 4px solid var(--accent);
  border-radius: 0 16px 16px 0;
  padding: 40px;
  max-width: 60%;
}

.text-card-title {
  font-family: 'M PLUS Rounded 1c', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: var(--text-highlight);
  margin-bottom: 20px;
}

.text-card-body {
  font-size: 32px;
  line-height: 1.6;
  color: var(--text);
}

/* 注釈レイヤー */
.caption-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 18%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
  padding: 0 var(--safe-margin);
}

.caption-text {
  font-size: 42px;
  font-weight: 700;
  text-align: center;
  color: var(--text);
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  max-width: 80%;
}

.caption-text .highlight {
  color: var(--text-highlight);
  background: rgba(255, 215, 0, 0.2);
  padding: 0 8px;
  border-radius: 4px;
}

/* ポインター（桜井スタイル指し棒） */
.pointer-stick {
  position: absolute;
  width: 200px;
  height: 8px;
  background: linear-gradient(90deg, var(--accent) 0%, var(--text-highlight) 100%);
  border-radius: 4px;
  transform-origin: left center;
  box-shadow: 0 4px 12px rgba(233, 69, 96, 0.5);
}

.pointer-stick::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 24px solid var(--text-highlight);
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
}

.pointer-box {
  position: absolute;
  border: 4px solid var(--accent);
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
}

.pointer-circle {
  position: absolute;
  border: 4px solid var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
}

/* プログレスバー */
.progress-bar {
  position: absolute;
  top: 20px;
  left: var(--safe-margin);
  right: var(--safe-margin);
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent) 0%, var(--text-highlight) 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.topic-indicator {
  position: absolute;
  top: 40px;
  left: var(--safe-margin);
  font-size: 24px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

/* オーバーレイ */
.overlay-vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%);
  pointer-events: none;
}

.overlay-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 8px solid rgba(233, 69, 96, 0.3);
  border-radius: 0;
  pointer-events: none;
}
`;

// ============================================================================
// マルチレイヤー書き出しエンドポイント
// ============================================================================

app.post('/render-multilayer', async (req, res) => {
  const {
    scene,                // SakuraiScene オブジェクト
    width = 1920,
    height = 1080,
    output_layers = ['background', 'visual', 'annotation', 'composite'],
  } = req.body;

  if (!scene) {
    return res.status(400).json({ error: 'scene object is required' });
  }

  try {
    const browser = await getBrowser();
    const timestamp = Date.now();
    const results = {};

    for (const layerName of output_layers) {
      const page = await browser.newPage();
      await page.setViewport({ width: parseInt(width), height: parseInt(height) });

      const html = generateLayerHTML(scene, layerName, width, height);
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.evaluateHandle('document.fonts.ready');

      const filename = `${timestamp}_${scene.id || 'scene'}_${layerName}.png`;
      const filepath = path.join(OUTPUT_DIR, filename);

      const buffer = await page.screenshot({
        path: filepath,
        type: 'png',
        omitBackground: layerName !== 'composite' && layerName !== 'background',
      });

      await page.close();

      results[layerName] = {
        filename,
        path: filepath,
        size: buffer.length,
        base64: buffer.toString('base64'),
      };
    }

    res.json({
      success: true,
      scene_id: scene.id,
      layers: results,
    });

  } catch (error) {
    console.error('Multilayer render error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// レイヤー別HTML生成
// ============================================================================

function generateLayerHTML(scene, layerName, width, height) {
  const layers = scene.layers || {};
  
  let layerContent = '';

  switch (layerName) {
    case 'background':
      layerContent = generateBackgroundHTML(layers.background);
      break;
    case 'visual':
      layerContent = generateVisualHTML(layers.visual);
      break;
    case 'annotation':
      layerContent = generateAnnotationHTML(layers.annotation);
      break;
    case 'overlay':
      layerContent = generateOverlayHTML(layers.overlay);
      break;
    case 'composite':
      // 全レイヤー合成
      layerContent = `
        ${generateBackgroundHTML(layers.background)}
        ${generateVisualHTML(layers.visual)}
        ${generateAnnotationHTML(layers.annotation)}
        ${generateOverlayHTML(layers.overlay)}
      `;
      break;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${SAKURAI_BASE_CSS}
    body { width: ${width}px; height: ${height}px; }
  </style>
</head>
<body>
  ${layerContent}
</body>
</html>
  `;
}

function generateBackgroundHTML(bg) {
  if (!bg) return '<div class="layer layer-background bg-gradient-dark"></div>';

  let style = '';
  
  if (bg.type === 'solid') {
    style = `background: ${bg.color || 'var(--background)'};`;
  } else if (bg.type === 'gradient' && bg.gradient) {
    const colors = bg.gradient.colors.join(', ');
    const angle = bg.gradient.angle || 135;
    style = `background: linear-gradient(${angle}deg, ${colors});`;
  } else if (bg.type === 'image' && bg.image_url) {
    const blur = bg.blur ? `filter: blur(${bg.blur}px);` : '';
    const opacity = bg.opacity !== undefined ? `opacity: ${bg.opacity};` : '';
    style = `background: url('${bg.image_url}') center/cover; ${blur} ${opacity}`;
  }

  return `<div class="layer layer-background" style="${style}"></div>`;
}

function generateVisualHTML(visual) {
  if (!visual) return '';

  let content = '';

  if (visual.type === 'image' && visual.image) {
    const img = visual.image;
    const pos = img.position || { x: 50, y: 50 };
    const size = img.size || { width: 60, height: 70 };
    
    content = `
      <div class="visual-container" style="
        left: ${pos.x - size.width / 2}%;
        top: ${pos.y - size.height / 2}%;
        width: ${size.width}%;
        height: ${size.height}%;
      ">
        <img class="visual-image with-frame" src="${img.url}" alt="visual" />
      </div>
    `;
  } else if (visual.type === 'multi_image' && visual.images) {
    content = visual.images.map((img, idx) => {
      const pos = img.position || { x: 25 + idx * 25, y: 50 };
      const size = img.size || { width: 30, height: 50 };
      
      return `
        <div class="visual-container" style="
          left: ${pos.x - size.width / 2}%;
          top: ${pos.y - size.height / 2}%;
          width: ${size.width}%;
          height: ${size.height}%;
        ">
          <img class="visual-image with-frame" src="${img.url}" alt="visual-${idx}" />
          ${img.label ? `<div style="position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%); font-size: 24px; color: var(--text);">${img.label}</div>` : ''}
        </div>
      `;
    }).join('');
  } else if (visual.type === 'text_card' && visual.text_card) {
    const card = visual.text_card;
    content = `
      <div class="visual-container" style="left: 10%; top: 20%; width: 80%; height: 60%;">
        <div class="text-card">
          ${card.title ? `<div class="text-card-title">${card.title}</div>` : ''}
          <div class="text-card-body">${card.body}</div>
        </div>
      </div>
    `;
  }

  return `<div class="layer layer-visual">${content}</div>`;
}

function generateAnnotationHTML(annotation) {
  if (!annotation) return '';

  let content = '';

  // テロップ
  if (annotation.captions && annotation.captions.length > 0) {
    const caption = annotation.captions[0];  // 最初のテロップを使用
    const text = highlightWords(caption.text, caption.style?.highlight_words || []);
    
    content += `
      <div class="caption-area">
        <div class="caption-text">${text}</div>
      </div>
    `;
  }

  // ポインター
  if (annotation.pointers && annotation.pointers.length > 0) {
    annotation.pointers.forEach((pointer, idx) => {
      const target = pointer.target || { x: 50, y: 50 };
      
      if (pointer.type === 'stick') {
        content += `
          <div class="pointer-stick" style="
            left: ${target.x - 10}%;
            top: ${target.y}%;
            transform: rotate(-15deg);
          "></div>
        `;
      } else if (pointer.type === 'box') {
        content += `
          <div class="pointer-box" style="
            left: ${target.x}%;
            top: ${target.y}%;
            width: ${target.width || 20}%;
            height: ${target.height || 20}%;
          "></div>
        `;
      } else if (pointer.type === 'circle') {
        const size = target.width || 15;
        content += `
          <div class="pointer-circle" style="
            left: ${target.x}%;
            top: ${target.y}%;
            width: ${size}%;
            height: ${size}%;
          "></div>
        `;
      }
    });
  }

  // プログレスバー
  if (annotation.progress_bar?.show) {
    const position = annotation.progress_bar.position || 'top';
    content += `
      <div class="progress-bar" style="${position === 'bottom' ? 'top: auto; bottom: 20px;' : ''}">
        <div class="progress-bar-fill" style="width: 50%;"></div>
      </div>
      ${annotation.progress_bar.current_topic ? `
        <div class="topic-indicator">${annotation.progress_bar.current_topic}</div>
      ` : ''}
    `;
  }

  return `<div class="layer layer-annotation">${content}</div>`;
}

function generateOverlayHTML(overlay) {
  if (!overlay) return '';

  let content = '';

  if (overlay.vignette) {
    content += `<div class="overlay-vignette" style="opacity: ${overlay.vignette.intensity || 0.5};"></div>`;
  }

  if (overlay.frame?.style === 'sakurai') {
    content += `<div class="overlay-frame"></div>`;
  }

  return `<div class="layer layer-overlay">${content}</div>`;
}

function highlightWords(text, words) {
  if (!words || words.length === 0) return text;
  
  let result = text;
  words.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    result = result.replace(regex, '<span class="highlight">$1</span>');
  });
  return result;
}

// ============================================================================
// 既存エンドポイント（互換性維持）
// ============================================================================

app.post('/render', async (req, res) => {
  const {
    html,
    format = 'png',
    width = 1920,
    height = 1080,
    quality = 90,
    fullPage = false,
    pdfFormat = 'A4',
    landscape = false,
    printBackground = true,
  } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'html is required' });
  }

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: parseInt(width), height: parseInt(height) });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluateHandle('document.fonts.ready');

    const timestamp = Date.now();
    const filename = `render_${timestamp}.${format === 'pdf' ? 'pdf' : format}`;
    const filepath = path.join(OUTPUT_DIR, filename);

    let buffer;

    if (format === 'pdf') {
      buffer = await page.pdf({
        path: filepath,
        format: pdfFormat,
        landscape: landscape,
        printBackground: printBackground,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });
    } else {
      const screenshotOptions = {
        path: filepath,
        type: format === 'jpg' ? 'jpeg' : format,
        fullPage: fullPage,
      };
      if (format !== 'png') {
        screenshotOptions.quality = parseInt(quality);
      }
      buffer = await page.screenshot(screenshotOptions);
    }

    await page.close();

    const contentType = format === 'pdf' ? 'application/pdf' :
                        format === 'png' ? 'image/png' :
                        format === 'jpg' ? 'image/jpeg' : 'image/webp';

    res.set({
      'Content-Type': contentType,
      'Content-Length': buffer.length,
      'X-Filename': filename,
    });

    res.send(buffer);

  } catch (error) {
    console.error('Render error:', error);
    res.status(500).json({ error: error.message });
  }
});

// スライドショーPDF
app.post('/render-slideshow', async (req, res) => {
  const { slides, width = 1920, height = 1080, format = 'pdf' } = req.body;

  if (!slides || !Array.isArray(slides) || slides.length === 0) {
    return res.status(400).json({ error: 'slides array is required' });
  }

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: parseInt(width), height: parseInt(height) });

    const timestamp = Date.now();

    if (format === 'pdf') {
      const combinedHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            ${SAKURAI_BASE_CSS}
            @page { size: ${width}px ${height}px; margin: 0; }
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
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      await page.close();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length,
        'X-Filename': filename,
        'X-Slide-Count': slides.length,
      });

      res.send(buffer);
    } else {
      const images = [];
      for (let i = 0; i < slides.length; i++) {
        await page.setContent(slides[i].html, { waitUntil: 'networkidle0' });
        await page.evaluateHandle('document.fonts.ready');
        const buffer = await page.screenshot({ type: 'png' });
        images.push({
          index: i,
          duration: slides[i].duration || 5,
          data: buffer.toString('base64'),
        });
      }
      await page.close();
      res.json({ success: true, count: images.length, images });
    }

  } catch (error) {
    console.error('Slideshow render error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'N3 Sakurai-Style Puppeteer Renderer',
    version: '2.0.0',
    browserActive: !!browser,
    features: ['multilayer', 'slideshow', 'pdf', 'png', 'sakurai-style'],
  });
});

// サーバー起動
const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`🎬 N3 Sakurai-Style Renderer running on port ${PORT}`);
  console.log(`   POST /render             - HTML → PNG/PDF`);
  console.log(`   POST /render-multilayer  - シーン → 個別レイヤーPNG`);
  console.log(`   POST /render-slideshow   - スライド → PDF`);
  console.log(`   GET  /health             - ヘルスチェック`);
});

process.on('SIGINT', async () => {
  if (browser) await browser.close();
  process.exit();
});
