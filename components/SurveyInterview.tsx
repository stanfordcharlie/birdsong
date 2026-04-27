'use client'

import { useEffect, useRef, useState } from 'react'

interface Survey {
  id: string
  title: string
  topic: string
  sponsor: string
  question_guide: string
}

interface Message {
  role: 'assistant' | 'user'
  content: string
}

type Theme = 'light' | 'dark'

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export default function SurveyInterview({ survey }: { survey: Survey }) {
  const [stage, setStage] = useState<'intro' | 'interview' | 'complete'>('intro')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [responseId, setResponseId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const phoneInputRef = useRef<HTMLInputElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('birdsong-theme')
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    if (stage !== 'interview' || messages.length === 0) return
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === 'assistant') {
      inputRef.current?.focus()
    }
  }, [messages, stage])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (stage === 'intro') {
      nameInputRef.current?.focus()
    }
  }, [stage])

  function toggleTheme() {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    window.localStorage.setItem('birdsong-theme', nextTheme)
  }

  const colors = theme === 'light'
    ? {
        background: '#f5f0e8',
        text: '#1a1a1a',
        inputBackground: 'transparent',
        assistantBubble: '#ede8df',
        userBubble: '#1a1a1a',
        userText: '#fff',
      }
    : {
        background: '#1c1c1e',
        text: '#e8e8e8',
        inputBackground: 'transparent',
        assistantBubble: '#2c2c2e',
        userBubble: '#3a3a3c',
        userText: '#fff',
      }

  const isDark = theme === 'dark'

  const themeToggle = (
    <button
      onClick={toggleTheme}
      style={{ position: 'fixed', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', color: colors.text }}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )

  async function handleStart() {
    if (!name || !email || phone.length !== 14) return
    setLoading(true)
    const res = await fetch('/api/responses/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ surveyId: survey.id, respondentName: name, respondentEmail: email, respondentPhone: phone }),
    })
    const data = await res.json()
    setResponseId(data.responseId)
    setMessages([{ role: 'assistant', content: data.firstMessage }])
    setStage('interview')
    setLoading(false)
  }

  async function handleSend() {
    if (!input.trim() || !responseId) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
    const res = await fetch('/api/responses/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseId, userMessage }),
    })
    const data = await res.json()
    setMessages(prev => [...prev, { role: 'assistant', content: data.assistantMessage }])
    if (data.completed) setStage('complete')
    setLoading(false)
  }

  if (stage === 'intro') return (
    <div style={{ background: colors.background, minHeight: '100vh', color: colors.text, fontFamily: 'Inter, sans-serif' }}>
      {themeToggle}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{survey.title}</h1>
        <p style={{ color: colors.text, marginBottom: 32 }}>This is a short research interview. Your responses are confidential and will be used to generate an industry report.</p>
        <input
          ref={nameInputRef}
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              emailInputRef.current?.focus()
            }
          }}
          className={isDark ? 'birdsong-intro-input-dark' : undefined}
          style={isDark
            ? { display: 'block', width: '100%', padding: '12px 16px', marginBottom: 12, border: '1px solid #444', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#2c2c2e', color: '#e8e8e8' }
            : { display: 'block', width: '100%', padding: '12px 16px', marginBottom: 12, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }}
        />
        <input
          ref={emailInputRef}
          placeholder="Your work email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              phoneInputRef.current?.focus()
            }
          }}
          className={isDark ? 'birdsong-intro-input-dark' : undefined}
          style={isDark
            ? { display: 'block', width: '100%', padding: '12px 16px', marginBottom: 24, border: '1px solid #444', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#2c2c2e', color: '#e8e8e8' }
            : { display: 'block', width: '100%', padding: '12px 16px', marginBottom: 24, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }}
        />
        <input
          ref={phoneInputRef}
          type="tel"
          maxLength={14}
          placeholder="Your phone number"
          value={phone}
          onChange={e => setPhone(formatPhone(e.target.value))}
          onKeyDown={e => {
            if (e.key === 'Enter' && name && email && phone.length === 14) {
              e.preventDefault()
              void handleStart()
            }
          }}
          className={isDark ? 'birdsong-intro-input-dark' : undefined}
          style={isDark
            ? { display: 'block', width: '100%', padding: '12px 16px', marginBottom: 24, border: '1px solid #444', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#2c2c2e', color: '#e8e8e8' }
            : { display: 'block', width: '100%', padding: '12px 16px', marginBottom: 24, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }}
        />
        <button onClick={handleStart} disabled={loading || !name || !email || phone.length !== 14} style={{ background: isDark ? '#3a3a3c' : '#1a1a1a', color: '#ffffff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 16, cursor: 'pointer', opacity: name && email && phone.length === 14 ? 1 : 0.5 }}>
          {loading ? 'Starting...' : 'Begin Interview'}
        </button>
      </div>
    </div>
  )

  if (stage === 'complete') return (
    <div style={{ background: colors.background, minHeight: '100vh', color: colors.text, fontFamily: 'Inter, sans-serif' }}>
      {themeToggle}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Thank you, {name}.</h1>
        <p style={{ color: colors.text }}>You're all set — feel free to close this tab. We'll be in touch shortly with your gift card and a copy of the industry report.</p>
      </div>
    </div>
  )

  return (
    <div style={{ background: colors.background, minHeight: '100vh', color: colors.text, fontFamily: 'Inter, sans-serif' }}>
      {themeToggle}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 120px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 16, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '80%', background: m.role === 'user' ? colors.userBubble : colors.assistantBubble, color: m.role === 'user' ? colors.userText : colors.text, borderRadius: 12, padding: '12px 16px', fontSize: 15, lineHeight: 1.5 }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
            <div style={{ background: colors.assistantBubble, borderRadius: 12, padding: '12px 16px', fontSize: 15, color: colors.text }}>...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 24px 16px', background: colors.background }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', gap: 8 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type your response..."
            disabled={loading}
            className={isDark ? 'birdsong-chat-input-dark' : undefined}
            style={isDark
              ? { flex: 1, padding: '12px 16px', border: '1px solid #2a5298', borderRadius: 8, fontSize: 15, outline: 'none', background: '#1e3a5f', color: '#e8e8e8' }
              : { flex: 1, padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 15, outline: 'none', background: colors.inputBackground, color: colors.text }}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()} style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 20px', fontSize: 15, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            Send
          </button>
        </div>
      </div>
      <style jsx>{`
        .birdsong-intro-input-dark::placeholder {
          color: #888;
        }
        .birdsong-chat-input-dark::placeholder {
          color: #7a9cc4;
        }
      `}</style>
    </div>
  )
}
