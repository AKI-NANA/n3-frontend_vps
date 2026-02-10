import type { Metadata } from "next"
import { AuthProvider } from "@/contexts/AuthContext"
import { TenantProvider } from "@/contexts/TenantContext"
import { HeaderPanelProvider } from "@/contexts/HeaderPanelContext"
import LayoutWrapper from "@/components/layout/layout-wrapper"
import { QueryProvider } from "./providers"
import { SystemNotificationProvider } from "@/components/notifications/SystemNotification"
import { I18nProvider } from "@/lib/i18n/context"
import "./globals.css"

export const metadata: Metadata = {
  title: "NAGANO-3 v2.0",
  description: "統合eコマース管理システム",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
        {/* Icons */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body>
        <QueryProvider>
          <AuthProvider>
            <TenantProvider>
              <I18nProvider>
                <HeaderPanelProvider>
                  <SystemNotificationProvider>
                    <LayoutWrapper>
                      {children}
                    </LayoutWrapper>
                  </SystemNotificationProvider>
                </HeaderPanelProvider>
              </I18nProvider>
            </TenantProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
