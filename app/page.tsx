import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminLayout from '@/components/AdminLayout'

function getLeadScoreColor(score: number) {
  if (score >= 8) return '#1a1a1a'
  if (score >= 5) return '#ca8a04'
  return '#dc2626'
}

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/landing')
  }
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const [{ count: totalResponses = 0 }, { count: hotLeads = 0 }, { count: activeSurveys = 0 }, { data: recentResponses = [] }] = await Promise.all([
    supabase.from('responses').select('*', { count: 'exact', head: true }).eq('completed', true).eq('user_id', user.id),
    supabase.from('responses').select('*', { count: 'exact', head: true }).eq('completed', true).gte('lead_score', 8).eq('user_id', user.id),
    supabase.from('surveys').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase
      .from('responses')
      .select('id, respondent_name, respondent_email, lead_score, created_at, surveys:survey_id(title)')
      .eq('completed', true)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return (
    <AdminLayout>
      <div style={{ background: '#f8f8f7', minHeight: '100vh', fontFamily: 'Inter, -apple-system, sans-serif', color: '#111111', marginLeft: 56 }}>
        <div style={{ height: 56, background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#111111' }}>Home</div>
          <Link href="/admin/create" style={{ background: '#111111', color: '#ffffff', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            + New Survey
          </Link>
        </div>
        <div style={{ padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#111111' }}>{greeting}, Charlie</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 28 }}>
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#111111' }}>{totalResponses}</div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginTop: 4 }}>Total Responses</div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#111111' }}>{hotLeads}</div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginTop: 4 }}>Hot Leads</div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#111111' }}>{activeSurveys}</div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginTop: 4 }}>Active Surveys</div>
            </div>
          </div>

          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 12 }}>Recent Responses</div>
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            {(recentResponses || []).map((response) => {
              const score = typeof response.lead_score === 'number' ? response.lead_score : 1
              return (
                <Link key={response.id} href={`/admin/responses/${response.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6', padding: '12px 16px', fontSize: 13, alignItems: 'center' }}>
                    <div style={{ flex: '0 0 180px', color: '#111111', fontWeight: 500, whiteSpace: 'nowrap' }}>{response.respondent_name}</div>
                    <div style={{ flex: '0 0 220px', color: '#6b7280', whiteSpace: 'nowrap' }}>{response.respondent_email}</div>
                    <div style={{ flex: '1 1 auto', color: '#6b7280', whiteSpace: 'nowrap' }}>{(response.surveys as any)?.title || ''}</div>
                    <div style={{ flex: '0 0 100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ background: getLeadScoreColor(score), color: '#ffffff', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>
                        {response.lead_score ?? '-'}
                      </span>
                    </div>
                    <div style={{ flex: '0 0 110px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {response.created_at ? new Date(response.created_at).toLocaleDateString() : ''}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
