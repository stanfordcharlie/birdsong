'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useMemo, useState } from 'react'

function toKebabCase(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function CreateSurveyPage() {
  const [title, setTitle] = useState('')
  const [sponsor, setSponsor] = useState('')
  const [industry, setIndustry] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companySize, setCompanySize] = useState('11-50')
  const [researchTheme, setResearchTheme] = useState('')
  const [questionCount, setQuestionCount] = useState(5)
  const [questionLengthPreference, setQuestionLengthPreference] = useState('Short (1 sentence)')
  const [tone, setTone] = useState('Conversational and curious (recommended)')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [giftCardAmount, setGiftCardAmount] = useState(10)
  const [submitting, setSubmitting] = useState(false)
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const estimatedMinutes = useMemo(() => Math.round((questionCount * 90) / 60), [questionCount])

  useEffect(() => {
    if (!slugEdited) {
      setSlug(toKebabCase(title))
    }
  }, [title, slugEdited])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setCreatedSlug(null)

    const res = await fetch('/api/admin/surveys/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        sponsor,
        industry,
        jobTitle,
        companySizes: companySize,
        researchTheme,
        numQuestions: questionCount,
        questionLength: questionLengthPreference,
        tone,
        slug,
        giftCardAmount,
      }),
    })

    const data = await res.json()
    if (res.ok && data.slug) {
      setCreatedSlug(data.slug)
    }
    setSubmitting(false)
  }

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 64px' }}>
        <Link href="/admin/surveys" style={{ color: '#1a1a1a', textDecoration: 'underline', fontSize: 14 }}>
          View all surveys
        </Link>

        <h1 style={{ marginTop: 16, marginBottom: 24, fontSize: 28, fontWeight: 600 }}>Create Survey</h1>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Survey title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }} />

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Sponsor/company name</label>
          <input value={sponsor} onChange={(e) => setSponsor(e.target.value)} required style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }} />

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Target ICP: industry</label>
          <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="B2B SaaS" required style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }} />

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Who are we talking to?</label>
          <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Parks and recreation directors" required style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }} />

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Target ICP: company size</label>
          <select value={companySize} onChange={(e) => setCompanySize(e.target.value)} required style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }}>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-1000">201-1000</option>
            <option value="1000+">1000+</option>
          </select>

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Research theme</label>
          <textarea value={researchTheme} onChange={(e) => setResearchTheme(e.target.value)} placeholder="e.g. How parks and recreation departments manage their software and technology stack" required rows={4} style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }} />

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Number of questions</label>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input type="number" min={3} max={12} value={questionCount} onChange={(e) => setQuestionCount(Math.max(3, Math.min(12, Number(e.target.value) || 3)))} required style={{ width: 160, padding: '12px 16px', border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }} />
            <input readOnly value={`~${estimatedMinutes} minutes`} style={{ flex: 1, padding: '12px 16px', border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }} />
          </div>

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Question length preference</label>
          <select value={questionLengthPreference} onChange={(e) => setQuestionLengthPreference(e.target.value)} required style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }}>
            <option value="Short (1 sentence)">Short (1 sentence)</option>
            <option value="Medium (2-3 sentences)">Medium (2-3 sentences)</option>
            <option value="Detailed (4+ sentences)">Detailed (4+ sentences)</option>
          </select>

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Interview tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} required style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }}>
            <option value="Conversational and curious (recommended)">Conversational and curious (recommended)</option>
            <option value="Peer-to-peer casual">Peer-to-peer casual</option>
            <option value="Academic and structured">Academic and structured</option>
          </select>

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>URL slug</label>
          <input value={slug} onChange={(e) => { setSlugEdited(true); setSlug(toKebabCase(e.target.value)) }} required style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }} />

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Gift card incentive amount</label>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <span style={{ marginRight: 8, fontSize: 16 }}>$</span>
            <input type="number" min={0} value={giftCardAmount} onChange={(e) => setGiftCardAmount(Number(e.target.value) || 0)} required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }} />
          </div>

          <button type="submit" disabled={submitting} style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 16, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
            {submitting ? 'Creating...' : 'Create Survey'}
          </button>
        </form>

        {createdSlug && (
          <p style={{ marginTop: 20, fontSize: 15 }}>
            Live survey URL: <a href={`https://birdsong-ten.vercel.app/s/${createdSlug}`} target="_blank" rel="noreferrer" style={{ color: '#1a1a1a', textDecoration: 'underline' }}>{`birdsong-ten.vercel.app/s/${createdSlug}`}</a>
          </p>
        )}
      </div>
    </div>
  )
}
