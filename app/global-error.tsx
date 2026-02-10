// app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: 'white',
        margin: 0,
      }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>エラーが発生しました</h1>
        <p style={{ marginTop: '1rem', marginBottom: '2rem', color: '#888' }}>
          {error.message || '予期しないエラーが発生しました'}
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          再試行
        </button>
      </body>
    </html>
  );
}
