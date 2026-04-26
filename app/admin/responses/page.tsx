import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

function getLeadScoreColor(score: number) {
  if (score >= 8) return '#16a34a'
  if (score >= 5) return '#ca8a04'
  return '#dc2626'
}

export default async function AdminResponsesPage() {
  const supabase = await createClient()
  const { data: responses } = await supabase
    .from('responses')
    .select('id, respondent_name, respondent_email, respondent_phone, lead_score, pain_points, created_at, completed, survey_id, surveys:survey_id(title)')
    .eq('completed', true)
    .order('created_at', { ascending: false })

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px', fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Responses</h1>
          <Link href="/admin/create" style={{ color: '#1a1a1a', textDecoration: 'underline', fontSize: 13 }}>
            Create survey
          </Link>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
          <div style={{ display: 'flex', minWidth: 980, borderBottom: '2px solid #ddd' }}>
            <div style={{ width: 150, padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Name</div>
            <div style={{ width: 210, padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Email</div>
            <div style={{ width: 130, padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Phone</div>
            <div style={{ width: 190, padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Survey</div>
            <div style={{ width: 100, padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Lead Score</div>
            <div style={{ width: 220, padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Pain Points</div>
            <div style={{ width: 120, padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Date</div>
          </div>
          {(responses || []).map((response) => {
            const painPoints = Array.isArray(response.pain_points) ? response.pain_points : []
            const visiblePainPoints = painPoints.slice(0, 2)
            const remainingPainPoints = Math.max(0, painPoints.length - 2)
            const score = typeof response.lead_score === 'number' ? response.lead_score : 1

            return (
              <Link
                key={response.id}
                href={`/admin/responses/${response.id}`}
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <div style={{ display: 'flex', minWidth: 980, borderBottom: '1px solid #e5e5e5', cursor: 'pointer' }}>
                  <div style={{ width: 150, padding: '10px 16px', whiteSpace: 'nowrap', color: '#1a1a1a', fontWeight: 500 }}>{response.respondent_name}</div>
                  <div style={{ width: 210, padding: '10px 16px', whiteSpace: 'nowrap' }}>{response.respondent_email}</div>
                  <div style={{ width: 130, padding: '10px 16px', whiteSpace: 'nowrap' }}>{response.respondent_phone || '—'}</div>
                  <div style={{ width: 190, padding: '10px 16px', whiteSpace: 'nowrap' }}>{(response.surveys as any)?.title || ''}</div>
                  <div style={{ width: 100, padding: '10px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ background: getLeadScoreColor(score), color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>
                      {response.lead_score ?? '-'}
                    </span>
                  </div>
                  <div style={{ width: 220, padding: '10px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                      {visiblePainPoints.map((painPoint: string, idx: number) => (
                        <span key={`${painPoint}-${idx}`} style={{ background: '#efefef', color: '#444', borderRadius: 20, padding: '2px 8px', fontSize: 11 }}>
                          {painPoint}
                        </span>
                      ))}
                      {remainingPainPoints > 0 && <span style={{ color: '#666', fontSize: 11 }}>{`+${remainingPainPoints} more`}</span>}
                    </div>
                  </div>
                  <div style={{ width: 120, padding: '10px 16px', whiteSpace: 'nowrap' }}>
                    {response.created_at ? new Date(response.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
