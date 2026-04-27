'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
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
  const supabase = useMemo(() => createClient(), [])
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    async function loadSurveys() {
      const { data } = await supabase
        .from('surveys')
        .select('id, title, sponsor, slug, created_at')
        .order('created_at', { ascending: false })
      setSurveys((data || []) as Survey[])
    }
    void loadSurveys()
  }, [supabase])

  const allSelected = surveys.length > 0 && selected.length === surveys.length

  function toggleSurvey(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  function toggleAll() {
    setSelected(allSelected ? [] : surveys.map((survey) => survey.id))
  }

  async function handleDelete() {
    if (selected.length === 0) return
    const confirmed = window.confirm(`Delete ${selected.length} survey(s)?`)
    if (!confirmed) return
    await supabase.from('surveys').delete().in('id', selected)
    setSurveys((prev) => prev.filter((survey) => !selected.includes(survey.id)))
    setSelected([])
  }

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 64px' }}>
        <h1 style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 600 }}>All Surveys</h1>
        <Link href="/admin/create" style={{ color: '#1a1a1a', textDecoration: 'underline', fontSize: 14 }}>
          Create a survey
        </Link>

        <div style={{ marginTop: 20, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                </th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Title</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Sponsor</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Slug</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Created date</th>
                <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Live URL</th>
              </tr>
            </thead>
            <tbody>
              {(surveys || []).map((survey) => {
                const liveUrl = `https://birdsong-ten.vercel.app/s/${survey.slug}`
                const isSelected = selected.includes(survey.id)
                return (
                  <tr key={survey.id}>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSurvey(survey.id)} />
                    </td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                      <Link href={`/admin/surveys/${survey.id}`} style={{ color: '#1a1a1a', textDecoration: 'underline' }}>
                        {survey.title}
                      </Link>
                    </td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{survey.sponsor}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{survey.slug}</td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                      {survey.created_at ? new Date(survey.created_at).toLocaleDateString() : ''}
                    </td>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                      <CopyUrlButton url={liveUrl} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selected.length > 0 && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', color: '#fff', borderRadius: 12, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>{`${selected.length} selected`}</span>
          <button onClick={handleDelete} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>
            Delete
          </button>
          <button onClick={() => setSelected([])} style={{ background: 'transparent', color: '#fff', border: '1px solid #555', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
