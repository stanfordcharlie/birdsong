'use client'

import { useState } from 'react'

export default function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 13, cursor: 'pointer' }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
