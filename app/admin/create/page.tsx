'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'

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
  const [customFields, setCustomFields] = useState<{ label: string; required: boolean }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const minutes = numQuestions === '' ? 0 : Math.round((Number(numQuestions) * 90) / 60)

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    fontSize: 14,
    boxSizing: 'border-box' as const,
    background: '#ffffff',
    color: '#111111',
    outline: 'none',
  }

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
    <div style={{ background: '#f8f8f7', minHeight: '100vh', fontFamily: 'Inter, -apple-system, sans-serif', color: '#111111', marginLeft: 56 }}>
      <div style={{ height: 56, background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#111111' }}>Create Survey</h1>
        <Link href="/admin/surveys" style={{ color: '#111111', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
          All surveys
        </Link>
      </div>
      <div style={{ padding: 32 }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: 640, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 16 }}>Basics</div>

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#111111' }}>Survey title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ ...inputStyle, marginBottom: 16 }} />

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#111111' }}>Sponsor/company name</label>
          <input value={sponsor} onChange={(e) => setSponsor(e.target.value)} required style={{ ...inputStyle, marginBottom: 16 }} />

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#111111' }}>Target ICP: industry</label>
          <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="B2B SaaS" required style={{ ...inputStyle, marginBottom: 16 }} />

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#111111' }}>Who are we talking to?</label>
          <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. VP of Sales, Head of Sales, Director of Sales" required style={{ ...inputStyle, marginBottom: 16 }} />

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#111111' }}>Target ICP: company size</label>
          <select value={companySize} onChange={(e) => setCompanySize(e.target.value)} required style={{ ...inputStyle, marginBottom: 16 }}>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-1000">201-1000</option>
            <option value="1000+">1000+</option>
          </select>

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#111111' }}>Research theme</label>
          <textarea value={researchTheme} onChange={(e) => setResearchTheme(e.target.value)} placeholder="e.g. How B2B SaaS sales teams build and manage their outbound pipeline" required rows={4} style={{ ...inputStyle, marginBottom: 16, resize: 'vertical' }} />

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#111111' }}>Number of questions</label>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input
              type="text"
              inputMode="numeric"
              value={numQuestions}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                setNumQuestions(val === '' ? '' : Math.min(12, Math.max(1, parseInt(val))))
              }}
              placeholder="5"
              style={{ ...inputStyle, width: 160 }}
            />
            <input readOnly value={`~${minutes} minutes`} style={{ ...inputStyle, flex: 1, color: '#6b7280' }} />
          </div>

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#111111' }}>Question length preference</label>
          <select value={questionLengthPreference} onChange={(e) => setQuestionLengthPreference(e.target.value)} required style={{ ...inputStyle, marginBottom: 16 }}>
            <option value="Short (1 sentence)">Short (1 sentence)</option>
            <option value="Medium (2-3 sentences)">Medium (2-3 sentences)</option>
            <option value="Detailed (4+ sentences)">Detailed (4+ sentences)</option>
          </select>

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#111111' }}>Interview tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} required style={{ ...inputStyle, marginBottom: 16 }}>
            <option value="Conversational and curious (recommended)">Conversational and curious (recommended)</option>
            <option value="Peer-to-peer casual">Peer-to-peer casual</option>
            <option value="Academic and structured">Academic and structured</option>
          </select>

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#111111' }}>URL slug</label>
          <input value={slug} onChange={(e) => { setSlugEdited(true); setSlug(toKebabCase(e.target.value)) }} required style={{ ...inputStyle, marginBottom: 16 }} />

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#111111' }}>Gift card incentive amount</label>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <span style={{ marginRight: 8, fontSize: 14 }}>$</span>
            <input type="number" min={0} value={giftCardAmount} onChange={(e) => setGiftCardAmount(Number(e.target.value) || 0)} required style={inputStyle} />
          </div>

          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 16, marginTop: 28 }}>Custom Fields</div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#111111', marginBottom: 8 }}>Custom respondent fields</label>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 0, marginBottom: 12 }}>Add fields to collect additional info from respondents before the interview starts.</p>

          <div style={{ marginBottom: 12 }}>
            {customFields.map((field, index) => (
              <div key={index} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
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
                {field.label ? (
                  <div style={{ flex: 1, fontSize: 14, color: '#111111' }}>{field.label}</div>
                ) : (
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => {
                      const next = [...customFields]
                      next[index] = { ...next[index], label: e.target.value }
                      setCustomFields(next)
                    }}
                    placeholder="Field name"
                    style={{ border: 'none', outline: 'none', fontSize: 14, flex: 1, background: 'transparent', color: '#111111' }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => setCustomFields((prev) => prev.filter((_, i) => i !== index))}
                  style={{ color: '#6b7280', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => setCustomFields((prev) => [...prev, { label: '', required: true }])}
              style={{ background: 'transparent', border: '1px dashed #e5e7eb', borderRadius: 8, padding: '10px 16px', fontSize: 13, color: '#6b7280', cursor: 'pointer', width: '100%', marginTop: 8, textAlign: 'center' }}
            >
              Add custom field
            </button>
            {['Company name', 'Job title', 'LinkedIn URL'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCustomFields((prev) => [...prev, { label: preset, required: true }])}
                style={{ background: '#f3f4f6', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 12, color: '#111111', cursor: 'pointer', marginRight: 8 }}
              >
                {preset}
              </button>
            ))}
          </div>

          <button type="submit" disabled={submitting} style={{ width: '100%', background: '#111111', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
            {submitting ? 'Creating...' : 'Create Survey'}
          </button>
        </form>

        {createdSlug && (
          <p style={{ marginTop: 16, fontSize: 13, color: '#6b7280' }}>
            Live survey URL:{' '}
            <a href={`https://birdsong-ten.vercel.app/s/${createdSlug}`} target="_blank" rel="noreferrer" style={{ color: '#111111', textDecoration: 'none', fontWeight: 500 }}>
              {`birdsong-ten.vercel.app/s/${createdSlug}`}
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
