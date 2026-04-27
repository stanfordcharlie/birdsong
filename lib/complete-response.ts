import { anthropic } from '@/lib/anthropic'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function completeResponse(response: any) {
  const supabase = await createClient()

  const analysisResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze this interview transcript and return ONLY a JSON object with no markdown, no backticks, no explanation. Format: {pain_points: [array of specific pain points mentioned], lead_score: number}. Score the lead 1-10 using these strict criteria: 9-10: explicitly mentions budget, timeline, or is actively looking for a solution. 7-8: clear pain points that match a software buying need. 5-6: some challenges mentioned but vague or low urgency. 3-4: general complaints, no buying signals. 1-2: no pain points or irrelevant responses. Be strict -- most responses should score 5-7 unless there are strong buying signals. Transcript: ${JSON.stringify(response.messages)}`,
      },
    ],
  })

  let pain_points: string[] = []
  let lead_score = 5

  try {
    const raw = analysisResponse.content[0].type === 'text' ? analysisResponse.content[0].text : '{}'
    const parsed = JSON.parse(raw)
    pain_points = parsed.pain_points || []
    lead_score = parsed.lead_score || 5
  } catch (e) {
    console.error('Failed to parse analysis', e)
  }

  await supabase
    .from('responses')
    .update({ pain_points, lead_score })
    .eq('id', response.id)

  await resend.emails.send({
    from: 'Birdsong <onboarding@resend.dev>',
    to: process.env.ADMIN_EMAIL!,
    subject: `New Birdsong Response: ${response.surveys.title}`,
    text: `New completed interview\n\nName: ${response.respondent_name}\nEmail: ${response.respondent_email}\nLead Score: ${lead_score}/10\nPain Points:\n${pain_points.map((p: string) => `- ${p}`).join('\n')}\n\nView transcript: ${process.env.NEXT_PUBLIC_APP_URL}/admin/responses/${response.id}`,
  })
}
