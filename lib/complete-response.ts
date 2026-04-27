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
        content: `You are analyzing a market research interview transcript. Based on what the respondent shared naturally in conversation, return ONLY a JSON object: {pain_points: [array of implicit challenges or friction points you can infer from what they described, even if they never called them problems], lead_score: number}. Score 1-10: 9-10 if they described significant operational friction that a software solution could address and mentioned budget or urgency. 7-8 if clear implicit friction exists. 5-6 if mild friction inferred. 3-4 if mostly positive, little friction. 1-2 if no relevant friction detectable. Be conservative -- default to 5 unless signals are clear. Transcript: ${JSON.stringify(response.messages)}`,
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
