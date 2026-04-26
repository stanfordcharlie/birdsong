'use client'

import Link from 'next/link'

const cards = [
  {
    title: 'Responses',
    description: 'View and manage all completed survey responses',
    href: '/admin/responses',
  },
  {
    title: 'Create Survey',
    description: 'Build a new AI-moderated survey for your ICP',
    href: '/admin/create',
  },
  {
    title: 'All Surveys',
    description: 'View and copy links for all active surveys',
    href: '/admin/surveys',
  },
  {
    title: 'Live Survey (Test)',
    description: 'Preview the respondent-facing survey experience',
    href: '/s/test-survey',
  },
]

export default function HomePage() {
  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Birdsong</div>
          <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Admin Dashboard</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              style={{ background: '#fff', borderRadius: 12, padding: 24, cursor: 'pointer', border: '1px solid #e5e5e5', textDecoration: 'none', color: '#1a1a1a' }}
              className="admin-card"
            >
              <div style={{ fontWeight: 600, fontSize: 16 }}>{card.title}</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>{card.description}</div>
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        .admin-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  )
}
