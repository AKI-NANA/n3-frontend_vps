import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker Standalone Output
  output: 'standalone',
  
  // ESLintをビルド時に無視（開発速度向上）
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScriptエラーをビルド時に無視
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ===========================
  // 🚀 高速化設定
  // ===========================
  experimental: {
    // ビルド時はworkerThreadsを無効化（DataCloneError回避）
    workerThreads: false,
    cpus: 2,
    // パッケージインポート最適化（バンドルサイズ削減）
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
      'date-fns',
      'lodash',
    ],
  },
  
  // ページキャッシュを最適化（メモリ節約 + 高速化）
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,  // 15秒でアンロード（メモリ解放）
    pagesBufferLength: 2,       // 2ページまでキャッシュ
  },
  
  // ===========================
  // 画像最適化
  // ===========================
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '*.ebayimg.com' },
      { protocol: 'https', hostname: '*.yimg.jp' },
    ],
  },
  
  // ===========================
  // ビルド設定
  // ===========================
  reactStrictMode: false,
  
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  serverExternalPackages: ['ssh2', 'puppeteer', 'playwright'],
  
  // ===========================
  // Webpack設定（高速化版）
  // ===========================
  webpack: (config, { dev, isServer }) => {
    // 開発モードの高速化
    if (dev) {
      config.watchOptions = {
        poll: 1000,        // 1秒ごとにポーリング
        aggregateTimeout: 300,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/n8n-workflows/**',
          '**/_backup/**',
          '**/_archives/**',
        ],
      };
      
      // ソースマップを簡略化（高速化）
      config.devtool = 'eval-cheap-module-source-map';
    }
    
    // Webpack publicPath設定
    if (!isServer) {
      config.output = {
        ...config.output,
        publicPath: '/_next/',
      };
    }
    
    // サーバー側の設定
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // キャッシュ設定（高速化）
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    };
    
    // 警告を抑制
    config.ignoreWarnings = [
      { module: /scheduler/ },
      { module: /finance/ },
      { module: /credentials/ },
      { module: /gemini-client/ },
      { module: /encryption/ },
      { message: /Critical dependency/ },
      { message: /the request of a dependency is an expression/ },
    ];
    
    return config;
  },
};

export default nextConfig;
