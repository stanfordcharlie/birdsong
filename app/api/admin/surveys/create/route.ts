import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()

  const {
    title,
    sponsor,
    industry,
    jobTitle,
    companySizes,
    painPoint,
    numQuestions,
    questionLength,
    slug,
    giftCardAmount,
  } = body

  const finalSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const topic = `${industry} industry research focused on: ${painPoint}`

  const question_guide = `Ask ${numQuestions} questions following this theme: ${painPoint}. Target respondent is a ${jobTitle} at a ${companySizes} company in ${industry}. Keep each question ${questionLength}. Uncover pain points naturally without being obvious.`

  const { data, error } = await supabase
    .from('surveys')
    .insert({
      slug: finalSlug,
      title,
      topic,
      sponsor,
      question_guide,
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, slug: data.slug })
}
