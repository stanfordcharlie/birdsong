import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/SignOutButton'

function getInitials(name: string, email: string) {
  const source = name.trim() || email.trim()
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const fullName = (user.user_metadata?.full_name as string | undefined) || 'Birdsong User'
  const email = user.email || ''
  const memberSince = user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'

  const [{ count: totalSurveys = 0 }, { count: totalResponses = 0 }] = await Promise.all([
    supabase.from('surveys').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('responses').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  return (
    <div style={{ background: '#f8f8f7', minHeight: '100vh', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', color: '#111111', marginLeft: 56 }}>
      <div style={{ height: 56, background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#111111' }}>Profile</div>
        <SignOutButton />
      </div>

      <div style={{ padding: 32, maxWidth: 760 }}>
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#111111', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 18 }}>
              {getInitials(fullName, email)}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>{fullName}</div>
              <div style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>{email}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>Member since {memberSince}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{totalSurveys}</div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginTop: 4 }}>Total Surveys Created</div>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{totalResponses}</div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginTop: 4 }}>Total Responses Collected</div>
          </div>
        </div>
      </div>
    </div>
  )
}
