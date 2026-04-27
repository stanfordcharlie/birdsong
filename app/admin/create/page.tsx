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
  const [numQuestions, setNumQuestions] = useState<string | number>(5)
  const [questionLengthPreference, setQuestionLengthPreference] = useState('Short (1 sentence)')
  const [tone, setTone] = useState('Conversational and curious (recommended)')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [giftCardAmount, setGiftCardAmount] = useState(10)
  const [customFields, setCustomFields] = useState<{ label: string, required: boolean }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const minutes = numQuestions === '' ? 0 : Math.round((Number(numQuestions) * 90) / 60)
  const inputStyle = { width: 160, padding: '12px 16px', border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box' as const, background: '#ffffff', color: '#1a1a1a' }

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
        numQuestions,
        questionLength: questionLengthPreference,
        tone,
        slug,
        giftCardAmount,
        customFields: JSON.stringify(customFields),
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
          <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. VP of Sales, Head of Sales, Director of Sales" required style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }} />

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Target ICP: company size</label>
          <select value={companySize} onChange={(e) => setCompanySize(e.target.value)} required style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }}>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-1000">201-1000</option>
            <option value="1000+">1000+</option>
          </select>

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Research theme</label>
          <textarea value={researchTheme} onChange={(e) => setResearchTheme(e.target.value)} placeholder="e.g. How B2B SaaS sales teams build and manage their outbound pipeline" required rows={4} style={{ display: 'block', width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }} />

          <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Number of questions</label>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input
              type="text"
              inputMode="numeric"
              value={numQuestions}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '')
                setNumQuestions(val === '' ? '' : Math.min(12, Math.max(1, parseInt(val))))
              }}
              placeholder="5"
              style={inputStyle}
            />
            <input readOnly value={`~${minutes} minutes`} style={{ flex: 1, padding: '12px 16px', border: '1px solid #ccc', borderRadius: 8, fontSize: 16, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }} />
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

          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 8 }}>Custom respondent fields</label>
          <p style={{ fontSize: 12, color: '#999', marginTop: 0, marginBottom: 12 }}>Add fields to collect additional info from respondents before the interview starts</p>

          <div style={{ marginBottom: 12 }}>
            {customFields.map((field, index) => (
              <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <input
                  value={field.label}
                  onChange={(e) => {
                    const next = [...customFields]
                    next[index] = { ...next[index], label: e.target.value }
                    setCustomFields(next)
                  }}
                  placeholder="Field label"
                  style={{ flex: 1, padding: '10px 12px', border: '1px solid #ccc', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', background: '#ffffff', color: '#1a1a1a' }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => {
                      const next = [...customFields]
                      next[index] = { ...next[index], required: e.target.checked }
                      setCustomFields(next)
                    }}
                  />
                  Required
                </label>
                <button
                  type="button"
                  onClick={() => setCustomFields((prev) => prev.filter((_, i) => i !== index))}
                  style={{ color: '#999', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => setCustomFields((prev) => [...prev, { label: '', required: false }])}
              style={{ background: 'transparent', border: '1px dashed #ccc', borderRadius: 8, padding: '8px 16px', fontSize: 13, color: '#666', cursor: 'pointer' }}
            >
              Add field
            </button>
            {['Company name', 'Job title', 'LinkedIn URL'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCustomFields((prev) => [...prev, { label: preset, required: false }])}
                style={{ background: '#f0f0f0', border: 'none', borderRadius: 20, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}
              >
                {preset}
              </button>
            ))}
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
