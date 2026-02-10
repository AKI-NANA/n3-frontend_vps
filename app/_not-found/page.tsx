// app/_not-found/page.tsx
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div style={{ 
      padding: '4rem 2rem', 
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      color: 'white',
    }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <h2 style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        ページが見つかりません
      </h2>
      <Link 
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          background: '#3b82f6',
          color: 'white',
          borderRadius: '0.5rem',
          textDecoration: 'none',
        }}
      >
        ホームに戻る
      </Link>
    </div>
  );
}
