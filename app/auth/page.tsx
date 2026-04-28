'use client'

import { CSSProperties, FormEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

type AuthMode = 'signup' | 'signin'

export default function AuthPage() {
  const router = useRouter()
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )

  const [mode, setMode] = useState<AuthMode>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showMagicLink, setShowMagicLink] = useState(false)
  const [magicEmail, setMagicEmail] = useState('')
  const [magicSuccess, setMagicSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function resetMessages() {
    setError('')
    setMagicSuccess('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    resetMessages()
    setLoading(true)

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      })
      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }
      router.push('/')
      router.refresh()
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  async function handleMagicLink() {
    resetMessages()
    setLoading(true)
    const targetEmail = (magicEmail || email).trim()
    if (!targetEmail) {
      setError('Please enter your email address.')
      setLoading(false)
      return
    }
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: targetEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (otpError) {
      setError(otpError.message)
      setLoading(false)
      return
    }
    setMagicSuccess(`Check your email -- we sent a magic link to ${targetEmail}`)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#ffffff',
          borderRadius: 16,
          padding: 40,
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, color: '#111', textAlign: 'center', marginBottom: 8 }}>Birdsong</div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          <button
            onClick={() => {
              setMode('signup')
              setShowMagicLink(false)
              resetMessages()
            }}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '6px 20px',
              fontSize: 13,
              cursor: 'pointer',
              background: mode === 'signup' ? '#111' : 'transparent',
              color: mode === 'signup' ? '#fff' : '#666',
            }}
          >
            Sign up
          </button>
          <button
            onClick={() => {
              setMode('signin')
              setShowMagicLink(false)
              resetMessages()
            }}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '6px 20px',
              fontSize: 13,
              cursor: 'pointer',
              background: mode === 'signin' ? '#111' : 'transparent',
              color: mode === 'signin' ? '#fff' : '#666',
            }}
          >
            Sign in
          </button>
        </div>

        {!showMagicLink ? (
          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                style={inputStyle}
                required
              />
            )}
            <input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" disabled={loading} style={primaryButtonStyle}>
              {mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>
        ) : (
          <div>
            <input
              type="email"
              placeholder="Work email"
              value={magicEmail}
              onChange={(event) => setMagicEmail(event.target.value)}
              style={inputStyle}
              required
            />
            <button onClick={handleMagicLink} disabled={loading} style={primaryButtonStyle}>
              Send magic link
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          <span style={{ fontSize: 12, color: '#999' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>

        {!showMagicLink ? (
          <button
            onClick={() => {
              setShowMagicLink(true)
              setMagicEmail(email)
              resetMessages()
            }}
            style={secondaryButtonStyle}
          >
            Continue with magic link
          </button>
        ) : (
          <button
            onClick={() => {
              setShowMagicLink(false)
              resetMessages()
            }}
            style={secondaryButtonStyle}
          >
            Back to {mode === 'signup' ? 'create account' : 'sign in'}
          </button>
        )}

        {error && <p style={{ marginTop: 12, color: '#dc2626', fontSize: 13 }}>{error}</p>}
        {magicSuccess && <p style={{ marginTop: 12, color: '#111', fontSize: 13 }}>{magicSuccess}</p>}
      </div>
    </div>
  )
}

const inputStyle: CSSProperties = {
  width: '100%',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: '12px 14px',
  fontSize: 14,
  color: '#111',
  marginBottom: 12,
  outline: 'none',
}

const primaryButtonStyle: CSSProperties = {
  width: '100%',
  background: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: 12,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
}

const secondaryButtonStyle: CSSProperties = {
  width: '100%',
  border: '1px solid #e5e7eb',
  background: '#fff',
  color: '#111',
  borderRadius: 8,
  padding: 12,
  fontSize: 14,
  cursor: 'pointer',
}
