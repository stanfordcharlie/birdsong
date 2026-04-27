'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type AdminSidebarProps = {
  onWidthChange?: (width: number) => void
}

export default function AdminSidebar({ onWidthChange }: AdminSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(true)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem('birdsong-sidebar')
    if (stored === 'expanded') {
      setCollapsed(false)
      onWidthChange?.(220)
      return
    }
    setCollapsed(true)
    onWidthChange?.(56)
  }, [onWidthChange])

  function handleToggle() {
    const nextCollapsed = !collapsed
    setCollapsed(nextCollapsed)
    window.localStorage.setItem('birdsong-sidebar', nextCollapsed ? 'collapsed' : 'expanded')
    onWidthChange?.(nextCollapsed ? 56 : 220)
  }

  const topNavItems = [
    {
      href: '/',
      label: 'Home',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
      ),
    },
    {
      href: '/admin/responses',
      label: 'Responses',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
      ),
    },
    {
      href: '/admin/surveys',
      label: 'Surveys',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6" /><path d="M9 13h6" /><path d="M9 17h4" /></svg>
      ),
    }
  ]

  const bottomNavItems = [
    {
      href: '/admin/create',
      label: 'Create Survey',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
      ),
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      ),
    },
  ]

  function renderNavItem(item: { href: string; label: string; icon: React.ReactElement }) {
    const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`)
    const isHovered = hoveredItem === item.href
    return (
      <Link
        key={item.href}
        href={item.href}
        onMouseEnter={() => setHoveredItem(item.href)}
        onMouseLeave={() => setHoveredItem(null)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: collapsed ? '9px 0' : '9px 10px',
          margin: collapsed ? '2px 4px' : '2px 8px',
          borderRadius: 8,
          fontSize: 14,
          color: isActive ? '#1a1a1a' : '#333',
          textDecoration: 'none',
          background: isActive ? '#f0f4f0' : isHovered ? '#f5f5f5' : 'transparent',
          fontWeight: isActive ? 500 : 400,
          justifyContent: collapsed ? 'center' : 'flex-start',
          height: 38,
          position: 'relative',
        }}
      >
        <span style={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
        {!collapsed && <span>{item.label}</span>}
        {collapsed && isHovered && (
          <span style={{ position: 'absolute', left: 52, background: '#1a1a1a', color: '#fff', padding: '5px 10px', borderRadius: 6, fontSize: 12, whiteSpace: 'nowrap', zIndex: 100, pointerEvents: 'none' }}>
            {item.label}
          </span>
        )}
      </Link>
    )
  }

  return (
    <div style={{ position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 10, width: collapsed ? 56 : 220, transition: 'width 200ms ease', background: '#ffffff', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
      <div style={{ height: 56, display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
        {collapsed ? (
          <div />
        ) : (
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Birdsong</span>
        )}
      </div>
      <button
        onClick={handleToggle}
        style={{ position: 'absolute', right: -12, top: 20, width: 24, height: 24, borderRadius: '50%', background: '#ffffff', border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20, padding: 0 }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        )}
      </button>
      <div style={{ padding: '8px 0', flex: 1 }}>
        {topNavItems.map(renderNavItem)}
        <div style={{ height: 1, background: '#f0f0f0', margin: '8px 16px' }} />
        {bottomNavItems.map(renderNavItem)}
      </div>
    </div>
  )
}
