// app/tools/stocktake/layout.tsx
/**
 * 棚卸しツール専用レイアウト
 * サイドバーなしのシンプルなレイアウト
 */

export default function StocktakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f3f4f6',
    }}>
      {children}
    </div>
  );
}
