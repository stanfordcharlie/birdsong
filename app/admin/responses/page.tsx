import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminResponsesPage() {
  const supabase = await createClient()
  const { data: responses } = await supabase
    .from('responses')
    .select('id, respondent_name, respondent_email, respondent_phone, lead_score, pain_points, created_at, surveys(title)')
    .eq('completed', true)
    .order('created_at', { ascending: false })

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 600 }}>Completed Responses</h1>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Phone</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Survey</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Lead Score</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Pain Points</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {(responses || []).map((response) => (
                <tr key={response.id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    <Link href={`/admin/responses/${response.id}`} style={{ color: '#1a1a1a', textDecoration: 'underline' }}>
                      {response.respondent_name}
                    </Link>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{response.respondent_email}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{response.respondent_phone || ''}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{response.surveys?.title || ''}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{response.lead_score ?? ''}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    {Array.isArray(response.pain_points) ? response.pain_points.join(', ') : ''}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    {response.created_at ? new Date(response.created_at).toLocaleDateString() : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
