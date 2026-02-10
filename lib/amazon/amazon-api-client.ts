// lib/amazon/amazon-api-client.ts
import crypto from 'crypto'

interface AmazonAPIConfig {
  accessKey: string
  secretKey: string
  partnerTag: string
  marketplace: string
  region: string
}

interface SearchItemsParams {
  Keywords: string
  ItemCount?: number
  Resources?: string[]
}

export class AmazonAPIClient {
  private config: AmazonAPIConfig
  private service = 'ProductAdvertisingAPI'

  constructor() {
    this.config = {
      accessKey: process.env.AMAZON_ACCESS_KEY!,
      secretKey: process.env.AMAZON_SECRET_KEY!,
      partnerTag: process.env.AMAZON_PARTNER_TAG!,
      marketplace: process.env.AMAZON_MARKETPLACE || 'www.amazon.com',
      region: process.env.AMAZON_REGION || 'us-east-1'
    }

    // 設定チェック
    if (!this.config.accessKey || !this.config.secretKey || !this.config.partnerTag) {
      throw new Error('Amazon API credentials not configured')
    }
  }

  private getMarketplaceDomain(): string {
    const domains: Record<string, string> = {
      'www.amazon.com': 'com',
      'www.amazon.co.jp': 'co.jp',
      'www.amazon.co.uk': 'co.uk',
      'www.amazon.de': 'de',
      'www.amazon.fr': 'fr'
    }
    return domains[this.config.marketplace] || 'com'
  }

  private async signRequest(operation: string, payload: string, timestamp: string): Promise<string> {
    const dateStamp = timestamp.substring(0, 8)
    
    // AWS署名v4
    const kDate = crypto.createHmac('sha256', `AWS4${this.config.secretKey}`)
      .update(dateStamp)
      .digest()
    
    const kRegion = crypto.createHmac('sha256', kDate)
      .update(this.config.region)
      .digest()
    
    const kService = crypto.createHmac('sha256', kRegion)
      .update(this.service)
      .digest()
    
    const kSigning = crypto.createHmac('sha256', kService)
      .update('aws4_request')
      .digest()
    
    const canonicalUri = `/paapi5/${operation.toLowerCase()}`
    const canonicalQueryString = ''
    const payloadHash = crypto.createHash('sha256').update(payload).digest('hex')
    
    const canonicalHeaders = [
      `content-type:application/json; charset=utf-8`,
      `host:webservices.amazon.${this.getMarketplaceDomain()}`,
      `x-amz-date:${timestamp}`,
      `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`
    ].join('\n')
    
    const signedHeaders = 'content-type;host;x-amz-date;x-amz-target'
    
    const canonicalRequest = [
      'POST',
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      '',
      signedHeaders,
      payloadHash
    ].join('\n')
    
    const credentialScope = `${dateStamp}/${this.config.region}/${this.service}/aws4_request`
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      timestamp,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n')
    
    const signature = crypto.createHmac('sha256', kSigning)
      .update(stringToSign)
      .digest('hex')
    
    return signature
  }

  async searchItems(keyword: string): Promise<any> {
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
    const operation = 'SearchItems'
    
    const requestPayload = {
      PartnerTag: this.config.partnerTag,
      PartnerType: 'Associates',
      Marketplace: this.config.marketplace,
      Keywords: keyword,
      ItemCount: 10,
      Resources: [
        'ItemInfo.Title',
        'Images.Primary.Large',
        'Offers.Listings.Price',
        'BrowseNodeInfo.WebsiteSalesRank'
      ]
    }
    
    const payload = JSON.stringify(requestPayload)
    const signature = await this.signRequest(operation, payload, timestamp)
    const dateStamp = timestamp.substring(0, 8)
    
    const authHeader = [
      `AWS4-HMAC-SHA256 Credential=${this.config.accessKey}/${dateStamp}/${this.config.region}/${this.service}/aws4_request`,
      `SignedHeaders=content-type;host;x-amz-date;x-amz-target`,
      `Signature=${signature}`
    ].join(', ')
    
    const endpoint = `https://webservices.amazon.${this.getMarketplaceDomain()}/paapi5/searchitems`
    
    console.log('📡 Amazon API Request:', {
      endpoint,
      operation,
      keyword,
      timestamp
    })
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Amz-Date': timestamp,
        'X-Amz-Target': `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`,
        'Authorization': authHeader,
        'Host': `webservices.amazon.${this.getMarketplaceDomain()}`
      },
      body: payload
    })
    
    const responseText = await response.text()
    console.log('📡 Amazon API Response:', {
      status: response.status,
      body: responseText
    })
    
    if (!response.ok) {
      throw new Error(`Amazon API error (${response.status}): ${responseText}`)
    }
    
    return JSON.parse(responseText)
  }

  async getItems(asins: string[]): Promise<any> {
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
    const operation = 'GetItems'
    
    const requestPayload = {
      PartnerTag: this.config.partnerTag,
      PartnerType: 'Associates',
      Marketplace: this.config.marketplace,
      ItemIds: asins,
      Resources: [
        'ItemInfo.Title',
        'Images.Primary.Large',
        'Offers.Listings.Price',
        'Offers.Listings.Condition',
        'BrowseNodeInfo.WebsiteSalesRank',
        'ItemInfo.Features'
      ]
    }
    
    const payload = JSON.stringify(requestPayload)
    const signature = await this.signRequest(operation, payload, timestamp)
    const dateStamp = timestamp.substring(0, 8)
    
    const authHeader = [
      `AWS4-HMAC-SHA256 Credential=${this.config.accessKey}/${dateStamp}/${this.config.region}/${this.service}/aws4_request`,
      `SignedHeaders=content-type;host;x-amz-date;x-amz-target`,
      `Signature=${signature}`
    ].join(', ')
    
    const endpoint = `https://webservices.amazon.${this.getMarketplaceDomain()}/paapi5/getitems`
    
    console.log('📡 Amazon GetItems Request:', {
      endpoint,
      operation,
      asins,
      timestamp
    })
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Amz-Date': timestamp,
        'X-Amz-Target': `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`,
        'Authorization': authHeader,
        'Host': `webservices.amazon.${this.getMarketplaceDomain()}`
      },
      body: payload
    })
    
    const responseText = await response.text()
    console.log('📡 Amazon GetItems Response:', {
      status: response.status,
      body: responseText.substring(0, 500)
    })
    
    if (!response.ok) {
      throw new Error(`Amazon GetItems API error (${response.status}): ${responseText}`)
    }
    
    return JSON.parse(responseText)
  }
}
