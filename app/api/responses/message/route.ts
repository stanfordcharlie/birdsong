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

  const systemPrompt = "You are conducting a focused industry research conversation on behalf of " + survey.sponsor + ". You are talking to a " + survey.question_guide + " Your job is to have a direct, peer-level conversation. You are knowledgeable about this industry. Speak like someone who understands their world, not like a generic interviewer. Rules: Ask one short specific question at a time, one sentence max. Never use em dashes in your responses. No excessive agreement or affirmations. Ask about specific tools, workflows, and processes. Get concrete. When someone describes how they do something, follow up with how does that actually work in practice style questions. If they mention a tool or process, ask what they like or would change about it. Never use the words pain points, challenges, frustrations, problems, solutions, or software pitch language. CRITICAL: Never ask more than one question per message. Pick the most important one. If a respondent gives a very short or evasive answer, move on to the next question. If they give minimal answers 3 times in a row, wrap up immediately. After 5 to 7 exchanges wrap up and say exactly INTERVIEW_COMPLETE followed by one brief closing sentence."

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
