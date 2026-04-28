import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CopySurveyLink from '@/components/CopySurveyLink'

export default async function SurveyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: survey } = await supabase
    .from('surveys')
    .select('*')
    .eq('id', id)
    .single()

  if (!survey) return notFound()

  const { data: responses } = await supabase
    .from('responses')
    .select('id, respondent_name, respondent_email, respondent_phone, lead_score, pain_points, created_at, completed')
    .eq('survey_id', id)
    .eq('completed', true)
    .order('created_at', { ascending: false })

  const totalResponses = responses?.length || 0
  const avgScore = responses && responses.length > 0
    ? Math.round(responses.reduce((sum, r) => sum + (r.lead_score || 0), 0) / responses.length)
    : 0
  const hotLeads = responses?.filter(r => (r.lead_score || 0) >= 8).length || 0
  const liveSurveyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/s/${survey.slug}`

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', background: '#f8f8f7', minHeight: '100vh', marginLeft: 56 }}>
      <div style={{ height: 56, background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/admin/surveys" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>
            Surveys
          </Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ fontSize: 14, color: '#111111', fontWeight: 500 }}>{survey.title}</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <CopySurveyLink url={liveSurveyUrl} />
          <a
            href={liveSurveyUrl}
            target="_blank"
            style={{ fontSize: 13, fontWeight: 500, background: '#111111', color: '#fff', padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}
          >
            View live survey
          </a>
        </div>
      </div>
      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#111111', marginBottom: 4 }}>{survey.title}</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>Sponsor: {survey.sponsor}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Responses', value: totalResponses },
            { label: 'Avg Lead Score', value: avgScore },
            { label: 'Hot Leads', value: hotLeads },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#ffffff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#111111', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', padding: '10px 16px', background: '#f8f8f7', borderBottom: '1px solid #e5e7eb' }}>
            {['Name', 'Email', 'Lead Score', 'Date'].map((col) => (
              <div key={col} style={{ flex: col === 'Name' ? '0 0 220px' : col === 'Email' ? '0 0 260px' : col === 'Lead Score' ? '0 0 120px' : '1', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>{col}</div>
            ))}
          </div>
          {responses && responses.length > 0 ? responses.map((r) => (
            <Link key={r.id} href={`/admin/responses/${r.id}`} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f3f4f6', textDecoration: 'none', color: '#111111', fontSize: 13 }}>
              <div style={{ flex: '0 0 220px', fontWeight: 500 }}>{r.respondent_name}</div>
              <div style={{ flex: '0 0 260px', color: '#6b7280' }}>{r.respondent_email}</div>
              <div style={{ flex: '0 0 120px', display: 'flex', justifyContent: 'center' }}>
                <span style={{ background: (r.lead_score || 0) >= 8 ? '#16a34a' : (r.lead_score || 0) >= 5 ? '#ca8a04' : '#dc2626', color: '#fff', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{r.lead_score || 0}</span>
              </div>
              <div style={{ flex: 1, color: '#6b7280' }}>{new Date(r.created_at).toLocaleDateString()}</div>
            </Link>
          )) : (
            <div style={{ padding: 60, textAlign: 'center', color: '#6b7280', fontSize: 14 }}>No responses yet. Share the survey link to get started.</div>
          )}
        </div>
      </div>
    </div>
  )
}
