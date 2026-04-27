import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminLayout from '@/components/AdminLayout'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

function getLeadScoreColor(score: number) {
  if (score >= 8) return '#1a1a1a'
  if (score >= 5) return '#ca8a04'
  return '#dc2626'
}

export default async function HomePage() {
  const supabase = await createClient()

  const [{ count: totalResponses = 0 }, { count: hotLeads = 0 }, { count: activeSurveys = 0 }, { data: recentResponses = [] }] = await Promise.all([
    supabase.from('responses').select('*', { count: 'exact', head: true }).eq('completed', true),
    supabase.from('responses').select('*', { count: 'exact', head: true }).eq('completed', true).gte('lead_score', 8),
    supabase.from('surveys').select('*', { count: 'exact', head: true }),
    supabase
      .from('responses')
      .select('id, respondent_name, respondent_email, lead_score, created_at, surveys:survey_id(title)')
      .eq('completed', true)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const greeting = getGreeting()

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{`Good ${greeting}, Charlie`}</div>
            <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>{today}</div>
          </div>
          <Link href="/admin/create" style={{ background: '#1a1a1a', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 13, textDecoration: 'none' }}>
            + New Survey
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', flex: 1, border: '1px solid #e5e5e5', color: '#1a1a1a' }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{totalResponses}</div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', marginTop: 6 }}>Total Responses</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', flex: 1, border: '1px solid #e5e5e5', color: '#1a1a1a' }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{hotLeads}</div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', marginTop: 6 }}>Hot Leads</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', flex: 1, border: '1px solid #e5e5e5', color: '#1a1a1a' }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{activeSurveys}</div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', marginTop: 6 }}>Active Surveys</div>
          </div>
        </div>

        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', marginBottom: 12 }}>Recent Responses</div>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {(recentResponses || []).map((response) => {
            const score = typeof response.lead_score === 'number' ? response.lead_score : 1
            return (
              <Link key={response.id} href={`/admin/responses/${response.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5', padding: '10px 16px', fontSize: 13 }}>
                  <div style={{ flex: '0 0 180px', color: '#1a1a1a', fontWeight: 500, whiteSpace: 'nowrap' }}>{response.respondent_name}</div>
                  <div style={{ flex: '0 0 220px', whiteSpace: 'nowrap' }}>{response.respondent_email}</div>
                  <div style={{ flex: '0 0 220px', whiteSpace: 'nowrap' }}>{(response.surveys as any)?.title || ''}</div>
                  <div style={{ flex: '0 0 100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ background: getLeadScoreColor(score), color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>
                      {response.lead_score ?? '-'}
                    </span>
                  </div>
                  <div style={{ flex: '0 0 120px', whiteSpace: 'nowrap' }}>
                    {response.created_at ? new Date(response.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}
