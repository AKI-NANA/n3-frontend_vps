import { fetchSecret } from '@/lib/shared/security';

#!/usr/bin/env node
/**
 * N3 n8n 自動設定スクリプト
 * すべてのワークフローと認証情報を自動的に設定
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

// 環境変数読み込み
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.n8n' });

class N8nAutoConfigurator {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:5678';
    this.username = config.username || 'admin';
    this.password = config.password || process.env.N8N_PASSWORD || 'n3admin2024';
    this.apiToken = null;
    this.credentials = {};
    this.workflows = {};
  }

  /**
   * n8nにログインしてトークンを取得
   */
  async authenticate() {
    try {
      
      const response = await axios.post(`${this.baseUrl}/api/v1/auth/login`, {
        email: this.username,
        password: this.password
      });
      
      this.apiToken = response.data.data.token;
      
      // デフォルトヘッダーを設定
      axios.defaults.headers.common['X-N8N-API-KEY'] = this.apiToken;
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 認証情報を作成
   */
  async createCredentials() {
    const credentialsConfig = {
      supabase: {
        name: 'Supabase N3',
        type: 'supabaseApi',
        data: {
          host: process.env.NEXT_PUBLIC_SUPABASE_URL,
          serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      },
      ebay: {
        name: 'eBay API',
        type: 'httpBasicAuth',
        data: {
          user: await fetchSecret('EBAY_APP_ID'),
          password: await fetchSecret('EBAY_CERT_ID')
        }
      },
      amazon: {
        name: 'Amazon SP-API',
        type: 'httpHeaderAuth',
        data: {
          name: 'x-amz-access-token',
          value: await fetchSecret('AMAZON_ACCESS_TOKEN') || 'placeholder'
        }
      },
      keepa: {
        name: 'Keepa API',
        type: 'httpHeaderAuth',
        data: {
          name: 'key',
          value: process.env.KEEPA_API_KEY || 'placeholder'
        }
      },
      slack: {
        name: 'Slack N3',
        type: 'slackApi',
        data: {
          accessToken: await fetchSecret('SLACK_TOKEN'),
          webhookUrl: await fetchSecret('SLACK_WEBHOOK_URL')
        }
      }
    };

    
    for (const [key, config] of Object.entries(credentialsConfig)) {
      try {
        const response = await axios.post(`${this.baseUrl}/api/v1/credentials`, config);
        this.credentials[key] = response.data.data.id;
      } catch (error) {
      }
    }
  }

  /**
   * ワークフローをインポート
   */
  async importWorkflows() {
    const workflowDir = path.join(__dirname, '../n8n-workflows');
    const files = fs.readdirSync(workflowDir).filter(f => f.endsWith('.json'));
    
    
    for (const file of files) {
      try {
        const workflowPath = path.join(workflowDir, file);
        const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
        
        // 認証情報IDを更新
        this.updateCredentialIds(workflowData);
        
        const response = await axios.post(`${this.baseUrl}/api/v1/workflows`, workflowData);
        this.workflows[workflowData.name] = response.data.data.id;
        
      } catch (error) {
      }
    }
  }

  /**
   * ワークフロー内の認証情報IDを更新
   */
  updateCredentialIds(workflow) {
    if (!workflow.nodes) return;
    
    workflow.nodes.forEach(node => {
      if (node.credentials) {
        Object.keys(node.credentials).forEach(credType => {
          const credName = node.credentials[credType].name;
          
          // 作成した認証情報IDに置き換え
          if (credName === 'Supabase N3' && this.credentials.supabase) {
            node.credentials[credType].id = this.credentials.supabase;
          } else if (credName === 'eBay API' && this.credentials.ebay) {
            node.credentials[credType].id = this.credentials.ebay;
          } else if (credName === 'Slack N3' && this.credentials.slack) {
            node.credentials[credType].id = this.credentials.slack;
          }
        });
      }
    });
  }

  /**
   * ワークフローを有効化
   */
  async activateWorkflows() {
    
    for (const [name, id] of Object.entries(this.workflows)) {
      try {
        await axios.patch(`${this.baseUrl}/api/v1/workflows/${id}`, {
          active: true
        });
      } catch (error) {
      }
    }
  }

  /**
   * 環境変数を設定
   */
  async setEnvironmentVariables() {
    const variables = {
      N3_BASE_URL: 'http://localhost:3002',
      N3_API_TIMEOUT: '30000',
      N3_BATCH_SIZE: '10',
      N3_RETRY_ATTEMPTS: '3',
      EBAY_SANDBOX: 'false',
      AMAZON_MARKETPLACE: 'ATVPDKIKX0DER'
    };

    
    try {
      await axios.post(`${this.baseUrl}/api/v1/variables`, {
        variables
      });
    } catch (error) {
    }
  }

  /**
   * テスト実行
   */
  async testWorkflows() {
    
    // テスト用のWebhookを実行
    const testData = {
      test: true,
      timestamp: new Date().toISOString()
    };
    
    try {
      // マスターWebhookをテスト
      const response = await axios.post(`${this.baseUrl}/webhook/n3-master`, testData);
    } catch (error) {
    }
  }

  /**
   * メイン実行関数
   */
  async run() {
    
    // 認証
    const authenticated = await this.authenticate();
    if (!authenticated) {
      process.exit(1);
    }
    
    // 認証情報作成
    await this.createCredentials();
    
    // ワークフローインポート
    await this.importWorkflows();
    
    // ワークフロー有効化
    await this.activateWorkflows();
    
    // 環境変数設定
    await this.setEnvironmentVariables();
    
    // テスト実行
    await this.testWorkflows();
    
  }
}

// 実行
if (require.main === module) {
  const configurator = new N8nAutoConfigurator();
  configurator.run().catch(console.error);
}

module.exports = N8nAutoConfigurator;