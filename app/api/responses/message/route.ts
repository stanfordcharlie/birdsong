import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/anthropic'
import { NextResponse } from 'next/server'
import { completeResponse } from '@/lib/complete-response'

export async function POST(req: Request) {
  const { responseId, userMessage } = await req.json()
  const supabase = await createClient()

  const { data: response } = await supabase
    .from('responses')
    .select('*, surveys(*)')
    .eq('id', responseId)
    .single()

  if (!response) return NextResponse.json({ error: 'Response not found' }, { status: 404 })

  const survey = response.surveys
  const updatedMessages = [...response.messages, { role: 'user', content: userMessage }]

  const systemPrompt = `You are Birdsong, an AI research interviewer. You are conducting a professional industry research interview on behalf of ${survey.sponsor}. The topic is: ${survey.topic}. Your goal is to have a natural, conversational interview that follows this loose question guide: ${survey.question_guide}. Rules: ask one question at a time, probe when answers are vague or shallow, listen for pain points and challenges the respondent mentions, be warm and professional but not salesy, never reveal you are AI unless directly asked, when you have collected sufficient signal across all guide topics (typically 8-12 exchanges) wrap up graciously and say exactly INTERVIEW_COMPLETE followed by a warm closing sentence. Keep all questions short and conversational, one sentence max. Ask no more than 5-6 questions total before wrapping up. When you have enough signal wrap up and say exactly INTERVIEW_COMPLETE followed by a single warm closing sentence.`

  const aiResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: updatedMessages,
  })

  const rawMessage = aiResponse.content[0].type === 'text' ? aiResponse.content[0].text : ''
  const completed = rawMessage.includes('INTERVIEW_COMPLETE')
  const assistantMessage = rawMessage.replace('INTERVIEW_COMPLETE', '').trim()

  const finalMessages = [...updatedMessages, { role: 'assistant', content: assistantMessage }]

  await supabase
    .from('responses')
    .update({ messages: finalMessages, completed })
    .eq('id', responseId)

  if (completed) {
    await completeResponse({ ...response, messages: finalMessages, surveys: survey })
  }

  return NextResponse.json({ assistantMessage, completed })
}
