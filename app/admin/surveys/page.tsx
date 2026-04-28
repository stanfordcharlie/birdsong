'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import CopyUrlButton from './CopyUrlButton'

type Survey = {
  id: string
  title: string
  sponsor: string
  slug: string
  created_at: string | null
}

export default function AdminSurveysPage() {
  const [surveys, setSurveys] = useState<any[] | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('surveys').select('*').order('created_at', { ascending: false })
        setSurveys(data || [])
      } finally {
        setLoading(false)
      }
    }
    void fetchSurveys()
  }, [])

  const allSelected = (surveys?.length || 0) > 0 && selected.length === (surveys?.length ?? 0)

  function toggleSurvey(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  function toggleAll() {
    setSelected(allSelected ? [] : (surveys || []).map((survey) => survey.id))
  }

  async function handleDelete() {
    if (selected.length === 0) return
    const confirmed = window.confirm(`Delete ${selected.length} survey(s)?`)
    if (!confirmed) return
    const supabase = createClient()
    await supabase.from('surveys').delete().in('id', selected)
    setSurveys((prev) => (prev || []).filter((survey) => !selected.includes(survey.id)))
    setSelected([])
  }

  return (
    <div style={{ background: '#f8f8f7', minHeight: '100vh', fontFamily: 'Inter, -apple-system, sans-serif', color: '#111111', marginLeft: 56 }}>
      <div style={{ height: 56, background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#111111' }}>Surveys</h1>
        <Link href="/admin/create" style={{ color: '#111111', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
          Create survey
        </Link>
      </div>
      <div style={{ padding: '32px 32px 64px' }}>

        {surveys === null || loading === true ? (
          <div style={{ marginTop: 4 }}>
            <div className="skeleton" style={{ background: '#f3f4f6', borderRadius: 6, height: 40, width: '100%', marginBottom: 12 }} />
            <div className="skeleton" style={{ background: '#f3f4f6', borderRadius: 6, height: 40, width: '100%', marginBottom: 12 }} />
            <div className="skeleton" style={{ background: '#f3f4f6', borderRadius: 6, height: 40, width: '100%' }} />
          </div>
        ) : surveys.length === 0 ? (
          <div style={{ marginTop: 20, fontSize: 14, color: '#6b7280' }}>No surveys yet.</div>
        ) : (
          <div style={{ marginTop: 4, overflowX: 'auto', background: '#ffffff', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff' }}>
              <thead>
                <tr style={{ background: '#f8f8f7' }}>
                  <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '1px solid #e5e7eb' }}>
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '1px solid #e5e7eb', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '1px solid #e5e7eb', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>Sponsor</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '1px solid #e5e7eb', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>Slug</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '1px solid #e5e7eb', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>Created date</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '1px solid #e5e7eb', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>Live URL</th>
                </tr>
              </thead>
              <tbody>
                {(surveys || []).map((survey) => {
                  const liveUrl = `https://birdsong-ten.vercel.app/s/${survey.slug}`
                  const isSelected = selected.includes(survey.id)
                  return (
                    <tr key={survey.id}>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSurvey(survey.id)} />
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
                        <Link href={`/admin/surveys/${survey.id}`} style={{ color: '#111111', textDecoration: 'none', fontWeight: 500 }}>
                          {survey.title}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', fontSize: 13, color: '#6b7280' }}>{survey.sponsor}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', fontSize: 13, color: '#6b7280' }}>{survey.slug}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', fontSize: 13, color: '#6b7280' }}>
                        {survey.created_at ? new Date(survey.created_at).toLocaleDateString() : ''}
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
                        <CopyUrlButton url={liveUrl} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#111111', color: '#fff', borderRadius: 12, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>{`${selected.length} selected`}</span>
          <button onClick={handleDelete} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}>
            Delete
          </button>
          <button onClick={() => setSelected([])} style={{ background: 'transparent', color: '#fff', border: '1px solid #555', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}>
            Cancel
          </button>
        </div>
      )}
      <style>{`
@keyframes shimmer {
0% { opacity: 0.5; }
50% { opacity: 1; }
100% { opacity: 0.5; }
}
.skeleton { animation: shimmer 1.2s ease-in-out infinite; }
`}</style>
    </div>
  )
}
