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
        content: `Based on this interview transcript, return ONLY a JSON object with no markdown, no backticks, no explanation. Format: {"pain_points": ["pain point 1", "pain point 2"], "lead_score": 7}. Lead score is 1-10 based on how strong a sales prospect this person appears to be. Transcript: ${JSON.stringify(response.messages)}`,
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
