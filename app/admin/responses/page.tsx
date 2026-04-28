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
    .select('id, respondent_name, respondent_email, lead_score, created_at, completed, survey_id, surveys:survey_id(title)')
    .eq('completed', true)
    .order('created_at', { ascending: false })

  return (
    <div style={{ background: '#f8f8f7', minHeight: '100vh', fontFamily: 'Inter, -apple-system, sans-serif', color: '#111111', marginLeft: 56 }}>
      <div style={{ height: 56, background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#111111' }}>Responses</h1>
        <Link href="/admin/create" style={{ color: '#111111', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
          Create survey
        </Link>
      </div>
      <div style={{ padding: 32, fontSize: 13, overflow: 'hidden' }}>
        <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', overflowX: 'auto' }}>
          <div style={{ display: 'flex', minWidth: 980, borderBottom: '1px solid #e5e7eb', background: '#f8f8f7' }}>
            <div style={{ flex: '0 0 180px', padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>Name</div>
            <div style={{ flex: '0 0 220px', padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>Email</div>
            <div style={{ flex: '0 0 200px', padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>Survey</div>
            <div style={{ flex: '0 0 100px', padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>Lead Score</div>
            <div style={{ flex: '0 0 100px', padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>Date</div>
          </div>
          {(responses || []).map((response) => {
            const score = typeof response.lead_score === 'number' ? response.lead_score : 1

            return (
              <Link
                key={response.id}
                href={`/admin/responses/${response.id}`}
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <div style={{ display: 'flex', minWidth: 980, borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
                  <div style={{ flex: '0 0 180px', padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap', color: '#111111', fontWeight: 500 }}>{response.respondent_name}</div>
                  <div style={{ flex: '0 0 220px', padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap', color: '#6b7280' }}>{response.respondent_email}</div>
                  <div style={{ flex: '0 0 200px', padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap', color: '#6b7280' }}>{(response.surveys as any)?.title || ''}</div>
                  <div style={{ flex: '0 0 100px', padding: '12px 16px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ background: getLeadScoreColor(score), color: '#fff', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                      {response.lead_score ?? '-'}
                    </span>
                  </div>
                  <div style={{ flex: '0 0 100px', padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap', color: '#6b7280' }}>
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
