import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/anthropic'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { surveyId, respondentName, respondentEmail, respondentPhone, customFieldValues } = await req.json()
  const supabase = await createClient()

  const { data: survey } = await supabase
    .from('surveys')
    .select('*')
    .eq('id', surveyId)
    .single()

  if (!survey) return NextResponse.json({ error: 'Survey not found' }, { status: 404 })

  // Admin needs to run:
  // alter table responses add column if not exists custom_field_values jsonb default '{}';
  const { data: response } = await supabase
    .from('responses')
    .insert({
      survey_id: surveyId,
      respondent_name: respondentName,
      respondent_email: respondentEmail,
      respondent_phone: respondentPhone,
      custom_field_values: customFieldValues || {},
      messages: [],
      completed: false,
    })
    .select()
    .single()

  const systemPrompt = "You are conducting a focused industry research conversation on behalf of " + survey.sponsor + ". You are talking to a " + survey.question_guide + " Your job is to have a direct, peer-level conversation. You are knowledgeable about this industry. Speak like someone who understands their world, not like a generic interviewer. Rules: Ask one short specific question at a time, one sentence max. Never use em dashes in your responses. No excessive agreement or affirmations. Ask about specific tools, workflows, and processes. Get concrete. When someone describes how they do something, follow up with how does that actually work in practice style questions. If they mention a tool or process, ask what they like or would change about it. Never use the words pain points, challenges, frustrations, problems, solutions, or software pitch language. CRITICAL: Never ask more than one question per message. Pick the most important one. If a respondent gives a very short or evasive answer, move on to the next question. If they give minimal answers 3 times in a row, wrap up immediately. After 5 to 7 exchanges wrap up and say exactly INTERVIEW_COMPLETE followed by one brief closing sentence."

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
