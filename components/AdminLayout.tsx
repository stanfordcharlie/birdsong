'use client'

import { ReactNode, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(56)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row', background: '#f8f8f7', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
      <AdminSidebar onWidthChange={setSidebarWidth} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', marginLeft: sidebarWidth }}>
        {children}
      </div>
    </div>
  )
}
