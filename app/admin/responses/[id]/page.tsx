import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface Message {
  role: 'assistant' | 'user'
  content: string
}

export default async function ResponseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: response } = await supabase
    .from('responses')
    .select('*, surveys:survey_id(title)')
    .eq('id', id)
    .single()

  if (!response) return notFound()

  const messages = Array.isArray(response.messages) ? (response.messages as Message[]) : []
  const painPoints = Array.isArray(response.pain_points) ? response.pain_points : []

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <Link href="/admin/responses" style={{ color: '#1a1a1a', textDecoration: 'underline', fontSize: 14 }}>
          Back to /admin/responses
        </Link>

        <h1 style={{ margin: '16px 0 8px', fontSize: 28, fontWeight: 600 }}>{response.respondent_name}</h1>
        <p style={{ margin: '0 0 4px' }}>{response.respondent_email}</p>
        <p style={{ margin: '0 0 4px' }}>{response.respondent_phone || ''}</p>
        <p style={{ margin: '0 0 20px' }}>{(response.surveys as any)?.title || ''}</p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Lead Score</div>
          <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1 }}>{response.lead_score ?? '-'}</div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 14, marginBottom: 10 }}>Pain Points</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {painPoints.map((painPoint: string, idx: number) => (
              <span key={`${painPoint}-${idx}`} style={{ background: '#1a1a1a', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 13 }}>
                {painPoint}
              </span>
            ))}
          </div>
        </div>

        <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 600 }}>Transcript</h2>
        <div>
          {messages.map((message, idx) => (
            <div key={idx} style={{ marginBottom: 16, display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', background: message.role === 'user' ? '#1a1a1a' : '#ede8df', color: message.role === 'user' ? '#fff' : '#1a1a1a', borderRadius: 12, padding: '12px 16px', fontSize: 15, lineHeight: 1.5 }}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
