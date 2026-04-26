import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function toKebabCase(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function POST(req: Request) {
  const {
    title,
    sponsor,
    industry,
    jobTitle,
    companySize,
    painPointHypothesis,
    questionCount,
    questionLengthPreference,
    slug,
    giftCardAmount,
  } = await req.json()

  const supabase = await createClient()
  const baseSlug = toKebabCase(slug || title || 'survey')

  let finalSlug = baseSlug
  let attempt = 1
  // Keep slugs unique in case user-entered slug already exists.
  while (true) {
    const { data: existing } = await supabase
      .from('surveys')
      .select('id')
      .eq('slug', finalSlug)
      .maybeSingle()
    if (!existing) break
    attempt += 1
    finalSlug = `${baseSlug}-${attempt}`
  }

  const topic = `${industry} industry research focused on ${painPointHypothesis}`
  const question_guide = `Ask ${questionCount} questions following this theme: ${painPointHypothesis}. Target respondent is a ${jobTitle} at a ${companySize} company in ${industry}. Keep each question ${questionLengthPreference}.`
  const systemPromptContext = `Survey title: ${title}. Sponsor: ${sponsor}. Target ICP industry: ${industry}. Target ICP job title: ${jobTitle}. Target ICP company size: ${companySize}. Core pain point hypothesis: ${painPointHypothesis}. Number of questions: ${questionCount}. Question length preference: ${questionLengthPreference}. Gift card incentive amount: $${giftCardAmount}.`
  void systemPromptContext

  const { data, error } = await supabase
    .from('surveys')
    .insert({
      slug: finalSlug,
      title,
      sponsor,
      topic,
      question_guide,
    })
    .select('id, slug')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, slug: data.slug })
}
