'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(10,10,10,0.7)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Birdsong</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/auth" style={{ color: '#fff', textDecoration: 'none', fontSize: 14 }}>
            Sign in
          </Link>
          <Link
            href="/auth"
            style={{
              background: '#fff',
              color: '#111',
              textDecoration: 'none',
              borderRadius: 100,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Get started free
          </Link>
        </div>
      </nav>

      <main style={{ paddingTop: 140, paddingBottom: 80 }}>
        <section style={{ textAlign: 'center', padding: '0 20px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid #ffffff',
              borderRadius: 999,
              padding: '4px 14px',
              fontSize: 12,
              color: '#ccc',
            }}
          >
            AI-powered market research
          </div>
          <h1 style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1, marginTop: 20, marginBottom: 0 }}>
            <span>Survey it. Score it.</span>
            <br />
            <span style={{ background: 'linear-gradient(90deg, #ffffff 0%, #888888 100%)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              Pipeline it.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: '#888', maxWidth: 480, margin: '20px auto 0', lineHeight: 1.6 }}>
            AI-moderated industry surveys that uncover buyer pain points and deliver qualified inbounds to your BDR team.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 40, flexWrap: 'wrap' }}>
            <Link
              href="/auth"
              style={{
                background: '#fff',
                color: '#111',
                borderRadius: 100,
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Get started free
            </Link>
            <a
              href="#features"
              style={{
                border: '1px solid #fff',
                color: '#fff',
                borderRadius: 100,
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              See how it works
            </a>
          </div>
        </section>

        <section id="features" style={{ marginTop: 100, padding: '0 20px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 32 }}>
            <article style={{ border: '1px solid #222', borderRadius: 16, padding: 28, background: '#111' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginTop: 16, marginBottom: 0 }}>AI-Moderated Interviews</h3>
              <p style={{ fontSize: 14, color: '#888', marginTop: 8, lineHeight: 1.6, marginBottom: 0 }}>
                Natural conversations that surface pain points without feeling like a sales call.
              </p>
            </article>

            <article style={{ border: '1px solid #222', borderRadius: 16, padding: 28, background: '#111' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h18" />
                  <path d="M12 3l9 9-9 9-9-9z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginTop: 16, marginBottom: 0 }}>Guaranteed Inbounds</h3>
              <p style={{ fontSize: 14, color: '#888', marginTop: 8, lineHeight: 1.6, marginBottom: 0 }}>
                100+ qualified leads per month delivered directly to your BDR team.
              </p>
            </article>

            <article style={{ border: '1px solid #222', borderRadius: 16, padding: 28, background: '#111' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5V4.5" />
                  <path d="M10 19.5V9.5" />
                  <path d="M16 19.5v-7" />
                  <path d="M22 19.5v-12" />
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginTop: 16, marginBottom: 0 }}>Thought Leadership</h3>
              <p style={{ fontSize: 14, color: '#888', marginTop: 8, lineHeight: 1.6, marginBottom: 0 }}>
                Turn every response into reports, personas, and content your team can use.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid #1a1a1a', padding: 32, textAlign: 'center', color: '#555', fontSize: 13 }}>
        © 2026 Birdsong. All rights reserved.
      </footer>
    </div>
  )
}
