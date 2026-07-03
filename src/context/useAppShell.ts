import { useContext } from 'react'
import { AppShellContext } from './appShellContextValue'
import type { AppShellContextValue } from './appShellContextValue'

export const useAppShell = (): AppShellContextValue => {
  const context = useContext(AppShellContext)

  if (!context) {
    throw new Error('useAppShell deve ser usado dentro de AppShellProvider.')
  }

  return context
}
