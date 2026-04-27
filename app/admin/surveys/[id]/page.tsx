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
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f5f0e8', minHeight: '100vh', padding: '40px', marginLeft: 56 }}>
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/surveys" style={{ fontSize: 12, color: '#999', textDecoration: 'none' }}>All Surveys</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>{survey.title}</h1>
          <p style={{ fontSize: 13, color: '#666', margin: 0 }}>Sponsor: {survey.sponsor}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <CopySurveyLink url={liveSurveyUrl} />
          <a
            href={liveSurveyUrl}
            target="_blank"
            style={{ fontSize: 13, background: '#1a1a1a', color: '#fff', padding: '10px 18px', borderRadius: 8, textDecoration: 'none' }}
          >
            View live survey
          </a>
        </div>
      </div>
      <div style={{ borderBottom: '1px solid #e5e5e5', margin: '24px 0' }} />

      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'TOTAL RESPONSES', value: totalResponses },
          { label: 'AVG LEAD SCORE', value: avgScore },
          { label: 'HOT LEADS', value: hotLeads },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#fff', borderRadius: 12, padding: 24, flex: 1, border: '1px solid #e5e5e5' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>{stat.value}</div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '12px 20px', background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}>
          {['NAME', 'EMAIL', 'LEAD SCORE', 'DATE'].map(col => (
            <div key={col} style={{ flex: col === 'NAME' ? '0 0 200px' : col === 'EMAIL' ? '0 0 240px' : col === 'LEAD SCORE' ? '0 0 120px' : '1', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>{col}</div>
          ))}
        </div>
        {responses && responses.length > 0 ? responses.map(r => (
          <Link key={r.id} href={`/admin/responses/${r.id}`} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f5f5f5', textDecoration: 'none', color: '#1a1a1a', fontSize: 13 }}>
            <div style={{ flex: '0 0 200px', fontWeight: 500 }}>{r.respondent_name}</div>
            <div style={{ flex: '0 0 240px', color: '#666' }}>{r.respondent_email}</div>
            <div style={{ flex: '0 0 120px', display: 'flex', justifyContent: 'center' }}>
              <span style={{ background: (r.lead_score || 0) >= 8 ? '#16a34a' : (r.lead_score || 0) >= 5 ? '#ca8a04' : '#dc2626', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>{r.lead_score || 0}</span>
            </div>
            <div style={{ flex: 1, color: '#666' }}>{new Date(r.created_at).toLocaleDateString()}</div>
          </Link>
        )) : (
          <div style={{ padding: 60, textAlign: 'center', color: '#999', fontSize: 14 }}>No responses yet. Share the survey link to get started.</div>
        )}
      </div>
    </div>
  )
}
