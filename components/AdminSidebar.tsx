'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type AdminSidebarProps = {
  onWidthChange?: (width: number) => void
  visible?: boolean
}

type NavItem = {
  href: string
  label: string
  icon: React.ReactElement
}

export default function AdminSidebar({ onWidthChange, visible = true }: AdminSidebarProps) {
  if (!visible) return null

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

  const topNavItems: NavItem[] = [
    {
      href: '/',
      label: 'Home',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href: '/admin/responses',
      label: 'Responses',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      href: '/admin/surveys',
      label: 'Surveys',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      ),
    },
  ]

  const bottomNavItems: NavItem[] = [
    {
      href: '/admin/create',
      label: 'Create Survey',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    },
  ]

  function renderNavItem(item: NavItem) {
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
          gap: 10,
          padding: collapsed ? '8px 0' : '8px 12px',
          margin: collapsed ? '1px 8px' : '1px 8px',
          borderRadius: 6,
          fontSize: 13,
          color: isActive || isHovered ? '#ffffff' : '#9ca3af',
          textDecoration: 'none',
          background: isActive ? 'rgba(255,255,255,0.12)' : isHovered ? 'rgba(255,255,255,0.08)' : 'transparent',
          fontWeight: 500,
          justifyContent: collapsed ? 'center' : 'flex-start',
          minHeight: 34,
          position: 'relative',
        }}
      >
        <span style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
        {!collapsed && <span>{item.label}</span>}
        {collapsed && isHovered && (
          <span
            style={{
              position: 'absolute',
              left: 48,
              background: '#111111',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.18)',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 12,
              whiteSpace: 'nowrap',
              zIndex: 100,
              pointerEvents: 'none',
            }}
          >
            {item.label}
          </span>
        )}
      </Link>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        zIndex: 10,
        width: collapsed ? 56 : 220,
        transition: 'width 200ms ease',
        background: '#111111',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
      }}
    >
      <div style={{ padding: '20px 16px', minHeight: 56, display: 'flex', alignItems: 'center' }}>
        {!collapsed && <span style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>Birdsong</span>}
      </div>
      <button
        onClick={handleToggle}
        style={{
          position: 'absolute',
          right: -12,
          top: 18,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: '#1f1f1f',
          border: '1px solid #333',
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          padding: 0,
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        )}
      </button>
      <div style={{ padding: '8px 0', flex: 1 }}>
        {topNavItems.map(renderNavItem)}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '8px 12px' }} />
        {bottomNavItems.map(renderNavItem)}
      </div>
    </div>
  )
}
