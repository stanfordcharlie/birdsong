export default function AdminSettingsPage() {
  return (
    <div style={{ background: '#f8f8f7', minHeight: '100vh', fontFamily: 'Inter, -apple-system, sans-serif', color: '#111111', marginLeft: 56 }}>
      <div style={{ height: 56, background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#111111' }}>Settings</h1>
      </div>
      <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', padding: '28px 32px', minWidth: 320, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Coming soon</p>
        </div>
      </div>
    </div>
  )
}
