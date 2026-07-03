import { createContext } from 'react'

export interface AppShellContextValue {
  isSidebarOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
}

export const AppShellContext = createContext<AppShellContextValue | null>(null)
