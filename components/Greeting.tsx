'use client'

export default function Greeting({ name }: { name: string }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#1a1a1a' }}>{greeting}, {name}</div>
      <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>{date}</div>
    </div>
  )
}
