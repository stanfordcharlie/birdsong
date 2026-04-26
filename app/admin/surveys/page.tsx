import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CopyUrlButton from './CopyUrlButton'

export default async function AdminSurveysPage() {
  const supabase = await createClient()
  const { data: surveys } = await supabase
    .from('surveys')
    .select('id, title, sponsor, slug, created_at')
    .order('created_at', { ascending: false })

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
                return (
                  <tr key={survey.id}>
                    <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                      <Link href={`/admin/responses?survey=${survey.id}`} style={{ color: '#1a1a1a', textDecoration: 'underline' }}>
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
    </div>
  )
}
