'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type AdminSidebarProps = {
  onWidthChange?: (width: number) => void
}

export default function AdminSidebar({ onWidthChange }: AdminSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(true)

  useEffect(() => {
    const stored = window.localStorage.getItem('birdsong-sidebar')
    if (stored === 'expanded') {
      setCollapsed(false)
      onWidthChange?.(200)
      return
    }
    setCollapsed(true)
    onWidthChange?.(56)
  }, [onWidthChange])

  function handleToggle() {
    const nextCollapsed = !collapsed
    setCollapsed(nextCollapsed)
    window.localStorage.setItem('birdsong-sidebar', nextCollapsed ? 'collapsed' : 'expanded')
    onWidthChange?.(nextCollapsed ? 56 : 200)
  }

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
      ),
    },
    {
      href: '/admin/responses',
      label: 'Responses',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="4" cy="6" r="1" />
          <circle cx="4" cy="12" r="1" />
          <circle cx="4" cy="18" r="1" />
        </svg>
      ),
    },
    {
      href: '/admin/surveys',
      label: 'Surveys',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
          <path d="M14 2v6h6" />
        </svg>
      ),
    },
    {
      href: '/admin/create',
      label: 'Create Survey',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
    },
  ]

  return (
    <div style={{ width: collapsed ? 56 : 200, transition: 'width 200ms ease', background: '#1a1a1a', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 10, overflow: 'hidden' }}>
      <div style={{ padding: 16, color: '#fff', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
        {collapsed ? 'B' : 'Birdsong'}
      </div>
      <button
        onClick={handleToggle}
        style={{ width: 40, height: 40, background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        )}
      </button>
      <div style={{ marginTop: 8 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                height: 40,
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: 12,
                color: isActive ? '#ffffff' : '#999',
                textDecoration: 'none',
                borderRadius: 0,
                background: isActive ? '#2a2a2a' : 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
