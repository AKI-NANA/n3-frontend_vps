// テストページ
export default function TestPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Test Page</h1>
      <p>This is a simple test page to check if the server is working.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}
