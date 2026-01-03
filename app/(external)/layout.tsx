// app/(external)/layout.tsx
/**
 * 外部ツール用レイアウト（サイドバーなし）
 * 外注さん向けのシンプルなUI
 * 
 * ルートレイアウト（app/layout.tsx）のLayoutWrapperを
 * バイパスするため、直接childrenを返す
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Plus1 棚卸し",
  description: "外注用棚卸しツール",
}

export default function ExternalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // サイドバーなしでchildrenを表示
  // ルートのLayoutWrapperが適用されるが、
  // このページ専用のスタイルで上書き
  return (
    <div 
      style={{ 
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#f3f4f6',
        overflow: 'auto',
      }}
    >
      {children}
    </div>
  )
}
