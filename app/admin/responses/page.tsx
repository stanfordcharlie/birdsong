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
    .select('*, surveys:survey_id(title)')
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
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '2px solid #ddd', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', fontWeight: 400 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '2px solid #ddd', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', fontWeight: 400 }}>Email</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '2px solid #ddd', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', fontWeight: 400 }}>Phone</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '2px solid #ddd', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', fontWeight: 400 }}>Survey</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '2px solid #ddd', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', fontWeight: 400 }}>Lead Score</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '2px solid #ddd', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', fontWeight: 400 }}>Pain Points</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '2px solid #ddd', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', fontWeight: 400 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {(responses || []).map((response) => {
                const painPoints = Array.isArray(response.pain_points) ? response.pain_points : []
                const visiblePainPoints = painPoints.slice(0, 2)
                const remainingPainPoints = Math.max(0, painPoints.length - 2)
                const score = typeof response.lead_score === 'number' ? response.lead_score : 1

                return (
                  <tr key={response.id}>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #e5e5e5', whiteSpace: 'nowrap' }}>
                      <Link href={`/admin/responses/${response.id}`} style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500 }}>
                        {response.respondent_name}
                      </Link>
                    </td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #e5e5e5', whiteSpace: 'nowrap' }}>{response.respondent_email}</td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #e5e5e5', whiteSpace: 'nowrap' }}>{response.respondent_phone || ''}</td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #e5e5e5', whiteSpace: 'nowrap' }}>{(response.surveys as any)?.title || ''}</td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #e5e5e5', whiteSpace: 'nowrap' }}>
                      <span style={{ background: getLeadScoreColor(score), color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>
                        {response.lead_score ?? '-'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #e5e5e5' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                        {visiblePainPoints.map((painPoint: string, idx: number) => (
                          <span key={`${painPoint}-${idx}`} style={{ background: '#efefef', color: '#444', borderRadius: 20, padding: '2px 8px', fontSize: 11 }}>
                            {painPoint}
                          </span>
                        ))}
                        {remainingPainPoints > 0 && <span style={{ color: '#666', fontSize: 11 }}>{`+${remainingPainPoints} more`}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #e5e5e5', whiteSpace: 'nowrap' }}>
                      {response.created_at ? new Date(response.created_at).toLocaleDateString() : ''}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
