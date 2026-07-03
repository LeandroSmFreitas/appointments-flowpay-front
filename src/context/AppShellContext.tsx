import { useMemo, useState, type ReactNode } from 'react'
import { AppShellContext } from './appShellContextValue'
import type { AppShellContextValue } from './appShellContextValue'

interface AppShellProviderProps {
  children: ReactNode
}

export function AppShellProvider({ children }: AppShellProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const value = useMemo<AppShellContextValue>(
    () => ({
      isSidebarOpen,
      openSidebar: () => setIsSidebarOpen(true),
      closeSidebar: () => setIsSidebarOpen(false),
      toggleSidebar: () => setIsSidebarOpen((current) => !current),
    }),
    [isSidebarOpen],
  )

  return (
    <AppShellContext.Provider value={value}>
      {children}
    </AppShellContext.Provider>
  )
}
