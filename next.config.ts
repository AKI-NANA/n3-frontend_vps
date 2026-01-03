import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker Standalone Output
  output: 'standalone',
  
  // Turbopackを無効化（Next.js 16でWebpackを使用）
  turbopack: {},
  
  // ESLintをビルド時に無視（開発速度向上）
  
  // TypeScriptエラーをビルド時に無視
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ===========================
  // メモリリーク防止の最重要設定
  // ===========================
  experimental: {
    // ビルド時はworkerThreadsを無効化（DataCloneError回避）
    workerThreads: false,
    cpus: 2,
    // コンパイル対象を絞り込む
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
    ],
  },
  
  // ページキャッシュを最小化
  onDemandEntries: {
    maxInactiveAge: 10 * 1000,
    pagesBufferLength: 1,
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
  // Webpack設定（シンプル版）
  // ===========================
  webpack: (config, { dev, isServer }) => {
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
