'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const supabase = createClient()
  const router = useRouter()
  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/landing')
  }
  return (
    <button onClick={handleSignOut} style={{ background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 16px', fontSize: 13, color: '#111', cursor: 'pointer' }}>
      Sign out
    </button>
  )
}
