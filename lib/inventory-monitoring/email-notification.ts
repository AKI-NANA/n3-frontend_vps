/**
 * ====================================================================
 * N3 在庫監視システム - メール通知サービス
 * ====================================================================
 * Resend APIを使用して、監視結果・エラー・変動を通知します。
 * 環境変数が設定されていない場合はコンソールログにフォールバック。
 * ====================================================================
 */

import type { MonitoringLog, InventoryChange } from './types'

export interface EmailNotificationOptions {
  to: string[]
  subject: string
  html: string
  text?: string
}

// 環境変数
const RESEND_API_KEY = process.env.RESEND_API_KEY
const NOTIFICATION_FROM = process.env.NOTIFICATION_FROM_EMAIL || 'N3 System <noreply@n3-system.com>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/**
 * メール送信
 * Resend APIを使用（APIキーがない場合はコンソールログ）
 */
async function sendEmail(options: EmailNotificationOptions): Promise<boolean> {
  // APIキーがない場合はシミュレーション
  if (!RESEND_API_KEY) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 メール送信（シミュレーション - RESEND_API_KEY未設定）')
    console.log(`To: ${options.to.join(', ')}`)
    console.log(`Subject: ${options.subject}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(options.text || '(HTMLのみ)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    return true
  }

  try {
    // Resend APIを動的にインポート（インストールされている場合のみ）
    const { Resend } = await import('resend')
    const resend = new Resend(RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: NOTIFICATION_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    if (error) {
      console.error('❌ Resend APIエラー:', error)
      return false
    }

    console.log(`📧 メール送信成功: ${data?.id}`)
    return true
  } catch (error: any) {
    // Resendがインストールされていない場合など
    console.error('❌ メール送信エラー:', error.message)
    
    // フォールバック: コンソールログ
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 メール送信（フォールバック）')
    console.log(`To: ${options.to.join(', ')}`)
    console.log(`Subject: ${options.subject}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    return false
  }
}

/**
 * HTMLメールテンプレートの共通スタイル
 */
const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
  .header h1 { margin: 0; font-size: 20px; }
  .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
  .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 16px 0; }
  .stat-card { background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
  .stat-label { font-size: 12px; color: #64748b; margin-bottom: 4px; }
  .stat-value { font-size: 18px; font-weight: 600; color: #1e293b; }
  .stat-value.success { color: #16a34a; }
  .stat-value.warning { color: #ca8a04; }
  .stat-value.error { color: #dc2626; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
  th { background: #f1f5f9; font-weight: 600; font-size: 12px; color: #64748b; text-transform: uppercase; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; }
  .badge-success { background: #dcfce7; color: #166534; }
  .badge-warning { background: #fef3c7; color: #92400e; }
  .badge-error { background: #fee2e2; color: #991b1b; }
  .btn { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
  .footer { padding: 16px 20px; background: #f1f5f9; border-radius: 0 0 8px 8px; font-size: 12px; color: #64748b; }
`

/**
 * 監視完了通知を送信
 */
export async function sendMonitoringCompletedNotification(
  log: MonitoringLog | {
    logId?: string
    targetCount: number
    processedCount: number
    successCount: number
    errorCount: number
    changesDetected: number
    durationSeconds: number
    priceChanges?: number
    stockChanges?: number
    pageErrors?: number
  },
  recipients?: string[]
): Promise<boolean> {
  // recipientsが渡されない場合は環境変数から取得
  const toAddresses = recipients && recipients.length > 0 
    ? recipients 
    : (process.env.NOTIFICATION_EMAILS?.split(',').map(e => e.trim()).filter(Boolean) || [])

  if (toAddresses.length === 0) {
    console.log('⚠️ 通知先メールアドレスが設定されていません')
    return false
  }

  // MonitoringLog形式とシンプル形式の両方に対応
  const data = 'status' in log ? {
    executionType: log.execution_type,
    status: log.status,
    targetCount: log.target_count,
    processedCount: log.processed_count,
    successCount: log.success_count,
    errorCount: log.error_count,
    changesDetected: log.changes_detected,
    priceChanges: log.price_changes,
    stockChanges: log.stock_changes,
    pageErrors: log.page_errors,
    durationSeconds: log.duration_seconds || 0,
    createdAt: log.created_at,
  } : {
    executionType: 'manual',
    status: 'completed',
    targetCount: log.targetCount,
    processedCount: log.processedCount,
    successCount: log.successCount,
    errorCount: log.errorCount,
    changesDetected: log.changesDetected,
    priceChanges: log.priceChanges || 0,
    stockChanges: log.stockChanges || 0,
    pageErrors: log.pageErrors || 0,
    durationSeconds: log.durationSeconds,
    createdAt: new Date().toISOString(),
  }

  const hasChanges = data.changesDetected > 0
  const hasErrors = data.errorCount > 0

  const subject = hasChanges
    ? `🔔 [N3] 在庫監視完了 - ${data.changesDetected}件の変動を検知`
    : hasErrors
    ? `⚠️ [N3] 在庫監視完了 - ${data.errorCount}件のエラー`
    : `✅ [N3] 在庫監視完了 - 変動なし`

  const html = `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>📊 在庫監視レポート</h1>
  </div>
  
  <div class="content">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">処理件数</div>
        <div class="stat-value">${data.processedCount} / ${data.targetCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">所要時間</div>
        <div class="stat-value">${data.durationSeconds}秒</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">成功</div>
        <div class="stat-value success">${data.successCount}件</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">エラー</div>
        <div class="stat-value ${data.errorCount > 0 ? 'error' : ''}">${data.errorCount}件</div>
      </div>
    </div>

    ${hasChanges ? `
    <h3>🔍 検知された変動</h3>
    <table>
      <tr><th>種別</th><th>件数</th></tr>
      <tr><td>💰 価格変動</td><td><strong>${data.priceChanges}</strong>件</td></tr>
      <tr><td>📦 在庫変動</td><td><strong>${data.stockChanges}</strong>件</td></tr>
      <tr><td>⚠️ ページエラー</td><td><strong>${data.pageErrors}</strong>件</td></tr>
    </table>
    <p style="background: #fef3c7; padding: 12px; border-radius: 6px; border-left: 4px solid #f59e0b;">
      <strong>⚠️ 変動が検知されました</strong><br>
      ダッシュボードで詳細を確認し、必要に応じてeBayに反映してください。
    </p>
    ` : `
    <p style="background: #dcfce7; padding: 12px; border-radius: 6px; border-left: 4px solid #16a34a;">
      ✅ 変動は検知されませんでした。
    </p>
    `}

    <div style="text-align: center; margin-top: 20px;">
      <a href="${APP_URL}/tools/settings-n3" class="btn">在庫監視ダッシュボードを開く</a>
    </div>
  </div>
  
  <div class="footer">
    <p>このメールはN3システムから自動送信されています。</p>
    <p>実行日時: ${new Date(data.createdAt).toLocaleString('ja-JP')}</p>
  </div>
</div>
</body>
</html>
  `

  const text = `
在庫監視が完了しました

【実行結果】
- 処理件数: ${data.processedCount} / ${data.targetCount}件
- 成功: ${data.successCount}件
- エラー: ${data.errorCount}件
- 所要時間: ${data.durationSeconds}秒

【変動検知】
- 変動総数: ${data.changesDetected}件
- 価格変動: ${data.priceChanges}件
- 在庫変動: ${data.stockChanges}件
- ページエラー: ${data.pageErrors}件

${hasChanges ? '⚠️ 変動が検知されました。ダッシュボードで確認してください。' : '✅ 変動は検知されませんでした。'}

ダッシュボード: ${APP_URL}/tools/settings-n3
実行日時: ${new Date(data.createdAt).toLocaleString('ja-JP')}
  `

  return sendEmail({ to: toAddresses, subject, html, text })
}

/**
 * エラー通知を送信
 */
export async function sendMonitoringErrorNotification(
  log: MonitoringLog | { logId?: string; error: string },
  recipients?: string[]
): Promise<boolean> {
  const toAddresses = recipients && recipients.length > 0 
    ? recipients 
    : (process.env.NOTIFICATION_EMAILS?.split(',').map(e => e.trim()).filter(Boolean) || [])

  if (toAddresses.length === 0) {
    return false
  }

  const errorMessage = 'error_message' in log ? log.error_message : ('error' in log ? log.error : 'Unknown error')
  const executionType = 'execution_type' in log ? log.execution_type : 'manual'

  const subject = `🚨 [N3] 在庫監視エラー発生`

  const html = `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
<div class="container">
  <div class="header" style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);">
    <h1>🚨 在庫監視エラー</h1>
  </div>
  
  <div class="content">
    <div style="background: #fee2e2; padding: 16px; border-radius: 6px; border-left: 4px solid #dc2626; margin-bottom: 16px;">
      <strong>エラー内容:</strong>
      <pre style="margin: 8px 0 0 0; white-space: pre-wrap; word-break: break-all;">${errorMessage}</pre>
    </div>

    <table>
      <tr><th>項目</th><th>値</th></tr>
      <tr><td>実行タイプ</td><td>${executionType === 'scheduled' ? '自動実行' : '手動実行'}</td></tr>
      <tr><td>発生日時</td><td>${new Date().toLocaleString('ja-JP')}</td></tr>
    </table>

    <div style="text-align: center; margin-top: 20px;">
      <a href="${APP_URL}/tools/settings-n3" class="btn" style="background: #dc2626;">ログを確認する</a>
    </div>
  </div>
  
  <div class="footer">
    <p>このメールはN3システムから自動送信されています。</p>
  </div>
</div>
</body>
</html>
  `

  const text = `
在庫監視でエラーが発生しました

エラー内容:
${errorMessage}

実行タイプ: ${executionType === 'scheduled' ? '自動実行' : '手動実行'}
発生日時: ${new Date().toLocaleString('ja-JP')}

ログを確認: ${APP_URL}/tools/settings-n3
  `

  return sendEmail({ to: toAddresses, subject, html, text })
}

/**
 * 変動サマリー通知を送信
 */
export async function sendChangeSummaryNotification(
  changes: Array<{
    sku: string
    title?: string
    type: 'price' | 'stock' | 'page_deleted' | 'page_changed'
    oldValue: any
    newValue: any
  }>,
  recipients?: string[]
): Promise<boolean> {
  const toAddresses = recipients && recipients.length > 0 
    ? recipients 
    : (process.env.NOTIFICATION_EMAILS?.split(',').map(e => e.trim()).filter(Boolean) || [])

  if (toAddresses.length === 0 || changes.length === 0) {
    return false
  }

  const typeLabels: Record<string, string> = {
    price: '💰 価格',
    stock: '📦 在庫',
    page_deleted: '🗑️ ページ削除',
    page_changed: '🔄 ページ変更',
  }

  const subject = `🔔 [N3] ${changes.length}件の変動を検知しました`

  const tableRows = changes.slice(0, 20).map(c => `
    <tr>
      <td style="font-family: monospace; font-size: 12px;">${c.sku}</td>
      <td><span class="badge badge-${c.type === 'price' ? 'warning' : c.type === 'stock' ? 'success' : 'error'}">${typeLabels[c.type] || c.type}</span></td>
      <td>${c.oldValue ?? '-'} → <strong>${c.newValue ?? '-'}</strong></td>
    </tr>
  `).join('')

  const html = `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>🔔 変動検知レポート</h1>
  </div>
  
  <div class="content">
    <p><strong>${changes.length}件</strong>の変動が検知されました。</p>
    
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>種別</th>
          <th>変更内容</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    
    ${changes.length > 20 ? `<p style="color: #64748b;">... 他 ${changes.length - 20}件</p>` : ''}

    <div style="text-align: center; margin-top: 20px;">
      <a href="${APP_URL}/tools/settings-n3" class="btn">詳細を確認する</a>
    </div>
  </div>
  
  <div class="footer">
    <p>このメールはN3システムから自動送信されています。</p>
    <p>検知日時: ${new Date().toLocaleString('ja-JP')}</p>
  </div>
</div>
</body>
</html>
  `

  return sendEmail({ to: toAddresses, subject, html })
}

/**
 * テストメール送信
 */
export async function sendTestNotification(
  recipient: string
): Promise<boolean> {
  const subject = `🧪 [N3] テストメール`

  const html = `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>🧪 テストメール</h1>
  </div>
  
  <div class="content">
    <p style="background: #dcfce7; padding: 12px; border-radius: 6px; border-left: 4px solid #16a34a;">
      ✅ メール通知が正常に設定されています。
    </p>
    
    <p>このメールが届いていれば、N3在庫監視システムからの通知を受け取れる状態です。</p>

    <table>
      <tr><th>設定項目</th><th>値</th></tr>
      <tr><td>送信先</td><td>${recipient}</td></tr>
      <tr><td>送信元</td><td>${NOTIFICATION_FROM}</td></tr>
      <tr><td>APIキー</td><td>${RESEND_API_KEY ? '設定済み ✅' : '未設定 ⚠️'}</td></tr>
    </table>
  </div>
  
  <div class="footer">
    <p>送信日時: ${new Date().toLocaleString('ja-JP')}</p>
  </div>
</div>
</body>
</html>
  `

  return sendEmail({ to: [recipient], subject, html })
}
