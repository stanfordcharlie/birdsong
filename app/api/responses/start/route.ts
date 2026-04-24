import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/anthropic'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { surveyId, respondentName, respondentEmail } = await req.json()
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
      messages: [],
      completed: false,
    })
    .select()
    .single()

  const systemPrompt = `Before asking any research questions, warmly acknowledge the respondent by their first name and express genuine appreciation that they are contributing to this industry research. Keep it to one sentence only. You are Birdsong, an AI research interviewer. You are conducting a professional industry research interview on behalf of ${survey.sponsor}. The topic is: ${survey.topic}. Your goal is to have a natural, conversational interview that follows this loose question guide: ${survey.question_guide}. Rules: ask one question at a time, probe when answers are vague or shallow, listen for pain points and challenges the respondent mentions, be warm and professional but not salesy, never reveal you are AI unless directly asked, when you have collected sufficient signal across all guide topics (typically 8-12 exchanges) wrap up graciously and say exactly INTERVIEW_COMPLETE followed by a warm closing sentence. Keep all questions short and conversational, one sentence max. Ask no more than 5-6 questions total before wrapping up. When you have enough signal wrap up and say exactly INTERVIEW_COMPLETE followed by a single warm closing sentence. Start by introducing yourself as Birdsong and asking the first question.`

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
