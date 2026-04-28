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
    <div style={{ background: '#f8f8f7', minHeight: '100vh', fontFamily: 'Inter, -apple-system, sans-serif', color: '#111111', marginLeft: 56 }}>
      <div style={{ height: 56, background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', alignItems: 'center' }}>
        <Link href="/admin/responses" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
          Back to responses
        </Link>
      </div>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', marginBottom: 20 }}>
          <h1 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 600 }}>{response.respondent_name}</h1>
          <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: 14 }}>{response.respondent_email}</p>
          <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: 14 }}>{response.respondent_phone || ''}</p>
          <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: 14 }}>{(response.surveys as any)?.title || ''}</p>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 8 }}>Lead Score</div>
            <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1, color: '#111111' }}>{response.lead_score ?? '-'}</div>
          </div>

          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 10 }}>Pain Points</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {painPoints.map((painPoint: string, idx: number) => (
                <span key={`${painPoint}-${idx}`} style={{ background: '#f3f4f6', color: '#111111', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>
                  {painPoint}
                </span>
              ))}
            </div>
          </div>
        </div>

        <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 600, color: '#111111' }}>Transcript</h2>
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
          {messages.map((message, idx) => (
            <div key={idx} style={{ marginBottom: 16, display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '75%', background: message.role === 'user' ? '#111111' : '#f3f4f6', color: message.role === 'user' ? '#fff' : '#111111', borderRadius: 12, padding: '10px 14px', fontSize: 14, lineHeight: 1.5 }}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
