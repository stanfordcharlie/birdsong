import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/anthropic'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { surveyId, respondentName, respondentEmail, respondentPhone } = await req.json()
  const supabase = await createClient()

  const { data: survey } = await supabase
    .from('surveys')
    .select('*')
    .eq('id', surveyId)
    .single()

  if (!survey) return NextResponse.json({ error: 'Survey not found' }, { status: 404 })

  const { data: response } = await supabase
    .from('responses')
    .insert({
      survey_id: surveyId,
      respondent_name: respondentName,
      respondent_email: respondentEmail,
      respondent_phone: respondentPhone,
      messages: [],
      completed: false,
    })
    .select()
    .single()

  const systemPrompt = `IMPORTANT: Never start by asking about frustrations, problems, challenges, or anything negative. Open with genuine curiosity about what they do and how they work. Your first question should be warm and open-ended about their role or their organization, not about problems. You are a market researcher conducting a genuine industry study. Your goal is to understand how ${survey.topic} professionals work -- their tools, processes, workflows, and day-to-day realities. Be naturally curious and conversational. Ask one question at a time. Listen carefully and ask thoughtful follow-up questions based on what they share. Never mention problems, pain points, challenges, or solutions directly -- just let the conversation flow naturally. If someone mentions a difficulty, acknowledge it briefly and move on without dwelling on it. You are not selling anything. When you have had a rich, natural conversation covering the research theme (typically 5-8 exchanges), wrap up warmly and say exactly INTERVIEW_COMPLETE followed by a single genuine thank-you sentence.`

  const aiResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Hello' }],
  })

  const firstMessage = aiResponse.content[0].type === 'text' ? aiResponse.content[0].text : ''

  await supabase
    .from('responses')
    .update({ messages: [{ role: 'assistant', content: firstMessage }] })
    .eq('id', response.id)

  return NextResponse.json({ responseId: response.id, firstMessage })
}
