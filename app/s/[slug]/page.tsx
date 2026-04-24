import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SurveyInterview from '@/components/SurveyInterview'

export default async function SurveyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: survey } = await supabase
    .from('surveys')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!survey) return notFound()

  return <SurveyInterview survey={survey} />
}
