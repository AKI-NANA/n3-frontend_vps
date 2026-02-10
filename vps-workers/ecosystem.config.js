/**
 * PM2 Ecosystem設定ファイル
 * 
 * VPSでのワーカープロセス管理
 * 
 * 使用方法:
 *   pm2 start ecosystem.config.js
 *   pm2 status
 *   pm2 logs
 *   pm2 stop all
 *   pm2 restart all
 */

module.exports = {
  apps: [
    // 出品実行ワーカー（5分ごと）
    {
      name: 'listing-executor',
      script: 'dist/listing-executor.js',
      cwd: '/home/ubuntu/n3-frontend/vps-workers',
      cron_restart: '*/5 * * * *', // 5分ごと
      autorestart: false, // cronで再起動するため
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        TZ: 'Asia/Tokyo'
      },
      error_file: '/home/ubuntu/n3-frontend/logs/listing-executor-error.log',
      out_file: '/home/ubuntu/n3-frontend/logs/listing-executor-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    
    // 在庫監視ワーカー（毎時）
    {
      name: 'inventory-monitor',
      script: 'dist/inventory-monitor.js',
      cwd: '/home/ubuntu/n3-frontend/vps-workers',
      cron_restart: '0 * * * *', // 毎時0分
      autorestart: false,
      watch: false,
      max_memory_restart: '1G', // Puppeteer用に多めに
      env: {
        NODE_ENV: 'production',
        TZ: 'Asia/Tokyo'
      },
      error_file: '/home/ubuntu/n3-frontend/logs/inventory-monitor-error.log',
      out_file: '/home/ubuntu/n3-frontend/logs/inventory-monitor-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    
    // スケジュール自動生成ワーカー（毎日09:00）
    {
      name: 'schedule-generator',
      script: 'dist/schedule-generator.js',
      cwd: '/home/ubuntu/n3-frontend/vps-workers',
      cron_restart: '0 9 * * *', // 毎日09:00
      autorestart: false,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        TZ: 'Asia/Tokyo'
      },
      error_file: '/home/ubuntu/n3-frontend/logs/schedule-generator-error.log',
      out_file: '/home/ubuntu/n3-frontend/logs/schedule-generator-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
