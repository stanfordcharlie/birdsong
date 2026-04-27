'use client'

import { useState } from 'react'

export default function CopySurveyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      style={{ fontSize: 13, background: '#fff', color: '#1a1a1a', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e5e5', cursor: 'pointer' }}
    >
      {copied ? 'Copied' : 'Copy survey link'}
    </button>
  )
}
