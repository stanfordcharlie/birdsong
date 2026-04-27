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
    researchTheme,
    numQuestions,
    questionLength,
    tone,
    slug,
    giftCardAmount,
  } = body

  const finalSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const topic = `Market research: ${researchTheme} among ${jobTitle} professionals in ${industry}`

  const question_guide = `You are conducting genuine market research about: ${researchTheme}. Your respondents are ${jobTitle} professionals. Ask ${numQuestions} natural, open-ended questions that help you genuinely understand how they work, what tools they use, and what their day-to-day looks like. Tone: ${tone}. Never ask about problems or pain points directly. Just be curious about how they operate.`

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
