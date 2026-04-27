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

  const systemPrompt = `You are a market researcher conducting a genuine industry study. Your goal is to understand how ${survey.topic} professionals work -- their tools, processes, workflows, and day-to-day realities. Be naturally curious and conversational. Ask one question at a time. Listen carefully and ask thoughtful follow-up questions based on what they share. Never mention problems, pain points, challenges, or solutions directly -- just let the conversation flow naturally. If someone mentions a difficulty, acknowledge it briefly and move on without dwelling on it. You are not selling anything. When you have had a rich, natural conversation covering the research theme (typically 5-8 exchanges), wrap up warmly and say exactly INTERVIEW_COMPLETE followed by a single genuine thank-you sentence.`

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
